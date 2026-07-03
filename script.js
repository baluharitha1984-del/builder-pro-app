/**
 * Cognitive Lab Interactive Engine
 * Powered by Web Audio API synthesizers and responsive state machines.
 */

// Sound Synthesizer Controller
class SoundSynth {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, volume = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis could not run yet.', e);
    }
  }

  playSuccess() {
    this.playTone(587.33, 'sine', 0.15, 0.1); // D5
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.1), 100); // A5
  }

  playFail() {
    this.playTone(311.13, 'sawtooth', 0.15, 0.12); // Eb4
    setTimeout(() => this.playTone(196, 'sawtooth', 0.3, 0.15), 100); // G3
  }

  playTick() {
    this.playTone(1200, 'sine', 0.05, 0.05);
  }

  playClick() {
    this.playTone(600, 'triangle', 0.08, 0.08);
  }

  playLevelUp() {
    this.playTone(440, 'sine', 0.1, 0.08);
    setTimeout(() => this.playTone(554.37, 'sine', 0.1, 0.08), 80);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 160);
    setTimeout(() => this.playTone(880, 'sine', 0.3, 0.1), 240);
  }
}

const synth = new SoundSynth();

// State Management
const state = {
  globalScore: 100,
  streak: 0,
  scores: {
    matrix: 0,
    stroop: 0,
    math: 0
  },
  quotas: {
    playAny: false,
    stroop15: false,
    math15: false
  },
  dailyTipIndex: 0
};

const tips = [
  "Stroop challenge strengthens anterior cingulate cortex activity by forcing decision-making under high cognitive interference!",
  "The Memory Matrix stimulates the visuospatial sketchpad of your working memory system.",
  "Rapid math speeds up synaptic connections in your parietal lobe, critical for mental focus and deduction.",
  "Taking short rest periods between high difficulty game modules enhances cognitive consolidation.",
  "Sound triggers neural spikes in the primary auditory cortex that sharpen visual motor reflex speeds."
];

// Save & Load State
function loadProfile() {
  const stored = localStorage.getItem('cognitive_lab_stats');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      state.globalScore = parsed.globalScore || 100;
      state.streak = parsed.streak || 0;
      state.scores = parsed.scores || { matrix: 0, stroop: 0, math: 0 };
      state.quotas = parsed.quotas || { playAny: false, stroop15: false, math15: false };
    } catch (e) {
      console.error("Profile load error", e);
    }
  }
  updateDashboardUI();
}

function saveProfile() {
  localStorage.setItem('cognitive_lab_stats', JSON.stringify(state));
  updateDashboardUI();
}

function addLog(text) {
  const consoleBox = document.getElementById('console-log-box');
  const timeStr = new Date().toTimeString().split(' ')[0];
  const logElement = document.createElement('div');
  logElement.textContent = `[${timeStr}] ${text}`;
  consoleBox.appendChild(logElement);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function updateDashboardUI() {
  document.getElementById('global-score-val').textContent = state.globalScore;
  document.getElementById('streak-val').textContent = state.streak;
  document.getElementById('matrix-high-val').innerHTML = `${state.scores.matrix} <span class="text-slate-500 font-normal">Lvl</span>`;
  document.getElementById('stroop-high-val').innerHTML = `${state.scores.stroop} <span class="text-slate-500 font-normal">pts</span>`;
  document.getElementById('math-high-val').innerHTML = `${state.scores.math} <span class="text-slate-500 font-normal">pts</span>`;

  // Handle quota checkboxes
  document.getElementById('quota-play-any').checked = state.quotas.playAny;
  document.getElementById('quota-stroop-15').checked = state.quotas.stroop15;
  document.getElementById('quota-math-15').checked = state.quotas.math15;

  // Calculate completed percent
  let doneCount = 0;
  if (state.quotas.playAny) doneCount++;
  if (state.quotas.stroop15) doneCount++;
  if (state.quotas.math15) doneCount++;
  const donePct = Math.round((doneCount / 3) * 100);
  document.getElementById('quota-tracker-pct').textContent = `${donePct}% done`;

  // Dynamic skill polygon rendering mapping (focus, math, speed, memory)
  // Matrix affects memory; Stroop affects focus + speed; Math affects calculation.
  const baseMin = 10;
  const memoryVal = baseMin + Math.min(state.scores.matrix * 8, 80); 
  const focusVal = baseMin + Math.min(state.scores.stroop * 2, 75);
  const mathVal = baseMin + Math.min(state.scores.math * 2.5, 80);
  const speedVal = baseMin + Math.min((state.scores.stroop + state.scores.math) * 1.2, 70);

  // Map to points on polygon: Top(Memory), Right(Speed), Bottom(Math), Left(Focus)
  // Standard center = (50, 50), radius scale = 40%
  // Top node: (50, 50 - memoryVal/2)
  // Right node: (50 + speedVal/2, 50)
  // Bottom node: (50, 50 + mathVal/2)
  // Left node: (50 - focusVal/2, 50)
  const yTop = 50 - (memoryVal * 0.45);
  const xRight = 50 + (speedVal * 0.45);
  const yBottom = 50 + (mathVal * 0.45);
  const xLeft = 50 - (focusVal * 0.45);

  const poly = document.getElementById('skills-polygon');
  if (poly) {
    poly.setAttribute('points', `${50},${yTop} ${xRight},${50} ${50},${yBottom} ${xLeft},${50}`);
  }

  // Update Tier title
  const tierLabel = document.getElementById('brain-tier-label');
  if (state.globalScore < 120) {
    tierLabel.textContent = "Aptitude Trainee";
    tierLabel.className = "ml-1 font-semibold text-indigo-400";
  } else if (state.globalScore < 200) {
    tierLabel.textContent = "Cognitive Adept";
    tierLabel.className = "ml-1 font-semibold text-emerald-400";
  } else if (state.globalScore < 350) {
    tierLabel.textContent = "Neuro Analyst";
    tierLabel.className = "ml-1 font-semibold text-pink-400";
  } else {
    tierLabel.textContent = "Quantum Mind";
    tierLabel.className = "ml-1 font-semibold text-fuchsia-400 animate-pulse";
  }
}

function showToast(title, description, isSuccess = true) {
  const toast = document.getElementById('toast-message');
  const tTitle = document.getElementById('toast-title');
  const tDesc = document.getElementById('toast-desc');
  const tIconWrapper = document.getElementById('toast-icon-wrapper');

  tTitle.textContent = title;
  tDesc.textContent = description;
  if (isSuccess) {
    tIconWrapper.className = "p-1 bg-emerald-500 rounded-lg text-slate-950";
  } else {
    tIconWrapper.className = "p-1 bg-red-500 rounded-lg text-white";
  }
  
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2500);
}

// Toggle screens
function switchView(viewId) {
  synth.playClick();
  const screens = ['hub-screen', 'matrix-screen', 'stroop-screen', 'math-screen'];
  screens.forEach(s => {
    const el = document.getElementById(s);
    if (s === viewId) {
      el.classList.remove('hidden');
      el.classList.add('flex');
    } else {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });

  // Refresh daily tip intermittently
  state.dailyTipIndex = (state.dailyTipIndex + 1) % tips.length;
  document.getElementById('daily-tip-text').textContent = tips[state.dailyTipIndex];
}


// ===========================================
// GAME 1: MEMORY MATRIX LOGIC
// ===========================================
const matrixGame = {
  level: 1,
  gridSize: 3, // 3x3 initially
  activeTiles: [],
  userSelections: [],
  isPlaybackPhase: false,
  gameActive: false,

  init() {
    this.level = 1;
    this.gridSize = 3;
    this.gameActive = true;
    this.setupLevel();
  },

  setupLevel() {
    this.isPlaybackPhase = true;
    this.userSelections = [];
    
    // Adjust size dynamically
    if (this.level >= 4 && this.level <= 7) this.gridSize = 4; // 4x4
    else if (this.level > 7) this.gridSize = 5; // 5x5
    else this.gridSize = 3;

    const totalTiles = this.gridSize * this.gridSize;
    const activeCount = 2 + this.level; // scaling

    // Pick random target unique indexes
    this.activeTiles = [];
    while (this.activeTiles.length < activeCount) {
      const idx = Math.floor(Math.random() * totalTiles);
      if (!this.activeTiles.includes(idx)) {
        this.activeTiles.push(idx);
      }
    }

    document.getElementById('matrix-score').textContent = this.level;
    document.getElementById('matrix-status-banner').textContent = "Memorize the Grid...";
    document.getElementById('matrix-status-banner').className = "mb-6 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-950/80 border border-amber-500/30 text-amber-300 animate-pulse";

    this.renderGrid();

    // Wait briefly then show targets
    setTimeout(() => {
      this.revealTargets();
    }, 850);
  },

  renderGrid() {
    const container = document.getElementById('matrix-grid-container');
    container.innerHTML = '';
    
    // Grid layout class manipulation
    container.className = `grid gap-2 p-4 bg-slate-950 rounded-2xl border border-slate-850 shadow-inner max-w-[320px] w-full aspect-square justify-center items-center transition-all duration-300 grid-cols-${this.gridSize}`;
    
    const total = this.gridSize * this.gridSize;
    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = "matrix-cell w-full bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850 transition-colors";
      cell.dataset.index = i;
      cell.addEventListener('click', (e) => this.handleCellClick(e, i));
      container.appendChild(cell);
    }
  },

  revealTargets() {
    const cells = document.querySelectorAll('.matrix-cell');
    // Light them up
    this.activeTiles.forEach((idx) => {
      cells[idx].classList.add('active-show');
    });
    
    synth.playTone(330, 'sine', 0.1, 0.05);
    setTimeout(() => {
      synth.playTone(440, 'sine', 0.2, 0.05);
    }, 150);

    // Turn them off after length
    const viewTime = 1200 + (this.level * 100); // dynamic memory duration
    setTimeout(() => {
      cells.forEach(c => c.classList.remove('active-show'));
      this.isPlaybackPhase = false;
      document.getElementById('matrix-status-banner').textContent = "replicate locations!";
      document.getElementById('matrix-status-banner').className = "mb-6 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-950 border border-indigo-500/20 text-indigo-300";
    }, viewTime);
  },

  handleCellClick(e, idx) {
    if (this.isPlaybackPhase || !this.gameActive) return;
    if (this.userSelections.includes(idx)) return; // duplicate prevention

    const cell = e.currentTarget;

    // Was it correct?
    if (this.activeTiles.includes(idx)) {
      this.userSelections.push(idx);
      cell.classList.add('correct-click');
      synth.playTone(523.25 + (this.userSelections.length * 30), 'sine', 0.1, 0.1); // rising tone

      // Win check
      if (this.userSelections.length === this.activeTiles.length) {
        this.levelCompleted();
      }
    } else {
      // Failure path
      cell.classList.add('incorrect-click');
      this.levelFailed();
    }
  },

  levelCompleted() {
    this.isPlaybackPhase = true;
    synth.playSuccess();
    addLog(`Memory Matrix: Level ${this.level} Cleared!`);
    
    // Increment Level
    this.level++;
    
    // Update Personal High level tracker
    if (this.level > state.scores.matrix) {
      state.scores.matrix = this.level - 1;
    }
    
    // Global IQ incremental boost
    state.globalScore += 4;
    state.quotas.playAny = true;
    saveProfile();

    document.getElementById('matrix-status-banner').textContent = "CORRECT STIMULUS";
    document.getElementById('matrix-status-banner').className = "mb-6 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500/20 text-emerald-400";

    setTimeout(() => {
      this.setupLevel();
    }, 1200);
  },

  levelFailed() {
    this.gameActive = false;
    synth.playFail();
    
    // Highlight remaining targets
    const cells = document.querySelectorAll('.matrix-cell');
    this.activeTiles.forEach((idx) => {
      if (!this.userSelections.includes(idx)) {
        cells[idx].classList.add('active-show');
      }
    });

    addLog(`Memory Matrix terminated at level ${this.level}.`);
    showToast("Simulation Halted", `Memory matrix mismatched at level ${this.level}`, false);

    document.getElementById('matrix-status-banner').textContent = "COGNITIVE SYNAPSE ERROR";
    document.getElementById('matrix-status-banner').className = "mb-6 px-4 py-1.5 rounded-full text-xs font-bold bg-red-950 border border-red-500/20 text-red-400";
    
    document.getElementById('start-matrix-btn').textContent = "Re-attempt Module";
  }
};


// ===========================================
// GAME 2: STROOP INTERFERENCE LOGIC
// ===========================================
const stroopGame = {
  score: 0,
  timeLeft: 30,
  timerInterval: null,
  currentWord: "",
  currentColorName: "",
  currentMatch: false, // is meaning equal to colored font?
  active: false,

  colors: [
    { name: "RED", value: "#ef4444", glowClass: "stroop-glow-red" },
    { name: "GREEN", value: "#10b981", glowClass: "stroop-glow-green" },
    { name: "BLUE", value: "#3b82f6", glowClass: "stroop-glow-blue" },
    { name: "YELLOW", value: "#f59e0b", glowClass: "stroop-glow-yellow" },
    { name: "PINK", value: "#ec4899", glowClass: "stroop-glow-pink" }
  ],

  init() {
    this.score = 0;
    this.timeLeft = 30;
    this.active = true;
    
    document.getElementById('stroop-score').textContent = this.score;
    document.getElementById('stroop-timer').textContent = `${this.timeLeft}s`;

    document.getElementById('stroop-lobby').classList.add('hidden');
    document.getElementById('stroop-arena').classList.remove('hidden');

    this.nextStimulus();
    
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('stroop-timer').textContent = `${this.timeLeft}s`;
      
      if (this.timeLeft <= 5) {
        synth.playTick();
      }

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  },

  nextStimulus() {
    // Pick random target label
    const wordObj = this.colors[Math.floor(Math.random() * this.colors.length)];
    // Pick random physical color display
    const colorObj = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.currentWord = wordObj.name;
    this.currentColorName = colorObj.name;
    this.currentMatch = (wordObj.name === colorObj.name);

    const displayEl = document.getElementById('stroop-word');
    displayEl.textContent = this.currentWord;
    displayEl.style.color = colorObj.value;
    
    // Clear previous glow classes
    displayEl.className = "text-5xl font-extrabold tracking-wider filter drop-shadow-lg select-none transition-all duration-100 transform scale-100";
    displayEl.classList.add(colorObj.glowClass);
  },

  handleUserResponse(userResponseTrue) {
    if (!this.active) return;

    if (userResponseTrue === this.currentMatch) {
      // Correct
      this.score++;
      synth.playTone(800, 'sine', 0.08, 0.06);
      document.getElementById('stroop-score').textContent = this.score;
    } else {
      // Incorrect (Minor penalty duration)
      synth.playTone(220, 'sawtooth', 0.15, 0.1);
      this.timeLeft = Math.max(0, this.timeLeft - 2); // lose 2 seconds
      document.getElementById('stroop-timer').textContent = `${this.timeLeft}s`;
    }
    
    this.nextStimulus();
  },

  endGame() {
    this.active = false;
    clearInterval(this.timerInterval);
    synth.playFail();

    addLog(`Stroop Focus completed with score: ${this.score}`);
    showToast("Stroop Finished", `Stimulus score: ${this.score}`, true);

    // Save metrics
    if (this.score > state.scores.stroop) {
      state.scores.stroop = this.score;
    }
    
    if (this.score >= 15) {
      state.quotas.stroop15 = true;
    }

    state.globalScore += Math.floor(this.score / 2);
    state.quotas.playAny = true;
    saveProfile();

    // Restore Lobby Screen UI
    document.getElementById('stroop-lobby').classList.remove('hidden');
    document.getElementById('stroop-arena').classList.add('hidden');
    document.getElementById('start-stroop-btn').textContent = "Re-run Test Module";
  }
};


// ===========================================
// GAME 3: MATH RUSH LOGIC
// ===========================================
const mathGame = {
  score: 0,
  timeLeft: 30,
  timerInterval: null,
  currentExpression: "",
  currentAnswerIsCorrect: false,
  active: false,

  init() {
    this.score = 0;
    this.timeLeft = 30;
    this.active = true;
    
    document.getElementById('math-score').textContent = this.score;
    document.getElementById('math-timer').textContent = `${this.timeLeft}s`;

    document.getElementById('math-lobby').classList.add('hidden');
    document.getElementById('math-arena').classList.remove('hidden');

    this.generateEquation();
    
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('math-timer').textContent = `${this.timeLeft}s`;
      
      if (this.timeLeft <= 5) {
        synth.playTick();
      }

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  },

  generateEquation() {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    
    let num1 = 0;
    let num2 = 0;
    let correctVal = 0;
    
    if (op === '+') {
      num1 = Math.floor(Math.random() * 80) + 10;
      num2 = Math.floor(Math.random() * 80) + 10;
      correctVal = num1 + num2;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 80) + 20;
      num2 = Math.floor(Math.random() * (num1 - 5)) + 5;
      correctVal = num1 - num2;
    } else if (op === '*') {
      num1 = Math.floor(Math.random() * 12) + 2;
      num2 = Math.floor(Math.random() * 12) + 2;
      correctVal = num1 * num2;
    }

    // Deliberately introduce falseness 50% of time
    this.currentAnswerIsCorrect = Math.random() < 0.5;
    let displayedResult = correctVal;
    
    if (!this.currentAnswerIsCorrect) {
      const deviation = Math.floor(Math.random() * 5) + 1;
      displayedResult = Math.random() < 0.5 ? correctVal + deviation : Math.max(0, correctVal - deviation);
      if (displayedResult === correctVal) displayedResult += 2;
    }

    this.currentExpression = `${num1} ${op === '*' ? '×' : op} ${num2} = ${displayedResult}`;
    document.getElementById('math-expr').textContent = this.currentExpression;
  },

  handleUserResponse(userTrue) {
    if (!this.active) return;

    if (userTrue === this.currentAnswerIsCorrect) {
      // Correct
      this.score++;
      synth.playTone(950, 'sine', 0.08, 0.05);
      document.getElementById('math-score').textContent = this.score;
    } else {
      // Wrong answer
      synth.playTone(280, 'triangle', 0.15, 0.1);
      this.timeLeft = Math.max(0, this.timeLeft - 2);
      document.getElementById('math-timer').textContent = `${this.timeLeft}s`;
    }

    this.generateEquation();
  },

  endGame() {
    this.active = false;
    clearInterval(this.timerInterval);
    synth.playFail();

    addLog(`Math Rush completed with score: ${this.score}`);
    showToast("Arithmetic Speed Ended", `Calculated output: ${this.score}`, true);

    // Save metrics
    if (this.score > state.scores.math) {
      state.scores.math = this.score;
    }
    
    if (this.score >= 15) {
      state.quotas.math15 = true;
    }

    state.globalScore += Math.floor(this.score / 2);
    state.quotas.playAny = true;
    saveProfile();

    // Restore Lobby Screen UI
    document.getElementById('math-lobby').classList.remove('hidden');
    document.getElementById('math-arena').classList.add('hidden');
    document.getElementById('start-math-btn').textContent = "Re-run Test Module";
  }
};


// ===========================================
// USER CONTROLLER EVENT LISTENERS
// ===========================================
function initEventListeners() {
  // Sound Control
  document.getElementById('toggle-sound-btn').addEventListener('click', () => {
    synth.enabled = !synth.enabled;
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (synth.enabled) {
      icon.className = "relative flex h-2 w-2";
      text.textContent = "Synth FX: ON";
      synth.playClick();
      addLog("Acoustic feedback elements active.");
    } else {
      icon.className = "relative h-2 w-2 rounded-full bg-slate-600";
      text.textContent = "Synth FX: MUTED";
      addLog("Acoustic components silenced.");
    }
  });

  // Reset Stats Button
  document.getElementById('reset-stats-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to initialize telemetry reset? Your cognitive history will be purged.")) {
      state.globalScore = 100;
      state.streak = 0;
      state.scores = { matrix: 0, stroop: 0, math: 0 };
      state.quotas = { playAny: false, stroop15: false, math15: false };
      saveProfile();
      addLog("Profile database rebuilt successfully.");
      showToast("Data Wiped", "Telemetry data rebuilt from default blueprint", false);
    }
  });

  // Hub Navigation Cards
  document.getElementById('matrix-card').addEventListener('click', () => {
    switchView('matrix-screen');
    matrixGame.init();
  });
  document.getElementById('stroop-card').addEventListener('click', () => {
    switchView('stroop-screen');
  });
  document.getElementById('math-card').addEventListener('click', () => {
    switchView('math-screen');
  });

  // Back-to-hub buttons
  document.querySelectorAll('.back-to-hub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Halt active sessions if returning
      matrixGame.gameActive = false;
      stroopGame.active = false;
      clearInterval(stroopGame.timerInterval);
      mathGame.active = false;
      clearInterval(mathGame.timerInterval);

      switchView('hub-screen');
    });
  });

  // Game 1 Start Button
  document.getElementById('start-matrix-btn').addEventListener('click', () => {
    synth.playClick();
    matrixGame.init();
  });

  // Game 2 Interactive Events (Stroop)
  document.getElementById('start-stroop-btn').addEventListener('click', () => {
    synth.playClick();
    stroopGame.init();
  });
  document.getElementById('stroop-btn-true').addEventListener('click', () => {
    stroopGame.handleUserResponse(true);
  });
  document.getElementById('stroop-btn-false').addEventListener('click', () => {
    stroopGame.handleUserResponse(false);
  });

  // Game 3 Interactive Events (Math)
  document.getElementById('start-math-btn').addEventListener('click', () => {
    synth.playClick();
    mathGame.init();
  });
  document.getElementById('math-btn-true').addEventListener('click', () => {
    mathGame.handleUserResponse(true);
  });
  document.getElementById('math-btn-false').addEventListener('click', () => {
    mathGame.handleUserResponse(false);
  });
}

// Execute Setup
window.addEventListener('load', () => {
  loadProfile();
  initEventListeners();
  
  // Simple automated setup streak checker
  const todayStr = new Date().toDateString();
  const lastVisit = localStorage.getItem('last_mind_visit');
  if (lastVisit && lastVisit !== todayStr) {
    state.streak++;
    saveProfile();
  } else if (!lastVisit) {
    state.streak = 1;
    saveProfile();
  }
  localStorage.setItem('last_mind_visit', todayStr);
});