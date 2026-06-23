/**
 * OmniFlow Focus & Task Engine Sandbox Interactivity Script
 * Built with synthesized sound generation (Web Audio API) & robust local state logic
 */

(function() {
  // --- STATE --- 
  let state = {
    xp: 65,
    level: 1,
    xpNeeded: 100,
    streak: 3,
    focusMinutes: 145,
    tasks: [
      { id: 't1', title: 'Refactor Auth Controllers', desc: 'Migrate legacy token checks to standard JWT middleware.', priority: 'high', column: 'inprogress' },
      { id: 't2', title: 'Prepare Presentation Slides', desc: 'Compile roadmap, sprint milestones, and user adoption metrics.', priority: 'medium', column: 'todo' },
      { id: 't3', title: 'Setup GitHub Actions CI', desc: 'Integrate automated testing suite and ESLint verification.', priority: 'medium', column: 'done' }
    ],
    habits: [
      { id: 'h1', title: 'Read 15 Pages', theme: 'emerald', done: false, streak: 8 },
      { id: 'h2', title: 'LeetCode Daily Challenge', theme: 'indigo', done: true, streak: 4 },
      { id: 'h3', title: 'Drink 3L Water', theme: 'pink', done: false, streak: 12 }
    ],
    activityLog: [
      { id: 'l1', text: 'Synthesizer setup initialised', time: 'Just now' },
      { id: 'l2', text: 'Task "Setup GitHub Actions CI" finished (+20 XP)', time: '1 hr ago' },
      { id: 'l3', text: 'Daily Habit "LeetCode Daily Challenge" cleared (+15 XP)', time: '2 hrs ago' }
    ],
    timer: {
      duration: 1500, // 25 minutes
      remaining: 1500,
      timerId: null,
      isRunning: false,
      phase: 'Focus Session' // or Break
    }
  };

  // --- SOUND SYNTHESIZER ENGINE --- 
  // Web Audio Context setup lazily on user action
  let audioCtx = null;
  let binauralOsc1 = null;
  let binauralOsc2 = null;
  let binauralGain = null;
  
  let cosmicOsc = null;
  let cosmicLfo = null;
  let cosmicGain = null;

  let rainBufferSource = null;
  let rainFilter = null;
  let rainGain = null;

  function initAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    setupBinauralNodes();
    setupCosmicNodes();
    setupRainNodes();
  }

  function setupBinauralNodes() {
    // 40Hz difference for Gamma Brain Entrainment (200Hz and 240Hz)
    binauralOsc1 = audioCtx.createOscillator();
    binauralOsc2 = audioCtx.createOscillator();
    const panner1 = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
    const panner2 = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
    
    binauralGain = audioCtx.createGain();
    binauralGain.gain.setValueAtTime(0, audioCtx.currentTime);

    binauralOsc1.frequency.value = 200;
    binauralOsc2.frequency.value = 240;

    if (panner1 && panner2) {
      panner1.pan.value = -1;
      panner2.pan.value = 1;
      binauralOsc1.connect(panner1).connect(binauralGain);
      binauralOsc2.connect(panner2).connect(binauralGain);
    } else {
      binauralOsc1.connect(binauralGain);
      binauralOsc2.connect(binauralGain);
    }

    binauralGain.connect(audioCtx.destination);
    binauralOsc1.start();
    binauralOsc2.start();
  }

  function setupCosmicNodes() {
    // Deep sound space drone
    cosmicOsc = audioCtx.createOscillator();
    cosmicOsc.type = 'sawtooth';
    cosmicOsc.frequency.value = 55; // A1 low frequency

    cosmicLfo = audioCtx.createOscillator();
    cosmicLfo.frequency.value = 0.15; // ultra-slow sweep
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(15, audioCtx.currentTime);

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 120;
    lowpass.Q.value = 3;

    cosmicGain = audioCtx.createGain();
    cosmicGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Connect LFO sweep
    cosmicLfo.connect(lfoGain).connect(lowpass.frequency);
    cosmicOsc.connect(lowpass).connect(cosmicGain).connect(audioCtx.destination);

    cosmicOsc.start();
    cosmicLfo.start();
  }

  function setupRainNodes() {
    // Generate procedural white/pink noise for rain
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    rainBufferSource = audioCtx.createBufferSource();
    rainBufferSource.buffer = noiseBuffer;
    rainBufferSource.loop = true;

    rainFilter = audioCtx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 400;
    rainFilter.Q.value = 1.2;

    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0, audioCtx.currentTime);

    rainBufferSource.connect(rainFilter).connect(rainGain).connect(audioCtx.destination);
    rainBufferSource.start();
  }

  // --- ELEMENT SELECTORS --- 
  const dom = {
    toast: document.getElementById('toast-pill'),
    toastMsg: document.getElementById('toast-message'),
    viewTitle: document.getElementById('view-title'),
    // XP elements
    xpLevel: document.getElementById('xp-level'),
    xpCurrent: document.getElementById('xp-current'),
    xpNext: document.getElementById('xp-next'),
    xpBar: document.getElementById('xp-progress-bar'),
    // Stat boxes
    statTasksCompleted: document.getElementById('stat-tasks-completed'),
    statFocusTime: document.getElementById('stat-focus-time'),
    statStreakVal: document.getElementById('stat-streak-val'),
    statHabitRate: document.getElementById('stat-habit-rate'),
    streakCountLabel: document.getElementById('streak-count'),
    // Nav items
    navDashboard: document.getElementById('nav-dashboard'),
    navKanban: document.getElementById('nav-kanban'),
    navTimer: document.getElementById('nav-timer'),
    navHabits: document.getElementById('nav-habits'),
    // Content Sections
    secDashboard: document.getElementById('view-content-dashboard'),
    secKanban: document.getElementById('view-content-kanban'),
    secTimer: document.getElementById('view-content-timer'),
    secHabits: document.getElementById('view-content-habits'),
    // Dynamic boards
    dashboardTasks: document.getElementById('dashboard-tasks-container'),
    dashboardHabits: document.getElementById('dashboard-habits-list'),
    activityFeed: document.getElementById('activity-feed'),
    colTodo: document.getElementById('column-todo'),
    colInprogress: document.getElementById('column-inprogress'),
    colDone: document.getElementById('column-done'),
    todoBadge: document.getElementById('todo-badge'),
    inprogressBadge: document.getElementById('inprogress-badge'),
    doneBadge: document.getElementById('done-badge'),
    habitsGrid: document.getElementById('habits-board-grid'),
    // Sound UI
    soundBinauralRange: document.getElementById('range-sound-binaural'),
    soundCosmicRange: document.getElementById('range-sound-cosmic'),
    soundRainRange: document.getElementById('range-sound-rain'),
    volBinauralLbl: document.getElementById('lbl-vol-binaural'),
    volCosmicLbl: document.getElementById('lbl-vol-cosmic'),
    volRainLbl: document.getElementById('lbl-vol-rain'),
    btnKillSounds: document.getElementById('btn-kill-sounds'),
    // Timer UI
    timerText: document.getElementById('timer-countdown-text'),
    timerLabel: document.getElementById('timer-state-label'),
    timerRing: document.getElementById('timer-progress-ring'),
    btnTimerToggle: document.getElementById('btn-timer-toggle'),
    btnTimerReset: document.getElementById('btn-timer-reset'),
    btnTimerSkip: document.getElementById('btn-timer-skip'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    // Modals & Action
    modalAddTask: document.getElementById('modal-add-task'),
    modalAddHabit: document.getElementById('modal-add-habit'),
    formAddTask: document.getElementById('form-add-task'),
    formAddHabit: document.getElementById('form-add-habit'),
    btnQuickTask: document.getElementById('btn-quick-task'),
    btnTriggerAddTask: document.getElementById('btn-trigger-add-task'),
    btnTriggerAddHabit: document.getElementById('btn-trigger-add-habit'),
    btnCloseTaskModal: document.getElementById('btn-close-task-modal'),
    btnCloseHabitModal: document.getElementById('btn-close-habit-modal'),
    btnCancelTask: document.getElementById('btn-cancel-task'),
    btnCancelHabit: document.getElementById('btn-cancel-habit'),
    btnClearedFeed: document.getElementById('btn-clear-feed')
  };

  // --- TOAST NOTIFICATIONS ---
  function triggerToast(message) {
    dom.toastMsg.innerText = message;
    dom.toast.classList.remove('hidden');
    dom.toast.classList.add('flex');
    setTimeout(() => {
      dom.toast.classList.remove('flex');
      dom.toast.classList.add('hidden');
    }, 3200);
  }

  // --- XP SYSTEM CRITICAL ---
  function gainXP(amount) {
    state.xp += amount;
    logActivity(`Gained +${amount} XP!`);
    if (state.xp >= state.xpNeeded) {
      state.xp -= state.xpNeeded;
      state.level += 1;
      triggerToast(`🎉 Level Up! Welcome to Level ${state.level}!`);
      logActivity(`🎖️ Level Up! Reached level ${state.level}`);
    }
    updateXPUI();
  }

  function updateXPUI() {
    dom.xpLevel.innerText = state.level;
    dom.xpCurrent.innerText = state.xp;
    dom.xpNext.innerText = state.xpNeeded;
    const pct = Math.min((state.xp / state.xpNeeded) * 100, 100);
    dom.xpBar.style.width = `${pct}%`;
  }

  // --- ACTIVITY LOGGER ---
  function logActivity(text) {
    const timestamp = 'Just now';
    state.activityLog.unshift({ id: 'l-' + Date.now(), text, time: timestamp });
    if (state.activityLog.length > 25) state.activityLog.pop();
    renderActivityFeed();
  }

  function renderActivityFeed() {
    if (!dom.activityFeed) return;
    dom.activityFeed.innerHTML = '';
    state.activityLog.forEach(log => {
      const div = document.createElement('div');
      div.className = 'flex justify-between items-start py-1.5 border-b border-slate-800/60 last:border-0';
      div.innerHTML = `
        <span class="text-slate-300">${log.text}</span>
        <span class="text-[10px] text-slate-500 shrink-0 ml-2">${log.time}</span>
      `;
      dom.activityFeed.appendChild(div);
    });
  }

  // --- VIEW SWITCHING ---
  const tabs = [
    { id: 'dashboard', btn: dom.navDashboard, view: dom.secDashboard, title: 'Overview Dashboard' },
    { id: 'kanban', btn: dom.navKanban, view: dom.secKanban, title: 'Personal Kanban Workspace' },
    { id: 'timer', btn: dom.navTimer, view: dom.secTimer, title: 'Focus Station & Ambience' },
    { id: 'habits', btn: dom.navHabits, view: dom.secHabits, title: 'Daily Habits & Streaks' }
  ];

  function switchTab(targetId) {
    tabs.forEach(tab => {
      if (tab.id === targetId) {
        tab.btn.classList.add('bg-slate-800', 'text-white');
        tab.btn.classList.remove('text-slate-400', 'hover:bg-slate-800/50');
        tab.view.classList.remove('hidden');
        dom.viewTitle.innerText = tab.title;
      } else {
        tab.btn.classList.remove('bg-slate-800', 'text-white');
        tab.btn.classList.add('text-slate-400', 'hover:bg-slate-800/50');
        tab.view.classList.add('hidden');
      }
    });
    renderAll();
  }
  window.switchTab = switchTab; // export globally to let button actions execute

  // --- TASK MANAGEMENT (KANBAN) ---
  function renderKanban() {
    // Count arrays
    const todoList = state.tasks.filter(t => t.column === 'todo');
    const progressList = state.tasks.filter(t => t.column === 'inprogress');
    const doneList = state.tasks.filter(t => t.column === 'done');

    dom.todoBadge.innerText = todoList.length;
    dom.inprogressBadge.innerText = progressList.length;
    dom.doneBadge.innerText = doneList.length;

    // Render Helper
    const generateCardHTML = (t) => {
      const prioColor = t.priority === 'high' ? 'text-red-400 bg-red-950/40 border-red-900/40' : t.priority === 'medium' ? 'text-amber-400 bg-amber-950/40 border-amber-900/40' : 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40';
      const actions = `
        <div class="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button class="delete-task-btn text-xs text-slate-500 hover:text-red-400 transition-colors" data-id="${t.id}">Delete</button>
          <div class="flex gap-1.5">
            ${t.column !== 'todo' ? `<button class="move-task-btn px-2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold transition" data-id="${t.id}" data-dest="todo">To Do</button>` : ''}
            ${t.column !== 'inprogress' ? `<button class="move-task-btn px-2 py-1 bg-amber-950/40 hover:bg-amber-900/40 text-amber-400 rounded text-[10px] font-bold transition" data-id="${t.id}" data-dest="inprogress">Work</button>` : ''}
            ${t.column !== 'done' ? `<button class="move-task-btn px-2 py-1 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 rounded text-[10px] font-bold transition" data-id="${t.id}" data-dest="done">Done</button>` : ''}
          </div>
        </div>
      `;
      return `
        <div class="bg-slate-950 border border-slate-800/80 p-4 rounded-xl shadow-sm hover:border-slate-700/80 transition-all card-hover">
          <div class="flex items-start justify-between gap-2">
            <h6 class="text-xs font-bold text-white">${t.title}</h6>
            <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${prioColor}">${t.priority}</span>
          </div>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">${t.desc || 'No description provided.'}</p>
          ${actions}
        </div>
      `;
    };

    dom.colTodo.innerHTML = todoList.length ? todoList.map(generateCardHTML).join('') : '<p class="text-center text-slate-600 text-xs py-8">No items</p>';
    dom.colInprogress.innerHTML = progressList.length ? progressList.map(generateCardHTML).join('') : '<p class="text-center text-slate-600 text-xs py-8">No focus targets</p>';
    dom.colDone.innerHTML = doneList.length ? doneList.map(generateCardHTML).join('') : '<p class="text-center text-slate-600 text-xs py-8">Hooray, columns clear</p>';

    // Update metrics top overview
    document.getElementById('lbl-active-task-count').innerText = progressList.length + todoList.length;
    document.getElementById('lbl-completed-task-count').innerText = doneList.length;
  }

  function setupKanbanEvents() {
    // Delegation for move/delete inside Kanban Columns
    const handleColumnClick = (e) => {
      const target = e.target;
      if (target.classList.contains('move-task-btn')) {
        const taskId = target.getAttribute('data-id');
        const destination = target.getAttribute('data-dest');
        moveTask(taskId, destination);
      } else if (target.classList.contains('delete-task-btn')) {
        const taskId = target.getAttribute('data-id');
        deleteTask(taskId);
      }
    };

    dom.colTodo.addEventListener('click', handleColumnClick);
    dom.colInprogress.addEventListener('click', handleColumnClick);
    dom.colDone.addEventListener('click', handleColumnClick);
  }

  function moveTask(id, targetCol) {
    state.tasks = state.tasks.map(t => {
      if (t.id === id) {
        // Gain reward for completion
        if (targetCol === 'done' && t.column !== 'done') {
          gainXP(25);
          triggerToast('Task marked Completed! Earned +25 XP');
        }
        return { ...t, column: targetCol };
      }
      return t;
    });
    renderAll();
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    triggerToast('Task removed from board.');
    renderAll();
  }

  // --- RENDER COMPACT DASHBOARD VIEWS ---
  function renderDashboardWidgets() {
    // Immediate Work items
    const immediate = state.tasks.filter(t => t.column === 'inprogress');
    dom.dashboardTasks.innerHTML = '';
    if (immediate.length === 0) {
      dom.dashboardTasks.innerHTML = `
        <div class="text-center py-8 bg-slate-950 rounded-xl border border-slate-850">
          <p class="text-xs text-slate-500">No active In-Progress tasks. Check Kanban board to promote tasks!</p>
        </div>
      `;
    } else {
      immediate.forEach(t => {
        const card = document.createElement('div');
        card.className = "p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3";
        card.innerHTML = `
          <div>
            <span class="text-[9px] font-bold text-amber-500 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40 uppercase tracking-wider">Focusing</span>
            <h5 class="text-xs font-bold text-white mt-1">${t.title}</h5>
          </div>
          <button class="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 text-xs font-bold transition border border-emerald-900/40" data-id="${t.id}" id="dash-done-${t.id}">Done</button>
        `;
        dom.dashboardTasks.appendChild(card);

        document.getElementById(`dash-done-${t.id}`).addEventListener('click', () => {
          moveTask(t.id, 'done');
        });
      });
    }

    // Mini Habit list on Dashboard
    dom.dashboardHabits.innerHTML = '';
    state.habits.forEach(h => {
      const card = document.createElement('div');
      card.className = `flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800`;
      card.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full ${h.done ? 'bg-slate-600' : `bg-${h.theme}-500`} shadow-sm"></span>
          <span class="text-xs text-slate-200 ${h.done ? 'line-through text-slate-500' : ''}">${h.title}</span>
        </div>
        <button id="dash-habit-check-${h.id}" class="px-2 py-1 rounded text-[10px] font-extrabold tracking-tight transition ${h.done ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}">
          ${h.done ? '✓ Completed' : 'Check'}
        </button>
      `;
      dom.dashboardHabits.appendChild(card);
      
      document.getElementById(`dash-habit-check-${h.id}`).addEventListener('click', () => {
        toggleHabit(h.id);
      });
    });

    // Top Stats Values calculation
    dom.statTasksCompleted.innerText = state.tasks.filter(t => t.column === 'done').length;
    dom.statFocusTime.innerText = `${state.focusMinutes} min`;
    dom.statStreakVal.innerText = `${state.streak} Days`;
    dom.streakCountLabel.innerText = `${state.streak} days`;

    const finishedHabits = state.habits.filter(h => h.done).length;
    const habitRatePct = state.habits.length > 0 ? Math.round((finishedHabits / state.habits.length) * 100) : 0;
    dom.statHabitRate.innerText = `${habitRatePct}%`;
  }

  // --- HABIT MODULE RENDERER ---
  function renderHabitsBoard() {
    if (!dom.habitsGrid) return;
    dom.habitsGrid.innerHTML = '';
    state.habits.forEach(h => {
      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl border ${h.done ? 'border-slate-800 bg-slate-900/30 opacity-75' : 'border-indigo-900/20 bg-slate-900'} flex flex-col justify-between transition-all duration-200 card-hover`;
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-start">
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${h.done ? 'bg-slate-800 text-slate-500' : `bg-${h.theme}-500/20 text-${h.theme}-400`}">${h.theme} Category</span>
            <button class="delete-habit-btn text-slate-600 hover:text-red-400 text-xs transition" data-id="${h.id}">Remove</button>
          </div>
          <h4 class="text-md font-bold text-white mt-3 ${h.done ? 'line-through text-slate-500' : ''}">${h.title}</h4>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="text-xs text-amber-500 font-semibold flex items-center gap-1">
              🔥 ${h.streak} day streak
            </span>
          </div>
        </div>

        <div class="mt-6">
          <button id="habit-toggle-${h.id}" class="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${h.done ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'}">
            ${h.done ? '✓ Finished Today' : 'Complete Habit'}
          </button>
        </div>
      `;
      dom.habitsGrid.appendChild(card);

      // Setup events inline
      document.getElementById(`habit-toggle-${h.id}`).addEventListener('click', () => {
        toggleHabit(h.id);
      });
    });
  }

  function toggleHabit(id) {
    state.habits = state.habits.map(h => {
      if (h.id === id) {
        const newDone = !h.done;
        if (newDone) {
          gainXP(15);
          triggerToast(`Habit updated! +15 XP`);
        }
        return { ...h, done: newDone, streak: newDone ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    });
    renderAll();
  }

  function setupHabitsEvents() {
    if (!dom.habitsGrid) return;
    dom.habitsGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-habit-btn')) {
        const habitId = e.target.getAttribute('data-id');
        state.habits = state.habits.filter(h => h.id !== habitId);
        triggerToast('Habit removed.');
        renderAll();
      }
    });
  }

  // --- POMODORO FOCUS TIMER MODULE ---
  function setTimerPreset(mins, type) {
    initAudio();
    stopTimer();
    state.timer.duration = mins * 60;
    state.timer.remaining = mins * 60;
    state.timer.phase = type;
    updateTimerUI();
    triggerToast(`Timer set to ${mins} mins (${type})`);
  }
  window.setTimerPreset = setTimerPreset;

  function toggleTimer() {
    initAudio();
    if (state.timer.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    state.timer.isRunning = true;
    dom.playIcon.classList.add('hidden');
    dom.pauseIcon.classList.remove('hidden');
    state.timer.timerId = setInterval(() => {
      if (state.timer.remaining > 0) {
        state.timer.remaining--;
        updateTimerUI();
      } else {
        handleTimerCompletion();
      }
    }, 1000);
    triggerToast('Timer running. Stay focused!');
    logActivity('Focus interval initiated.');
  }

  function stopTimer() {
    state.timer.isRunning = false;
    dom.playIcon.classList.remove('hidden');
    dom.pauseIcon.classList.add('hidden');
    if (state.timer.timerId) {
      clearInterval(state.timer.timerId);
      state.timer.timerId = null;
    }
  }

  function handleTimerCompletion() {
    stopTimer();
    gainXP(50);
    state.focusMinutes += Math.round(state.timer.duration / 60);
    triggerToast('🔔 Phase complete! Focus registered! +50 XP');
    logActivity(`Focus Session completed (${Math.round(state.timer.duration / 60)}m). XP +50`);
    
    // Switch Phase
    if (state.timer.phase === 'Focus Session' || state.timer.phase === 'Standard' || state.timer.phase === 'Sprint' || state.timer.phase === 'Extreme') {
      setTimerPreset(5, 'Short Break');
    } else {
      setTimerPreset(25, 'Standard');
    }
    renderAll();
  }

  function updateTimerUI() {
    const minutes = Math.floor(state.timer.remaining / 60);
    const seconds = state.timer.remaining % 60;
    dom.timerText.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    dom.timerLabel.innerText = state.timer.phase;

    // Progress ring circle offset calculations
    // Circumference = 2 * PI * r = 2 * 3.14159 * 42 = 263.89
    const circumference = 263.89;
    const percentLeft = state.timer.remaining / state.timer.duration;
    const offset = circumference * (1 - percentLeft);
    dom.timerRing.style.strokeDashoffset = offset;
  }

  // --- AUDIO SYNTH SLIDERS LOGIC ---
  function setupAudioControls() {
    dom.soundBinauralRange.addEventListener('input', (e) => {
      initAudio();
      const val = parseFloat(e.target.value);
      binauralGain.gain.setTargetAtTime(val * 0.15, audioCtx.currentTime, 0.1);
      dom.volBinauralLbl.innerText = val > 0 ? `${Math.round(val * 100)}%` : 'Off';
    });

    dom.soundCosmicRange.addEventListener('input', (e) => {
      initAudio();
      const val = parseFloat(e.target.value);
      cosmicGain.gain.setTargetAtTime(val * 0.2, audioCtx.currentTime, 0.1);
      dom.volCosmicLbl.innerText = val > 0 ? `${Math.round(val * 100)}%` : 'Off';
    });

    dom.soundRainRange.addEventListener('input', (e) => {
      initAudio();
      const val = parseFloat(e.target.value);
      rainGain.gain.setTargetAtTime(val * 0.45, audioCtx.currentTime, 0.1);
      dom.volRainLbl.innerText = val > 0 ? `${Math.round(val * 100)}%` : 'Off';
    });

    dom.btnKillSounds.addEventListener('click', () => {
      dom.soundBinauralRange.value = 0;
      dom.soundCosmicRange.value = 0;
      dom.soundRainRange.value = 0;
      
      if (binauralGain) binauralGain.gain.setValueAtTime(0, audioCtx.currentTime);
      if (cosmicGain) cosmicGain.gain.setValueAtTime(0, audioCtx.currentTime);
      if (rainGain) rainGain.gain.setValueAtTime(0, audioCtx.currentTime);

      dom.volBinauralLbl.innerText = 'Off';
      dom.volCosmicLbl.innerText = 'Off';
      dom.volRainLbl.innerText = 'Off';
      triggerToast('All ambient noise generators muted.');
    });
  }

  // --- MODAL UTILITIES ---
  function openModal(modal) {
    modal.classList.remove('hidden');
  }
  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  function setupModalEvents() {
    // Open
    dom.btnQuickTask.addEventListener('click', () => openModal(dom.modalAddTask));
    dom.btnTriggerAddTask.addEventListener('click', () => openModal(dom.modalAddTask));
    dom.btnTriggerAddHabit.addEventListener('click', () => openModal(dom.modalAddHabit));

    // Close Buttons
    dom.btnCloseTaskModal.addEventListener('click', () => closeModal(dom.modalAddTask));
    dom.btnCloseHabitModal.addEventListener('click', () => closeModal(dom.modalAddHabit));
    dom.btnCancelTask.addEventListener('click', () => closeModal(dom.modalAddTask));
    dom.btnCancelHabit.addEventListener('click', () => closeModal(dom.modalAddHabit));

    // Submission handlers
    dom.formAddTask.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('input-task-title').value.trim();
      const desc = document.getElementById('input-task-desc').value.trim();
      const column = document.getElementById('input-task-column').value;
      const priority = document.getElementById('input-task-priority').value;

      if (title) {
        const newTask = {
          id: 't-' + Date.now(),
          title,
          desc,
          column,
          priority
        };
        state.tasks.push(newTask);
        closeModal(dom.modalAddTask);
        dom.formAddTask.reset();
        triggerToast('New task successfully created!');
        logActivity(`Created task "${title}"`);
        renderAll();
      }
    });

    dom.formAddHabit.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('input-habit-title').value.trim();
      const theme = document.getElementById('input-habit-theme').value;

      if (title) {
        const newHabit = {
          id: 'h-' + Date.now(),
          title,
          theme,
          done: false,
          streak: 0
        };
        state.habits.push(newHabit);
        closeModal(dom.modalAddHabit);
        dom.formAddHabit.reset();
        triggerToast('Established new daily habit.');
        logActivity(`Established daily habit "${title}"`);
        renderAll();
      }
    });
  }

  // --- INITIALIZE & COMBINED RENDERING ---
  function renderAll() {
    renderKanban();
    renderDashboardWidgets();
    renderHabitsBoard();
    renderActivityFeed();
    updateXPUI();
  }

  function setupGlobalEvents() {
    // Sidebar Navigation Click Handlers
    dom.navDashboard.addEventListener('click', () => switchTab('dashboard'));
    dom.navKanban.addEventListener('click', () => switchTab('kanban'));
    dom.navTimer.addEventListener('click', () => switchTab('timer'));
    dom.navHabits.addEventListener('click', () => switchTab('habits'));

    // Timer Actions
    dom.btnTimerToggle.addEventListener('click', toggleTimer);
    dom.btnTimerReset.addEventListener('click', () => {
      stopTimer();
      state.timer.remaining = state.timer.duration;
      updateTimerUI();
      triggerToast('Timer reset.');
    });
    dom.btnTimerSkip.addEventListener('click', () => {
      stopTimer();
      handleTimerCompletion();
    });

    // Clear Live Feed
    dom.btnClearedFeed.addEventListener('click', () => {
      state.activityLog = [];
      renderActivityFeed();
    });
  }

  // Run initialization once DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    setupGlobalEvents();
    setupKanbanEvents();
    setupHabitsEvents();
    setupAudioControls();
    setupModalEvents();
    
    // Set Initial Timer values
    updateTimerUI();
    
    // Master render pass
    renderAll();
  });
})();