// Subtraction Playground, Game & Solver Implementation

// Sound Synthesizer
const AudioEngine = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playPop() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  },

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, this.ctx.currentTime);
    osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(660, this.ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.32);
  },

  playFail() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
};

// State Variables
let currentTab = 'visual';
let minuendVal = 15;
let subtrahendVal = 6;
let historyList = [
  { id: 1, text: '15 − 6 = 9', label: 'Playground', timestamp: 'Initial state' }
];

// Game variables
let gameActive = false;
let gameScore = 0;
let gameStreak = 0;
let gameBestStreak = 0;
let gameDifficulty = 'easy'; // easy, medium, hard, insane
let currentQuestion = { a: 0, b: 0, ans: 0 };
let gameTimerInterval = null;
let gameTimeLeft = 100; // in percentage

// DOM Elements
const elements = {
  tabVisual: document.getElementById('tab-visual'),
  tabArcade: document.getElementById('tab-arcade'),
  tabSolver: document.getElementById('tab-solver'),
  viewVisual: document.getElementById('view-visual'),
  viewArcade: document.getElementById('view-arcade'),
  viewSolver: document.getElementById('view-solver'),

  rangeMinuend: document.getElementById('range-minuend'),
  rangeSubtrahend: document.getElementById('range-subtrahend'),
  valMinuend: document.getElementById('val-minuend'),
  valSubtrahend: document.getElementById('val-subtrahend'),
  eqMinuend: document.getElementById('eq-minuend'),
  eqSubtrahend: document.getElementById('eq-subtrahend'),
  eqResult: document.getElementById('eq-result'),
  eqWorded: document.getElementById('eq-worded'),
  visualGrid: document.getElementById('visual-items-grid'),
  resetPlayground: document.getElementById('reset-playground'),

  btnToggleSound: document.getElementById('btn-toggle-sound'),
  btnTestSoundPop: document.getElementById('btn-test-sound-pop'),
  btnTestSoundWin: document.getElementById('btn-test-sound-win'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  activityLog: document.getElementById('activity-log'),

  // Arcade
  arcadeScore: document.getElementById('arcade-score'),
  arcadeStreak: document.getElementById('arcade-streak'),
  arcadeBestStreak: document.getElementById('arcade-best-streak'),
  qMinuend: document.getElementById('q-minuend'),
  qSubtrahend: document.getElementById('q-subtrahend'),
  optionsContainer: document.getElementById('arcade-options'),
  timerBar: document.getElementById('arcade-timer'),
  introOverlay: document.getElementById('arcade-intro-overlay'),
  btnStartArcade: document.getElementById('btn-start-arcade'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayDesc: document.getElementById('overlay-desc'),

  // Solver
  solverMinuend: document.getElementById('solver-minuend'),
  solverSubtrahend: document.getElementById('solver-subtrahend'),
  solverColumns: document.getElementById('solver-math-columns'),
  solverStepsList: document.getElementById('solver-steps-list'),
  solverColumnLabel: document.getElementById('solver-column-label')
};

// Tab Management
function switchTab(tabId) {
  currentTab = tabId;
  const tabs = [elements.tabVisual, elements.tabArcade, elements.tabSolver];
  const views = [elements.viewVisual, elements.viewArcade, elements.viewSolver];
  
  tabs.forEach(tab => {
    tab.className = "tab-btn px-4 py-2 text-sm font-semibold rounded-lg transition-all text-slate-400 hover:text-slate-200";
  });
  views.forEach(v => v.classList.add('hidden'));

  if (tabId === 'visual') {
    elements.tabVisual.className = "tab-btn active px-4 py-2 text-sm font-semibold rounded-lg transition-all text-white bg-gradient-to-r from-rose-600 to-rose-500 shadow-md shadow-rose-600/10";
    elements.viewVisual.classList.remove('hidden');
    renderPlayground();
  } else if (tabId === 'arcade') {
    elements.tabArcade.className = "tab-btn active px-4 py-2 text-sm font-semibold rounded-lg transition-all text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-600/10";
    elements.viewArcade.classList.remove('hidden');
    resetArcadeStats();
  } else if (tabId === 'solver') {
    elements.tabSolver.className = "tab-btn active px-4 py-2 text-sm font-semibold rounded-lg transition-all text-white bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-md shadow-emerald-600/10";
    elements.viewSolver.classList.remove('hidden');
    runSolver();
  }
  AudioEngine.playPop();
}

// Sound controls initialization
if (elements.btnToggleSound) {
  elements.btnToggleSound.addEventListener('click', () => {
    AudioEngine.enabled = !AudioEngine.enabled;
    elements.btnToggleSound.textContent = AudioEngine.enabled ? "ON" : "OFF";
    elements.btnToggleSound.className = AudioEngine.enabled 
      ? "px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors"
      : "px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-lg text-xs transition-colors";
    AudioEngine.playPop();
  });
}
if (elements.btnTestSoundPop) {
  elements.btnTestSoundPop.addEventListener('click', () => AudioEngine.playPop());
}
if (elements.btnTestSoundWin) {
  elements.btnTestSoundWin.addEventListener('click', () => AudioEngine.playSuccess());
}

// Convert numbers to words for friendly voice representation
function numberToWords(num) {
  if (num < 0) return 'negative ' + numberToWords(Math.abs(num));
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  if (words[num]) return words[num];
  if (num < 100) {
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const single = num % 10;
    return tens[Math.floor(num / 10)] + (single ? '-' + words[single] : '');
  }
  return num.toString();
}

// Interactive Playground Engine
function renderPlayground() {
  const m = minuendVal;
  const s = subtrahendVal;
  const result = m - s;

  elements.valMinuend.textContent = m;
  elements.valSubtrahend.textContent = s;
  elements.eqMinuend.textContent = m;
  elements.eqSubtrahend.textContent = s;
  elements.eqResult.textContent = result;
  elements.eqWorded.textContent = `${numberToWords(m)} minus ${numberToWords(s)} equals ${numberToWords(result)}`;

  // Clear grid
  elements.visualGrid.innerHTML = '';

  // Render dots. Subtrahend dots are flagged visually as "taken away"
  for (let i = 1; i <= m; i++) {
    const dot = document.createElement('div');
    const isSubtracted = i > (m - s);

    dot.className = `item-dot w-12 h-12 flex flex-col items-center justify-center rounded-2xl text-xs font-black transition-all cursor-pointer relative select-none
      ${isSubtracted 
        ? 'bg-slate-900 border border-amber-500/40 text-amber-500/50 dimmed'
        : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95'
      }`;

    // Visual Indicator labels
    dot.innerHTML = `
      <span class="leading-none">${i}</span>
      ${isSubtracted ? '<span class="text-[10px] text-amber-500 leading-none mt-0.5">−1</span>' : ''}
    `;

    // User can manually tap a positive dot to increment subtraction!
    if (!isSubtracted) {
      dot.addEventListener('click', () => {
        if (subtrahendVal < minuendVal) {
          subtrahendVal++;
          elements.rangeSubtrahend.value = subtrahendVal;
          renderPlayground();
          AudioEngine.playPop();
          triggerContainerFlash(elements.viewVisual, 'flash-red');
        }
      });
    } else {
      // Clicking a subtracted dot restores it!
      dot.addEventListener('click', () => {
        if (subtrahendVal > 0) {
          subtrahendVal--;
          elements.rangeSubtrahend.value = subtrahendVal;
          renderPlayground();
          AudioEngine.playPop();
          triggerContainerFlash(elements.viewVisual, 'flash-green');
        }
      });
    }

    elements.visualGrid.appendChild(dot);
  }
}

function triggerContainerFlash(element, className) {
  element.classList.remove('flash-green', 'flash-red');
  // Force reflow
  void element.offsetWidth;
  element.classList.add(className);
}

// Handle slider updates
elements.rangeMinuend.addEventListener('input', (e) => {
  minuendVal = parseInt(e.target.value);
  // Clamp subtrahend values to never exceed minuend
  elements.rangeSubtrahend.max = minuendVal;
  if (subtrahendVal > minuendVal) {
    subtrahendVal = minuendVal;
    elements.rangeSubtrahend.value = subtrahendVal;
  }
  renderPlayground();
});

elements.rangeSubtrahend.addEventListener('input', (e) => {
  subtrahendVal = parseInt(e.target.value);
  renderPlayground();
});

elements.resetPlayground.addEventListener('click', () => {
  minuendVal = 15;
  subtrahendVal = 6;
  elements.rangeMinuend.value = 15;
  elements.rangeSubtrahend.max = 15;
  elements.rangeSubtrahend.value = 6;
  renderPlayground();
  AudioEngine.playPop();
  pushHistory('15 − 6 = 9', 'Reset Playground');
});

// --- ARCADE GAME ENGINE ---
const arcadeDifficultyRules = {
  easy: { maxM: 12, maxSub: 10, time: 12 },
  medium: { maxM: 40, maxSub: 30, time: 10 },
  hard: { maxM: 99, maxSub: 80, time: 8 },
  insane: { maxM: 200, maxSub: 150, time: 6 }
};

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.diff-btn').forEach(b => b.className = "diff-btn text-xs px-3 py-1.5 rounded-lg font-bold text-slate-400 transition-all");
    e.target.className = "diff-btn active text-xs px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white transition-all";
    gameDifficulty = e.target.getAttribute('data-level');
    AudioEngine.playPop();
    stopArcadeGame();
  });
});

function resetArcadeStats() {
  gameScore = 0;
  gameStreak = 0;
  elements.arcadeScore.textContent = '0';
  elements.arcadeStreak.textContent = '🔥 0';
  stopArcadeGame();
}

function stopArcadeGame() {
  gameActive = false;
  clearInterval(gameTimerInterval);
  elements.introOverlay.classList.remove('hidden');
  elements.overlayTitle.textContent = "Prepare your brain!";
  elements.overlayDesc.textContent = `Difficulty: ${gameDifficulty.toUpperCase()}. Quick mental math is required.`;
  elements.timerBar.style.width = '100%';
}

elements.btnStartArcade.addEventListener('click', () => {
  gameActive = true;
  gameScore = 0;
  gameStreak = 0;
  elements.arcadeScore.textContent = '0';
  elements.arcadeStreak.textContent = '🔥 0';
  elements.introOverlay.classList.add('hidden');
  nextArcadeQuestion();
});

function nextArcadeQuestion() {
  if (!gameActive) return;
  clearInterval(gameTimerInterval);
  
  const rule = arcadeDifficultyRules[gameDifficulty];
  const m = Math.floor(Math.random() * (rule.maxM - 4)) + 5;
  // Ensure we can have positive results or negative options based on difficulty level
  let s = Math.floor(Math.random() * m);
  if (gameDifficulty === 'insane' && Math.random() > 0.6) {
    // allow negative outputs occasionally
    s = Math.floor(Math.random() * (rule.maxSub + 20));
  }

  const answer = m - s;
  currentQuestion = { a: m, b: s, ans: answer };

  elements.qMinuend.textContent = m;
  elements.qSubtrahend.textContent = s;

  // Generate options
  const correctOption = answer;
  const uniqueOptions = new Set([correctOption]);
  
  while (uniqueOptions.size < 4) {
    const offset = Math.floor(Math.random() * 11) - 5; // offset between -5 and 5
    const fake = correctOption + offset;
    uniqueOptions.add(fake);
  }

  const sortedOptions = Array.from(uniqueOptions).sort(() => Math.random() - 0.5);
  elements.optionsContainer.innerHTML = '';
  
  sortedOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "option-btn py-4 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-bold text-xl text-white transition-all shadow-md active:scale-95";
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(opt, btn));
    elements.optionsContainer.appendChild(btn);
  });

  // Start Countdown Timer
  let limit = rule.time * 10;
  let elapsed = 0;
  elements.timerBar.style.width = '100%';

  gameTimerInterval = setInterval(() => {
    elapsed++;
    const percentage = 100 - (elapsed / limit) * 100;
    elements.timerBar.style.width = `${Math.max(0, percentage)}%`;

    if (elapsed >= limit) {
      clearInterval(gameTimerInterval);
      handleTimeOut();
    }
  }, 100);
}

function selectAnswer(selected, buttonElement) {
  if (!gameActive) return;
  clearInterval(gameTimerInterval);

  const correct = currentQuestion.ans;
  if (selected === correct) {
    AudioEngine.playSuccess();
    gameScore += 10 + (gameStreak * 2);
    gameStreak++;
    if (gameStreak > gameBestStreak) {
      gameBestStreak = gameStreak;
      elements.arcadeBestStreak.textContent = gameBestStreak;
    }
    buttonElement.classList.add('bg-emerald-600', 'border-emerald-500');
    buttonElement.classList.remove('bg-slate-900');
    pushHistory(`${currentQuestion.a} − ${currentQuestion.b} = ${correct}`, `Arcade (${gameDifficulty}) ✅`);
    
    setTimeout(() => {
      elements.arcadeScore.textContent = gameScore;
      elements.arcadeStreak.textContent = `🔥 ${gameStreak}`;
      nextArcadeQuestion();
    }, 600);
  } else {
    AudioEngine.playFail();
    gameStreak = 0;
    buttonElement.classList.add('bg-rose-600', 'border-rose-500');
    buttonElement.classList.remove('bg-slate-900');
    pushHistory(`${currentQuestion.a} − ${currentQuestion.b} ❌ (Ans: ${correct})`, `Arcade (${gameDifficulty})`);
    
    // Highlight correct one
    Array.from(elements.optionsContainer.children).forEach(btn => {
      if (parseInt(btn.textContent) === correct) {
        btn.className = "option-btn py-4 px-6 bg-emerald-600 border border-emerald-500 rounded-xl font-bold text-xl text-white transition-all";
      }
    });

    setTimeout(() => {
      elements.arcadeStreak.textContent = '🔥 0';
      gameOverOverlay("Wrong Answer!", `You chose ${selected}, but the answer was ${correct}.`);
    }, 1200);
  }
}

function handleTimeOut() {
  AudioEngine.playFail();
  gameStreak = 0;
  elements.arcadeStreak.textContent = '🔥 0';
  gameOverOverlay("Time's Up!", "Be faster next round to keep the streak going.");
}

function gameOverOverlay(title, subtitle) {
  gameActive = false;
  elements.introOverlay.classList.remove('hidden');
  elements.overlayTitle.textContent = title;
  elements.overlayDesc.innerHTML = `${subtitle}<br><br><span class="text-indigo-400 font-extrabold">Final Score: ${gameScore}</span>`;
  elements.btnStartArcade.textContent = "Play Again";
}

// --- STEP-BY-STEP SOLVER ---
function runSolver() {
  const m = parseInt(elements.solverMinuend.value) || 0;
  const s = parseInt(elements.solverSubtrahend.value) || 0;
  const result = m - s;

  elements.solverStepsList.innerHTML = '';
  
  if (m < s) {
    elements.solverColumnLabel.textContent = "Note: The Minuend is smaller than Subtrahend. Output is negative!";
    elements.solverColumns.innerHTML = `
      <div class="text-slate-500 text-xl mb-2">Calculated:</div>
      <div>${m}</div>
      <div class="border-b border-slate-700 pb-1"><span class="text-rose-500 mr-2">−</span>${s}</div>
      <div class="text-emerald-400 mt-1">${result}</div>
    `;
    
    elements.solverStepsList.innerHTML = `
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <p class="text-xs font-bold uppercase text-amber-500 mb-1">Negative Result Warning</p>
        <p class="text-xs text-slate-300">Because you are taking away more than you have, you will cross below zero by <strong>${Math.abs(result)}</strong> units.</p>
      </div>
    `;
    return;
  }

  elements.solverColumnLabel.textContent = "Aligned place-value columns (Ones, Tens, Hundreds)";
  
  // Build detailed borrowing step-by-step for multi-digit numbers
  const mStr = m.toString();
  const sStr = s.toString();
  
  // Format standard stacked subtraction html
  elements.solverColumns.innerHTML = `
    <div class="text-slate-500 text-xs mb-2 uppercase tracking-widest font-sans">Place-value stack</div>
    <div class="tracking-wider">${m}</div>
    <div class="border-b-2 border-slate-700 pb-1 tracking-wider"><span class="text-rose-500 mr-2">−</span>${s}</div>
    <div class="text-emerald-400 mt-1 tracking-wider">${result}</div>
  `;

  // Step generation
  let stepsHtml = '';
  const mDigits = mStr.split('').map(Number).reverse();
  const sDigits = sStr.split('').map(Number).reverse();
  const maxLen = Math.max(mDigits.length, sDigits.length);
  
  let borrowed = Array(maxLen + 1).fill(false);
  let currentM = [...mDigits];

  stepsHtml += `
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
      <p class="text-xs font-bold uppercase text-slate-400 mb-1">Goal</p>
      <p class="text-xs text-slate-300">We want to solve <strong>${m} − ${s}</strong> by processing columns from right to left.</p>
    </div>
  `;

  for (let i = 0; i < maxLen; i++) {
    const colName = i === 0 ? 'Ones' : i === 1 ? 'Tens' : i === 2 ? 'Hundreds' : `10^${i}s`;
    const digitM = currentM[i] || 0;
    const digitS = sDigits[i] || 0;

    if (digitM < digitS) {
      // Need to borrow!
      let borrowIndex = i + 1;
      while (borrowIndex < currentM.length && currentM[borrowIndex] === 0) {
        borrowIndex++;
      }
      
      if (borrowIndex < currentM.length) {
        currentM[borrowIndex] -= 1;
        currentM[i] += 10;
        stepsHtml += `
          <div class="bg-slate-950 p-4 rounded-xl border border-rose-500/20">
            <p class="text-xs font-bold uppercase text-rose-400 mb-1">Column ${colName} (Borrowing Needed)</p>
            <p class="text-xs text-slate-300">
              We cannot subtract <strong>${digitS}</strong> from <strong>${digitM}</strong>. 
              We borrow 1 from the next column (${colName === 'Ones' ? 'Tens' : 'Hundreds'}), transforming the current column value to <strong>${digitM + 10}</strong>.
              Now we subtract: <strong>${digitM + 10} − ${digitS} = ${digitM + 10 - digitS}</strong>.
            </p>
          </div>
        `;
      } else {
        // Fallback simple column subtraction step
        stepsHtml += `
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p class="text-xs font-bold uppercase text-emerald-400 mb-1">Column ${colName}</p>
            <p class="text-xs text-slate-300">Subtract <strong>${digitS}</strong> from <strong>${digitM}</strong> to get <strong>${digitM - digitS}</strong>.</p>
          </div>
        `;
      }
    } else {
      stepsHtml += `
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <p class="text-xs font-bold uppercase text-slate-400 mb-1">Column ${colName}</p>
          <p class="text-xs text-slate-300">No borrowing required! <strong>${digitM} − ${digitS} = ${digitM - digitS}</strong>.</p>
        </div>
      `;
    }
    
    // Update our simulated subtraction digit outcome
    currentM[i] = digitM - digitS;
  }

  stepsHtml += `
    <div class="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/25">
      <p class="text-xs font-bold uppercase text-emerald-400 mb-1">Final Combined Result</p>
      <p class="text-xs text-slate-300">Reading outputs from left to right gives the correct final answer: <strong>${result}</strong>.</p>
    </div>
  `;

  elements.solverStepsList.innerHTML = stepsHtml;
  pushHistory(`${m} − ${s} = ${result}`, "Interactive Solver");
}

elements.solverMinuend.addEventListener('input', runSolver);
elements.solverSubtrahend.addEventListener('input', runSolver);

// --- HISTORY LOG & UTILS ---
function pushHistory(eqText, sourceLabel) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const id = Date.now();
  historyList.unshift({ id, text: eqText, label: sourceLabel, timestamp: time });
  
  // limit to 8 items
  if (historyList.length > 8) {
    historyList.pop();
  }
  renderHistory();
}

function renderHistory() {
  elements.activityLog.innerHTML = '';
  if (historyList.length === 0) {
    elements.activityLog.innerHTML = `
      <div class="text-center text-slate-500 text-xs py-8">
        No equations processed yet.
      </div>
    `;
    return;
  }

  historyList.forEach(item => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center p-3 bg-slate-950/80 hover:bg-slate-950 rounded-xl border border-slate-800 transition-colors";
    div.innerHTML = `
      <div>
        <p class="text-sm font-extrabold text-white tracking-wide">${item.text}</p>
        <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">${item.label}</span>
      </div>
      <span class="text-[10px] text-slate-500 font-mono">${item.timestamp}</span>
    `;
    elements.activityLog.appendChild(div);
  });
}

elements.btnClearHistory.addEventListener('click', () => {
  historyList = [];
  renderHistory();
  AudioEngine.playPop();
});

// Initialize Sandbox on Load
renderPlayground();
renderHistory();