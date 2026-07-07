document.addEventListener('DOMContentLoaded', () => {
  // --- Initial Data / State Management ---
  let habits = JSON.parse(localStorage.getItem('vanquish_habits')) || [
    {
      id: '1',
      badHabit: 'Bedtime Infinite Scroll',
      replacement: 'Read 2 pages of a non-fiction book',
      primaryTrigger: 'Boredom',
      streakDays: 4
    },
    {
      id: '2',
      badHabit: 'Reaching for processed sugar mid-work',
      replacement: 'Drink sparkling water with a lime twist',
      primaryTrigger: 'Stress',
      streakDays: 2
    }
  ];

  let logs = JSON.parse(localStorage.getItem('vanquish_logs')) || [
    { id: 'l1', habitId: '1', type: 'resisted', trigger: 'Boredom', notes: 'Resisted with urge surfer!', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'l2', habitId: '2', type: 'slipped', trigger: 'Stress', notes: 'Very tight deadline pressure.', date: new Date(Date.now() - 172800000).toISOString() }
  ];

  // State Variables
  let breathingInterval = null;
  let breathingStep = 0; // 0: Idle, 1: Inhale, 2: Hold Full, 3: Exhale, 4: Hold Empty
  let breathingTimer = null;
  let breathingTotalSecondsLeft = 60;

  // --- DOM Elements ---
  const habitForm = document.getElementById('habit-form');
  const badHabitInput = document.getElementById('bad-habit-input');
  const replacementHabitInput = document.getElementById('replacement-habit-input');
  const triggerTypeInput = document.getElementById('trigger-type-input');

  const habitsListContainer = document.getElementById('habits-list-container');
  const habitCountSpan = document.getElementById('habit-count');

  const logHabitSelect = document.getElementById('log-habit-select');
  const logActionType = document.getElementById('log-action-type');
  const logTriggerSelect = document.getElementById('log-trigger-select');
  const logNotes = document.getElementById('log-notes');
  const submitLogBtn = document.getElementById('submit-log-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const logsFeedContainer = document.getElementById('logs-feed-container');

  // Stats DOM
  const statTotalUrges = document.getElementById('stat-total-urges');
  const statResisted = document.getElementById('stat-resisted');
  const statResistRate = document.getElementById('stat-resist-rate');
  const statTopTrigger = document.getElementById('stat-top-trigger');
  const streakBadge = document.getElementById('streak-badge');

  // Breather DOM
  const startBreatherBtn = document.getElementById('start-breather-btn');
  const stopBreatherBtn = document.getElementById('stop-breather-btn');
  const breatherCircleInner = document.getElementById('breath-circle-inner');
  const breatherIndicator = document.getElementById('breather-indicator');
  const breatherCaption = document.getElementById('breather-caption');
  const breatherInstructions = document.getElementById('breather-instructions');
  const triggerPanicBtn = document.getElementById('trigger-panic-btn');
  const urgeSurfingCard = document.getElementById('urge-surfing-card');

  // Toast DOM
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const currentYearSpan = document.getElementById('current-year');

  // Set Footer Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Helper: Save States ---
  function saveState() {
    localStorage.setItem('vanquish_habits', JSON.stringify(habits));
    localStorage.setItem('vanquish_logs', JSON.stringify(logs));
  }

  // --- Helper: Toast Notification ---
  function showToast(message, isAlert = false) {
    toastMessage.textContent = message;
    const iconWrapper = document.getElementById('toast-icon-wrapper');
    if (isAlert) {
      iconWrapper.className = 'p-1.5 rounded-lg bg-rose-500/20 text-rose-400';
    } else {
      iconWrapper.className = 'p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400';
    }
    
    toast.classList.remove('hidden', 'translate-y-10');
    toast.classList.add('flex', 'translate-y-0');

    setTimeout(() => {
      toast.classList.add('translate-y-10');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 300);
    }, 3000);
  }

  // --- Render Functions ---

  function renderAll() {
    renderHabitList();
    renderLogOptions();
    renderLogsFeed();
    calculateStats();
  }

  // 1. Habits List Rendering
  function renderHabitList() {
    habitsListContainer.innerHTML = '';
    habitCountSpan.textContent = `${habits.length} tracked`;

    if (habits.length === 0) {
      habitsListContainer.innerHTML = `
        <div class="text-center text-xs text-slate-500 py-6 border border-dashed border-slate-800 rounded-xl">
          No habits tracked yet. Use the form above to add your first bad habit mapping.
        </div>
      `;
      return;
    }

    habits.forEach(habit => {
      const card = document.createElement('div');
      card.className = 'group relative bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition duration-150 space-y-2';
      
      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <span class="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase">
              ${habit.primaryTrigger}
            </span>
            <h4 class="text-sm font-semibold text-slate-200 mt-1.5 group-hover:text-rose-400 transition-colors">${habit.badHabit}</h4>
          </div>
          <button class="delete-habit-btn text-slate-500 hover:text-rose-400 transition text-xs p-1" data-id="${habit.id}" title="Remove Habit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 mt-1">
          <p class="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Constructive replacement</p>
          <p class="text-xs text-slate-300">${habit.replacement}</p>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Streak: <b class="text-emerald-400">${habit.streakDays} days</b></span>
          <button class="increment-streak-btn bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 px-2 py-1 rounded text-[10px] font-medium text-slate-300" data-id="${habit.id}">
            🔥 Increment Day
          </button>
        </div>
      `;

      habitsListContainer.appendChild(card);
    });

    // Event Listeners for deletion
    document.querySelectorAll('.delete-habit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const habitId = btn.getAttribute('data-id');
        habits = habits.filter(h => h.id !== habitId);
        // Clean up logs associated?
        saveState();
        renderAll();
        showToast('Habit loop removed.', true);
      });
    });

    // Event Listeners for increments
    document.querySelectorAll('.increment-streak-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const habitId = btn.getAttribute('data-id');
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          habit.streakDays = (habit.streakDays || 0) + 1;
          saveState();
          renderAll();
          showToast(`Awesome! Streak updated to ${habit.streakDays} days.`);
        }
      });
    });
  }

  // 2. Refresh Select Dropdowns with current habits
  function renderLogOptions() {
    logHabitSelect.innerHTML = '';
    if (habits.length === 0) {
      logHabitSelect.innerHTML = `<option value="">-- No habits tracked --</option>`;
      return;
    }
    habits.forEach(habit => {
      const opt = document.createElement('option');
      opt.value = habit.id;
      opt.textContent = habit.badHabit;
      logHabitSelect.appendChild(opt);
    });
  }

  // 3. Render Incident Feed
  function renderLogsFeed() {
    logsFeedContainer.innerHTML = '';
    if (logs.length === 0) {
      logsFeedContainer.innerHTML = `
        <div class="text-center text-xs text-slate-500 py-6">
          No urges tracked yet. Begin with mindful tracking.
        </div>
      `;
      return;
    }

    // Sort by recent first
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedLogs.forEach(log => {
      const linkedHabit = habits.find(h => h.id === log.habitId);
      const habitName = linkedHabit ? linkedHabit.badHabit : 'General Trigger';
      
      const item = document.createElement('div');
      item.className = `p-3.5 rounded-xl border ${log.type === 'resisted' ? 'bg-emerald-950/20 border-emerald-950 hover:border-emerald-800' : 'bg-rose-950/20 border-rose-950 hover:border-rose-900'} transition duration-150 space-y-1.5`;

      const dateObj = new Date(log.date);
      const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' @ ' + dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold ${log.type === 'resisted' ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1">
            ${log.type === 'resisted' ? '🛡️ Resisted Urge' : '⚠️ Slipped Habit'}
          </span>
          <span class="text-[10px] text-slate-500 font-mono">${formattedDate}</span>
        </div>
        <p class="text-xs text-slate-200 font-medium">${habitName}</p>
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>Trigger: <b class="text-slate-300">${log.trigger}</b></span>
          ${log.notes ? `<span class="italic text-slate-400">"${log.notes}"</span>` : ''}
        </div>
      `;
      logsFeedContainer.appendChild(item);
    });
  }

  // 4. Calculate Analytics Cards
  function calculateStats() {
    const total = logs.length;
    statTotalUrges.textContent = total;

    const resistedCount = logs.filter(l => l.type === 'resisted').length;
    statResisted.textContent = resistedCount;

    const rate = total > 0 ? Math.round((resistedCount / total) * 100) : 0;
    statResistRate.textContent = `${rate}%`;

    // Top Trigger
    const triggersCount = {};
    logs.forEach(l => {
      triggersCount[l.trigger] = (triggersCount[l.trigger] || 0) + 1;
    });
    let topTrigger = 'None';
    let maxVal = 0;
    for (const [key, val] of Object.entries(triggersCount)) {
      if (val > maxVal) {
        maxVal = val;
        topTrigger = key;
      }
    }
    statTopTrigger.textContent = topTrigger !== 'None' ? `${topTrigger} (${maxVal}x)` : 'None';

    // Overall Streak calculation (approximate by looking at maximum streak in habits or general days)
    const maxHabitStreak = habits.reduce((max, h) => h.streakDays > max ? h.streakDays : max, 0);
    streakBadge.textContent = `🔥 ${maxHabitStreak} Day Streak`;
  }

  // --- Core Actions ---

  // Habit Form Submission
  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const badHabit = badHabitInput.value.trim();
    const replacement = replacementHabitInput.value.trim();
    const primaryTrigger = triggerTypeInput.value;

    if (!badHabit || !replacement) return;

    const newHabit = {
      id: Date.now().toString(),
      badHabit,
      replacement,
      primaryTrigger,
      streakDays: 0
    };

    habits.push(newHabit);
    saveState();
    renderAll();

    // Reset form fields
    badHabitInput.value = '';
    replacementHabitInput.value = '';
    
    showToast('New dynamic replacement mapped!');
  });

  // Submit Manual Urge Log
  submitLogBtn.addEventListener('click', () => {
    const habitId = logHabitSelect.value;
    const type = logActionType.value;
    const trigger = logTriggerSelect.value;
    const notes = logNotes.value.trim();

    if (!habitId) {
      showToast('Please register at least one habit first!', true);
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      habitId,
      type,
      trigger,
      notes,
      date: new Date().toISOString()
    };

    logs.push(newLog);

    // Dynamic impact on habit streak if it was a slip
    if (type === 'slipped') {
      const matchedHabit = habits.find(h => h.id === habitId);
      if (matchedHabit) {
        matchedHabit.streakDays = 0;
        showToast(`Habit streak reset. It's okay, analyze your trigger!`, true);
      }
    } else {
      // Succeeded in resisting, increment streak option dynamically
      const matchedHabit = habits.find(h => h.id === habitId);
      if (matchedHabit) {
        matchedHabit.streakDays = (matchedHabit.streakDays || 0) + 1;
        showToast(`Outstanding! Urge resisted. Streak grows to ${matchedHabit.streakDays}!`);
      }
    }

    saveState();
    renderAll();

    // Clear inputs
    logNotes.value = '';
  });

  // Clear All Log History
  clearLogsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your urge log history? This action is permanent.')) {
      logs = [];
      saveState();
      renderAll();
      showToast('All logged history cleared successfully.', true);
    }
  });

  // --- The Interactive "Urge Surfing" Box Breather ---
  
  function updateBreathingCycle() {
    if (breathingTotalSecondsLeft <= 0) {
      stopBreather();
      showToast('Wonderful work! Wave survived. Urge level should have dramatically receded.');
      return;
    }

    // Box breathing is 4 phases: Inhale 4s, Hold 4s, Exhale 4s, Hold empty 4s
    const cycleOffset = (60 - breathingTotalSecondsLeft) % 16;
    let currentPhase = '';
    let directive = '';
    let colorClass = '';

    if (cycleOffset < 4) {
      currentPhase = 'Inhale';
      directive = 'Breathe in slowly. Fill your lungs with light...';
      colorClass = 'breath-inhale';
    } else if (cycleOffset < 8) {
      currentPhase = 'Hold Full';
      directive = 'Hold your breath. Observe the raw energetic sensation without fear.';
      colorClass = 'breath-hold';
    } else if (cycleOffset < 12) {
      currentPhase = 'Exhale';
      directive = 'Exhale completely. Let the urge dissolve with the air.';
      colorClass = 'breath-exhale';
    } else {
      currentPhase = 'Hold Empty';
      directive = 'Rest in peace. Realize you are stronger than temporary neural waves.';
      colorClass = 'breath-hold-empty';
    }

    // Visual adjustments
    breatherCircleInner.className = `w-24 h-24 rounded-full opacity-90 transition-all duration-1000 ease-in-out flex items-center justify-center ${colorClass}`;
    breatherIndicator.textContent = currentPhase;
    breatherCaption.textContent = `Surfing... (${breathingTotalSecondsLeft}s left)`;
    breatherInstructions.textContent = directive;

    breathingTotalSecondsLeft--;
  }

  function startBreather() {
    stopBreather(); // Safe clean
    breathingTotalSecondsLeft = 60;
    startBreatherBtn.classList.add('hidden');
    stopBreatherBtn.classList.remove('hidden');
    
    // Visual glowing container
    urgeSurfingCard.classList.remove('border-rose-500/20');
    urgeSurfingCard.classList.add('border-emerald-500/50', 'ring-2', 'ring-emerald-500/20');

    // Execute first run immediately, then interval
    updateBreathingCycle();
    breathingInterval = setInterval(updateBreathingCycle, 1000);
  }

  function stopBreather() {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    startBreatherBtn.classList.remove('hidden');
    stopBreatherBtn.classList.add('hidden');
    
    // Reset visuals
    breatherCircleInner.className = 'w-24 h-24 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full opacity-60 transition-all duration-[4000ms] ease-in-out flex items-center justify-center';
    breatherIndicator.textContent = 'READY';
    breatherCaption.textContent = 'Click Start to Surf the urge!';
    breatherInstructions.textContent = 'Deep breathing resets your autonomic nervous system, helping you gain space between stimulus and response.';
    
    urgeSurfingCard.classList.remove('border-emerald-500/50', 'ring-2', 'ring-emerald-500/20');
    urgeSurfingCard.classList.add('border-rose-500/20');
  }

  // Event Listeners for Breather Controls
  startBreatherBtn.addEventListener('click', startBreather);
  stopBreatherBtn.addEventListener('click', stopBreather);
  
  // Panic Button - Scrolls to and highlights the Urge Surfer Station instantly
  triggerPanicBtn.addEventListener('click', () => {
    urgeSurfingCard.scrollIntoView({ behavior: 'smooth' });
    // Give a transient glow attention effect
    urgeSurfingCard.classList.add('ring-4', 'ring-rose-500/40');
    setTimeout(() => {
      urgeSurfingCard.classList.remove('ring-4', 'ring-rose-500/40');
    }, 1500);
    
    // Auto-launch the breather to capture the attention
    startBreather();
    showToast('🚨 Breathing tool activated! Focus on the circle.');
  });

  // Initialize on Load
  renderAll();
});