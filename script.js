// Web Audio System for game immersion
let audioEnabled = true;
const toggleAudioBtn = document.getElementById('toggle-audio');
if (toggleAudioBtn) {
  toggleAudioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    toggleAudioBtn.textContent = audioEnabled ? 'ON' : 'OFF';
    toggleAudioBtn.className = audioEnabled 
      ? 'mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all'
      : 'mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-all';
    playSynthTone(300, 'sine', 0.08);
  });
}

function playSynthTone(freq, type, duration) {
  if (!audioEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Browser policy fallback
  }
}

// Level & Achievements State Engine
let globalXP = parseInt(localStorage.getItem('num_arcade_xp') || '0');
let globalLevel = Math.floor(globalXP / 100) + 1;
let unlockedAchievements = JSON.parse(localStorage.getItem('num_arcade_ach') || '[]');

function addXP(amount) {
  globalXP += amount;
  localStorage.setItem('num_arcade_xp', globalXP);
  document.getElementById('global-xp').textContent = globalXP;
  
  const newLevel = Math.floor(globalXP / 100) + 1;
  if (newLevel > globalLevel) {
    globalLevel = newLevel;
    document.getElementById('global-level').textContent = globalLevel;
    playSynthTone(587.33, 'triangle', 0.5); // D5
    setTimeout(() => playSynthTone(880, 'triangle', 0.6), 150);
    triggerAchievement('ach-level-five');
  }
}

function triggerAchievement(id) {
  if (!unlockedAchievements.includes(id)) {
    unlockedAchievements.push(id);
    localStorage.setItem('num_arcade_ach', JSON.stringify(unlockedAchievements));
    updateAchievementsUI();
    playSynthTone(784, 'triangle', 0.2);
    setTimeout(() => playSynthTone(987.77, 'triangle', 0.4), 100);
  }
}

function updateAchievementsUI() {
  const ids = ['ach-first-guess', 'ach-blitz-streak', 'ach-seq-master', 'ach-level-five'];
  let count = 0;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (unlockedAchievements.includes(id) || (id === 'ach-level-five' && globalLevel >= 5)) {
        el.classList.add('achievement-unlocked');
        count++;
      } else {
        el.classList.remove('achievement-unlocked');
      }
    }
  });
  document.getElementById('achievements-ratio').textContent = `${count}/${ids.length}`;
}

// High Score Loaders
let bestGuessAttempt = parseInt(localStorage.getItem('num_best_guess') || '999');
let bestBlitzStreak = parseInt(localStorage.getItem('num_best_blitz') || '0');
let bestSeqLevel = parseInt(localStorage.getItem('num_best_seq') || '0');

function renderHighScores() {
  document.getElementById('record-guess').textContent = bestGuessAttempt === 999 ? '--' : `${bestGuessAttempt} tries`;
  document.getElementById('record-blitz').textContent = `${bestBlitzStreak} ans`;
  document.getElementById('record-seq').textContent = `${bestSeqLevel} rounds`;
}

// View Controller (Tabs Selection)
const tabButtons = document.querySelectorAll('.game-tab-btn');
const gameViews = document.querySelectorAll('.game-view');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    gameViews.forEach(v => v.classList.remove('active'));

    btn.classList.add('active');
    const targetView = btn.id.replace('tab-', '').replace('-game', '-view');
    const viewEl = document.getElementById(targetView);
    if (viewEl) {
      viewEl.classList.add('active');
    }
    playSynthTone(440, 'sine', 0.08);
    
    // Stop active games if switching
    stopBlitzTimer();
  });
});

// ===================================
// GAME 1: GUESS MY NUMBER ENGINE
// ===================================
let guessTarget = 0;
let guessCount = 0;
let guessMaxRange = 100;

function initGuessGame() {
  guessTarget = Math.floor(Math.random() * guessMaxRange) + 1;
  guessCount = 0;
  document.getElementById('guess-count').textContent = '0';
  document.getElementById('clue-banner').innerHTML = `<span class="text-sm font-medium text-indigo-400">New Diagnostics Initiated. Number locked between 1 and ${guessMaxRange}.</span>`;
  document.getElementById('guesses-history-list').innerHTML = '<p class="text-xs text-slate-500 italic text-center py-8">No diagnostic pulses submitted yet.</p>';
  document.getElementById('guess-input').value = '';
  document.getElementById('guess-validation-msg').classList.add('hidden');
}

// Difficulty buttons switching
const diffBtns = document.querySelectorAll('.difficulty-btn');
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => {
      b.classList.remove('active-diff');
      b.classList.add('bg-slate-950', 'border-slate-900', 'text-slate-400');
    });
    btn.classList.add('active-diff');
    btn.classList.remove('bg-slate-950', 'border-slate-900', 'text-slate-400');
    
    const diff = btn.getAttribute('data-diff');
    if (diff === 'easy') guessMaxRange = 100;
    else if (diff === 'medium') guessMaxRange = 500;
    else if (diff === 'hard') guessMaxRange = 1000;
    
    document.getElementById('guess-range-low').textContent = '1';
    document.getElementById('guess-range-high').textContent = guessMaxRange;
    
    playSynthTone(350, 'sine', 0.1);
    initGuessGame();
  });
});

const guessInput = document.getElementById('guess-input');
const guessSubmitBtn = document.getElementById('guess-submit-btn');
const resetGuessBtn = document.getElementById('reset-guess-btn');
const historyList = document.getElementById('guesses-history-list');

function submitGuess() {
  const valueAttr = guessInput.value.trim();
  const guess = parseInt(valueAttr);
  
  if (isNaN(guess) || guess < 1 || guess > guessMaxRange) {
    const err = document.getElementById('guess-validation-msg');
    err.textContent = `Please enter a value between 1 and ${guessMaxRange}`;
    err.classList.remove('hidden');
    playSynthTone(150, 'sawtooth', 0.2);
    return;
  }
  document.getElementById('guess-validation-msg').classList.add('hidden');
  
  guessCount++;
  document.getElementById('guess-count').textContent = guessCount;
  
  // Clear placeholder initial history statement
  if (guessCount === 1) {
    historyList.innerHTML = '';
  }

  const diff = Math.abs(guessTarget - guess);
  let clueText = '';
  let clueColorClass = 'text-slate-400';
  let logBadgeClass = '';

  if (guess === guessTarget) {
    clueText = `🎉 Brilliant! ${guess} is correct! Total diagnostics completed in ${guessCount} attempts.`;
    clueColorClass = 'text-emerald-400 font-extrabold';
    logBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    
    playSynthTone(523.25, 'triangle', 0.15);
    setTimeout(() => playSynthTone(659.25, 'triangle', 0.15), 100);
    setTimeout(() => playSynthTone(783.99, 'triangle', 0.3), 200);

    // Save high scores
    if (guessCount < bestGuessAttempt) {
      bestGuessAttempt = guessCount;
      localStorage.setItem('num_best_guess', bestGuessAttempt);
      renderHighScores();
    }
    
    triggerAchievement('ach-first-guess');
    addXP(40 + Math.max(0, 10 * (10 - guessCount)));
    
  } else {
    const isTooHigh = guess > guessTarget;
    const deviationText = isTooHigh ? 'TOO HIGH' : 'TOO LOW';
    
    if (diff <= 3) {
      clueText = `🔥 Scorching Hot! You are incredibly close. (Try going slightly ${isTooHigh ? 'lower' : 'higher'})`;
      clueColorClass = 'text-rose-400 font-bold';
      logBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      playSynthTone(400, 'square', 0.12);
    } else if (diff <= 10) {
      clueText = `🍊 Very Warm! Beautiful alignment. (Go ${isTooHigh ? 'lower' : 'higher'})`;
      clueColorClass = 'text-amber-400 font-semibold';
      logBadgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      playSynthTone(350, 'sine', 0.1);
    } else if (diff <= 30) {
      clueText = `💧 Cool. Needs optimization. (Go ${isTooHigh ? 'lower' : 'higher'})`;
      clueColorClass = 'text-cyan-400';
      logBadgeClass = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      playSynthTone(300, 'sine', 0.1);
    } else {
      clueText = `❄️ Freezing Cold! Distance is vast. (Go ${isTooHigh ? 'lower' : 'higher'})`;
      clueColorClass = 'text-blue-400';
      logBadgeClass = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      playSynthTone(220, 'sine', 0.1);
    }
  }

  // Render visual clue banner
  const clueBanner = document.getElementById('clue-banner');
  clueBanner.innerHTML = `<span class="text-sm ${clueColorClass}">${clueText}</span>`;
  clueBanner.classList.add('diagnostic-pulse');
  setTimeout(() => clueBanner.classList.remove('diagnostic-pulse'), 400);

  // Insert log badge
  const historyNode = document.createElement('div');
  historyNode.className = `flex justify-between items-center p-2.5 rounded-xl border bg-slate-950/40 ${logBadgeClass} text-xs transition-all animate-fadeIn`;
  historyNode.innerHTML = `
    <span>Pulse #${guessCount}</span>
    <span class="font-black text-sm">${guess}</span>
    <span class="font-bold opacity-85">${guess === guessTarget ? 'SOLVED' : (guess > guessTarget ? '↓ Go Lower' : '↑ Go Higher')}</span>
  `;
  
  if (historyList.firstChild) {
    historyList.insertBefore(historyNode, historyList.firstChild);
  } else {
    historyList.appendChild(historyNode);
  }
  
  guessInput.value = '';
  guessInput.focus();
}

guessSubmitBtn.addEventListener('click', submitGuess);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitGuess();
});
resetGuessBtn.addEventListener('click', () => {
  playSynthTone(280, 'sine', 0.1);
  initGuessGame();
});

// ===================================
// GAME 2: MATH BLITZ ENGINE
// ===================================
let blitzActive = false;
let blitzTimeRemaining = 30;
let blitzInterval = null;
let blitzStreak = 0;
let blitzMaxStreak = 0;
let blitzEquationVal = 0;
let blitzTotalQuestionsCorrect = 0;

const blitzStartBtn = document.getElementById('blitz-start-btn');
const blitzRestartBtn = document.getElementById('blitz-restart-btn');
const blitzStartScreen = document.getElementById('blitz-start-screen');
const blitzPlayScreen = document.getElementById('blitz-play-screen');
const blitzEndScreen = document.getElementById('blitz-end-screen');
const blitzInput = document.getElementById('blitz-input');
const blitzTimerText = document.getElementById('blitz-timer');
const blitzStreakText = document.getElementById('blitz-streak');
const blitzEqLabel = document.getElementById('blitz-equation');
const blitzFeedback = document.getElementById('blitz-feedback');
const blitzProgressBar = document.getElementById('blitz-progress-bar');
const blitzSubmitBtn = document.getElementById('blitz-submit-btn');

function generateBlitzQuestion() {
  const operators = ['+', '-', '*'];
  const chosenOp = operators[Math.floor(Math.random() * operators.length)];
  let num1 = 0;
  let num2 = 0;
  
  if (chosenOp === '+') {
    num1 = Math.floor(Math.random() * 89) + 10; // 10 to 98
    num2 = Math.floor(Math.random() * 89) + 10;
    blitzEquationVal = num1 + num2;
    blitzEqLabel.textContent = `${num1} + ${num2}`;
  } else if (chosenOp === '-') {
    num1 = Math.floor(Math.random() * 89) + 10;
    num2 = Math.floor(Math.random() * (num1 - 5)) + 5; // make sure it's non-negative & positive mostly
    blitzEquationVal = num1 - num2;
    blitzEqLabel.textContent = `${num1} - ${num2}`;
  } else {
    num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
    num2 = Math.floor(Math.random() * 11) + 2;
    blitzEquationVal = num1 * num2;
    blitzEqLabel.textContent = `${num1} × ${num2}`;
  }
  
  blitzInput.value = '';
  blitzInput.focus();
}

function startBlitz() {
  blitzActive = true;
  blitzTimeRemaining = 30;
  blitzStreak = 0;
  blitzMaxStreak = 0;
  blitzTotalQuestionsCorrect = 0;
  
  blitzStartScreen.classList.add('hidden');
  blitzEndScreen.classList.add('hidden');
  blitzPlayScreen.classList.remove('hidden');
  
  blitzStreakText.textContent = `0 🔥`;
  blitzTimerText.textContent = `30s`;
  blitzProgressBar.style.width = '100%';
  blitzFeedback.textContent = 'Rapid math initialized!';
  blitzFeedback.className = 'text-center text-sm font-semibold mt-4 text-slate-400';
  
  generateBlitzQuestion();
  playSynthTone(330, 'triangle', 0.15);

  blitzInterval = setInterval(() => {
    blitzTimeRemaining--;
    blitzTimerText.textContent = `${blitzTimeRemaining}s`;
    
    // Progress bar percent scaling
    const pct = (blitzTimeRemaining / 30) * 100;
    blitzProgressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    
    if (blitzTimeRemaining <= 0) {
      endBlitz();
    }
  }, 1000);
}

function processBlitzAnswer() {
  if (!blitzActive) return;
  const val = parseInt(blitzInput.value.trim());
  if (isNaN(val)) return;
  
  if (val === blitzEquationVal) {
    blitzTotalQuestionsCorrect++;
    blitzStreak++;
    if (blitzStreak > blitzMaxStreak) blitzMaxStreak = blitzStreak;
    
    blitzTimeRemaining = Math.min(30, blitzTimeRemaining + 2);
    blitzFeedback.textContent = `Excellent! +2s Dynamic Offset`;
    blitzFeedback.className = 'text-center text-sm font-bold mt-4 text-emerald-400';
    playSynthTone(587.33, 'triangle', 0.1);
    
    if (blitzStreak >= 8) {
      triggerAchievement('ach-blitz-streak');
    }
    addXP(15);
  } else {
    blitzStreak = 0;
    blitzTimeRemaining = Math.max(0, blitzTimeRemaining - 3);
    blitzFeedback.textContent = `Recalibration Error! -3s Deficit (Ans: ${blitzEquationVal})`;
    blitzFeedback.className = 'text-center text-sm font-bold mt-4 text-rose-400';
    playSynthTone(180, 'sawtooth', 0.25);
  }
  
  blitzStreakText.textContent = `${blitzStreak} 🔥`;
  blitzTimerText.textContent = `${blitzTimeRemaining}s`;
  generateBlitzQuestion();
}

function stopBlitzTimer() {
  if (blitzInterval) {
    clearInterval(blitzInterval);
    blitzInterval = null;
  }
  blitzActive = false;
}

function endBlitz() {
  stopBlitzTimer();
  playSynthTone(220, 'sine', 0.4);
  
  blitzPlayScreen.classList.add('hidden');
  blitzEndScreen.classList.remove('hidden');
  
  document.getElementById('blitz-final-solved').textContent = blitzTotalQuestionsCorrect;
  document.getElementById('blitz-final-streak').textContent = blitzMaxStreak;
  
  if (blitzMaxStreak > bestBlitzStreak) {
    bestBlitzStreak = blitzMaxStreak;
    localStorage.setItem('num_best_blitz', bestBlitzStreak);
    renderHighScores();
  }
}

blitzStartBtn.addEventListener('click', startBlitz);
blitzRestartBtn.addEventListener('click', startBlitz);
blitzSubmitBtn.addEventListener('click', processBlitzAnswer);
blitzInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') processBlitzAnswer();
});

// ===================================
// GAME 3: SEQUENCE MATRIX ENGINE
// ===================================
let seqRound = 1;
let targetSequence = [];
let playerSequence = [];
let seqIsPlaying = false;
let seqIsUserTurn = false;
let seqFlashDelay = 550;

const seqStartBtn = document.getElementById('seq-start-btn');
const seqStatusText = document.getElementById('seq-status');
const seqRoundText = document.getElementById('seq-round');
const seqGridBtns = document.querySelectorAll('.seq-grid-btn');

function initSeqGame() {
  seqRound = 1;
  targetSequence = [];
  playerSequence = [];
  seqIsPlaying = false;
  seqIsUserTurn = false;
  seqStatusText.textContent = 'Synchronize node link to begin.';
  seqRoundText.textContent = '0';
}

function triggerSeqButtonFlash(num, customDuration = 400) {
  const btn = document.querySelector(`.seq-grid-btn[data-num="${num}"]`);
  if (btn) {
    btn.classList.add('seq-flash');
    
    // Tonal sound sequence map
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];
    playSynthTone(notes[num - 1] || 440, 'sine', customDuration / 1000);
    
    setTimeout(() => {
      btn.classList.remove('seq-flash');
    }, customDuration);
  }
}

async function playSequenceFeedback() {
  seqIsPlaying = true;
  seqIsUserTurn = false;
  seqStatusText.textContent = '⚠️ Observation state active. Watch carefully.';
  seqStatusText.className = 'text-xs text-center text-amber-400 font-bold py-1';
  
  for (let i = 0; i < targetSequence.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    triggerSeqButtonFlash(targetSequence[i], 380);
    await new Promise(resolve => setTimeout(resolve, seqFlashDelay));
  }
  
  seqIsPlaying = false;
  seqIsUserTurn = true;
  playerSequence = [];
  seqStatusText.textContent = '⚡ Mimic sequence now!';
  seqStatusText.className = 'text-xs text-center text-emerald-400 font-extrabold py-1';
}

function startSeqRound() {
  seqRoundText.textContent = seqRound;
  // Append next digit
  const nextDigit = Math.floor(Math.random() * 9) + 1;
  targetSequence.push(nextDigit);
  playSequenceFeedback();
}

function handleSeqInput(num) {
  if (seqIsPlaying || !seqIsUserTurn) return;
  
  triggerSeqButtonFlash(num, 150);
  playerSequence.push(num);
  
  // Check input immediately
  const currentStep = playerSequence.length - 1;
  if (playerSequence[currentStep] !== targetSequence[currentStep]) {
    // FAILED
    seqIsUserTurn = false;
    seqStatusText.textContent = '❌ Synaptic Desync! Sequence Broken.';
    seqStatusText.className = 'text-xs text-center text-rose-500 font-black py-1';
    playSynthTone(120, 'sawtooth', 0.5);
    
    if (seqRound - 1 > bestSeqLevel) {
      bestSeqLevel = seqRound - 1;
      localStorage.setItem('num_best_seq', bestSeqLevel);
      renderHighScores();
    }
    
    setTimeout(() => {
      initSeqGame();
    }, 2000);
    return;
  }
  
  if (playerSequence.length === targetSequence.length) {
    // Round complete successfully
    seqIsUserTurn = false;
    seqStatusText.textContent = '✓ Synchronization match! Restabilizing...';
    seqStatusText.className = 'text-xs text-center text-indigo-400 font-bold py-1';
    
    addXP(25);
    if (seqRound >= 5) {
      triggerAchievement('ach-seq-master');
    }
    
    seqRound++;
    setTimeout(() => {
      startSeqRound();
    }, 1000);
  }
}

seqStartBtn.addEventListener('click', () => {
  initSeqGame();
  startSeqRound();
});

seqGridBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const num = parseInt(btn.getAttribute('data-num'));
    handleSeqInput(num);
  });
});

// Init Game States on load
initGuessGame();
initSeqGame();
renderHighScores();
updateAchievementsUI();

// Add small diagnostic indicators to show system level readiness
document.getElementById('global-xp').textContent = globalXP;
document.getElementById('global-level').textContent = globalLevel;
