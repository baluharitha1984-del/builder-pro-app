// WonderLand Kids Playbox Interactivity Hub

// State Management
let starsCount = 0;
let currentActivity = 'music'; // music, paint, memory, story
let soundSynthType = 'triangle'; // triangle, sine, square
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let paintColor = '#ef4444';
let paintTool = 'draw'; // draw, sticker
let selectedSticker = '🦄';
let brushSize = 12;

// Web Audio API context setup
let audioCtx = null;

// Memory game states
const memoryEmojis = ['🦁', '🦁', '🐼', '🐼', '🐸', '🐸', '🦊', '🦊', '🐙', '🐙', '🦄', '🦄'];
let shuffledCards = [];
let selectedCards = [];
let matchedPairsCount = 0;
let memoryMovesCount = 0;

// Mascots pool
const mascotsList = ['🦁', '🐼', '🐸', '🦊', '🐙', '🦄', '🐥', '🐵'];

window.addEventListener('DOMContentLoaded', () => {
  // Initialize localstorage stars
  const cachedStars = localStorage.getItem('wonder_stars');
  if (cachedStars) {
    starsCount = parseInt(cachedStars, 10) || 0;
    document.getElementById('star-counter').innerText = starsCount;
  }

  // Nav buttons setup
  setupNavigation();

  // Activity 1: Music Board Setup
  setupSoundBoard();

  // Activity 2: Painting Canvas Setup
  setupCanvas();

  // Activity 3: Memory Game Initializer
  initMemoryGame();

  // Activity 4: Story Generator Setup
  setupStoryGenerator();

  // Setup custom interval to animate/wiggle the header mascot random choice!
  setInterval(() => {
    const mascotEl = document.getElementById('mascot-avatar');
    const randMascot = mascotsList[Math.floor(Math.random() * mascotsList.length)];
    mascotEl.innerText = randMascot;
  }, 5000);
});

/* ------------------ COMMON HELPERS ------------------ */
function addStars(amount) {
  starsCount += amount;
  document.getElementById('star-counter').innerText = starsCount;
  localStorage.setItem('wonder_stars', starsCount);
  
  // Fire audio rewarding ding!
  playBellDing();
}

function showToast(emoji, message) {
  const toast = document.getElementById('toast-notif');
  document.getElementById('toast-emoji').innerText = emoji;
  document.getElementById('toast-msg').innerText = message;

  toast.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
  toast.classList.add('opacity-100', 'scale-100');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'scale-100');
    toast.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
  }, 2500);
}

function playBellDing() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high chime A5
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15); // slide up
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    // browser locked audio context or unsupported
  }
}

/* ------------------ NAVIGATION CONTROL ------------------ */
function setupNavigation() {
  const tabs = ['music', 'paint', 'memory', 'story'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`nav-btn-${tab}`);
    btn.addEventListener('click', () => {
      // Play brief navigation pop sound
      playSynthNote(400, 'sine', 0.1);
      
      // switch active classes on buttons
      tabs.forEach(t => {
        document.getElementById(`nav-btn-${t}`).classList.remove('active');
        document.getElementById(`panel-${t}`).classList.add('hidden');
        document.getElementById(`panel-${t}`).classList.remove('block');
      });

      btn.classList.add('active');
      document.getElementById(`panel-${tab}`).classList.remove('hidden');
      document.getElementById(`panel-${tab}`).classList.add('block');
      currentActivity = tab;

      // Resize canvas trigger if paint tab open
      if (tab === 'paint') {
        resizeCanvasToMatchContainer();
      }
    });
  });
}

/* ------------------ ACTIVITY 1: SOUND SYNTH BOARD ------------------ */
function setupSoundBoard() {
  const keys = document.querySelectorAll('.sound-key');
  keys.forEach(key => {
    key.addEventListener('click', () => {
      const freq = parseFloat(key.getAttribute('data-freq'));
      const emoji = key.getAttribute('data-emoji');
      const color = key.getAttribute('data-color');

      // Play corresponding frequency synthesized instrument wave
      playSynthNote(freq, soundSynthType, 0.6);

      // Small sparkle stars addition sometimes for playful reinforcement
      if (Math.random() < 0.2) {
        addStars(1);
        showToast(emoji, `Silly note played! Star added!`);
      }
    });
  });

  // Wave type selectors
  const types = ['triangle', 'sine', 'square'];
  types.forEach(type => {
    const btn = document.getElementById(`synth-type-${type}`);
    btn.addEventListener('click', () => {
      types.forEach(t => {
        const currentBtn = document.getElementById(`synth-type-${t}`);
        currentBtn.classList.remove('active', 'bg-indigo-100', 'border-indigo-400');
        currentBtn.classList.add('bg-indigo-50', 'border-transparent');
      });

      btn.classList.add('active', 'bg-indigo-100', 'border-indigo-400');
      btn.classList.remove('bg-indigo-50', 'border-transparent');
      soundSynthType = type;
      
      // preview chime
      playSynthNote(523.25, soundSynthType, 0.3);
    });
  });
}

function playSynthNote(freq, type, duration) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // resume if suspended by browser auto-play policy
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Adjust envelope based on wave style to keep volume children-safe & sweet
    let initialVolume = 0.25;
    if (type === 'square') {
      initialVolume = 0.08; // softer robot sounds
    } else if (type === 'sine') {
      initialVolume = 0.3;
    }

    gainNode.gain.setValueAtTime(initialVolume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Audio synthesis not fully supported by browser yet.", err);
  }
}

/* ------------------ ACTIVITY 2: DOODLE ART CANVAS ------------------ */
function setupCanvas() {
  const canvas = document.getElementById('paint-canvas');
  const ctx = canvas.getContext('2d');

  // Brush slider
  const brushSlider = document.getElementById('brush-size');
  const brushSizeLabel = document.getElementById('brush-size-val');
  brushSlider.addEventListener('input', (e) => {
    brushSize = e.target.value;
    brushSizeLabel.innerText = `${brushSize}px`;
  });

  // Clear art board
  document.getElementById('canvas-clear').addEventListener('click', () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showToast('🧹', 'Drawing board cleaned up!');
  });

  // Toggle Draw vs Sticker mode
  const toolDrawBtn = document.getElementById('tool-draw');
  const toolStickerBtn = document.getElementById('tool-sticker');
  const stickerBox = document.getElementById('sticker-box');

  toolDrawBtn.addEventListener('click', () => {
    paintTool = 'draw';
    toolDrawBtn.classList.add('active', 'bg-pink-500', 'text-white');
    toolDrawBtn.classList.remove('bg-white', 'text-pink-700');
    toolStickerBtn.classList.remove('active', 'bg-pink-500', 'text-white');
    toolStickerBtn.classList.add('bg-white', 'text-pink-700');
    stickerBox.classList.add('hidden');
  });

  toolStickerBtn.addEventListener('click', () => {
    paintTool = 'sticker';
    toolStickerBtn.classList.add('active', 'bg-pink-500', 'text-white');
    toolStickerBtn.classList.remove('bg-white', 'text-pink-700');
    toolDrawBtn.classList.remove('active', 'bg-pink-500', 'text-white');
    toolDrawBtn.classList.add('bg-white', 'text-pink-700');
    stickerBox.classList.remove('hidden');
  });

  // Color selection swatches
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active-swatch'));
      swatch.classList.add('active-swatch');
      paintColor = swatch.getAttribute('data-color');
    });
  });

  // Sticker selection
  const stickers = document.querySelectorAll('.sticker-selector');
  stickers.forEach(st => {
    st.addEventListener('click', () => {
      stickers.forEach(s => s.classList.remove('active-sticker'));
      st.classList.add('active-sticker');
      selectedSticker = st.getAttribute('data-emoji');
      
      // Play a happy soft bubble pop preview sound
      playSynthNote(500, 'sine', 0.1);
    });
  });

  // Listen for mouse / touch on Canvas
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;

    if (paintTool === 'sticker') {
      stampEmoji(lastX, lastY);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    if (paintTool === 'draw') {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      drawSegment(lastX, lastY, x, y);
      lastX = x;
      lastY = y;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', stopDrawing);

  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    if (paintTool === 'sticker') {
      stampEmoji(lastX, lastY);
    }
  }

  function draw(e) {
    if (!isDrawing || paintTool !== 'draw') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawSegment(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  }

  let rewardThrottle = 0;
  function drawSegment(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    
    // Rainbow color check
    if (paintColor === 'rainbow') {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.3, '#eab308');
      grad.addColorStop(0.6, '#06b6d4');
      grad.addColorStop(1, '#a855f7');
      ctx.strokeStyle = grad;
    } else {
      ctx.strokeStyle = paintColor;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Reward kid after painting a bunch
    rewardThrottle++;
    if (rewardThrottle > 35) {
      addStars(1);
      showToast('🎨', 'Creative drawing is magical! +1 Star!');
      rewardThrottle = 0;
    }
  }

  function stampEmoji(x, y) {
    ctx.font = `${brushSize * 2 + 16}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedSticker, x, y);
    addStars(1);
    showToast('✨', `Stamped a ${selectedSticker}! +1 Star!`);
  }

  function stopDrawing() {
    isDrawing = false;
  }
}

function resizeCanvasToMatchContainer() {
  const canvas = document.getElementById('paint-canvas');
  const parent = canvas.parentElement;
  const tempImg = canvas.toDataURL();
  
  // Match actual size based on flex layout with nice min-height fallback
  canvas.width = parent.clientWidth || 650;
  canvas.height = 360;

  // Reload picture background & restore previous art
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  };
  img.src = tempImg;
}

/* ------------------ ACTIVITY 3: MEMORY MATCH GAME ------------------ */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  const victoryBox = document.getElementById('memory-victory');
  
  // Reset state variables
  grid.innerHTML = '';
  victoryBox.classList.add('hidden');
  selectedCards = [];
  matchedPairsCount = 0;
  memoryMovesCount = 0;
  document.getElementById('memory-moves').innerText = memoryMovesCount;

  // Shuffle cards
  shuffledCards = [...memoryEmojis].sort(() => Math.random() - 0.5);

  // Create DOM grid dynamically
  shuffledCards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card w-full aspect-square relative';
    card.setAttribute('data-id', index);
    card.setAttribute('data-emoji', emoji);

    card.innerHTML = `
      <div class="memory-card-inner w-full h-full relative pointer-events-none">
        <div class="card-back w-full h-full shadow-md rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-tr from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 transition-colors">
          ❓
        </div>
        <div class="card-front w-full h-full shadow-md rounded-2xl flex items-center justify-center text-5xl bg-white border-4 border-emerald-400">
          ${emoji}
        </div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    grid.appendChild(card);
  });
}

function handleCardClick(card) {
  // check restrictions
  if (selectedCards.length >= 2) return;
  if (card.classList.contains('flipped')) return;

  // Play cute note trigger on flipping
  playSynthNote(350 + (selectedCards.length * 150), 'sine', 0.2);

  card.classList.add('flipped');
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    memoryMovesCount++;
    document.getElementById('memory-moves').innerText = memoryMovesCount;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = selectedCards;
  const emoji1 = card1.getAttribute('data-emoji');
  const emoji2 = card2.getAttribute('data-emoji');

  if (emoji1 === emoji2) {
    // Match made!
    matchedPairsCount++;
    selectedCards = [];

    // happy audio indicator scale
    setTimeout(() => {
      playSynthNote(783.99, 'triangle', 0.4); // G5 note
      // visually tag them with gold ring
      card1.querySelector('.card-front').classList.add('border-yellow-400');
      card2.querySelector('.card-front').classList.add('border-yellow-400');
    }, 200);

    // check victory
    if (matchedPairsCount === memoryEmojis.length / 2) {
      setTimeout(() => {
        document.getElementById('memory-victory').classList.remove('hidden');
        addStars(15);
        showToast('🏆', 'Victory! You matched all cute buddies! +15 Stars');
        
        // play winner sound scale
        playSynthNote(523.25, 'triangle', 0.1);
        setTimeout(() => playSynthNote(659.25, 'triangle', 0.1), 100);
        setTimeout(() => playSynthNote(783.99, 'triangle', 0.15), 200);
        setTimeout(() => playSynthNote(1046.50, 'triangle', 0.3), 300);
      }, 800);
    }
  } else {
    // No match, turn back over
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      selectedCards = [];
      playSynthNote(220, 'sawtooth', 0.15); // soft error note buzzer
    }, 1200);
  }
}

// Reset memory game button trigger
document.getElementById('btn-reset-memory').addEventListener('click', () => {
  initMemoryGame();
  showToast('🔄', 'New memory deck shuffled!');
});

/* ------------------ ACTIVITY 4: SILLY STORY GENERATOR ------------------ */
function setupStoryGenerator() {
  const generateBtn = document.getElementById('btn-generate-story');
  const readAloudBtn = document.getElementById('btn-read-aloud');
  const storyOutputBox = document.getElementById('story-output-box');

  generateBtn.addEventListener('click', () => {
    const hero = document.getElementById('story-hero').value;
    const action = document.getElementById('story-action').value;
    const place = document.getElementById('story-place').value;

    // Craft funny child fantasy sentences
    const storiesPool = [
      `Once upon a time, there was ${hero} who ${action}. And guess what? This all occurred ${place}`,
      `Attention everyone! A silly legend says that ${hero} loved to visit ${place} just so they could ${action}! Isn't that wild?`,
      `Kaboom! Out of nowhere, ${hero} bounced happily! They quickly ${action} right in front of everyone ${place}. It was the best day ever!`
    ];

    const randomTemplate = storiesPool[Math.floor(Math.random() * storiesPool.length)];
    
    // Update display markup text
    storyOutputBox.innerHTML = randomTemplate;

    // Reward kid
    addStars(5);
    showToast('📖', 'Magnificent! You crafted a silly story! +5 Stars!');

    // Play playful retro level-up tune
    playSynthNote(440, 'triangle', 0.15);
    setTimeout(() => playSynthNote(554.37, 'triangle', 0.15), 100);
    setTimeout(() => playSynthNote(659.25, 'triangle', 0.25), 200);
  });

  // Web Speech Synthesis Reader
  readAloudBtn.addEventListener('click', () => {
    const textToRead = storyOutputBox.innerText;
    
    if ('speechSynthesis' in window) {
      // cancel current spoken text if active
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Pick a high pitch child friendly speed/voice if available
      utterance.pitch = 1.4;
      utterance.rate = 1.0;
      
      // Visual status changes during speech
      utterance.onstart = () => {
        document.getElementById('voice-status').innerText = "🎙️ Magic voice speaking... listen closely!";
        document.getElementById('voice-status').classList.add('text-amber-600', 'font-black');
      };
      
      utterance.onend = () => {
        document.getElementById('voice-status').innerText = "Reads story using Web Speech narration synth!";
        document.getElementById('voice-status').classList.remove('text-amber-600', 'font-black');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      showToast('❌', 'Oops! Web Voice synthesizer is busy or unsupported on this device.');
    }
  });
}