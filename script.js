document.addEventListener('DOMContentLoaded', () => {
  // Core State Engine
  let state = {
    addendA: 0,
    addendB: 0,
    correctAnswer: 0,
    streak: 0,
    maxStreak: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    globalXP: 0,
    soundEnabled: true,
    activeDifficulty: 'double-easy',
    gameType: 'zen', // zen, sprint-30, sprint-60
    sprintTimer: null,
    secondsRemaining: 0
  };

  // Web Audio Synth Engine for interactive feedback sounds
  const playSyntheticAudio = (type) => {
    if (!state.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        // Happy arpeggio chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'incorrect') {
        // Melancholic double-beep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.12); // D3
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'button') {
        // Neutral dynamic tick sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      console.log('Audio Context muted or not allowed by browser permissions yet.');
    }
  };

  // DOM Element Selectors
  const elAddendA = document.getElementById('addend-a');
  const elAddendB = document.getElementById('addend-b');
  const elInputUserSum = document.getElementById('input-user-sum');
  const elBtnSubmitAnswer = document.getElementById('btn-submit-answer');
  const elBtnRestartGame = document.getElementById('btn-restart-game');
  const elSelectDifficulty = document.getElementById('select-difficulty');
  const elSelectGameType = document.getElementById('select-game-type');
  
  const elGlobalXP = document.getElementById('global-xp');
  const elCurrentStreak = document.getElementById('current-streak');
  const elStatCorrect = document.getElementById('stat-correct');
  const elStatIncorrect = document.getElementById('stat-incorrect');
  const elStatAccuracy = document.getElementById('stat-accuracy');
  const elStatMaxStreak = document.getElementById('stat-max-streak');
  const elBtnResetStats = document.getElementById('btn-reset-stats');
  
  const elActiveModeBadge = document.getElementById('active-mode-badge');
  const elScoreBubble = document.getElementById('score-bubble');
  const elSprintTimerContainer = document.getElementById('sprint-timer-container');
  const elSprintTimerText = document.getElementById('sprint-timer-text');
  const elStreakAlertMsg = document.getElementById('streak-alert-msg');

  const elTerminalFeedbackCurtain = document.getElementById('terminal-feedback-curtain');
  const elTerminalFeedbackText = document.getElementById('terminal-feedback-text');
  const elArenaTerminal = document.getElementById('arena-terminal');
  
  const elVisLabelA = document.getElementById('vis-label-a');
  const elVisLabelB = document.getElementById('vis-label-b');
  const elVisBlocksA = document.getElementById('vis-blocks-a');
  const elVisBlocksB = document.getElementById('vis-blocks-b');
  const elBtnRegenerateVisuals = document.getElementById('btn-regenerate-visuals');

  const elFeedContainer = document.getElementById('feed-container');
  const elFeedPlaceholder = document.getElementById('feed-placeholder');
  const elFeedCount = document.getElementById('feed-count');

  const elBtnToggleSound = document.getElementById('btn-toggle-sound');
  const elSoundIconOn = document.getElementById('sound-icon-on');
  const elSoundIconOff = document.getElementById('sound-icon-off');

  // Load Statistics from LocalStorage if available
  const loadSavedStats = () => {
    try {
      const savedXP = localStorage.getItem('summit_xp');
      const savedMaxStreak = localStorage.getItem('summit_max_streak');
      if (savedXP) state.globalXP = parseInt(savedXP, 10) || 0;
      if (savedMaxStreak) state.maxStreak = parseInt(savedMaxStreak, 10) || 0;
      updateUIStats();
    } catch (e) {}
  };

  const saveStatsToStorage = () => {
    try {
      localStorage.setItem('summit_xp', state.globalXP);
      localStorage.setItem('summit_max_streak', state.maxStreak);
    } catch (e) {}
  };

  // Utility Randomizers
  const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomFloat = (min, max, decimals = 1) => {
    const num = Math.random() * (max - min) + min;
    return parseFloat(num.toFixed(decimals));
  };

  // Generate a New Mathematical Equation based on difficulty parameter
  const generateEquation = () => {
    let a = 0;
    let b = 0;
    const diff = state.activeDifficulty;

    if (diff === 'single') {
      a = getRandomInteger(1, 9);
      b = getRandomInteger(1, 9);
    } else if (diff === 'double-easy') {
      a = getRandomInteger(10, 50);
      b = getRandomInteger(10, 50);
    } else if (diff === 'double-hard') {
      a = getRandomInteger(50, 99);
      b = getRandomInteger(50, 99);
    } else if (diff === 'hundreds') {
      a = getRandomInteger(100, 999);
      b = getRandomInteger(100, 999);
    } else if (diff === 'decimals') {
      a = getRandomFloat(1.0, 9.9, 1);
      b = getRandomFloat(1.0, 9.9, 1);
    }

    state.addendA = a;
    state.addendB = b;
    // Force rounded floating calculations to prevent JS float precision bugs (e.g., 0.1 + 0.2)
    state.correctAnswer = diff === 'decimals' ? parseFloat((a + b).toFixed(1)) : (a + b);

    // Populate Equation Text
    elAddendA.textContent = a;
    elAddendB.textContent = b;
    
    // Reset input box
    elInputUserSum.value = '';
    elInputUserSum.focus();

    // Generate Counter Blocks
    generateVisualBlocks();
  };

  // Counter Visualizer generator for young learners & structural concepts
  const generateVisualBlocks = () => {
    elVisLabelA.textContent = state.addendA;
    elVisLabelB.textContent = state.addendB;

    elVisBlocksA.innerHTML = '';
    elVisBlocksB.innerHTML = '';

    // Convert to integers for drawing simple counter blocks, if decimal multiply by 10 to demonstrate
    let countA = state.activeDifficulty === 'decimals' ? Math.round(state.addendA * 10) : Math.round(state.addendA);
    let countB = state.activeDifficulty === 'decimals' ? Math.round(state.addendB * 10) : Math.round(state.addendB);

    // Cap visually to avoid browser freezing up with triple-digit huge blocks
    const MAX_VISUAL_BLOCKS = 180;
    if (countA > MAX_VISUAL_BLOCKS) countA = MAX_VISUAL_BLOCKS;
    if (countB > MAX_VISUAL_BLOCKS) countB = MAX_VISUAL_BLOCKS;

    // Render Blocks A
    const blockTensA = Math.floor(countA / 10);
    const blockOnesA = countA % 10;
    
    for (let i = 0; i < blockTensA; i++) {
      const block = document.createElement('div');
      block.className = 'w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[9px] font-bold text-indigo-100 shadow-sm border border-indigo-400/35 cursor-pointer vis-dot';
      block.title = 'Ten group';
      block.textContent = '10';
      elVisBlocksA.appendChild(block);
    }
    for (let i = 0; i < blockOnesA; i++) {
      const dot = document.createElement('div');
      dot.className = 'w-4 h-4 bg-indigo-400 rounded-full flex items-center justify-center text-[7px] font-semibold text-slate-900 cursor-pointer vis-dot';
      dot.title = 'Single Unit';
      dot.textContent = '1';
      elVisBlocksA.appendChild(dot);
    }

    // Render Blocks B
    const blockTensB = Math.floor(countB / 10);
    const blockOnesB = countB % 10;
    
    for (let i = 0; i < blockTensB; i++) {
      const block = document.createElement('div');
      block.className = 'w-6 h-6 bg-violet-600 rounded flex items-center justify-center text-[9px] font-bold text-violet-100 shadow-sm border border-violet-400/35 cursor-pointer vis-dot';
      block.title = 'Ten group';
      block.textContent = '10';
      elVisBlocksB.appendChild(block);
    }
    for (let i = 0; i < blockOnesB; i++) {
      const dot = document.createElement('div');
      dot.className = 'w-4 h-4 bg-violet-400 rounded-full flex items-center justify-center text-[7px] font-semibold text-slate-900 cursor-pointer vis-dot';
      dot.title = 'Single Unit';
      dot.textContent = '1';
      elVisBlocksB.appendChild(dot);
    }
  };

  // UI Updates helper
  const updateUIStats = () => {
    elGlobalXP.textContent = state.globalXP;
    elCurrentStreak.textContent = state.streak;
    elStatCorrect.textContent = state.totalCorrect;
    elStatIncorrect.textContent = state.totalIncorrect;
    elStatMaxStreak.textContent = state.maxStreak;
    
    const totalAttempted = state.totalCorrect + state.totalIncorrect;
    const accuracy = totalAttempted > 0 ? Math.round((state.totalCorrect / totalAttempted) * 100) : 0;
    elStatAccuracy.textContent = `${accuracy}%`;

    // Highlight current score/points bubble
    elScoreBubble.querySelector('strong').textContent = state.totalCorrect * 15;

    // Update interactive layout features based on streak
    if (state.streak >= 5) {
      elStreakAlertMsg.classList.remove('opacity-0', 'translate-y-2');
      elStreakAlertMsg.classList.add('opacity-100', 'translate-y-0');
    } else {
      elStreakAlertMsg.classList.add('opacity-0', 'translate-y-2');
      elStreakAlertMsg.classList.remove('opacity-100', 'translate-y-0');
    }
  };

  // Real-time verification Log Addition Feed
  const addFeedEntry = (addendA, addendB, userValue, correctValue, isCorrect) => {
    if (elFeedPlaceholder) {
      elFeedPlaceholder.classList.add('hidden');
    }

    const entry = document.createElement('div');
    entry.className = `p-3 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 transform scale-95 opacity-0 ${isCorrect ? 'bg-emerald-950/40 border-emerald-900/40' : 'bg-rose-950/40 border-rose-900/40 animate-pulse'}`;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    entry.innerHTML = `
      <div class="flex flex-col gap-0.5">
        <span class="font-mono font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">
          ${addendA} + ${addendB} = ${userValue}
        </span>
        <span class="text-[10px] text-slate-500">Verified ${timeString}</span>
      </div>
      <span class="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
        ${isCorrect ? 'Correct' : `Err: True is ${correctValue}`}
      </span>
    `;

    elFeedContainer.insertBefore(entry, elFeedContainer.firstChild);
    
    // Animation trigger
    setTimeout(() => {
      entry.classList.remove('scale-95', 'opacity-0');
    }, 20);

    // Limit children
    const maxChildren = 25;
    if (elFeedContainer.children.length > maxChildren) {
      elFeedContainer.removeChild(elFeedContainer.lastChild);
    }

    elFeedCount.textContent = elFeedContainer.querySelectorAll('div.border').length;
  };

  // Handle Addition Verification Submit Flow
  const verifyAdditionResult = () => {
    const userInputValue = parseFloat(elInputUserSum.value);
    
    if (isNaN(userInputValue)) {
      // Play short attention shake
      elArenaTerminal.classList.add('input-shake');
      setTimeout(() => elArenaTerminal.classList.remove('input-shake'), 350);
      elInputUserSum.focus();
      return;
    }

    const isCorrectAnswer = Math.abs(userInputValue - state.correctAnswer) < 0.001;

    if (isCorrectAnswer) {
      // Correct answer actions
      state.totalCorrect++;
      state.streak++;
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }

      // XP calculation based on difficulty
      let xpGained = 10;
      if (state.activeDifficulty === 'double-hard') xpGained = 20;
      if (state.activeDifficulty === 'hundreds') xpGained = 30;
      if (state.activeDifficulty === 'decimals') xpGained = 25;
      
      // Bonus multiplier for streak
      if (state.streak >= 5) xpGained *= 2;
      state.globalXP += xpGained;

      playSyntheticAudio('correct');
      triggerFlashCurtain('correct', `+${xpGained} XP! Correct`);
      addFeedEntry(state.addendA, state.addendB, userInputValue, state.correctAnswer, true);
      
      saveStatsToStorage();
      updateUIStats();

      // Transition to new formula instantly
      setTimeout(generateEquation, 800);
    } else {
      // Incorrect answer actions
      state.totalIncorrect++;
      state.streak = 0;

      playSyntheticAudio('incorrect');
      triggerFlashCurtain('incorrect', `Incorrect (Target: ${state.correctAnswer})`);
      addFeedEntry(state.addendA, state.addendB, userInputValue, state.correctAnswer, false);

      updateUIStats();
      
      // Shake terminal to show mistake
      elArenaTerminal.classList.add('input-shake');
      setTimeout(() => elArenaTerminal.classList.remove('input-shake'), 350);

      // Focus back and auto-clear to retry
      elInputUserSum.select();
    }
  };

  // Interactive visual flash overlay for correctness feedback
  const triggerFlashCurtain = (type, message) => {
    if (type === 'correct') {
      elTerminalFeedbackCurtain.className = 'absolute inset-0 bg-emerald-500/25 pointer-events-none transition-all duration-200 flex items-center justify-center';
      elTerminalFeedbackText.textContent = message;
      elTerminalFeedbackText.className = 'text-emerald-300 font-extrabold text-2xl sm:text-4xl opacity-100 scale-105 transform transition-all duration-200';
    } else {
      elTerminalFeedbackCurtain.className = 'absolute inset-0 bg-rose-500/30 pointer-events-none transition-all duration-200 flex items-center justify-center';
      elTerminalFeedbackText.textContent = message;
      elTerminalFeedbackText.className = 'text-rose-200 font-extrabold text-xl sm:text-3xl opacity-100 scale-105 transform transition-all duration-200';
    }

    setTimeout(() => {
      elTerminalFeedbackCurtain.className = 'absolute inset-0 bg-emerald-500/0 pointer-events-none transition-all duration-300 flex items-center justify-center';
      elTerminalFeedbackText.className = 'text-white font-black text-3xl opacity-0 transform scale-75 transition-all duration-200';
    }, 850);
  };

  // Sprint Game Mode Countdown Timers
  const startSprintTimer = (seconds) => {
    clearInterval(state.sprintTimer);
    state.secondsRemaining = seconds;
    
    elSprintTimerContainer.classList.remove('hidden');
    elSprintTimerContainer.classList.add('flex');
    elSprintTimerText.textContent = `${state.secondsRemaining}s Left`;

    state.sprintTimer = setInterval(() => {
      state.secondsRemaining--;
      if (state.secondsRemaining <= 0) {
        clearInterval(state.sprintTimer);
        elSprintTimerText.textContent = 'Times Up!';
        playSyntheticAudio('incorrect');
        alert(`⏱️ Arena Sprint Finished! You solved ${state.streak} additions in a row!`);
        
        // Reset back to zen
        elSelectGameType.value = 'zen';
        toggleGameType('zen');
      } else {
        elSprintTimerText.textContent = `${state.secondsRemaining}s Left`;
      }
    }, 1000);
  };

  const toggleGameType = (type) => {
    state.gameType = type;
    clearInterval(state.sprintTimer);
    
    if (type === 'zen') {
      elActiveModeBadge.textContent = 'ZEN SYSTEM';
      elActiveModeBadge.className = 'px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      elSprintTimerContainer.classList.remove('flex');
      elSprintTimerContainer.classList.add('hidden');
    } else if (type === 'sprint-30') {
      elActiveModeBadge.textContent = '30s SPRINT';
      elActiveModeBadge.className = 'px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20';
      startSprintTimer(30);
    } else if (type === 'sprint-60') {
      elActiveModeBadge.textContent = '60s MARATHON';
      elActiveModeBadge.className = 'px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20';
      startSprintTimer(60);
    }
    generateEquation();
  };

  // On Screen Keypad Handler
  document.querySelectorAll('.numpad-key').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = btn.getAttribute('data-val');
      playSyntheticAudio('button');

      if (val === 'clear') {
        elInputUserSum.value = '';
      } else if (val === 'dot') {
        if (!elInputUserSum.value.includes('.')) {
          elInputUserSum.value += '.';
        }
      } else {
        elInputUserSum.value += val;
      }
      elInputUserSum.focus();
    });
  });

  // Custom controls listeners
  elBtnSubmitAnswer.addEventListener('click', () => {
    playSyntheticAudio('button');
    verifyAdditionResult();
  });

  elInputUserSum.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      verifyAdditionResult();
    } else if (e.key === 'Escape') {
      elInputUserSum.value = '';
    }
  });

  elSelectDifficulty.addEventListener('change', (e) => {
    state.activeDifficulty = e.target.value;
    playSyntheticAudio('button');
    generateEquation();
  });

  elSelectGameType.addEventListener('change', (e) => {
    playSyntheticAudio('button');
    toggleGameType(e.target.value);
  });

  elBtnRestartGame.addEventListener('click', () => {
    playSyntheticAudio('button');
    generateEquation();
  });

  elBtnRegenerateVisuals.addEventListener('click', () => {
    playSyntheticAudio('button');
    generateVisualBlocks();
  });

  elBtnResetStats.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all current performance tracker data? This action cannot be reversed.')) {
      state.streak = 0;
      state.maxStreak = 0;
      state.totalCorrect = 0;
      state.totalIncorrect = 0;
      state.globalXP = 0;
      saveStatsToStorage();
      updateUIStats();
      playSyntheticAudio('incorrect');
      
      // Clear Feed
      elFeedContainer.innerHTML = '';
      if (elFeedPlaceholder) {
        elFeedPlaceholder.classList.remove('hidden');
      }
      elFeedCount.textContent = '0';
    }
  });

  elBtnToggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      elSoundIconOn.classList.remove('hidden');
      elSoundIconOff.classList.add('hidden');
      playSyntheticAudio('button');
    } else {
      elSoundIconOn.classList.add('hidden');
      elSoundIconOff.classList.remove('hidden');
    }
  });

  // Initialize on boot
  loadSavedStats();
  generateEquation();
  updateUIStats();
});