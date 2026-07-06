/**
 * LipiMitra: Dynamic Telugu Letter Writing & Tracing Sandbox Interactivity
 */

// Comprehensive letter datasets
const teluguVowels = [
  { id: 'v1', letter: 'అ', english: 'a', phonetic: 'a', word: 'అమ్మ', meaning: 'Mother (Amma)', direction: 'Start with a wide sweep clockwise from the center-left loop, drag downwards, round up and close with a long wavy top-right horizontal sweep.' },
  { id: 'v2', letter: 'ఆ', english: 'aa', phonetic: 'aa', word: 'ఆవు', meaning: 'Cow (Aavu)', direction: 'Similar to అ. Extend the trailing right stroke down and loop it backwards with a circular tail upward.' },
  { id: 'v3', letter: 'ఇ', english: 'i', phonetic: 'ee', word: 'ఇల్లు', meaning: 'House (Illu)', direction: 'Trace the center-top circle, descend into two bottom curves, then complete the horizontal baseline loop.' },
  { id: 'v4', letter: 'ఈ', english: 'ee', phonetic: 'eee', word: 'ఈల', meaning: 'Whistle (Eela)', direction: 'Draw the primary outer shell circular ring, add a top loop hook, and place two side dots inside.' },
  { id: 'v5', letter: 'ఉ', english: 'u', phonetic: 'u', word: 'ఉడుత', meaning: 'Squirrel (Uduta)', direction: 'Begin with a double left curved arch, draw a small centered horizontal line, and complete the trailing tail upward.' },
  { id: 'v6', letter: 'ఊ', english: 'oo', phonetic: 'oo', word: 'ఊయల', meaning: 'Cradle (Ooyala)', direction: 'Trace the character ఉ, then add a right side swoosh and a bottom-aligned curve indicator.' },
  { id: 'v7', letter: 'ఋ', english: 'ru', phonetic: 'ru', word: 'ఋషి', meaning: 'Sage (Rishi)', direction: 'Draw the upper arching loops, descend down with a series of small, consecutive rounded vertical waves.' },
  { id: 'v8', letter: 'ఎ', english: 'e', phonetic: 'e', word: 'ఎలుక', meaning: 'Rat (Eluka)', direction: 'Start with a small loop in the left center, trace up, and complete a wave rightward.' },
  { id: 'v9', letter: 'ఏ', english: 'ae', phonetic: 'ae', word: 'ఏనుగు', meaning: 'Elephant (Aenugu)', direction: 'Begin identical to ఎ, but extend the trailing right tail up with an upward vertical curve.' },
  { id: 'v10', letter: 'ఐ', english: 'ai', phonetic: 'ai', word: 'ఐదు', meaning: 'Five (Aidu)', direction: 'Trace character ఎ, then place a double loop cradle support curve underneath.' },
  { id: 'v11', letter: 'ఒ', english: 'o', phonetic: 'o', word: 'ఒంటె', meaning: 'Camel (Onte)', direction: 'A delicate series of three loops: trace small bottom loop, rise, dive, and round the right hook.' },
  { id: 'v12', letter: 'ఓ', english: 'oo', phonetic: 'ooo', word: 'ఓడ', meaning: 'Ship (Oda)', direction: 'Like ఒ, but stretch the right wing upward into a curved checkmark.' },
  { id: 'v13', letter: 'ఔ', english: 'au', phonetic: 'au', word: 'ఔషధం', meaning: 'Medicine (Aushadham)', direction: 'Trace ఒ first, then draw a wavy flag accent on the upper-right corner.' },
  { id: 'v14', letter: 'అం', english: 'am', phonetic: 'am', word: 'అంకెలు', meaning: 'Numbers (Ankelu)', direction: 'Trace character అ first, then place a clean medium circle directly to its right.' },
  { id: 'v15', letter: 'అః', english: 'aha', phonetic: 'aha', word: 'అంతఃపురం', meaning: 'Palace (Anthahpuram)', direction: 'Trace character అ first, then add two small stacked vertical circles (visarga) on the right.' }
];

const teluguConsonants = [
  { id: 'c1', letter: 'క', english: 'ka', phonetic: 'ka', word: 'కలము', meaning: 'Pen (Kalamu)', direction: 'Trace a hook curve from top left, down, cross it, and put the signature checkmark on top.' },
  { id: 'c2', letter: 'ఖ', english: 'kha', phonetic: 'kha', word: 'ఖడ్గము', meaning: 'Sword (Khadgamu)', direction: 'Start from bottom-left loop, draw a balloon-like arch, descend into a bottom loop, and cross with a center tick.' },
  { id: 'c3', letter: 'గ', english: 'ga', phonetic: 'ga', word: 'గడియారం', meaning: 'Clock (Gadiyaram)', direction: 'An inverted U curve with a hook. Trace smoothly up, arch right, go down, and complete with a top checkmark.' },
  { id: 'c4', letter: 'ఘ', english: 'gha', phonetic: 'gha', word: 'ఘటం', meaning: 'Pot (Ghatam)', direction: 'Draw several small wavy crests, add a vertical line support on the right, and mark with a tick on top.' },
  { id: 'c5', letter: 'చ', english: 'cha', phonetic: 'cha', word: 'చదరంగం', meaning: 'Chess (Chadarangam)', direction: 'Trace a horizontal loop, lift up, draw a deep curve, and top with a standard checkmark.' },
  { id: 'c6', letter: 'ఛ', english: 'chha', phonetic: 'chha', word: 'ఛత్రి', meaning: 'Umbrella (Chhatri)', direction: 'Like చ, but with an extra decorative looping loop at the bottom and a vertical line hanging.' },
  { id: 'c7', letter: 'జ', english: 'ja', phonetic: 'ja', word: 'జడ', meaning: 'Plait (Jada)', direction: 'Draw a central circle, add two horns on the left, and a vertical tail pointing down.' },
  { id: 'c8', letter: 'ఝ', english: 'jha', phonetic: 'jha', word: 'ఝషము', meaning: 'Fish (Jhashamu)', direction: 'Trace a wide wavy contour with a bottom circle and a side crescent.' }
];

// State variables
let currentLetter = teluguVowels[0];
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let strokeColor = '#f59e0b'; // Amber
let brushSize = 12;
let isEraser = false;
let guidelinesActive = true;
let starsEarned = 0;

// Local Progress Storage Structure
let letterProgress = {}; 

// Canvas elements
const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');
const canvasContainer = canvas.parentElement;

// Init
window.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  populateAlphabets();
  setupCanvasResolution();
  selectLetter(currentLetter);
  
  // Window Resize re-draw support
  window.addEventListener('resize', () => {
    setupCanvasResolution();
    renderDottedGuide();
  });

  // Setup Event Listeners
  setupDrawingListeners();
  setupInterfaceControls();
});

// Load & Save Mastery Progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('lipimitra_progress');
  const savedStars = localStorage.getItem('lipimitra_stars');
  if (saved) {
    try {
      letterProgress = JSON.parse(saved);
    } catch (e) {
      letterProgress = {};
    }
  }
  if (savedStars) {
    starsEarned = parseInt(savedStars, 10) || 0;
    document.getElementById('starCounter').innerText = starsEarned;
  }
}

function saveProgress() {
  localStorage.setItem('lipimitra_progress', JSON.stringify(letterProgress));
  localStorage.setItem('lipimitra_stars', starsEarned);
  document.getElementById('starCounter').innerText = starsEarned;
}

// Setup high DPI Canvas resolution
function setupCanvasResolution() {
  const rect = canvasContainer.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(2, 2);
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  if (guidelinesActive) {
    canvasContainer.classList.add('canvas-grid-bg');
  } else {
    canvasContainer.classList.remove('canvas-grid-bg');
  }
}

// Populates letters left side grids
function populateAlphabets() {
  const vGrid = document.getElementById('vowelsGrid');
  const cGrid = document.getElementById('consonantsGrid');
  
  vGrid.innerHTML = '';
  cGrid.innerHTML = '';

  // Build vowels
  teluguVowels.forEach(v => {
    const btn = document.createElement('button');
    const progress = letterProgress[v.id] || 0;
    btn.id = `btn-${v.id}`;
    btn.className = `letter-card p-3 flex flex-col items-center justify-center bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer`;
    btn.innerHTML = `
      <span class="text-2xl font-bold text-slate-100">${v.letter}</span>
      <span class="text-[10px] text-slate-400 mt-0.5">${v.english}</span>
      ${progress > 0 ? `<div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></div>` : ''}
    `;
    btn.addEventListener('click', () => selectLetter(v));
    vGrid.appendChild(btn);
  });

  // Build consonants
  teluguConsonants.forEach(c => {
    const btn = document.createElement('button');
    const progress = letterProgress[c.id] || 0;
    btn.id = `btn-${c.id}`;
    btn.className = `letter-card p-3 flex flex-col items-center justify-center bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer`;
    btn.innerHTML = `
      <span class="text-2xl font-bold text-slate-100">${c.letter}</span>
      <span class="text-[10px] text-slate-400 mt-0.5">${c.english}</span>
      ${progress > 0 ? `<div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></div>` : ''}
    `;
    btn.addEventListener('click', () => selectLetter(c));
    cGrid.appendChild(btn);
  });
}

// Highlight selected letter state
function selectLetter(letterObj) {
  currentLetter = letterObj;
  
  // Remove active styling on all
  document.querySelectorAll('.letter-card').forEach(card => {
    card.classList.remove('border-amber-500/50', 'bg-amber-500/10');
  });
  
  // Highlight selected target
  const activeBtn = document.getElementById(`btn-${letterObj.id}`);
  if (activeBtn) {
    activeBtn.classList.add('border-amber-500/50', 'bg-amber-500/10');
  }

  // Update Right Information Board
  document.getElementById('metaTeluguLetter').innerText = letterObj.letter;
  document.getElementById('metaPronunciationEnglish').innerHTML = `Pronounced as: <span class="font-semibold text-amber-400">'${letterObj.english}'</span>`;
  document.getElementById('metaExampleWordTelugu').innerText = letterObj.word;
  document.getElementById('metaExampleMeaningEnglish').innerText = `English: ${letterObj.meaning}`;
  document.getElementById('metaGuideDirections').innerText = letterObj.direction;

  // Update progress value visualization
  const progressVal = letterProgress[letterObj.id] || 0;
  document.getElementById('masteryVal').innerText = `${progressVal}%`;
  document.getElementById('masteryProgressFill').style.width = `${progressVal}%`;

  // Clear existing paths and draw new template
  resetCanvasDrawing();
  renderDottedGuide();
  
  // TTS Pronounce automatically
  speakLetter(letterObj.letter);
}

// Switch Tabs (Achulu vs Hallulu)
window.switchTab = function(tabName) {
  const tabV = document.getElementById('tabVowels');
  const tabC = document.getElementById('tabConsonants');
  const gridV = document.getElementById('vowelsGrid');
  const gridC = document.getElementById('consonantsGrid');

  if (tabName === 'vowels') {
    tabV.className = "flex-1 py-2 text-xs font-medium rounded-md transition-all bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm";
    tabC.className = "flex-1 py-2 text-xs font-medium rounded-md transition-all text-slate-400 hover:text-slate-200";
    gridV.classList.remove('hidden');
    gridC.classList.add('hidden');
  } else {
    tabC.className = "flex-1 py-2 text-xs font-medium rounded-md transition-all bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm";
    tabV.className = "flex-1 py-2 text-xs font-medium rounded-md transition-all text-slate-400 hover:text-slate-200";
    gridC.classList.remove('hidden');
    gridV.classList.add('hidden');
  }
};

// Draws the background guided Telugu character onto the template canvas
function renderDottedGuide() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Draw visual support line guides behind the canvas text
  if (guidelinesActive) {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    ctx.restore();
  }

  // Draw large guided letter outline strictly as dots using a clever dash stroke
  ctx.save();
  // Set properties
  ctx.font = `bold ${Math.min(width, height) * 0.45}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Render text outline using a highly defined dotted pattern
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
  ctx.lineWidth = 5;
  ctx.setLineDash([6, 15]); // Creates the 'dotted' drawing track
  ctx.strokeText(currentLetter.letter, width / 2, height / 2 + 10);
  
  // Also render very light inner solid fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fillText(currentLetter.letter, width / 2, height / 2 + 10);
  ctx.restore();
}

// Clear canvas content
function resetCanvasDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderDottedGuide();
  document.getElementById('accuracyDisplay').innerText = "Trace Accuracy: --%";
}

// Draw Event Handling (Mouse & Touch compatible)
function setupDrawingListeners() {
  // Mouse Events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Touch Events for Tablets/Phones
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      isDrawing = true;
      lastX = touch.clientX - rect.left;
      lastY = touch.clientY - rect.top;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDrawing && e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      drawSegment(lastX, lastY, x, y);
      lastX = x;
      lastY = y;
    }
  });

  canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  drawSegment(lastX, lastY, x, y);
  lastX = x;
  lastY = y;
}

function drawSegment(x1, y1, x2, y2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  
  if (isEraser) {
    ctx.strokeStyle = '#0f172a'; // Match background color for smooth erasing
    ctx.lineWidth = brushSize * 1.5;
  } else {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = brushSize;
  }
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function stopDrawing() {
  isDrawing = false;
}

// User Tool Controls Binding
function setupInterfaceControls() {
  // Color selection
  const colorButtons = document.querySelectorAll('#brushColorGroup button');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear current selection highlight
      colorButtons.forEach(b => b.classList.remove('scale-125', 'ring-2', 'ring-white/50'));
      
      // Select
      strokeColor = btn.getAttribute('data-color');
      btn.classList.add('scale-125', 'ring-2', 'ring-white/50');
      
      // Disable Eraser automatically
      isEraser = false;
      document.getElementById('eraserBtn').classList.remove('bg-pink-500/20', 'text-pink-300', 'border-pink-500/50');
    });
  });

  // Eraser Trigger
  const eraserBtn = document.getElementById('eraserBtn');
  eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    if (isEraser) {
      eraserBtn.classList.add('bg-pink-500/20', 'text-pink-300', 'border-pink-500/50');
    } else {
      eraserBtn.classList.remove('bg-pink-500/20', 'text-pink-300', 'border-pink-500/50');
    }
  });

  // Brush Size Adjuster
  const sizeSlider = document.getElementById('brushSizeSlider');
  sizeSlider.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value, 10);
    document.getElementById('brushSizeVal').innerText = `${brushSize}px`;
  });

  // Toggle guidelines grid lines
  document.getElementById('toggleGuidelinesBtn').addEventListener('click', () => {
    guidelinesActive = !guidelinesActive;
    setupCanvasResolution();
    renderDottedGuide();
  });

  // Clear Drawing Board
  document.getElementById('clearBtn').addEventListener('click', resetCanvasDrawing);

  // Evaluate / Verify Tracing Accuracy Button
  document.getElementById('checkBtn').addEventListener('click', evaluateDrawingAccuracy);

  // Text To Speech Trigger
  document.getElementById('speakBtn').addEventListener('click', () => {
    speakLetter(currentLetter.letter);
  });

  // Download My Practice Sheet
  document.getElementById('sheetExportBtn').addEventListener('click', downloadCanvas);

  // Reset saved states
  document.getElementById('resetProgressBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to clear your earned stars and mastery progress?')) {
      letterProgress = {};
      starsEarned = 0;
      saveProgress();
      populateAlphabets();
      selectLetter(currentLetter);
    }
  });
}

// Speech Synthesis for Telugu phonetics support
function speakLetter(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te-IN'; // Telugu language code
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported on this browser.');
  }
}

// Accuracy evaluation routine using simple canvas pixel comparison matrix
function evaluateDrawingAccuracy() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width);
  const height = Math.floor(rect.height);
  
  // Create offscreen template checker context to match current letters
  const compCanvas = document.createElement('canvas');
  compCanvas.width = width;
  compCanvas.height = height;
  const compCtx = compCanvas.getContext('2d');

  // Render letter in solid state in check canvas
  compCtx.font = `bold ${Math.min(width, height) * 0.45}px sans-serif`;
  compCtx.textAlign = 'center';
  compCtx.textBaseline = 'middle';
  compCtx.fillStyle = '#ffffff';
  compCtx.fillText(currentLetter.letter, width / 2, height / 2 + 10);

  // Grab pixel buffers
  const templateData = compCtx.getImageData(0, 0, width, height).data;
  // Grab user drawing pixels (from interactive canvas)
  const userData = ctx.getImageData(0, 0, width * 2, height * 2).data; // 2x scaled

  let matchedPoints = 0;
  let totalPoints = 0;
  let userPointsOnTemplate = 0;
  
  // sample pixel map spacing for speed performance optimization
  const step = 4; 
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const templateIdx = ((y * width) + x) * 4;
      const userIdx = (((y * 2) * (width * 2)) + (x * 2)) * 4;

      const templateIsFilled = templateData[templateIdx + 3] > 50; // alpha threshold
      const userIsFilled = userData[userIdx + 3] > 50; 

      if (templateIsFilled) {
        totalPoints++;
        if (userIsFilled) {
          userPointsOnTemplate++;
        }
      }
    }
  }

  // Compute score
  let finalScore = 0;
  if (totalPoints > 0) {
    finalScore = Math.round((userPointsOnTemplate / totalPoints) * 100);
  }

  // Normalize maximum accuracy logic
  if (finalScore > 100) finalScore = 100;
  
  // Bound final score range for delightful gamification feedback
  let displayScore = finalScore;
  if (userPointsOnTemplate > 0 && finalScore < 15) {
    displayScore = 15; // Give child trace positive validation motivation
  }

  // Render text accuracy visual
  const accDisp = document.getElementById('accuracyDisplay');
  accDisp.innerText = `Trace Accuracy: ${displayScore}%`;
  accDisp.classList.add('score-pulse');
  setTimeout(() => accDisp.classList.remove('score-pulse'), 600);

  // Update mastery value if higher than before
  const currentBest = letterProgress[currentLetter.id] || 0;
  if (displayScore > currentBest) {
    letterProgress[currentLetter.id] = displayScore;
    
    // If user trace achieves > 65%, award a shiny star!
    if (displayScore >= 65 && currentBest < 65) {
      starsEarned += 1;
      triggerCelebration();
    }
    
    saveProgress();
    populateAlphabets();
    // Select current letter again to trigger visual re-render
    selectLetter(currentLetter);
  }
}

// Confetti simulation reward
function triggerCelebration() {
  const confCanvas = document.getElementById('confettiCanvas');
  confCanvas.classList.remove('hidden');
  const confCtx = confCanvas.getContext('2d');
  
  // Setup full sized confetti canvas
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#22d3ee'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * confCanvas.width,
      y: Math.random() * confCanvas.height - confCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confCanvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  let animationFrameId;
  function drawConfetti() {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    
    let remaining = false;
    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

      if (p.y <= confCanvas.height) {
        remaining = true;
      }

      confCtx.beginPath();
      confCtx.lineWidth = p.r;
      confCtx.strokeStyle = p.color;
      confCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      confCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      confCtx.stroke();
    });

    if (remaining) {
      animationFrameId = requestAnimationFrame(drawConfetti);
    } else {
      confCanvas.classList.add('hidden');
      cancelAnimationFrame(animationFrameId);
    }
  }

  drawConfetti();
}

// Download tracing state image sheet function
function downloadCanvas() {
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `LipiMitra_Telugu_${currentLetter.english}_Practice.png`;
  link.href = image;
  link.click();
}