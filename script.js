// Telugu Lipi App Core Scripting

// Comprehensive Telugu Letter Database
const TELUGU_LETTERS = [
  // VOWELS (Achulu)
  { char: "అ", translit: "a", category: "vowel", example: "అమ్మ", exampleMeaning: "Mother", examplePhonetic: "Amma" },
  { char: "ఆ", translit: "aa", category: "vowel", example: "ఆవు", exampleMeaning: "Cow", examplePhonetic: "Aavu" },
  { char: "ఇ", translit: "i", category: "vowel", example: "ఇల్లు", exampleMeaning: "House", examplePhonetic: "Illu" },
  { char: "ఈ", translit: "ee", category: "vowel", example: "ఈల", exampleMeaning: "Whistle", examplePhonetic: "Eela" },
  { char: "ఉ", translit: "u", category: "vowel", example: "ఉడుత", exampleMeaning: "Squirrel", examplePhonetic: "Uduta" },
  { char: "ఊ", translit: "oo", category: "vowel", example: "ఊయల", exampleMeaning: "Cradle/Swing", examplePhonetic: "Ooyala" },
  { char: "ఋ", translit: "ru", category: "vowel", example: "ఋషి", exampleMeaning: "Sage", examplePhonetic: "Rushi" },
  { char: "ఎ", translit: "e", category: "vowel", example: "ఎలుక", exampleMeaning: "Rat", examplePhonetic: "Eluka" },
  { char: "ఏ", translit: "ae", category: "vowel", example: "ఏనుగు", exampleMeaning: "Elephant", examplePhonetic: "Aenugu" },
  { char: "ఐ", translit: "ai", category: "vowel", example: "ఐదు", exampleMeaning: "Five", examplePhonetic: "Aidu" },
  { char: "ఒ", translit: "o", category: "vowel", example: "ఒంటె", exampleMeaning: "Camel", examplePhonetic: "Onte" },
  { char: "ఓ", translit: "oh", category: "vowel", example: "ఓడ", exampleMeaning: "Ship", examplePhonetic: "Ohda" },
  { char: "ఔ", translit: "au", category: "vowel", example: "ఔషధం", exampleMeaning: "Medicine", examplePhonetic: "Aushadham" },
  { char: "అం", translit: "am", category: "vowel", example: "అంకెలు", exampleMeaning: "Numbers", examplePhonetic: "Ankelu" },
  { char: "అః", translit: "aha", category: "vowel", example: "అంతఃపురం", exampleMeaning: "Palace", examplePhonetic: "Antahpuram" },

  // CONSONANTS (Hallulu)
  { char: "క", translit: "ka", category: "consonant", example: "కలము", exampleMeaning: "Pen", examplePhonetic: "Kalamu" },
  { char: "ఖ", translit: "kha", category: "consonant", example: "ఖడ్గం", exampleMeaning: "Sword", examplePhonetic: "Khadgam" },
  { char: "గ", translit: "ga", category: "consonant", example: "గడియారం", exampleMeaning: "Clock", examplePhonetic: "Gadiyaaram" },
  { char: "ఘ", translit: "gha", category: "consonant", example: "ఘటం", exampleMeaning: "Pot", examplePhonetic: "Ghatam" },
  { char: "చ", translit: "cha", category: "consonant", example: "చక్రం", exampleMeaning: "Wheel", examplePhonetic: "Chakram" },
  { char: "ఛ", translit: "chha", category: "consonant", example: "ఛత్రి", exampleMeaning: "Umbrella", examplePhonetic: "Chhatri" },
  { char: "జ", translit: "ja", category: "consonant", example: "జడ", exampleMeaning: "Braid", examplePhonetic: "Jada" },
  { char: "ఝ", translit: "jha", category: "consonant", example: "ఝషం", exampleMeaning: "Fish", examplePhonetic: "Jhasham" },
  { char: "ట", translit: "ta", category: "consonant", example: "టమాటా", exampleMeaning: "Tomato", examplePhonetic: "Tamaata" },
  { char: "ఠ", translit: "tha", category: "consonant", example: "కంఠం", exampleMeaning: "Neck", examplePhonetic: "Kantham" },
  { char: "డ", translit: "da", category: "consonant", example: "డప్పు", exampleMeaning: "Drum", examplePhonetic: "Dappu" },
  { char: "ఢ", translit: "dha", category: "consonant", example: "ఢంకా", exampleMeaning: "Large Drum", examplePhonetic: "Dhanka" },
  { char: "ణ", translit: "na", category: "consonant", example: "వీణ", exampleMeaning: "Veena Instrument", examplePhonetic: "Veena" },
  { char: "త", translit: "tha", category: "consonant", example: "తబలా", exampleMeaning: "Tabla", examplePhonetic: "Tabala" },
  { char: "థ", translit: "thha", category: "consonant", example: "రథం", exampleMeaning: "Chariot", examplePhonetic: "Ratham" },
  { char: "ద", translit: "da", category: "consonant", example: "దండ", exampleMeaning: "Garland", examplePhonetic: "Danda" },
  { char: "ధ", translit: "dha", category: "consonant", example: "ధనస్సు", exampleMeaning: "Bow", examplePhonetic: "Dhanassu" },
  { char: "న", translit: "na", category: "consonant", example: "నగ", exampleMeaning: "Jewel", examplePhonetic: "Naga" },
  { char: "ప", translit: "pa", category: "consonant", example: "పలక", exampleMeaning: "Slate", examplePhonetic: "Palaka" },
  { char: "ఫ", translit: "pha", category: "consonant", example: "ఫలం", exampleMeaning: "Fruit", examplePhonetic: "Phalam" },
  { char: "బ", translit: "ba", category: "consonant", example: "బలపం", exampleMeaning: "Slate Pencil", examplePhonetic: "Balapam" },
  { char: "భ", translit: "bha", category: "consonant", example: "భయం", exampleMeaning: "Fear", examplePhonetic: "Bhayam" },
  { char: "మ", translit: "ma", category: "consonant", example: "మంచం", exampleMeaning: "Cot", examplePhonetic: "Mancham" },
  { char: "య", translit: "ya", category: "consonant", example: "యంత్రం", exampleMeaning: "Machine", examplePhonetic: "Yantram" },
  { char: "ర", translit: "ra", category: "consonant", example: "రవి", exampleMeaning: "Sun", examplePhonetic: "Ravi" },
  { char: "ల", translit: "la", category: "consonant", example: "లత", exampleMeaning: "Creeper Plant", examplePhonetic: "Lata" },
  { char: "వ", translit: "va", category: "consonant", example: "వల", exampleMeaning: "Net", examplePhonetic: "Vala" },
  { char: "శ", translit: "sha", category: "consonant", example: "శంఖం", exampleMeaning: "Conch", examplePhonetic: "Shankham" },
  { char: "ష", translit: "sha", category: "consonant", example: "షట్కోణం", exampleMeaning: "Hexagon", examplePhonetic: "Shatkonam" },
  { char: "స", translit: "sa", category: "consonant", example: "సబ్బు", exampleMeaning: "Soap", examplePhonetic: "Sabbu" },
  { char: "హ", translit: "ha", category: "consonant", example: "హంస", exampleMeaning: "Swan", examplePhonetic: "Hamsa" },

  // NUMBERS (Ankelu)
  { char: "౧", translit: "okati (1)", category: "number", example: "ఒకటి", exampleMeaning: "One", examplePhonetic: "Okati" },
  { char: "౨", translit: "rendu (2)", category: "number", example: "రెండు", exampleMeaning: "Two", examplePhonetic: "Rendu" },
  { char: "౩", translit: "moodu (3)", category: "number", example: "మూడు", exampleMeaning: "Three", examplePhonetic: "Moodu" },
  { char: "౪", translit: "naalugu (4)", category: "number", example: "నాలుగు", exampleMeaning: "Four", examplePhonetic: "Naalugu" },
  { char: "౫", translit: "aidu (5)", category: "number", example: "ఐదు", exampleMeaning: "Five", examplePhonetic: "Aidu" }
];

// State Management
let currentCategory = 'all';
let currentSearchQuery = '';
let selectedLetter = TELUGU_LETTERS[0]; 
let masteredLetters = JSON.parse(localStorage.getItem('telugu_mastered') || '[]');
let totalXP = parseInt(localStorage.getItem('telugu_xp') || '0');

// Canvas Tracing Variables
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = '#f59e0b'; // Amber-500
let brushSize = 8;
let isGuideVisible = true;

// Quiz System Variables
let quizScore = 0;
let currentQuizQuestionIndex = 0;
let totalQuizQuestions = 5;
let activeQuizQuestions = [];
let currentQuizCorrectChar = null;
let viewMode = 'learn'; // 'learn' or 'quiz'

window.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderLettersGrid();
  loadActiveLetter(selectedLetter);
  updateStatsUI();
  
  // Default canvas drawing helper
  showToast("Tracing Tip: Touch or drag inside the pad to write the letters!", 4000);
});

// -----------------------------------------------------
// Grid and Filtering Engine
// -----------------------------------------------------
function renderLettersGrid() {
  const gridContainer = document.getElementById('letters-grid');
  gridContainer.innerHTML = '';

  // Filter list
  const filtered = TELUGU_LETTERS.filter(item => {
    const matchCat = (currentCategory === 'all' || item.category === currentCategory);
    const matchSearch = item.char.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                        item.translit.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                        item.example.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                        item.exampleMeaning.toLowerCase().includes(currentSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Update counter badge
  document.getElementById('letter-count-badge').textContent = filtered.length;

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <svg class="h-12 w-12 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-semibold">No matches found</p>
        <p class="text-xs mt-1">Try looking for another pronunciation sound!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isMastered = masteredLetters.includes(item.char);
    const isActive = selectedLetter && (selectedLetter.char === item.char);

    const card = document.createElement('button');
    card.className = `p-4 rounded-xl border text-center transition-all duration-150 relative group ${
      isActive ? 'active-letter-card border-amber-500' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900'
    }`;
    
    card.onclick = () => loadActiveLetter(item);

    card.innerHTML = `
      <!-- Mastery dot indicator -->
      ${isMastered ? '<span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></span>' : ''}
      
      <div class="text-3xl font-black mb-1 transition-transform group-hover:scale-110 duration-200 ${isActive ? 'text-amber-400' : 'text-white'}">
        ${item.char}
      </div>
      <div class="text-[11px] font-semibold text-slate-400 truncate tracking-wide">
        ${item.translit}
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

function filterCategory(cat) {
  currentCategory = cat;
  
  // Style active tab buttons
  const tabIds = ['all', 'vowels', 'consonants', 'numbers'];
  tabIds.forEach(id => {
    const btn = document.getElementById(`tab-${id}`);
    if (id === 'all' && cat === 'all' || 
        id === 'vowels' && cat === 'vowel' || 
        id === 'consonants' && cat === 'consonant' || 
        id === 'numbers' && cat === 'number') {
      btn.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-amber-500 text-slate-950 shadow-md font-medium";
    } else {
      btn.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-slate-800 text-slate-300 hover:bg-slate-700";
    }
  });

  const titleMap = {
    'all': 'All Letters',
    'vowel': 'Achulu (Vowels)',
    'consonant': 'Hallulu (Consonants)',
    'number': 'Ankelu (Numbers)'
  };
  document.getElementById('grid-title').firstElementChild.textContent = titleMap[cat];

  renderLettersGrid();
}

function handleSearch(val) {
  currentSearchQuery = val;
  renderLettersGrid();
}

// -----------------------------------------------------
// Study Desk Integration & Audio Speech
// -----------------------------------------------------
function loadActiveLetter(item) {
  selectedLetter = item;
  
  // Update UI texts
  document.getElementById('desk-char').textContent = item.char;
  document.getElementById('desk-translit').textContent = item.translit;
  document.getElementById('desk-category-badge').textContent = item.category.toUpperCase();
  document.getElementById('desk-example-word').textContent = item.example;
  document.getElementById('desk-example-meaning').textContent = item.exampleMeaning;
  document.getElementById('desk-example-phonetic').textContent = item.examplePhonetic;
  
  // Mastery checkbox update
  document.getElementById('master-checkbox').checked = masteredLetters.includes(item.char);

  // Set the canvas trace watermark helper
  const canvasHelper = document.getElementById('canvas-trace-helper');
  canvasHelper.textContent = item.char;

  // Re-highlight list in the grid UI
  renderLettersGrid();
  
  // Clear canvas drawing for new practice letter!
  clearCanvas();
}

function toggleMasterActiveLetter() {
  const isChecked = document.getElementById('master-checkbox').checked;
  if (isChecked) {
    if (!masteredLetters.includes(selectedLetter.char)) {
      masteredLetters.push(selectedLetter.char);
      totalXP += 10; // gain points!
      showToast(`Completed! You marked "${selectedLetter.char}" as mastered. +10 XP`, 3000);
    }
  } else {
    const index = masteredLetters.indexOf(selectedLetter.char);
    if (index > -1) {
      masteredLetters.splice(index, 1);
      totalXP = Math.max(0, totalXP - 10);
    }
  }

  localStorage.setItem('telugu_mastered', JSON.stringify(masteredLetters));
  localStorage.setItem('telugu_xp', totalXP.toString());
  
  updateStatsUI();
  renderLettersGrid();
}

function updateStatsUI() {
  document.getElementById('stats-mastered-count').textContent = `${masteredLetters.length} / ${TELUGU_LETTERS.length}`;
  document.getElementById('stats-quiz-score').textContent = `${totalXP} XP`;
}

function speakActiveLetter() {
  if (!('speechSynthesis' in window)) {
    showToast("Speech synthesis is not fully supported on this browser.", 3000);
    return;
  }

  // Cancel ongoing speak requests
  window.speechSynthesis.cancel();

  // Attempt Telugu locale pronunciation
  const textToSpeak = selectedLetter.char;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Try targeting Telugu India voice
  utterance.lang = 'te-IN';
  
  // Fallback to English transliteration narration on voice error or lack of local voice support
  utterance.onerror = (e) => {
    const backupUtterance = new SpeechSynthesisUtterance(selectedLetter.translit);
    backupUtterance.lang = 'en-US';
    window.speechSynthesis.speak(backupUtterance);
  };

  // Try calling voice lists dynamically
  const voices = window.speechSynthesis.getVoices();
  const teVoice = voices.find(voice => voice.lang === 'te-IN' || voice.lang.startsWith('te'));
  if (teVoice) {
    utterance.voice = teVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// -----------------------------------------------------
// Canvas Drawing & Tracing
// -----------------------------------------------------
function initCanvas() {
  canvas = document.getElementById('tracing-canvas');
  ctx = canvas.getContext('2d');

  // High-dpi sizing for crisp lines
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Styling line outputs
  ctx.strokeStyle = brushColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize;

  // Event Listeners for drawing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Mobile Touch Support
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }, { passive: true });

  canvas.addEventListener('touchend', stopDrawing, { passive: true });

  // Resize handler fallback
  window.addEventListener('resize', () => {
    const rect = canvas.getBoundingClientRect();
    // simple preservation mechanism for current trace, else clear
    canvas.width = rect.width;
    canvas.height = rect.height;
    resetCanvasContext();
  });
}

function resetCanvasContext() {
  ctx.strokeStyle = brushColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize;
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  [lastX, lastY] = [x, y];
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function updateBrushSize(val) {
  brushSize = val;
  if (ctx) {
    ctx.lineWidth = brushSize;
  }
}

function toggleTraceBackground() {
  isGuideVisible = !isGuideVisible;
  const guideEl = document.getElementById('canvas-trace-helper');
  const btn = document.getElementById('toggle-trace-bg');

  if (isGuideVisible) {
    guideEl.classList.remove('invisible');
    btn.textContent = "Guide: ON";
    btn.classList.add('text-emerald-400');
    btn.classList.remove('text-slate-400');
  } else {
    guideEl.classList.add('invisible');
    btn.textContent = "Guide: OFF";
    btn.classList.add('text-slate-400');
    btn.classList.remove('text-emerald-400');
  }
}

// -----------------------------------------------------
// Interactive Gamified Quiz Arena
// -----------------------------------------------------
function setViewMode(mode) {
  viewMode = mode;
  const learnTabBtn = document.getElementById('view-mode-learn');
  const quizTabBtn = document.getElementById('view-mode-quiz');
  
  const learnPanel = document.getElementById('learn-panel');
  const quizPanel = document.getElementById('quiz-panel');

  if (mode === 'quiz') {
    learnTabBtn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all text-slate-400 hover:text-white";
    quizTabBtn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-amber-500/20 text-amber-400 border border-amber-500/30";
    learnPanel.classList.add('hidden');
    quizPanel.classList.remove('hidden');
    startNewQuizRound();
  } else {
    quizTabBtn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all text-slate-400 hover:text-white";
    learnTabBtn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-amber-500/20 text-amber-400 border border-amber-500/30";
    quizPanel.classList.add('hidden');
    learnPanel.classList.remove('hidden');
  }
}

function startNewQuizRound() {
  quizScore = 0;
  currentQuizQuestionIndex = 0;
  
  // Generate 5 random questions from active pool
  activeQuizQuestions = [];
  const pool = [...TELUGU_LETTERS];
  
  // Shuffle temporary helper array
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  activeQuizQuestions = pool.slice(0, totalQuizQuestions);
  
  document.getElementById('quiz-box').classList.remove('hidden');
  document.getElementById('quiz-result-screen').classList.add('hidden');
  
  loadQuizQuestion();
}

function loadQuizQuestion() {
  const currentQuestion = activeQuizQuestions[currentQuizQuestionIndex];
  currentQuizCorrectChar = currentQuestion.char;

  // Set Question progress bar
  const progressPercent = (currentQuizQuestionIndex / totalQuizQuestions) * 100;
  document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;
  document.getElementById('quiz-q-num').textContent = currentQuizQuestionIndex + 1;

  // Decide randomized prompt types: 
  // Type 1: "What sound does this letter make?" (Show Telugu character, options are transliterations)
  // Type 2: "Match the character with vocabulary word: [Meaning]"
  const isWordQuestion = Math.random() > 0.5;
  
  if (isWordQuestion) {
    document.getElementById('quiz-prompt-type').textContent = `Which Telugu character is associated with the meaning "${currentQuestion.exampleMeaning}"?`;
    document.getElementById('quiz-question-char').textContent = `"${currentQuestion.examplePhonetic}"`;
  } else {
    document.getElementById('quiz-prompt-type').textContent = `Choose the correct pronunciation sound for this character:`;
    document.getElementById('quiz-question-char').textContent = currentQuestion.char;
  }

  // Prepare answer choices (1 Correct, 3 Distractors)
  let options = [{ char: currentQuestion.char, translit: currentQuestion.translit, example: currentQuestion.exampleMeaning, isCorrect: true }];
  
  // Fill with unique distractors
  const distractorsPool = TELUGU_LETTERS.filter(item => item.char !== currentQuestion.char);
  const shuffledDistractors = distractorsPool.sort(() => 0.5 - Math.random()).slice(0, 3);

  shuffledDistractors.forEach(distractor => {
    options.push({
      char: distractor.char,
      translit: distractor.translit,
      example: distractor.exampleMeaning,
      isCorrect: false
    });
  });

  // Shuffle options so correct is randomized
  options.sort(() => 0.5 - Math.random());

  // Render option choices
  const choicesContainer = document.getElementById('quiz-choices');
  choicesContainer.innerHTML = '';

  options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = "p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 hover:bg-slate-850 text-slate-100 font-bold transition-all duration-150 text-base text-left flex items-center justify-between group active:scale-[0.99]";
    
    // Label is based on type of question
    let displayLabel = isWordQuestion ? `${opt.char} (${opt.translit})` : `${opt.translit} (${opt.char})`;
    
    btn.innerHTML = `
      <span class="flex items-center gap-3">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 text-xs font-mono group-hover:bg-amber-500 group-hover:text-slate-950 font-bold">
          ${String.fromCharCode(65 + index)}
        </span>
        <span>${displayLabel}</span>
      </span>
      <span class="opacity-0 group-hover:opacity-100 text-amber-400 text-xs transition-opacity">Select &rarr;</span>
    `;
    
    btn.onclick = () => handleQuizAnswer(opt.isCorrect, btn);
    choicesContainer.appendChild(btn);
  });
}

function handleQuizAnswer(isCorrect, element) {
  // Disable further clicks momentarily
  const allButtons = document.getElementById('quiz-choices').querySelectorAll('button');
  allButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    quizScore++;
    element.classList.remove('border-slate-800');
    element.classList.add('border-emerald-500', 'bg-emerald-950/30');
    element.innerHTML += `<span class="text-emerald-400 text-sm font-bold">✓ Correct</span>`;
    playSimpleSynthSound(true);
  } else {
    element.classList.remove('border-slate-800');
    element.classList.add('border-red-500', 'bg-red-950/30');
    element.innerHTML += `<span class="text-red-400 text-sm font-bold">✗ Incorrect</span>`;
    
    // Highlight correct one
    playSimpleSynthSound(false);
  }

  // Move to next question after 1.5s delay
  setTimeout(() => {
    currentQuizQuestionIndex++;
    if (currentQuizQuestionIndex < totalQuizQuestions) {
      loadQuizQuestion();
    } else {
      // Show final scoreboard screen
      document.getElementById('quiz-progress-bar').style.width = `100%`;
      document.getElementById('quiz-box').classList.add('hidden');
      
      const scoreScreen = document.getElementById('quiz-result-screen');
      scoreScreen.classList.remove('hidden');
      
      document.getElementById('quiz-correct-count').textContent = quizScore;
      
      // Calculate XP rewards
      const gainedXP = quizScore * 15;
      totalXP += gainedXP;
      localStorage.setItem('telugu_xp', totalXP.toString());
      document.getElementById('xp-gained-badge').textContent = `+${gainedXP} XP Gained!`;
      
      updateStatsUI();
    }
  }, 1500);
}

function resetQuizScore() {
  if(confirm("Are you sure you want to reset your score progress?")) {
    totalXP = 0;
    masteredLetters = [];
    localStorage.setItem('telugu_xp', '0');
    localStorage.setItem('telugu_mastered', '[]');
    updateStatsUI();
    renderLettersGrid();
    showToast("Progress reset successfully.", 3000);
  }
}

// -----------------------------------------------------
// Sound Effects Synthesizer (Fallback to Web Audio API)
// -----------------------------------------------------
function playSimpleSynthSound(isSuccess) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (isSuccess) {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
      osc.frequency.setValueAtTime(147, audioCtx.currentTime + 0.15); // D3
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }
  } catch (e) {
    // browser policies might block audio until user interaction
  }
}

// -----------------------------------------------------
// Toasts / Utility helpers
// -----------------------------------------------------
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast-message');
  const text = document.getElementById('toast-text');
  
  text.textContent = msg;
  toast.classList.remove('hidden');
  
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  
  window.toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

function hideToast() {
  document.getElementById('toast-message').classList.add('hidden');
}