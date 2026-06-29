(function() {
  // Web Audio Synth for custom retroactive procedural sound effects
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration) {
    if (!soundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis delayed until user interaction.");
    }
  }

  function playSuccess() {
    playTone(523.25, 'triangle', 0.15); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15), 80); // E5
  }

  function playFailure() {
    playTone(220, 'sawtooth', 0.25); // A3
    setTimeout(() => playTone(164.81, 'sawtooth', 0.25), 100); // E3
  }

  function playLevelUp() {
    playTone(523.25, 'sine', 0.1);
    setTimeout(() => playTone(659.25, 'sine', 0.1), 70);
    setTimeout(() => playTone(783.99, 'sine', 0.1), 140);
    setTimeout(() => playTone(1046.50, 'sine', 0.3), 210);
  }

  // Game state representation
  const STATE = {
    activeTab: 'chroma', // chroma, stroop, blend
    currentScore: 0,
    highScores: {
      chroma: 0,
      stroop: 0,
      blend: 0
    },
    gameInProgress: false,
    timeLeft: 30, // seconds
    maxTime: 30,
    timerInterval: null,
    streak: 0,

    // Game specific trackers
    chroma: {
      level: 1,
      size: 2,
      baseColor: null,
      oddColor: null,
      correctIndex: null
    },
    stroop: {
      currentWord: '',
      currentColor: '',
      isMatching: false
    },
    blend: {
      targetRGB: { r: 0, g: 0, b: 0 },
      currentRGB: { r: 128, g: 128, b: 128 }
    }
  };

  // Color lists for Stroop Game Mode
  const STROOP_COLORS = [
    { name: 'Red', hex: '#ef4444' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Cyan', hex: '#06b6d4' }
  ];

  // Retrieve High Scores from localStorage if available
  try {
    const saved = localStorage.getItem('chromaquest_highscores');
    if (saved) {
      STATE.highScores = JSON.parse(saved);
    }
  } catch(e) {}

  // DOM Element Selections
  const elCurrentScore = document.getElementById('current-score');
  const elHighScore = document.getElementById('high-score');
  const elSoundToggle = document.getElementById('sound-toggle');
  const elSoundIconOn = document.getElementById('sound-icon-on');
  const elSoundIconOff = document.getElementById('sound-icon-off');

  const tabChroma = document.getElementById('tab-chroma');
  const tabStroop = document.getElementById('tab-stroop');
  const tabBlend = document.getElementById('tab-blend');

  const elTimerBar = document.getElementById('timer-bar');
  const elTimerContainer = document.getElementById('timer-container');
  const elGameOverScreen = document.getElementById('game-over-screen');
  const elGoScore = document.getElementById('go-score');
  const elGoStreak = document.getElementById('go-streak');
  const elRestartBtn = document.getElementById('restart-btn');

  const elStartPane = document.getElementById('start-pane');
  const elStartIconContainer = document.getElementById('start-icon-container');
  const elStartTitle = document.getElementById('start-title');
  const elStartDesc = document.getElementById('start-desc');
  const elStartGameBtn = document.getElementById('start-game-btn');

  const elGameChroma = document.getElementById('game-chroma');
  const elChromaGrid = document.getElementById('chroma-grid');
  const elChromaLevel = document.getElementById('chroma-level');

  const elGameStroop = document.getElementById('game-stroop');
  const elStroopWord = document.getElementById('stroop-word');
  const elStroopFeedback = document.getElementById('stroop-feedback');
  const elStroopBtnFalse = document.getElementById('stroop-btn-false');
  const elStroopBtnTrue = document.getElementById('stroop-btn-true');

  const elGameBlend = document.getElementById('game-blend');
  const elBlendTarget = document.getElementById('blend-target');
  const elBlendCurrent = document.getElementById('blend-current');
  const elSlideRed = document.getElementById('slide-red');
  const elSlideGreen = document.getElementById('slide-green');
  const elSlideBlue = document.getElementById('slide-blue');
  const elValRed = document.getElementById('val-red');
  const elValGreen = document.getElementById('val-green');
  const elValBlue = document.getElementById('val-blue');
  const elBlendMatchPct = document.getElementById('blend-match-pct');
  const elBlendSubmitBtn = document.getElementById('blend-submit-btn');

  const elLogFeed = document.getElementById('log-feed');
  const elClearLog = document.getElementById('clear-log');

  // Add message to Feed Logger
  function logMessage(msg) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logDiv = document.createElement('div');
    logDiv.innerHTML = `<span class="text-slate-500">[${timestamp}]</span> ${msg}`;
    elLogFeed.appendChild(logDiv);
    elLogFeed.scrollTop = elLogFeed.scrollHeight;
    
    // Retain max 50 logs
    while (elLogFeed.childNodes.length > 50) {
      elLogFeed.removeChild(elLogFeed.firstChild);
    }
  }

  // Clear log history
  elClearLog.addEventListener('click', () => {
    elLogFeed.innerHTML = '<div>System: Log cleared. Ready for incoming actions.</div>';
    playTone(600, 'sine', 0.05);
  });

  // Sound Toggle
  elSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      elSoundIconOn.classList.remove('hidden');
      elSoundIconOff.classList.add('hidden');
      initAudio();
      playTone(440, 'sine', 0.1);
      logMessage("Sound effects enabled.");
    } else {
      elSoundIconOn.classList.add('hidden');
      elSoundIconOff.classList.remove('hidden');
      logMessage("Sound effects muted.");
    }
  });

  // Helper to sync scores onto HUD
  function updateScoreHUD() {
    elCurrentScore.textContent = STATE.currentScore;
    elHighScore.textContent = STATE.highScores[STATE.activeTab] || 0;
  }

  // Tab Selection Controller
  function setTab(mode) {
    STATE.activeTab = mode;
    [tabChroma, tabStroop, tabBlend].forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'chroma') {
      tabChroma.classList.add('active');
    } else if (mode === 'stroop') {
      tabStroop.classList.add('active');
    } else if (mode === 'blend') {
      tabBlend.classList.add('active');
    }
    
    endGame(false); // Cancel any running games without recording penalties
    showStartPane();
    updateScoreHUD();
    logMessage(`Switched category: ${mode.toUpperCase()} challenge configured.`);
  }

  tabChroma.addEventListener('click', () => setTab('chroma'));
  tabStroop.addEventListener('click', () => setTab('stroop'));
  tabBlend.addEventListener('click', () => setTab('blend'));

  // Handle dynamic metadata for Start Screen info injection
  function showStartPane() {
    elStartPane.classList.remove('hidden');
    elGameChroma.classList.add('hidden');
    elGameStroop.classList.add('hidden');
    elGameBlend.classList.add('hidden');
    elTimerContainer.classList.add('opacity-40');

    if (STATE.activeTab === 'chroma') {
      elStartIconContainer.innerHTML = `
        <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>`;
      elStartTitle.textContent = "Chroma Finder";
      elStartDesc.textContent = "Test your chromatic sensitivity. Spot the solitary block painted in a slightly different hue value before the clock runs out!";
    } else if (STATE.activeTab === 'stroop') {
      elStartIconContainer.innerHTML = `
        <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>`;
      elStartTitle.textContent = "Stroop Clash";
      elStartDesc.textContent = "Your brain will try to deceive you! Fast-click Match if the written text's meaning equals the physical paint style. Otherwise hit Clash!";
    } else {
      elStartIconContainer.innerHTML = `
        <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>`;
      elStartTitle.textContent = "Hue Blender";
      elStartDesc.textContent = "No hard timer here! Relax and manipulate the precise R, G, B sliders to match the random target color swatch. Push lock to score target proximity accuracy!";
    }
  }

  // Setup / Start Game Entry point
  function startGame() {
    initAudio();
    STATE.gameInProgress = true;
    STATE.currentScore = 0;
    STATE.streak = 0;
    updateScoreHUD();

    elStartPane.classList.add('hidden');
    elGameOverScreen.classList.add('opacity-0', 'pointer-events-none');
    elTimerContainer.classList.remove('opacity-40');

    if (STATE.activeTab === 'chroma') {
      elGameChroma.classList.remove('hidden');
      STATE.timeLeft = 25; 
      STATE.maxTime = 25;
      STATE.chroma.level = 1;
      STATE.chroma.size = 2;
      setupChromaLevel();
      startGlobalTimer();
      logMessage("Chroma Finder session initiated!");
    } else if (STATE.activeTab === 'stroop') {
      elGameStroop.classList.remove('hidden');
      STATE.timeLeft = 20;
      STATE.maxTime = 20;
      setupStroopQuestion();
      startGlobalTimer();
      logMessage("Stroop Clash challenge began. Think fast!");
    } else if (STATE.activeTab === 'blend') {
      elGameBlend.classList.remove('hidden');
      // Blender doesn't have an intense timer, hide it dynamically
      elTimerContainer.classList.add('opacity-40');
      setupBlendChallenge();
      logMessage("Hue Blender mode initialized. Slide to match target.");
    }

    playTone(330, 'sine', 0.1);
    setTimeout(() => playTone(440, 'sine', 0.15), 100);
  }

  elStartGameBtn.addEventListener('click', startGame);
  elRestartBtn.addEventListener('click', startGame);

  // Timer Operations
  function startGlobalTimer() {
    clearInterval(STATE.timerInterval);
    updateTimerVisual();
    
    STATE.timerInterval = setInterval(() => {
      STATE.timeLeft -= 0.1;
      if (STATE.timeLeft <= 0) {
        STATE.timeLeft = 0;
        updateTimerVisual();
        endGame(true);
      } else {
        updateTimerVisual();
      }
    }, 100);
  }

  function updateTimerVisual() {
    const percentage = Math.max(0, Math.min(100, (STATE.timeLeft / STATE.maxTime) * 100));
    elTimerBar.style.width = `${percentage}%`;
    
    // Change colors of the progress bar visually based on pressure
    if (percentage > 50) {
      elTimerBar.className = "h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full transition-all duration-100 ease-linear";
    } else if (percentage > 20) {
      elTimerBar.className = "h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-full transition-all duration-100 ease-linear";
    } else {
      elTimerBar.className = "h-full bg-gradient-to-r from-red-600 to-rose-500 w-full transition-all duration-100 ease-linear";
    }
  }

  // End Session Clean up
  function endGame(timeExpired) {
    clearInterval(STATE.timerInterval);
    STATE.gameInProgress = false;
    
    if (timeExpired) {
      playFailure();
      logMessage(`Time's up! Game finished with score: ${STATE.currentScore}`);
      
      // Check and persist personal High Score
      if (STATE.currentScore > (STATE.highScores[STATE.activeTab] || 0)) {
        STATE.highScores[STATE.activeTab] = STATE.currentScore;
        try {
          localStorage.setItem('chromaquest_highscores', JSON.stringify(STATE.highScores));
        } catch(e) {}
        logMessage(`🎉 New personal high score for ${STATE.activeTab}: ${STATE.currentScore}!`);
        playLevelUp();
      }
      
      // Show game over overlay panel
      elGoScore.textContent = STATE.currentScore;
      elGoStreak.textContent = STATE.streak;
      
      elGameOverScreen.classList.remove('pointer-events-none');
      elGameOverScreen.classList.add('opacity-100');
      updateScoreHUD();
    } else {
      // Hard cancel simply switches back to options state
      elGameOverScreen.classList.add('opacity-0', 'pointer-events-none');
    }
  }


  /* GAME 1: CHROMA FINDER CORE ROUTINES */
  function setupChromaLevel() {
    elChromaLevel.textContent = STATE.chroma.level;
    elChromaGrid.innerHTML = '';
    
    // Determine Grid size based on level progression
    if (STATE.chroma.level === 1) {
      STATE.chroma.size = 2;
    } else if (STATE.chroma.level < 4) {
      STATE.chroma.size = 3;
    } else if (STATE.chroma.level < 8) {
      STATE.chroma.size = 4;
    } else if (STATE.chroma.level < 14) {
      STATE.chroma.size = 5;
    } else if (STATE.chroma.level < 20) {
      STATE.chroma.size = 6;
    } else {
      STATE.chroma.size = 7;
    }

    const totalTiles = STATE.chroma.size * STATE.chroma.size;
    elChromaGrid.style.gridTemplateColumns = `repeat(${STATE.chroma.size}, minmax(0, 1fr))`;

    // Generate dynamic HSL colors representing subtle brightness adjustments
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 50; // 50% - 90%
    const l = Math.floor(Math.random() * 50) + 25; // 25% - 75%
    
    // Difficulty factor decreases gap difference as score/level raises
    const baseGap = Math.max(1.5, 20 - (STATE.chroma.level * 0.8));
    const isBrighter = l < 50;
    const oddL = isBrighter ? (l + baseGap) : (l - baseGap);
    
    STATE.chroma.baseColor = `hsl(${h}, ${s}%, ${l}%)`;
    STATE.chroma.oddColor = `hsl(${h}, ${s}%, ${oddL}%)`;
    STATE.chroma.correctIndex = Math.floor(Math.random() * totalTiles);

    for (let i = 0; i < totalTiles; i++) {
      const tile = document.createElement('button');
      tile.className = "w-full h-full rounded-xl transition-transform active:scale-95 duration-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400";
      tile.style.backgroundColor = (i === STATE.chroma.correctIndex) ? STATE.chroma.oddColor : STATE.chroma.baseColor;
      
      tile.addEventListener('click', () => {
        if (!STATE.gameInProgress) return;
        if (i === STATE.chroma.correctIndex) {
          // Correct choice
          playSuccess();
          STATE.currentScore += 10;
          STATE.streak += 1;
          STATE.chroma.level += 1;
          // Bonus time
          STATE.timeLeft = Math.min(STATE.maxTime, STATE.timeLeft + 2.5);
          updateScoreHUD();
          
          // Visual level-up scale effect on level badge
          elChromaLevel.classList.add('level-pop');
          setTimeout(() => elChromaLevel.classList.remove('level-pop'), 400);
          
          setupChromaLevel();
        } else {
          // Wrong choice
          playTone(180, 'sawtooth', 0.2);
          STATE.timeLeft = Math.max(0, STATE.timeLeft - 3.5);
          STATE.streak = 0;
          logMessage("Incorrect tile! Lose 3.5 seconds penalty.");
          updateTimerVisual();
        }
      });

      elChromaGrid.appendChild(tile);
    }
  }


  /* GAME 2: STROOP CLASH CORE ROUTINES */
  function setupStroopQuestion() {
    // Pick random target definitions
    const wordItem = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
    const colorItem = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
    
    // Determine matching state logically
    const matchChance = Math.random() < 0.5;
    
    if (matchChance) {
      STATE.stroop.currentWord = wordItem.name;
      STATE.stroop.currentColor = wordItem.hex;
      STATE.stroop.isMatching = true;
    } else {
      STATE.stroop.currentWord = wordItem.name;
      // Pick helper to guarantee mismatched colors
      let badColor = colorItem;
      while (badColor.name === wordItem.name) {
        badColor = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
      }
      STATE.stroop.currentColor = badColor.hex;
      STATE.stroop.isMatching = false;
    }

    elStroopWord.textContent = STATE.stroop.currentWord.toUpperCase();
    elStroopWord.style.color = STATE.stroop.currentColor;
    
    // Micro-interactivity jump anim
    elStroopWord.style.transform = 'scale(0.8)';
    setTimeout(() => {
      elStroopWord.style.transform = 'scale(1.0)';
    }, 50);
  }

  function triggerStroopAnswer(userSelection) {
    if (!STATE.gameInProgress || STATE.activeTab !== 'stroop') return;
    
    const isCorrect = (userSelection === STATE.stroop.isMatching);
    
    if (isCorrect) {
      playSuccess();
      STATE.currentScore += 10;
      STATE.streak += 1;
      STATE.timeLeft = Math.min(STATE.maxTime, STATE.timeLeft + 1.5);
      triggerFeedbackIndicator(true);
      updateScoreHUD();
      setupStroopQuestion();
    } else {
      playTone(180, 'sawtooth', 0.2);
      STATE.timeLeft = Math.max(0, STATE.timeLeft - 4);
      STATE.streak = 0;
      triggerFeedbackIndicator(false);
      logMessage("Clash error! 4s penalty registered.");
      updateTimerVisual();
      setupStroopQuestion();
    }
  }

  function triggerFeedbackIndicator(correct) {
    const textSpan = elStroopFeedback.querySelector('span');
    if (correct) {
      textSpan.textContent = "✓";
      textSpan.className = "text-6xl font-black text-emerald-500/30";
    } else {
      textSpan.textContent = "✗";
      textSpan.className = "text-6xl font-black text-rose-500/30";
    }
    elStroopFeedback.classList.remove('opacity-0');
    setTimeout(() => {
      elStroopFeedback.classList.add('opacity-0');
    }, 200);
  }

  elStroopBtnTrue.addEventListener('click', () => triggerStroopAnswer(true));
  elStroopBtnFalse.addEventListener('click', () => triggerStroopAnswer(false));

  // Keyboard hotkeys for Stroop Match
  window.addEventListener('keydown', (e) => {
    if (STATE.gameInProgress && STATE.activeTab === 'stroop') {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        triggerStroopAnswer(false);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        triggerStroopAnswer(true);
      }
    }
  });


  /* GAME 3: HUE BLENDER CORE ROUTINES */
  function setupBlendChallenge() {
    // Create randomized target values
    STATE.blend.targetRGB = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };

    elBlendTarget.style.backgroundColor = `rgb(${STATE.blend.targetRGB.r}, ${STATE.blend.targetRGB.g}, ${STATE.blend.targetRGB.b})`;
    
    // Reset sliders back to midpoints
    STATE.blend.currentRGB = { r: 128, g: 128, b: 128 };
    elSlideRed.value = 128;
    elSlideGreen.value = 128;
    elSlideBlue.value = 128;

    updateBlendOutputs();
  }

  function updateBlendOutputs() {
    const r = parseInt(elSlideRed.value);
    const g = parseInt(elSlideGreen.value);
    const b = parseInt(elSlideBlue.value);

    STATE.blend.currentRGB = { r, g, b };

    elValRed.textContent = r;
    elValGreen.textContent = g;
    elValBlue.textContent = b;

    elBlendCurrent.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Math formula calculating similarity index mathematically
    const diffR = STATE.blend.targetRGB.r - r;
    const diffG = STATE.blend.targetRGB.g - g;
    const diffB = STATE.blend.targetRGB.b - b;
    
    // Calculate normalized Euclidean distance vector
    const maxDist = Math.sqrt(255*255 * 3);
    const actualDist = Math.sqrt(diffR*diffR + diffG*diffG + diffB*diffB);
    const similarity = Math.max(0, 100 - (actualDist / maxDist * 100));

    elBlendMatchPct.textContent = `${similarity.toFixed(1)}%`;
    
    if (similarity > 95) {
      elBlendMatchPct.className = "text-lg font-extrabold text-emerald-400";
    } else if (similarity > 80) {
      elBlendMatchPct.className = "text-lg font-extrabold text-indigo-400";
    } else {
      elBlendMatchPct.className = "text-lg font-extrabold text-amber-500";
    }
  }

  // Monitor range inputs continuously
  [elSlideRed, elSlideGreen, elSlideBlue].forEach(slider => {
    slider.addEventListener('input', () => {
      updateBlendOutputs();
      if (Math.random() < 0.15) { // periodic sound ticks while sliding
        playTone(300 + (parseInt(slider.value) * 2), 'sine', 0.04);
      }
    });
  });

  elBlendSubmitBtn.addEventListener('click', () => {
    const matchText = elBlendMatchPct.textContent;
    const finalSimilarity = parseFloat(matchText);
    
    let awardedPoints = 0;
    if (finalSimilarity >= 98) {
      awardedPoints = 100;
      playLevelUp();
      logMessage(`🎉 Flawless! ${finalSimilarity.toFixed(1)}% match. Scored massive +100 points!`);
    } else if (finalSimilarity >= 90) {
      awardedPoints = 50;
      playSuccess();
      logMessage(`Excellent alignment. ${finalSimilarity.toFixed(1)}% match, awarded +50 points.`);
    } else if (finalSimilarity >= 75) {
      awardedPoints = 20;
      playTone(400, 'triangle', 0.2);
      logMessage(`Decent. ${finalSimilarity.toFixed(1)}% match, awarded +20 points.`);
    } else {
      playFailure();
      logMessage(`Weak match (${finalSimilarity.toFixed(1)}%). Need at least 75% accuracy. Try again!`);
    }

    STATE.currentScore += awardedPoints;
    if (awardedPoints > 0) {
      STATE.streak += 1;
    } else {
      STATE.streak = 0;
    }

    // Blend high score check
    if (STATE.currentScore > (STATE.highScores.blend || 0)) {
      STATE.highScores.blend = STATE.currentScore;
      try {
        localStorage.setItem('chromaquest_highscores', JSON.stringify(STATE.highScores));
      } catch(e) {}
    }
    
    updateScoreHUD();
    setupBlendChallenge();
  });

  // Initialize default screen configuration
  setTab('chroma');
})();