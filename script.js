// Real client-side logic with deep local storage capability & robust dynamic calculations.
(function () {
  // Default Starting Good Habits
  const DEFAULT_HABITS = [
    { id: "h1", name: "Hydrate Fully (3 Liters)", category: "Body", streak: 3, completedToday: true, icon: "💧", freq: "Everyday" },
    { id: "h2", name: "Read 10-15 Pages of Literature", category: "Mind", streak: 5, completedToday: false, icon: "📚", freq: "Everyday" },
    { id: "h3", name: "30-min Deep Focus & Code Work", category: "Work", streak: 2, completedToday: false, icon: "💻", freq: "Weekdays" },
    { id: "h4", name: "Meditate / Calm Reflection", category: "Mind", streak: 0, completedToday: false, icon: "🧘", freq: "Everyday" }
  ];

  const WISE_QUOTES = [
    { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
    { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { quote: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
    { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" }
  ];

  // State definition with local storage safe retrieval
  let state = {
    habits: JSON.parse(localStorage.getItem("sprout_habits")) || DEFAULT_HABITS,
    xp: parseInt(localStorage.getItem("sprout_xp")) || 30,
    level: parseInt(localStorage.getItem("sprout_lvl")) || 1,
    totalChecks: parseInt(localStorage.getItem("sprout_total_checks")) || 12,
    perfectDays: parseInt(localStorage.getItem("sprout_perfect_days")) || 1,
    activeFilter: "all",
    tipIndex: 0
  };

  // DOM Elements cache
  const habitsContainer = document.getElementById("habits-container");
  const dateString = document.getElementById("date-string");
  const progressCircle = document.getElementById("progress-circle");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressRatio = document.getElementById("progress-ratio");
  
  const userLevel = document.getElementById("user-level");
  const xpText = document.getElementById("xp-text");
  const xpBar = document.getElementById("xp-bar");

  const statTotalCompletions = document.getElementById("stat-total-completions");
  const statPerfectDays = document.getElementById("stat-perfect-days");
  const challengeProgress = document.getElementById("challenge-progress");
  const challengeBar = document.getElementById("challenge-bar");

  const toastElement = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  const toggleAddBtn = document.getElementById("toggle-add-btn");
  const addHabitDrawer = document.getElementById("add-habit-drawer");
  const closeAddDrawer = document.getElementById("close-add-drawer");
  const habitForm = document.getElementById("habit-form");

  const simulateDayBtn = document.getElementById("btn-simulate-day");
  const resetAppBtn = document.getElementById("btn-reset-app");
  
  const wiseQuote = document.getElementById("wise-quote");
  const wiseAuthor = document.getElementById("wise-author");
  const nextTipBtn = document.getElementById("btn-next-tip");
  
  const activityLogList = document.getElementById("activity-log-list");

  // Initialize Date presentation
  function renderDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    dateString.textContent = today.toLocaleDateString('en-US', options);
  }

  // Save helper
  function saveState() {
    localStorage.setItem("sprout_habits", JSON.stringify(state.habits));
    localStorage.setItem("sprout_xp", state.xp);
    localStorage.setItem("sprout_lvl", state.level);
    localStorage.setItem("sprout_total_checks", state.totalChecks);
    localStorage.setItem("sprout_perfect_days", state.perfectDays);
  }

  // Show premium bottom-right notification
  function showToast(message, isLevelUp = false) {
    toastMessage.textContent = message;
    if (isLevelUp) {
      toastElement.className = "fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-300 animate-bounce";
    } else {
      toastElement.className = "fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 ease-out bg-slate-900 text-indigo-300 font-semibold py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-500/30";
    }
    
    setTimeout(() => {
      toastElement.className = "fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 ease-out bg-indigo-600 text-white font-semibold py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-400";
    }, 2800);
  }

  // Realtime Logger
  function logActivity(text, badgeClass = "bg-indigo-500/10 text-indigo-400") {
    const logItem = document.createElement("div");
    logItem.className = "flex items-start gap-2.5 text-xs text-slate-300 animate-fade-in-down border-b border-slate-900 pb-2";
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logItem.innerHTML = `
      <span class="text-[10px] text-slate-500 font-mono mt-0.5">${time}</span>
      <span class="px-1.5 py-0.5 text-[9px] font-bold rounded ${badgeClass} shrink-0">LOG</span>
      <span class="leading-relaxed">${text}</span>
    `;
    activityLogList.insertBefore(logItem, activityLogList.firstChild);
  }

  // XP addition helper with Level calculation logic
  function addXP(amount) {
    state.xp += amount;
    logActivity(`Earned +${amount} Seed XP!`, "bg-emerald-500/10 text-emerald-400");
    
    let levelUpped = false;
    while (state.xp >= 100) {
      state.xp -= 100;
      state.level += 1;
      levelUpped = true;
    }
    
    if (levelUpped) {
      showToast(`✨ LEVEL UP! You reached Sprout Level ${state.level}!`, true);
      logActivity(`🎉 Levelled up to Level ${state.level}!`, "bg-amber-500/10 text-amber-400");
      // Simple UI Level effect animation
      userLevel.classList.add("text-amber-300", "scale-110");
      setTimeout(() => {
        userLevel.classList.remove("text-amber-300", "scale-110");
      }, 1000);
    }
    
    updateXPUI();
    saveState();
  }

  function updateXPUI() {
    userLevel.textContent = `Level ${state.level}`;
    xpText.textContent = `${state.xp} / 100 XP`;
    xpBar.style.width = `${state.xp}%`;
  }

  // Dynamic Habit Render Logic
  function renderHabits() {
    habitsContainer.innerHTML = "";
    
    const filteredHabits = state.habits.filter(h => {
      if (state.activeFilter === "all") return true;
      return h.category.toLowerCase() === state.activeFilter.toLowerCase();
    });

    if (filteredHabits.length === 0) {
      habitsContainer.innerHTML = `
        <div class="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <span class="text-4xl block mb-2">🌱</span>
          <h4 class="text-md font-bold text-slate-300">No habits tracked here yet</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Create a custom habit or clear filters to start seeding progress.</p>
        </div>
      `;
      return;
    }

    filteredHabits.forEach(habit => {
      const card = document.createElement("div");
      
      // Setup conditional styling based on completion
      const completedClass = habit.completedToday 
        ? "border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/20" 
        : "border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90";
      
      const titleClass = habit.completedToday 
        ? "line-through text-slate-500 font-normal" 
        : "text-slate-100 font-bold";

      const checkBtnClass = habit.completedToday
        ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20"
        : "border-2 border-slate-700 text-transparent hover:border-indigo-400 hover:bg-indigo-500/10";

      card.className = `habit-card-transition p-5 rounded-2.5xl border flex items-center justify-between gap-4 shadow-sm relative overflow-hidden ${completedClass}`;
      
      card.innerHTML = `
        <div class="flex items-center gap-4">
          <!-- Interactive Checkbox -->
          <button id="check-${habit.id}" class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${checkBtnClass}" aria-label="Toggle Completion">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <!-- Description -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg select-none">${habit.icon || "🌱"}</span>
              <span class="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded bg-slate-950 text-slate-400 border border-slate-800/60">${habit.category}</span>
              <span class="text-[10px] text-slate-500 font-medium">${habit.freq}</span>
            </div>
            <h3 class="text-sm sm:text-base ${titleClass} transition-all duration-200">${habit.name}</h3>
          </div>
        </div>

        <!-- Streak Pill & Action -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <div class="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-xl text-xs font-black border border-amber-500/20" title="Current Streak">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span id="streak-count-${habit.id}">${habit.streak}d</span>
            </div>
          </div>

          <button id="del-${habit.id}" class="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Habit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      `;

      habitsContainer.appendChild(card);

      // Event Listeners for completion toggles
      document.getElementById(`check-${habit.id}`).addEventListener("click", (e) => {
        e.stopPropagation();
        toggleHabitCompletion(habit.id);
      });

      // Event Listeners for habit deletions
      document.getElementById(`del-${habit.id}`).addEventListener("click", (e) => {
        e.stopPropagation();
        deleteHabit(habit.id);
      });
    });

    calculateProgress();
  }

  // Calculate statistics
  function calculateProgress() {
    const total = state.habits.length;
    if (total === 0) {
      progressPercentage.textContent = "0%";
      progressCircle.setAttribute("stroke-dashoffset", 163.3);
      progressRatio.textContent = "0/0 Habits";
      return;
    }

    const completedCount = state.habits.filter(h => h.completedToday).length;
    const percentage = Math.round((completedCount / total) * 100);

    // Progress wheel rendering
    progressPercentage.textContent = `${percentage}%`;
    progressRatio.textContent = `${completedCount}/${total} Habits`;
    
    // SVG circle math: r=26, Circumference = 2 * PI * 26 = 163.3
    const strokeOffset = 163.3 - (163.3 * percentage) / 100;
    progressCircle.setAttribute("stroke-dashoffset", strokeOffset);

    // Stats updating
    statTotalCompletions.textContent = state.totalChecks;
    statPerfectDays.textContent = state.perfectDays;
    
    // Update challenge progress target metrics dynamically
    const challengeLevelGoal = 5;
    challengeProgress.textContent = `Lvl ${state.level} / Lvl ${challengeLevelGoal}`;
    const challengePercent = Math.min((state.level / challengeLevelGoal) * 100, 100);
    challengeBar.style.width = `${challengePercent}%`;
  }

  // Complete Action Toggle
  function toggleHabitCompletion(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;

    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
      habit.streak += 1;
      state.totalChecks += 1;
      showToast(`Nice! "${habit.name}" done. +15 XP!`);
      logActivity(`Checked off "${habit.name}"`, "bg-emerald-500/10 text-emerald-400");
      addXP(15);

      // Visual flash on streak dynamic badge
      const streakEl = document.getElementById(`streak-count-${habit.id}`);
      if (streakEl) {
        streakEl.classList.add("streak-pulse");
      }
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
      state.totalChecks = Math.max(0, state.totalChecks - 1);
      logActivity(`Unchecked "${habit.name}"`, "bg-rose-500/10 text-rose-400");
      addXP(-10); // small deduction to discourage unchecking
    }

    // Auto perfect day checker trigger
    const allCompletedNow = state.habits.length > 0 && state.habits.every(h => h.completedToday);
    if (allCompletedNow && habit.completedToday) {
      state.perfectDays += 1;
      showToast(`🔥 Perfect Day Achieved! +50 XP Bonus!`, true);
      logActivity(`🏆 Perfect Score! All current habits completed.`, "bg-amber-500/10 text-amber-400");
      addXP(50);
    }

    saveState();
    renderHabits();
  }

  // Delete Single Habit
  function deleteHabit(id) {
    const index = state.habits.findIndex(h => h.id === id);
    if (index !== -1) {
      const name = state.habits[index].name;
      state.habits.splice(index, 1);
      logActivity(`Deleted habit "${name}"`, "bg-slate-700/50 text-slate-400");
      saveState();
      renderHabits();
    }
  }

  // Category Filter triggers
  document.getElementById("category-filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    // Reset all filter buttons visual styles
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.className = "filter-btn px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200";
    });

    btn.className = "filter-btn active-filter px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/20";
    state.activeFilter = btn.dataset.filter;
    renderHabits();
  });

  // Open Create Habit Panel
  toggleAddBtn.addEventListener("click", () => {
    addHabitDrawer.classList.toggle("hidden");
  });

  closeAddDrawer.addEventListener("click", () => {
    addHabitDrawer.classList.add("hidden");
  });

  // Create New Habit form submission
  habitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("habit-title").value.trim();
    const category = document.getElementById("habit-cat").value;
    const icon = document.getElementById("habit-icon").value;
    const freq = document.getElementById("habit-freq").value;

    if (!name) return;

    const newHabit = {
      id: "h_custom_" + Date.now(),
      name,
      category,
      streak: 0,
      completedToday: false,
      icon,
      freq
    };

    state.habits.push(newHabit);
    addXP(25); // Create reward XP
    showToast(`Successfully created "${name}"! +25 Seed XP.`);
    logActivity(`Created habit "${name}" in category: ${category}`, "bg-indigo-500/10 text-indigo-400");

    // Reset form & drawer
    habitForm.reset();
    addHabitDrawer.classList.add("hidden");

    saveState();
    renderHabits();
  });

  // Interactive Tips Engine
  nextTipBtn.addEventListener("click", () => {
    state.tipIndex = (state.tipIndex + 1) % WISE_QUOTES.length;
    wiseQuote.textContent = `"${WISE_QUOTES[state.tipIndex].quote}"`;
    wiseAuthor.textContent = `— ${WISE_QUOTES[state.tipIndex].author}`;
  });

  // Sandbox Simulation Tools
  simulateDayBtn.addEventListener("click", () => {
    // Simulation logic: reset completions, increment streaks if met or break them otherwise
    state.habits.forEach(h => {
      if (!h.completedToday) {
        // Streak reset to 0 if not completed
        h.streak = 0;
      }
      h.completedToday = false;
    });
    
    showToast("🌅 A new day has dawned! Untracked habit streaks reset.");
    logActivity("☀️ Simulated new day. Completed statuses cleared, streaks compiled.", "bg-violet-500/10 text-violet-400");
    saveState();
    renderHabits();
  });

  resetAppBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all habits back to their default tracking values?")) {
      state.habits = [
        { id: "h1", name: "Hydrate Fully (3 Liters)", category: "Body", streak: 3, completedToday: true, icon: "💧", freq: "Everyday" },
        { id: "h2", name: "Read 10-15 Pages of Literature", category: "Mind", streak: 5, completedToday: false, icon: "📚", freq: "Everyday" },
        { id: "h3", name: "30-min Deep Focus & Code Work", category: "Work", streak: 2, completedToday: false, icon: "💻", freq: "Weekdays" },
        { id: "h4", name: "Meditate / Calm Reflection", category: "Mind", streak: 0, completedToday: false, icon: "🧘", freq: "Everyday" }
      ];
      state.xp = 30;
      state.level = 1;
      state.totalChecks = 12;
      state.perfectDays = 1;
      state.activeFilter = "all";

      // Reset active filter buttons UI
      document.querySelectorAll(".filter-btn").forEach(b => {
        if (b.dataset.filter === "all") {
          b.className = "filter-btn active-filter px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/20";
        } else {
          b.className = "filter-btn px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200";
        }
      });

      showToast("🔄 App reset successfully.");
      logActivity("🔄 Reset app tracking statistics and loaded core defaults.", "bg-rose-500/10 text-rose-400");
      
      updateXPUI();
      saveState();
      renderHabits();
    }
  });

  // Run startup procedures
  renderDate();
  updateXPUI();
  renderHabits();
  logActivity("⚡ Welcome to HabitSprout. Happy habit cultivation!", "bg-emerald-500/10 text-emerald-400");
})();