/**
 * NeuroMatch Advanced Memory game matrix simulation
 * Features Dynamic Grids, custom Decks, customizable Modes, synthesized Web Audio FX, particle confetti simulations
 */

// Deck configuration lists
const DECK_RESOURCES = {
  emojis: [
    '🔮', '🛸', '👾', '🚀', '🧠', '💎', '🍕', '🎸', 
    '🦊', '🎃', '👑', '🎈', '🍟', '🦖', '🦩', '🍣', 
    '🎡', '🔮', '🔑', '💣', '🧸', '🔋', '🎙️', '🍿', 
    '⚽', '🎨', '🧪', '🧬', '🏆', '🧿', '🍀', '💡'
  ],
  symbols: [
    'Σ', 'Ω', 'Δ', 'Ψ', 'Φ', 'λ', 'π', '∞', 
    '√', '∫', '≈', '≠', '⊻', '⊗', '⊕', '⊠', 
    '⚛', '☸', '☯', '⚓', '⚡', '⚡', '⚙', '⚖', 
    '✂', '✈', '✉', '⏰', '⌛', '✒', '☕', '⭐'
  ],
  colors: [
    '#EF4444', '#10B981', '#3B82F6', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', 
    '#F97316', '#84CC16', '#6366F1', '#A855F7', 
    '#059669', '#DC2626', '#2563EB', '#D97706'
  ],
  animals: [
    '🦁', '🐯', '🐼', '🦊', '🐨', '🐸', '🐙', '🦖', 
    '🦄', '🦩', '🦋', '🐝', '🦉', '🐋', '🐬', '🦞', 
    '🐵', '🐧', '🦅', '🦆', '🕷️', '🦀', '🦁', '🦖', 
    '🐗', '🐴', '🐑', '🐪', '🐘', '🐁', '🐓', '🦓'
  ]
};

// Primary game state object
const state = {
  gridSize: 4, // default 4x4 (16 cards)
  motif: 'emojis',
  gameMode: 'standard',
  cards: [],
  flippedIndices: [],
  moves: 0,
  matchesCount: 0,
  score: 0,
  combo: 1,
  timerSeconds: 0,
  timeLeft: 60,
  isPlaying: false,
  soundOn: true,
  highScores: {
    '4-standard': 0,
    '4-timeAttack': 0,
    '6-standard': 0,
    '6-timeAttack': 0,
    '8-standard': 0,
    '8-timeAttack': 0,
  }
};

// Timer reference variable
let mainTimerInterval = null;

// Web Audio API Synthesis wrapper for immersive synth alerts without external file assets
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSynthSound(type) {
  if (!state.soundOn) return;
  try {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'flip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'match') {
      osc.type = 'sine';
      // Play chord effect via frequency jump
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.02, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'miss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); 
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'over') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'scan') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn('Audio Synthesis not fully supported or blocked by user gesture interaction.', e);
  }
}

// Local Storage utility to read/write persistent score records
function loadRecords() {
  const saved = localStorage.getItem('neuromatch_highscores');
  if (saved) {
    try {
      state.highScores = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  updateHighScoreDisplay();
}

function saveRecord(score) {
  const key = `${state.gridSize}-${state.gameMode}`;
  if (!state.highScores[key] || score > state.highScores[key]) {
    state.highScores[key] = score;
    localStorage.setItem('neuromatch_highscores', JSON.stringify(state.highScores));
    updateHighScoreDisplay();
    appendLogStream(`[NEW HIGH SCORE] Reached ${score} in ${key.toUpperCase()}!`, 'text-amber-400');
  }
}

function updateHighScoreDisplay() {
  const key = `${state.gridSize}-${state.gameMode}`;
  const topVal = state.highScores[key] || 0;
  document.getElementById('stat-best-score').textContent = topVal;
}

// Canvas Confetti effect generator when matching correctly
const canvas = document.getElementById('confetti-overlay');
const ctx = canvas?.getContext('2d');
let particles = [];

function resizeCanvas() {
  if (canvas) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 300);

function emitParticles(x, y, colorCode, count = 20) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 3,
      size: Math.random() * 6 + 4,
      color: colorCode || `hsl(${Math.random() * 360}, 80%, 60%)`,
      alpha: 1,
      life: 1
    });
  }
}

function updateAndDrawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12; // simulated low gravity
    p.alpha -= 0.025;
    
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }
    
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  requestAnimationFrame(updateAndDrawParticles);
}
requestAnimationFrame(updateAndDrawParticles);

// Stream log utility inside control container
function appendLogStream(msg, textStyleClass = 'text-slate-400') {
  const stream = document.getElementById('console-log-stream');
  if (stream) {
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.className = `leading-relaxed border-l-2 border-slate-800 pl-2 py-0.5 ${textStyleClass}`;
    entry.innerHTML = `<span class="text-slate-600">[${timestamp}]</span> ${msg}`;
    stream.appendChild(entry);
    stream.scrollTop = stream.scrollHeight;
  }
}

// Build Deck Array based on selection and requested grid count
function generateDecks(size, motifName) {
  const pairCount = (size * size) / 2;
  const srcList = DECK_RESOURCES[motifName] || DECK_RESOURCES.emojis;
  
  // Get unique candidates
  let candidates = [...srcList];
  // Shuffle candidates to avoid choosing same top symbols each game
  candidates.sort(() => Math.random() - 0.5);

  // Extract exact count needed
  const selected = candidates.slice(0, pairCount);
  
  // Duplicate to make matches
  const merged = [...selected, ...selected];
  
  // Fisher-Yates shuffle formula
  for (let i = merged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [merged[i], merged[j]] = [merged[j], merged[i]];
  }
  
  return merged.map((symbol, idx) => ({
    id: idx,
    symbol: symbol,
    isMatched: false,
    isFlipped: false
  }));
}

// Update live counters displayed in analytical metrics card
function updateInterfaceStats() {
  const totalAttempts = state.moves;
  const accurateMatchCount = state.matchesCount;
  let accuracy = 0;
  if (totalAttempts > 0) {
    accuracy = Math.round((accurateMatchCount / totalAttempts) * 100);
  }

  document.getElementById('stat-score').textContent = String(state.score).padStart(4, '0');
  document.getElementById('stat-moves').textContent = String(totalAttempts).padStart(2, '0');
  document.getElementById('stat-combo').textContent = state.combo;
  document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
}

// Setup live countdown/countup clock timer based on game mode selection
function configureTimer(action) {
  clearInterval(mainTimerInterval);
  if (action === 'stop') return;

  const timeDisplay = document.getElementById('display-timer');
  const progressBar = document.getElementById('progress-timer-bar');

  if (state.gameMode === 'timeAttack') {
    state.timeLeft = 60; 
    progressBar.style.width = '100%';
    progressBar.className = 'h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300';
    
    mainTimerInterval = setInterval(() => {
      state.timeLeft--;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        timeDisplay.textContent = "00:00";
        progressBar.style.width = '0%';
        clearInterval(mainTimerInterval);
        triggerGameOver(false); // Time limit defeat
      } else {
        const mins = String(Math.floor(state.timeLeft / 60)).padStart(2, '0');
        const secs = String(state.timeLeft % 60).padStart(2, '0');
        timeDisplay.textContent = `${mins}:${secs}`;
        
        const percentage = (state.timeLeft / 60) * 100;
        progressBar.style.width = `${Math.min(100, percentage)}%`;
      }
    }, 1000);

  } else {
    // Standard practice stopwatch chronometer
    state.timerSeconds = 0;
    progressBar.style.width = '100%';
    progressBar.className = 'h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300';
    
    mainTimerInterval = setInterval(() => {
      state.timerSeconds++;
      const mins = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
      const secs = String(state.timerSeconds % 60).padStart(2, '0');
      timeDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
  }
}

// Render Cards onto physical CSS grid based on size selection
function drawMatrixBoard() {
  const container = document.getElementById('puzzle-matrix-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Set responsive dynamic columns directly via inline styles to support grid system robustly
  const dimension = state.gridSize;
  container.style.gridTemplateColumns = `repeat(${dimension}, minmax(0, 1fr))`;

  state.cards.forEach((card, index) => {
    const cardBox = document.createElement('div');
    cardBox.className = 'perspective aspect-square w-full cursor-pointer group';
    cardBox.id = `card-slot-${index}`;
    cardBox.setAttribute('data-card-index', index);

    // Visual scaling adjust based on density
    let symbolTextSize = 'text-xl sm:text-2xl';
    if (dimension === 6) symbolTextSize = 'text-lg sm:text-xl';
    if (dimension === 8) symbolTextSize = 'text-sm sm:text-base';

    // Handle custom solid colors versus text symbols representation styling
    let symbolInnerMarkup = '';
    if (state.motif === 'colors') {
      symbolInnerMarkup = `<div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-inner border border-white/20" style="background-color: ${card.symbol};"></div>`;
    } else {
      symbolInnerMarkup = `<span class="font-black select-none tracking-tight ${symbolTextSize}">${card.symbol}</span>`;
    }

    // Structure supporting 3D flip effect and sleek rounded card design
    cardBox.innerHTML = `
      <div class="card-inner relative w-full h-full transform-style-3d transition-transform duration-500 rounded-xl sm:rounded-2xl ${card.isFlipped ? 'rotate-y-180' : ''}" style="height: 100%;">
        
        <!-- Card Front Face (Target visible representation) -->
        <div class="card-front absolute inset-0 backface-hidden flex items-center justify-center bg-slate-900 border-2 border-indigo-500/80 rounded-xl sm:rounded-2xl shadow-xl rotate-y-180 ${card.isMatched ? 'matched-card-effect' : 'card-glowing-glow'}">
          ${symbolInnerMarkup}
        </div>

        <!-- Card Back Face (Hidden mystery screen state) -->
        <div class="card-back absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl sm:rounded-2xl shadow-md transition-all duration-300">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-[10px] text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            ⚡
          </div>
        </div>

      </div>
    `;

    // Attach mouse event listener to each custom memory matrix card
    cardBox.addEventListener('click', () => {
      handleCardSelection(index);
    });

    container.appendChild(cardBox);
  });
}

// Handle flip and logic matching
function handleCardSelection(index) {
  if (!state.isPlaying) {
    appendLogStream('[Status] Matrix is inactive. Please click "INIT NEW GRID" to start.', 'text-rose-400');
    return;
  }

  const card = state.cards[index];

  // Prevent flipping matched or already flipped elements, or exceeding pair limit actions
  if (card.isMatched || card.isFlipped || state.flippedIndices.length >= 2) {
    return;
  }

  // Perform actual Flip transition sequence
  card.isFlipped = true;
  state.flippedIndices.push(index);
  
  // Interactive sound feedback triggering
  playSynthSound('flip');
  
  // Redraw matrix display representing flipped states
  const cardContainer = document.getElementById(`card-slot-${index}`);
  if (cardContainer) {
    const innerElement = cardContainer.querySelector('.card-inner');
    if (innerElement) {
      innerElement.classList.add('rotate-y-180');
    }
  }

  // Check matched state if two elements have been revealed
  if (state.flippedIndices.length === 2) {
    state.moves++;
    const [firstIndex, secondIndex] = state.flippedIndices;
    const cardA = state.cards[firstIndex];
    const cardB = state.cards[secondIndex];

    if (cardA.symbol === cardB.symbol) {
      // Symmetrical Match detected!
      cardA.isMatched = true;
      cardB.isMatched = true;
      state.matchesCount++;
      
      // Increment score calculating combo multipliers bonus
      const baseGain = 100;
      const comboBonus = baseGain * state.combo;
      state.score += comboBonus;
      
      // Generate log entry feedback
      appendLogStream(`[Match] Symmetrical Pair resolved! +${comboBonus}pts (Combo x${state.combo})`, 'text-emerald-400');
      playSynthSound('match');

      // Add matching color sparks/particles onto the board layout
      setTimeout(() => {
        const firstBox = document.getElementById(`card-slot-${firstIndex}`);
        const secondBox = document.getElementById(`card-slot-${secondIndex}`);
        if (firstBox && secondBox) {
          const rectA = firstBox.getBoundingClientRect();
          const rectContainer = document.getElementById('puzzle-matrix-grid').getBoundingClientRect();
          const xA = rectA.left + rectA.width/2 - rectContainer.left;
          const yA = rectA.top + rectA.height/2 - rectContainer.top;
          emitParticles(xA, yA, state.motif === 'colors' ? cardA.symbol : '#818CF8', 12);
        }
      }, 200);

      // Apply visual match glow border on success
      setTimeout(() => {
        [firstIndex, secondIndex].forEach(idx => {
          const frontFace = document.querySelector(`#card-slot-${idx} .card-front`);
          if (frontFace) {
            frontFace.classList.add('matched-card-effect');
          }
        });
      }, 300);

      // Increase dynamic Time attack bonus seconds if active mode is set
      if (state.gameMode === 'timeAttack') {
        state.timeLeft = Math.min(120, state.timeLeft + 6); // Cap max dynamic bonus time
        appendLogStream(`[Time Bonus] +6s dynamic time incentive added.`, 'text-indigo-400');
      }

      // Trigger Combo increment
      state.combo = Math.min(5, state.combo + 1);
      state.flippedIndices = [];
      
      // Refresh analytical indicators layout
      updateInterfaceStats();

      // Check global victory matrix resolution success
      const totalPairs = (state.gridSize * state.gridSize) / 2;
      if (state.matchesCount === totalPairs) {
        triggerGameOver(true);
      }
    } else {
      // Mismatch consequence loop
      playSynthSound('miss');
      state.combo = 1; // Break streak multiplier

      if (state.gameMode === 'timeAttack') {
        state.timeLeft = Math.max(3, state.timeLeft - 3);
        appendLogStream(`[Time Penalty] -3s deducted for synchronization error.`, 'text-rose-500');
      }

      appendLogStream(`[Mismatch] Identity conflict detected. Resetting target modules.`, 'text-slate-500');
      
      // Delay reset execution back to face down view
      setTimeout(() => {
        cardA.isFlipped = false;
        cardB.isFlipped = false;
        
        // Animate flip back to state
        [firstIndex, secondIndex].forEach(idx => {
          const innerElement = document.querySelector(`#card-slot-${idx} .card-inner`);
          if (innerElement) {
            innerElement.classList.remove('rotate-y-180');
          }
        });

        state.flippedIndices = [];
        updateInterfaceStats();
      }, 1000);
    }
  }
}

// Cheat Powerup Mechanism: Revelations scanner grid loop
function executeCheatScanner() {
  if (!state.isPlaying || state.cards.length === 0) {
    appendLogStream('[Warning] Initialize active simulation board first.', 'text-amber-400');
    return;
  }

  // Deduct score penalty for applying powerup scan
  const penaltyValue = 250;
  state.score = Math.max(0, state.score - penaltyValue);
  appendLogStream(`[Scanner Powered] Scanning entire matrix. Deducted ${penaltyValue}pts from core.`, 'text-amber-400');
  
  playSynthSound('scan');
  updateInterfaceStats();

  // Flip all non-matched items briefly
  state.cards.forEach((card, idx) => {
    if (!card.isMatched) {
      card.isFlipped = true;
      const cardInner = document.querySelector(`#card-slot-${idx} .card-inner`);
      if (cardInner) {
        cardInner.classList.add('rotate-y-180');
      }
    }
  });

  // Revert back down state transition cooldown
  setTimeout(() => {
    if (!state.isPlaying) return; // Prevent interference with clean board reloads
    state.cards.forEach((card, idx) => {
      if (!card.isMatched && !state.flippedIndices.includes(idx)) {
        card.isFlipped = false;
        const cardInner = document.querySelector(`#card-slot-${idx} .card-inner`);
        if (cardInner) {
          cardInner.classList.remove('rotate-y-180');
        }
      }
    });
  }, 1600);
}

// End simulation loop outcome UI updates
function triggerGameOver(isWin) {
  state.isPlaying = false;
  configureTimer('stop');
  
  const overlay = document.getElementById('game-overlay-state');
  const overlayIcon = document.getElementById('overlay-icon');
  const overlayTitle = document.getElementById('overlay-title');
  const overlaySubtitle = document.getElementById('overlay-subtitle');
  
  // Calculate final performance percentage
  const accuracy = state.moves > 0 ? Math.round((state.matchesCount / state.moves) * 100) : 0;
  
  // Assign values to summary interface cards
  document.getElementById('over-score').textContent = String(state.score).padStart(4, '0');
  
  let timeStr = '00:00';
  if (state.gameMode === 'timeAttack') {
    const elapsed = 60 - state.timeLeft;
    timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  } else {
    timeStr = `${String(Math.floor(state.timerSeconds / 60)).padStart(2, '0')}:${String(state.timerSeconds % 60).padStart(2, '0')}`;
  }
  
  document.getElementById('over-time').textContent = timeStr;
  document.getElementById('over-moves').textContent = state.moves;
  document.getElementById('over-accuracy').textContent = `${accuracy}%`;

  if (isWin) {
    playSynthSound('win');
    overlayIcon.textContent = '🏆';
    overlayTitle.textContent = "Sim Completed!";
    overlaySubtitle.textContent = "Superb! You achieved critical resonance and successfully aligned the memory matrix network.";
    appendLogStream(`[Resolved] Symmetrical alignment secured in ${timeStr}. Score: ${state.score}`, 'text-emerald-400');
    
    // Save record to storage if qualifying
    saveRecord(state.score);
    
    // Big particle burst
    if (canvas) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          emitParticles(Math.random() * canvas.width, Math.random() * canvas.height, null, 30);
        }, i * 200);
      }
    }
  } else {
    playSynthSound('over');
    overlayIcon.textContent = '💀';
    overlayTitle.textContent = "Probe De-synced";
    overlaySubtitle.textContent = "Time budget depleted before total matrix matching was acquired. Re-arm the grids and retry.";
    appendLogStream('[Defeat] Chronometer exhausted. Memory matching incomplete.', 'text-rose-500');
  }

  // Unhide victory element overlay modal panel container
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

// Initialize/Reset State and trigger new grid generation
function initGameSimulation() {
  // Stop active timer loops
  configureTimer('stop');

  // Clear overlay view elements
  const overlay = document.getElementById('game-overlay-state');
  if (overlay) {
    overlay.classList.add('hidden');
  }

  // Re-read selected custom attributes setup configurations
  const selectedSizeBtn = document.querySelector('.size-btn.border-indigo-500');
  state.gridSize = selectedSizeBtn ? parseInt(selectedSizeBtn.getAttribute('data-size'), 10) : 4;
  state.motif = document.getElementById('deck-selector').value;
  
  const activeModeRadio = document.querySelector('input[name="game-mode"]:checked');
  state.gameMode = activeModeRadio ? activeModeRadio.value : 'standard';

  // Reset state values variables
  state.moves = 0;
  state.matchesCount = 0;
  state.score = 0;
  state.combo = 1;
  state.flippedIndices = [];
  state.isPlaying = true;

  // Populate cards resource mapping
  state.cards = generateDecks(state.gridSize, state.motif);

  // Synchronize interface widgets
  updateInterfaceStats();
  updateHighScoreDisplay();
  
  // Render Grid layout onto physical DOM representation
  drawMatrixBoard();
  
  // Start stopwatch timers tracker
  configureTimer('start');

  // Log setup sequence
  appendLogStream(`[Sim] Init ${state.gridSize}x${state.gridSize} matrix (${state.motif} deck). Mode: ${state.gameMode.toUpperCase()}`, 'text-indigo-300');
  
  const statusText = document.getElementById('status-banner-text');
  if (statusText) {
    statusText.innerHTML = `Active Grid matches: <strong>0 / ${(state.gridSize * state.gridSize)/2}</strong>. Seek identical modules sequentially.`;
  }
}

// Reset High Score Storage Utility
function resetRecordStorage() {
  if (confirm("Are you sure you want to completely erase your saved high score records?")) {
    state.highScores = {
      '4-standard': 0, '4-timeAttack': 0,
      '6-standard': 0, '6-timeAttack': 0,
      '8-standard': 0, '8-timeAttack': 0,
    };
    localStorage.setItem('neuromatch_highscores', JSON.stringify(state.highScores));
    updateHighScoreDisplay();
    appendLogStream('[Storage] High scores successfully purged.', 'text-rose-400');
  }
}

// Setup general page UI element listeners
function setupListeners() {
  // Handle grid size dimension selection state modifications
  const sizeButtons = document.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Reset previous active configurations styles representation
      sizeButtons.forEach(b => {
        b.className = "size-btn py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-sm font-bold transition-all focus:outline-none hover:border-slate-700 hover:text-slate-300";
      });
      // Apply new styling highlight
      btn.className = "size-btn py-2 px-3 rounded-xl border border-indigo-500 bg-indigo-500/10 text-indigo-300 text-sm font-bold transition-all focus:outline-none hover:bg-indigo-500/20";
      
      // Immediately display change in logs
      const targetSize = btn.getAttribute('data-size');
      appendLogStream(`[Dimension Preset] Grid updated to ${targetSize}x${targetSize}. Start game to apply change.`, 'text-slate-300');
      
      // Live adjust high score display representation preview
      state.gridSize = parseInt(targetSize, 10);
      updateHighScoreDisplay();
    });
  });

  // Action buttons events registration
  document.getElementById('btn-start-game')?.addEventListener('click', initGameSimulation);
  document.getElementById('btn-overlay-action')?.addEventListener('click', initGameSimulation);
  document.getElementById('btn-peek-powerup')?.addEventListener('click', executeCheatScanner);
  
  document.getElementById('btn-reset-stats')?.addEventListener('click', () => {
    if (confirm("Reset the current game in progress?")) {
      initGameSimulation();
    }
  });

  document.getElementById('btn-reset-record')?.addEventListener('click', resetRecordStorage);

  // Sound Toggle controller
  const soundBtn = document.getElementById('btn-sound-toggle');
  soundBtn?.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    const soundIcon = document.getElementById('sound-icon');
    if (state.soundOn) {
      soundIcon.textContent = "🔊";
      soundBtn.className = "p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all";
      appendLogStream('[System] Synthesis sound processor online.', 'text-indigo-400');
    } else {
      soundIcon.textContent = "🔇";
      soundBtn.className = "p-2 rounded-lg bg-red-950/40 hover:bg-red-950/60 border border-red-900/40 text-rose-400 transition-all";
      appendLogStream('[System] Sound processor muted.', 'text-slate-500');
    }
  });

  // Deck selection live logs notification
  document.getElementById('deck-selector')?.addEventListener('change', (e) => {
    appendLogStream(`[Motif Selected] Deck set to ${e.target.value}. Initialize to reload graphics.`, 'text-slate-300');
  });
}

// Init overall application sequences
setupListeners();
loadRecords();
initGameSimulation();