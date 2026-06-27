document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGERS ---
  let soundEnabled = true;
  let currentFactorA = 6;
  let currentFactorB = 7;
  let exploreHighlightMode = 'crosshair'; // 'crosshair' or 'rectangle'

  // Quiz state variables
  let quizRange = 10;
  let quizMaxTime = 60;
  let quizTimeRemaining = 60;
  let quizTimerInterval = null;
  let quizScore = 0;
  let quizStreak = 0;
  let quizMaxStreak = 0;
  let quizTotalAnswered = 0;
  let quizCorrectAnswered = 0;
  let currentQuizAnswer = 0;
  let quizInputMode = 'choice'; // 'choice' or 'direct'

  // Solver state variables
  let solverA = 43;
  let solverB = 12;
  let solverSteps = [];
  let solverCurrentStepIdx = 0;

  // --- AUDIO SYNTH (Web Audio API) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSynthSound(freq, type, duration) {
    if (!soundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  function playCorrectSound() {
    playSynthSound(523.25, 'sine', 0.15); // C5
    setTimeout(() => playSynthSound(659.25, 'sine', 0.25), 80); // E5
  }

  function playWrongSound() {
    playSynthSound(180, 'sawtooth', 0.3);
  }

  function playClickSound() {
    playSynthSound(800, 'sine', 0.05);
  }

  // --- DOM ELEMENTS ---
  // Nav/Header
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const highScoreVal = document.getElementById('high-score-val');

  // Tab Switches
  const tabBtnExplore = document.getElementById('tab-btn-explore');
  const tabBtnPlay = document.getElementById('tab-btn-play');
  const tabBtnSolver = document.getElementById('tab-btn-solver');

  const tabPanelExplore = document.getElementById('tab-panel-explore');
  const tabPanelPlay = document.getElementById('tab-panel-play');
  const tabPanelSolver = document.getElementById('tab-panel-solver');

  // Tab 1: Explore Components
  const sliderA = document.getElementById('slider-a');
  const sliderB = document.getElementById('slider-b');
  const sliderAVal = document.getElementById('slider-a-val');
  const sliderBVal = document.getElementById('slider-b-val');
  const formulaA = document.getElementById('formula-a');
  const formulaB = document.getElementById('formula-b');
  const formulaResult = document.getElementById('formula-result');
  const visualizerSubtext = document.getElementById('visualizer-subtext');
  const dotGrid = document.getElementById('dot-grid');

  const tableHeaderRow = document.getElementById('table-header-row');
  const tableBodyMatrix = document.getElementById('table-body-matrix');
  const btnHlCross = document.getElementById('btn-hl-cross');
  const btnHlRect = document.getElementById('btn-hl-rect');

  // Tab 2: Quiz Components
  const quizSetupContainer = document.getElementById('quiz-setup-container');
  const quizActiveContainer = document.getElementById('quiz-active-container');
  const quizGameoverContainer = document.getElementById('quiz-gameover-container');

  const selectGameRange = document.getElementById('game-range');
  const btnStartGame = document.getElementById('btn-start-game');
  const quizScoreDisplay = document.getElementById('quiz-score-display');
  const quizStreakDisplay = document.getElementById('quiz-streak-display');
  const quizTimeDisplay = document.getElementById('quiz-time-display');
  const quizNumA = document.getElementById('quiz-num-a');
  const quizNumB = document.getElementById('quiz-num-b');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const btnToggleInputMode = document.getElementById('btn-toggle-input-mode');
  const quizDirectInputContainer = document.getElementById('quiz-direct-input-container');
  const quizDirectForm = document.getElementById('quiz-direct-form');
  const quizDirectInput = document.getElementById('quiz-direct-input');
  const quizFeedbackBanner = document.getElementById('quiz-feedback-banner');

  const gameoverScore = document.getElementById('gameover-score');
  const gameoverAccuracy = document.getElementById('gameover-accuracy');
  const gameoverAnswered = document.getElementById('gameover-answered');
  const gameoverStreak = document.getElementById('gameover-streak');
  const btnRestartGame = document.getElementById('btn-restart-game');
  const btnBackSetup = document.getElementById('btn-back-setup');

  // Tab 3: Solver Components
  const solverNumA = document.getElementById('solver-num-a');
  const solverNumB = document.getElementById('solver-num-b');
  const btnTriggerSolve = document.getElementById('btn-trigger-solve');
  const btnSolverClear = document.getElementById('btn-solver-clear');
  const solverRenderArea = document.getElementById('solver-render-area');
  const solverCurrentStepSpan = document.getElementById('solver-current-step');
  const solverTotalStepsSpan = document.getElementById('solver-total-steps');
  const solverBtnPrev = document.getElementById('solver-btn-prev');
  const solverBtnNext = document.getElementById('solver-btn-next');

  // --- PERSISTENCE INITIALIZATION ---
  let localHighScore = localStorage.getItem('timesmaster_highscore') || 0;
  highScoreVal.textContent = localHighScore;

  // --- TAB NAVIGATION SYSTEM ---
  function switchTab(tabId) {
    playClickSound();
    
    // Reset elements state
    tabBtnExplore.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60";
    tabBtnPlay.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60";
    tabBtnSolver.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60";

    tabPanelExplore.classList.add('hidden');
    tabPanelPlay.classList.add('hidden');
    tabPanelSolver.classList.add('hidden');

    if (tabId === 'explore') {
      tabBtnExplore.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow";
      tabPanelExplore.classList.remove('hidden');
    } else if (tabId === 'play') {
      tabBtnPlay.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow";
      tabPanelPlay.classList.remove('hidden');
      resetQuizToSetup();
    } else if (tabId === 'solver') {
      tabBtnSolver.className = "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow";
      tabPanelSolver.classList.remove('hidden');
      triggerCalculationStepVisualizer();
    }
  }

  tabBtnExplore.addEventListener('click', () => switchTab('explore'));
  tabBtnPlay.addEventListener('click', () => switchTab('play'));
  tabBtnSolver.addEventListener('click', () => switchTab('solver'));

  // Toggle sound
  btnToggleSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      playSynthSound(600, 'sine', 0.1);
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  });

  // --- TAB 1: EXPLORER AND GRID LOGIC ---

  function setupExploreTable() {
    // Headers
    tableHeaderRow.innerHTML = '';
    for (let c = 1; c <= 12; c++) {
      const th = document.createElement('th');
      th.id = `header-col-${c}`;
      th.className = "p-2.5 text-xs font-black text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors min-w-[40px] border-b border-slate-800";
      th.textContent = c;
      tableHeaderRow.appendChild(th);
    }

    // Rows
    tableBodyMatrix.innerHTML = '';
    for (let r = 1; r <= 12; r++) {
      const row = document.createElement('tr');
      row.className = "border-b border-slate-900/60 hover:bg-slate-900/10";
      
      // Left Row Indicator
      const firstCell = document.createElement('td');
      firstCell.id = `header-row-${r}`;
      firstCell.className = "p-2 text-xs font-black text-indigo-400 bg-slate-950/80 border-r border-slate-850 cursor-pointer hover:text-white transition-all";
      firstCell.textContent = r;
      firstCell.addEventListener('click', () => {
        currentFactorA = r;
        sliderA.value = r;
        updateExplorerVisuals();
        playClickSound();
      });
      row.appendChild(firstCell);

      // Multiplication Cells
      for (let c = 1; c <= 12; c++) {
        const cell = document.createElement('td');
        cell.id = `cell-${r}-${c}`;
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        const product = r * c;
        cell.textContent = product;

        // Standard diagonal styling
        if (r === c) {
          cell.className = "cell-neutral cell-diagonal p-2.5 cursor-pointer font-bold relative";
        } else {
          cell.className = "cell-neutral p-2.5 cursor-pointer text-slate-400 hover:text-slate-100 relative";
        }

        // Click to lock coordinates
        cell.addEventListener('click', () => {
          currentFactorA = r;
          currentFactorB = c;
          sliderA.value = r;
          sliderB.value = c;
          updateExplorerVisuals();
          playSynthSound(400 + product, 'sine', 0.12);
        });

        row.appendChild(cell);
      }
      tableBodyMatrix.appendChild(row);
    }
  }

  function updateExplorerVisuals() {
    sliderAVal.textContent = currentFactorA;
    sliderBVal.textContent = currentFactorB;
    formulaA.textContent = currentFactorA;
    formulaB.textContent = currentFactorB;
    formulaResult.textContent = currentFactorA * currentFactorB;
    visualizerSubtext.textContent = `"${currentFactorA} groups of ${currentFactorB} equals ${currentFactorA * currentFactorB}"`;

    // Repaint Highlights on the grid
    for (let r = 1; r <= 12; r++) {
      // Reset header highlights
      const rHeader = document.getElementById(`header-row-${r}`);
      if (rHeader) rHeader.className = "p-2 text-xs font-black text-indigo-400 bg-slate-950/80 border-r border-slate-850 cursor-pointer hover:text-white transition-all";
    }
    for (let c = 1; c <= 12; c++) {
      const cHeader = document.getElementById(`header-col-${c}`);
      if (cHeader) cHeader.className = "p-2.5 text-xs font-black text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors min-w-[40px] border-b border-slate-800";
    }

    for (let r = 1; r <= 12; r++) {
      for (let c = 1; c <= 12; c++) {
        const cell = document.getElementById(`cell-${r}-${c}`);
        if (!cell) continue;

        // Remove custom states
        cell.classList.remove('cell-row-highlight', 'cell-col-highlight', 'cell-target-highlight');

        const isDiagonal = (r === c);
        cell.className = isDiagonal 
          ? "cell-neutral cell-diagonal p-2.5 cursor-pointer font-bold relative" 
          : "cell-neutral p-2.5 cursor-pointer text-slate-400 hover:text-slate-100 relative";

        if (exploreHighlightMode === 'crosshair') {
          // Row highlighting
          if (r === currentFactorA) {
            cell.classList.add('cell-row-highlight');
          }
          // Column highlighting
          if (c === currentFactorB) {
            cell.classList.add('cell-col-highlight');
          }
        } else {
          // Rectangle area highlighting
          if (r <= currentFactorA && c <= currentFactorB) {
            cell.classList.add('cell-row-highlight');
          }
        }

        // Exact match target
        if (r === currentFactorA && c === currentFactorB) {
          cell.classList.add('cell-target-highlight');
          cell.className += " font-black text-white text-sm";
        }
      }
    }

    // Highlight matching row/col headers
    const matchingRowHeader = document.getElementById(`header-row-${currentFactorA}`);
    if (matchingRowHeader) {
      matchingRowHeader.className = "p-2 text-xs font-black bg-indigo-600/40 text-white border-r border-indigo-500/50 cursor-pointer transition-all";
    }
    const matchingColHeader = document.getElementById(`header-col-${currentFactorB}`);
    if (matchingColHeader) {
      matchingColHeader.className = "p-2.5 text-xs font-black bg-purple-600/40 text-white border-b border-purple-500/50 min-w-[40px] transition-all";
    }

    updateDotMatrixVisual();
  }

  function updateDotMatrixVisual() {
    dotGrid.innerHTML = '';
    dotGrid.style.gridTemplateRows = `repeat(${currentFactorA}, minmax(0, 1fr))`;
    dotGrid.style.gridTemplateColumns = `repeat(${currentFactorB}, minmax(0, 1fr))`;

    const totalCount = currentFactorA * currentFactorB;
    
    for (let i = 0; i < totalCount; i++) {
      const dot = document.createElement('div');
      dot.className = "dot-item bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md transform hover:scale-125 hover:rotate-12 duration-200 cursor-pointer";
      dot.setAttribute('title', `Element ${i + 1}`);
      dotGrid.appendChild(dot);
    }
  }

  // Controls listener
  sliderA.addEventListener('input', (e) => {
    currentFactorA = parseInt(e.target.value);
    updateExplorerVisuals();
  });

  sliderB.addEventListener('input', (e) => {
    currentFactorB = parseInt(e.target.value);
    updateExplorerVisuals();
  });

  btnHlCross.addEventListener('click', () => {
    exploreHighlightMode = 'crosshair';
    btnHlCross.className = "px-2.5 py-1 rounded bg-slate-800 text-white font-medium";
    btnHlRect.className = "px-2.5 py-1 rounded text-slate-400 hover:text-white";
    playClickSound();
    updateExplorerVisuals();
  });

  btnHlRect.addEventListener('click', () => {
    exploreHighlightMode = 'rectangle';
    btnHlRect.className = "px-2.5 py-1 rounded bg-slate-800 text-white font-medium";
    btnHlCross.className = "px-2.5 py-1 rounded text-slate-400 hover:text-white";
    playClickSound();
    updateExplorerVisuals();
  });

  // Pattern buttons
  const patternBtns = document.querySelectorAll('.pattern-btn');
  patternBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pattern = btn.dataset.pattern;
      playClickSound();
      
      // Clean up previous classes first
      updateExplorerVisuals();

      if (pattern === 'squares') {
        for (let r = 1; r <= 12; r++) {
          const cell = document.getElementById(`cell-${r}-${r}`);
          if (cell) {
            cell.className = "cell-neutral bg-amber-500/30 text-amber-200 p-2.5 cursor-pointer font-black border border-amber-500/60 relative";
          }
        }
      } else if (pattern === 'evens') {
        for (let r = 1; r <= 12; r++) {
          for (let c = 1; c <= 12; c++) {
            const product = r * c;
            if (product % 2 === 0) {
              const cell = document.getElementById(`cell-${r}-${c}`);
              if (cell && (r !== currentFactorA || c !== currentFactorB)) {
                cell.className += " bg-purple-900/15 text-purple-200";
              }
            }
          }
        }
      } else if (pattern === 'fives') {
        for (let r = 1; r <= 12; r++) {
          for (let c = 1; c <= 12; c++) {
            if (r === 5 || c === 5) {
              const cell = document.getElementById(`cell-${r}-${c}`);
              if (cell && (r !== currentFactorA || c !== currentFactorB)) {
                cell.className += " bg-indigo-900/30 text-indigo-100 border-indigo-500/20 border";
              }
            }
          }
        }
      } else if (pattern === 'clear') {
        updateExplorerVisuals();
      }
    });
  });


  // --- TAB 2: MULTIPLICATION SPEED CHALLENGE GAME ---
  
  // Setup Selection Highlighting for game duration
  let selectedDuration = 60;
  const timeBtns = document.querySelectorAll('.game-time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClickSound();
      timeBtns.forEach(b => {
        b.className = "game-time-btn py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-all";
      });
      btn.className = "game-time-btn py-2.5 rounded-xl border border-indigo-500/50 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-sm font-semibold transition-all";
      selectedDuration = parseInt(btn.dataset.time);
    });
  });

  function resetQuizToSetup() {
    clearInterval(quizTimerInterval);
    quizSetupContainer.classList.remove('hidden');
    quizActiveContainer.classList.add('hidden');
    quizGameoverContainer.classList.add('hidden');
    quizFeedbackBanner.classList.add('opacity-0');
  }

  btnStartGame.addEventListener('click', () => {
    playSynthSound(440, 'sine', 0.15);
    setTimeout(() => playSynthSound(554.37, 'sine', 0.15), 100);
    setTimeout(() => playSynthSound(659.25, 'sine', 0.25), 200);

    quizRange = parseInt(selectGameRange.value);
    quizMaxTime = selectedDuration;
    quizTimeRemaining = selectedDuration;
    quizScore = 0;
    quizStreak = 0;
    quizTotalAnswered = 0;
    quizCorrectAnswered = 0;
    
    quizScoreDisplay.textContent = "0 pts";
    quizStreakDisplay.textContent = "🔥 0";
    quizTimeDisplay.textContent = `${quizTimeRemaining}s`;

    quizSetupContainer.classList.add('hidden');
    quizActiveContainer.classList.remove('hidden');
    quizGameoverContainer.classList.add('hidden');

    generateNextQuizQuestion();
    startQuizTimer();
  });

  function startQuizTimer() {
    clearInterval(quizTimerInterval);
    quizTimerInterval = setInterval(() => {
      quizTimeRemaining--;
      quizTimeDisplay.textContent = `${quizTimeRemaining}s`;
      
      if (quizTimeRemaining <= 10) {
        quizTimeDisplay.classList.add('animate-pulse');
        // Subtle heartbeat alert ticks
        playSynthSound(150, 'triangle', 0.05);
      } else {
        quizTimeDisplay.classList.remove('animate-pulse');
      }

      if (quizTimeRemaining <= 0) {
        endQuizSession();
      }
    }, 1000);
  }

  function generateNextQuizQuestion() {
    // Pick random factors based on choice
    const factorA = Math.floor(Math.random() * quizRange) + 1;
    const factorB = Math.floor(Math.random() * (quizRange > 10 ? quizRange : 10)) + 1;
    currentQuizAnswer = factorA * factorB;

    quizNumA.textContent = factorA;
    quizNumB.textContent = factorB;

    // Populate Multiple Choice Option Buttons
    const correctAns = currentQuizAnswer;
    const options = new Set();
    options.add(correctAns);

    // Generate credible distractors
    while (options.size < 4) {
      const offset = (Math.floor(Math.random() * 5) - 2) * (Math.random() > 0.5 ? factorA : factorB);
      const fakeAns = correctAns + offset + (Math.floor(Math.random() * 6) - 3);
      if (fakeAns > 0 && fakeAns !== correctAns) {
        options.add(fakeAns);
      }
    }

    // Shuffled choice array conversion
    const choiceArray = Array.from(options).sort(() => Math.random() - 0.5);

    quizOptionsContainer.innerHTML = '';
    choiceArray.forEach(val => {
      const btn = document.createElement('button');
      btn.className = "py-4 px-6 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-indigo-500/50 text-white font-black rounded-xl text-lg transition-all transform hover:scale-102 flex items-center justify-center";
      btn.textContent = val;
      btn.addEventListener('click', () => handleQuizSubmission(val));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleQuizSubmission(chosenVal) {
    quizTotalAnswered++;
    const isCorrect = (chosenVal === currentQuizAnswer);

    if (isCorrect) {
      quizCorrectAnswered++;
      quizStreak++;
      // Score scales with quickness and active streaks
      const calculatedGain = 10 + Math.min(quizStreak * 2, 30);
      quizScore += calculatedGain;

      playCorrectSound();
      triggerFeedbackBanner(true, `Correct! +${calculatedGain} pts`);
    } else {
      quizStreak = 0;
      playWrongSound();
      triggerFeedbackBanner(false, `Oops! Correct answer was ${currentQuizAnswer}`);
    }

    // Update max streak recorded
    if (quizStreak > quizMaxStreak) {
      quizMaxStreak = quizStreak;
    }

    quizScoreDisplay.textContent = `${quizScore} pts`;
    quizStreakDisplay.textContent = `🔥 ${quizStreak}`;

    // Generate next question
    generateNextQuizQuestion();
  }

  function triggerFeedbackBanner(isCorrect, text) {
    quizFeedbackBanner.textContent = text;
    quizFeedbackBanner.className = isCorrect 
      ? "mt-8 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-center text-xs font-semibold opacity-100 transition-opacity duration-200"
      : "mt-8 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-center text-xs font-semibold opacity-100 transition-opacity duration-200";
  }

  btnToggleInputMode.addEventListener('click', () => {
    playClickSound();
    if (quizInputMode === 'choice') {
      quizInputMode = 'direct';
      quizOptionsContainer.classList.add('hidden');
      quizDirectInputContainer.classList.remove('hidden');
      btnToggleInputMode.textContent = "Prefer multiple choice answers?";
      quizDirectInput.focus();
    } else {
      quizInputMode = 'choice';
      quizOptionsContainer.classList.remove('hidden');
      quizDirectInputContainer.classList.add('hidden');
      btnToggleInputMode.textContent = "Prefer typing your answer?";
    }
  });

  // Direct Form Answer Input Submissions
  quizDirectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parseInt(quizDirectInput.value);
    if (isNaN(val)) return;
    handleQuizSubmission(val);
    quizDirectInput.value = '';
    quizDirectInput.focus();
  });

  function endQuizSession() {
    clearInterval(quizTimerInterval);
    
    // Evaluate high score comparison
    if (quizScore > localHighScore) {
      localHighScore = quizScore;
      localStorage.setItem('timesmaster_highscore', localHighScore);
      highScoreVal.textContent = localHighScore;
    }

    const accuracy = quizTotalAnswered > 0 ? Math.round((quizCorrectAnswered / quizTotalAnswered) * 100) : 0;

    gameoverScore.textContent = `${quizScore} pts`;
    gameoverAccuracy.textContent = `${accuracy}%`;
    gameoverAnswered.textContent = `${quizCorrectAnswered} / ${quizTotalAnswered}`;
    gameoverStreak.textContent = `🔥 ${quizMaxStreak}`;

    quizActiveContainer.classList.add('hidden');
    quizGameoverContainer.classList.remove('hidden');
  }

  btnRestartGame.addEventListener('click', () => {
    playClickSound();
    btnStartGame.click();
  });

  btnBackSetup.addEventListener('click', () => {
    playClickSound();
    resetQuizToSetup();
  });


  // --- TAB 3: STEP-BY-STEP DOUBLE-DIGIT MULTIPLICATION SOLVER ---

  function getStepByStepBreakdown(a, b) {
    const steps = [];
    const bStr = b.toString();
    const bDigits = bStr.split('').map(Number).reverse();

    steps.push({
      type: 'setup',
      label: 'Write down the multiplication problem vertically.',
      desc: `Setting up the operation: ${a} Multiplicand and ${b} Multiplier.`
    });

    let partials = [];
    
    // Multiply with each place value digit of multiplier b
    for (let i = 0; i < bDigits.length; i++) {
      const multiplierDigit = bDigits[i];
      const placeValueMultiplier = Math.pow(10, i);
      const rawProductPart = a * multiplierDigit;
      const computedPart = rawProductPart * placeValueMultiplier;
      partials.push(computedPart);

      let explanationStr = '';
      if (placeValueMultiplier === 1) {
        explanationStr = `Step 1: Multiply ${a} by ${multiplierDigit} (units digit) = ${rawProductPart}.`;
      } else {
        explanationStr = `Step 2: Multiply ${a} by ${multiplierDigit} (tens digit). Since it represents ${placeValueMultiplier}, write down a placeholder zero and multiply ${a} × ${multiplierDigit} = ${rawProductPart}. This gives ${computedPart}.`;
      }

      steps.push({
        type: 'partial_mul',
        place: i,
        digit: multiplierDigit,
        value: rawProductPart,
        shiftedValue: computedPart,
        label: explanationStr
      });
    }

    // If multiplier has multiple digits, calculate sum
    const finalSum = a * b;
    if (bDigits.length > 1) {
      steps.push({
        type: 'addition',
        partials: [...partials],
        result: finalSum,
        label: `Step 3: Add the partial products together: ${partials.join(' + ')} = ${finalSum}.`
      });
    }

    steps.push({
      type: 'final',
      result: finalSum,
      label: `Task Complete! The final product of ${a} × ${b} equals ${finalSum}.`
    });

    return steps;
  }

  function renderSolverStep() {
    if (solverSteps.length === 0) return;
    const step = solverSteps[solverCurrentStepIdx];

    solverCurrentStepSpan.textContent = solverCurrentStepIdx + 1;
    solverTotalStepsSpan.textContent = solverSteps.length;

    solverBtnPrev.disabled = (solverCurrentStepIdx === 0);
    solverBtnNext.disabled = (solverCurrentStepIdx === solverSteps.length - 1);

    let renderHtml = '';
    
    const aVal = parseInt(solverNumA.value) || 0;
    const bVal = parseInt(solverNumB.value) || 0;

    if (step.type === 'setup') {
      renderHtml = `
        <div class="text-right text-2xl pr-8 tracking-widest font-black">
          <div class="text-indigo-400">${aVal}</div>
          <div class="text-purple-400 border-b-4 border-slate-700 pb-2"><span class="text-slate-600 mr-4">×</span>${bVal}</div>
          <div class="text-slate-500 pt-2 text-sm italic">Awaiting operations...</div>
        </div>
        <div class="mt-6 text-center text-xs text-indigo-300 font-sans p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-lg">
          ${step.label}
        </div>
      `;
    } 
    else if (step.type === 'partial_mul') {
      const placeholderZeros = "0".repeat(step.place);
      const nonZeroPart = step.value;
      
      renderHtml = `
        <div class="text-right text-2xl pr-8 tracking-widest font-black">
          <div class="text-slate-500">${aVal}</div>
          <div class="text-slate-500 border-b-4 border-slate-700 pb-2"><span class="text-slate-600 mr-4">×</span>${bVal}</div>
          <div class="text-amber-400 pt-2">
            <span>${nonZeroPart}</span><span class="text-rose-500 font-bold">${placeholderZeros}</span>
          </div>
        </div>
        <div class="mt-6 text-left text-xs font-sans p-4 bg-amber-950/20 border border-amber-500/20 rounded-lg space-y-2">
          <p class="font-bold text-amber-400">✍️ Processing digit multiplication:</p>
          <p class="text-slate-300">${step.label}</p>
        </div>
      `;
    } 
    else if (step.type === 'addition') {
      const partitionRows = step.partials.map((val, idx) => {
        return `<div class="text-slate-300">${val}</div>`;
      }).join('');

      renderHtml = `
        <div class="text-right text-2xl pr-8 tracking-widest font-black">
          <div class="text-slate-600">${aVal}</div>
          <div class="text-slate-600 border-b border-slate-800 pb-1"><span class="text-slate-800 mr-4">×</span>${bVal}</div>
          <div class="text-sm text-slate-500">Partial Products:</div>
          <div class="space-y-1 text-slate-300 border-b-4 border-slate-700 pb-2">
            ${partitionRows}
          </div>
          <div class="text-emerald-400 pt-2">${step.result}</div>
        </div>
        <div class="mt-6 text-left text-xs font-sans p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg space-y-2">
          <p class="font-bold text-purple-400">➕ Summation Phase:</p>
          <p class="text-slate-300">${step.label}</p>
        </div>
      `;
    } 
    else if (step.type === 'final') {
      renderHtml = `
        <div class="text-right text-2xl pr-8 tracking-widest font-black">
          <div class="text-slate-600">${aVal}</div>
          <div class="text-slate-600 border-b-4 border-slate-850 pb-2"><span class="text-slate-800 mr-4">×</span>${bVal}</div>
          <div class="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)] text-3xl pt-2">${step.result}</div>
        </div>
        <div class="mt-6 text-center text-xs font-sans p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
          <p class="font-black text-emerald-400 mb-1">🏁 Solution Confirmed</p>
          <p class="text-slate-200">${step.label}</p>
        </div>
      `;
    }

    solverRenderArea.innerHTML = renderHtml;
  }

  function triggerCalculationStepVisualizer() {
    solverA = parseInt(solverNumA.value) || 43;
    solverB = parseInt(solverNumB.value) || 12;

    // Restrict extreme sizes for readable display
    if (solverA > 9999) solverA = 9999;
    if (solverB > 999) solverB = 999;
    solverNumA.value = solverA;
    solverNumB.value = solverB;

    solverSteps = getStepByStepBreakdown(solverA, solverB);
    solverCurrentStepIdx = 0;
    renderSolverStep();
  }

  btnTriggerSolve.addEventListener('click', () => {
    playSynthSound(500, 'triangle', 0.15);
    triggerCalculationStepVisualizer();
  });

  btnSolverClear.addEventListener('click', () => {
    playClickSound();
    solverNumA.value = 43;
    solverNumB.value = 12;
    triggerCalculationStepVisualizer();
  });

  solverBtnPrev.addEventListener('click', () => {
    if (solverCurrentStepIdx > 0) {
      playClickSound();
      solverCurrentStepIdx--;
      renderSolverStep();
    }
  });

  solverBtnNext.addEventListener('click', () => {
    if (solverCurrentStepIdx < solverSteps.length - 1) {
      playSynthSound(700, 'sine', 0.08);
      solverCurrentStepIdx++;
      renderSolverStep();
    }
  });

  // Initialize on load
  setupExploreTable();
  updateExplorerVisuals();
});