// Complete database of Telugu letters (Vowels/Achulu and Consonants/Hallulu) with phonetic names, matching pictures, and translations
const TELUGU_DATA = {
  achulu: [
    { letter: "అ", english: "A", type: "Vowel", word: "అమ్మ", translit: "Amma", meaning: "Mother", emoji: "👩" },
    { letter: "ఆ", english: "Aa", type: "Vowel", word: "ఆవు", translit: "Aavu", meaning: "Cow", emoji: "🐄" },
    { letter: "ఇ", english: "I", type: "Vowel", word: "ఇల్లు", translit: "Illu", meaning: "House", emoji: "🏠" },
    { letter: "ఈ", english: "Ee", type: "Vowel", word: "ఈగ", translit: "Eega", meaning: "Housefly", emoji: "🪰" },
    { letter: "ఉ", english: "U", type: "Vowel", word: "ఉడుత", translit: "Uduta", meaning: "Squirrel", emoji: "🐿️" },
    { letter: "ఊ", english: "Oo", type: "Vowel", word: "ఊయల", translit: "Ooyala", meaning: "Cradle", emoji: "🎡" },
    { letter: "ఋ", english: "Ru", type: "Vowel", word: "ఋషి", translit: "Rushi", meaning: "Sage", emoji: "🧘" },
    { letter: "ఎ", english: "E", type: "Vowel", word: "ఎలుక", translit: "Eluka", meaning: "Rat", emoji: "🐀" },
    { letter: "ఏ", english: "Ae", type: "Vowel", word: "ఏనుగు", translit: "Aenugu", meaning: "Elephant", emoji: "🐘" },
    { letter: "ఐ", english: "Ai", type: "Vowel", word: "ఐదు", translit: "Aidu", meaning: "Five", emoji: "5️⃣" },
    { letter: "ఒ", english: "O", type: "Vowel", word: "ఒంటె", translit: "Onte", meaning: "Camel", emoji: "🐪" },
    { letter: "ఓ", english: "Oe", type: "Vowel", word: "ఓడ", translit: "Oda", meaning: "Ship", emoji: "🚢" },
    { letter: "ఔ", english: "Au", type: "Vowel", word: "ఔషధం", translit: "Oushadham", meaning: "Medicine", emoji: "💊" },
    { letter: "అం", english: "Am", type: "Vowel", word: "అంబరం", translit: "Ambaram", meaning: "Sky", emoji: "🌌" },
    { letter: "అః", english: "Aha", type: "Vowel", word: "అంతఃపురం", translit: "Anthahpuram", meaning: "Palace", emoji: "🏰" }
  ],
  hallulu: [
    { letter: "క", english: "Ka", type: "Consonant", word: "కన్ను", translit: "Kannu", meaning: "Eye", emoji: "👁️" },
    { letter: "ఖ", english: "Kha", type: "Consonant", word: "ఖడ్గం", translit: "Khadgam", meaning: "Sword", emoji: "⚔️" },
    { letter: "గ", english: "Ga", type: "Consonant", word: "గడియారం", translit: "Gadiyaaram", meaning: "Clock", emoji: "⏰" },
    { letter: "ఘ", english: "Gha", type: "Consonant", word: "ఘటం", translit: "Ghatam", meaning: "Clay Pot", emoji: "🏺" },
    { letter: "చ", english: "Cha", type: "Consonant", word: "చందమామ", translit: "Chandamama", meaning: "Moon", emoji: "🌙" },
    { letter: "ఛ", english: "Chha", type: "Consonant", word: "ఛత్రి", translit: "Chhatri", meaning: "Umbrella", emoji: "⛱️" },
    { letter: "జ", english: "Ja", type: "Consonant", word: "జడ", translit: "Jada", meaning: "Hair Braid", emoji: "💇‍♀️" },
    { letter: "ట", english: "Ta", type: "Consonant", word: "టమోటా", translit: "Tomato", meaning: "Tomato", emoji: "🍅" },
    { letter: "డ", english: "Da", type: "Consonant", word: "డమరుకం", translit: "Damarukam", meaning: "Drum", emoji: "🥁" },
    { letter: "త", english: "Tha", type: "Consonant", word: "తలుపు", translit: "Talupu", meaning: "Door", emoji: "🚪" },
    { letter: "ద", english: "Dha", type: "Consonant", word: "ద్రాక్ష", translit: "Draaksha", meaning: "Grapes", emoji: "🍇" },
    { letter: "న", english: "Na", type: "Consonant", word: "నత్త", translit: "Natta", meaning: "Snail", emoji: "🐚" },
    { letter: "ప", english: "Pa", type: "Consonant", word: "పలక", translit: "Palaka", meaning: "Slate", emoji: "📝" },
    { letter: "బ", english: "Ba", type: "Consonant", word: "బంతి", translit: "Banthi", meaning: "Ball", emoji: "⚽" },
    { letter: "మ", english: "Ma", type: "Consonant", word: "మంచం", translit: "Mancham", meaning: "Bed", emoji: "🛏️" },
    { letter: "య", english: "Ya", type: "Consonant", word: "యంత్రం", translit: "Yanthram", meaning: "Machine", emoji: "⚙️" },
    { letter: "ర", english: "Ra", type: "Consonant", word: "రథం", translit: "Ratham", meaning: "Chariot", emoji: "🪵" },
    { letter: "ల", english: "La", type: "Consonant", word: "లడ్డు", translit: "Laddu", meaning: "Laddu Sweet", emoji: "🟡" },
    { letter: "వ", english: "Va", type: "Consonant", word: "వల", translit: "Vala", meaning: "Net", emoji: "🕸️" },
    { letter: "స", english: "Sa", type: "Consonant", word: "సబ్బు", translit: "Sabbu", meaning: "Soap", emoji: "🧼" },
    { letter: "హ", english: "Ha", type: "Consonant", word: "హంస", translit: "Hamsa", meaning: "Swan", emoji: "🦢" }
  ]
};

// Application State
let currentCategory = 'achulu';
let activeSelectedLetter = TELUGU_DATA.achulu[0];
let ttsAudioEnabled = true;
let ttsVoice = null;
let searchFilter = "";

// Drawing Canvas Setup Variables
const canvas = document.getElementById('trace-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = '#fbbf24';
let brushThickness = 7;

// Quiz State
let currentQuizQuestion = null;
let quizScore = 0;
let quizStreak = 0;
let quizOptions = [];

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  initializeCanvas();
  loadVoices();
  renderLettersGrid();
  updateDetailCard(activeSelectedLetter);
  setupEventListeners();
  
  // Handle window resizing for Canvas
  window.addEventListener('resize', handleCanvasResize);
});

// Find & Configure Telugu / Indian English fallback Speech Synthesis
function loadVoices() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      // Attempt to search for Telugu voice
      const matchedVoice = voices.find(v => v.lang.includes('te-IN') || v.lang.includes('te_IN'));
      const label = document.getElementById('active-voice-label');
      if (matchedVoice) {
        ttsVoice = matchedVoice;
        label.textContent = matchedVoice.name + ' (Telugu)';
      } else {
        // Fallback Indian English/Standard Voice
        const backupVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en'));
        ttsVoice = backupVoice || null;
        label.textContent = backupVoice ? backupVoice.name + ' (Fallback)' : 'System Default';
      }
    };
  } else {
    document.getElementById('active-voice-label').textContent = 'Not supported';
    document.getElementById('btn-toggle-tts').classList.add('opacity-50', 'pointer-events-none');
  }
}

// Render letters to UI
function renderLettersGrid() {
  const gridContainer = document.getElementById('letters-grid');
  gridContainer.innerHTML = '';

  const lettersArray = TELUGU_DATA[currentCategory];
  const filtered = lettersArray.filter(item => {
    const matchLetter = item.letter.includes(searchFilter);
    const matchEnglish = item.english.toLowerCase().includes(searchFilter.toLowerCase());
    const matchWord = item.word.includes(searchFilter) || item.meaning.toLowerCase().includes(searchFilter.toLowerCase());
    return matchLetter || matchEnglish || matchWord;
  });

  document.getElementById('letter-count-badge').textContent = `${filtered.length} Letters`;

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <p class="text-lg font-semibold">No letters found matching "${searchFilter}"</p>
        <p class="text-xs mt-1">Try searching another letter or word translation.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('button');
    const isActive = activeSelectedLetter.letter === item.letter;
    card.className = `p-4 rounded-xl border flex flex-col items-center justify-between text-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
      isActive 
        ? 'letter-card-active border-amber-500 bg-slate-900' 
        : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
    }`;
    
    card.innerHTML = `
      <span class="text-xs text-slate-500 font-mono tracking-wider font-bold mb-1">${item.english}</span>
      <span class="text-3xl font-bold block mb-2 text-slate-100">${item.letter}</span>
      <div class="flex items-center gap-1.5 mt-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-850 w-full justify-center">
        <span class="text-base">${item.emoji}</span>
        <span class="text-[10px] truncate text-slate-300 font-semibold">${item.translit}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      activeSelectedLetter = item;
      renderLettersGrid();
      updateDetailCard(item);
    });
    
    gridContainer.appendChild(card);
  });
}

// Update detailed selected card panel and change outline tracing letter
function updateDetailCard(item) {
  document.getElementById('detail-letter-telugu').textContent = item.letter;
  document.getElementById('detail-letter-english').textContent = item.english;
  document.getElementById('detail-type-badge').textContent = item.type;
  document.getElementById('detail-word-emoji').textContent = item.emoji;
  document.getElementById('detail-word-telugu').textContent = item.word;
  document.getElementById('detail-word-translit').textContent = item.translit;
  document.getElementById('detail-word-meaning').textContent = item.meaning;
  
  // Update tracing assistant guide background letter
  document.getElementById('canvas-guide-letter').textContent = item.letter;

  // Play Speech Audio automatically on card switch if active
  triggerSpeak(item);
}

// Canvas Tracing Engine
function initializeCanvas() {
  handleCanvasResize();
  
  // Pointer Listeners for Writing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    drawStroke(touch.clientX - rect.left, touch.clientY - rect.top);
  }, { passive: false });

  canvas.addEventListener('touchend', stopDrawing);
}

function handleCanvasResize() {
  // Match canvas physical pixels with display layout bounding dimension
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  clearCanvasDrawing();
}

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  drawStroke(e.offsetX, e.offsetY);
}

function drawStroke(x, y) {
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushThickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvasDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Text to Speech Voice Synthesizer
function triggerSpeak(item) {
  if (!ttsAudioEnabled || !('speechSynthesis' in window)) return;
  
  // Cancel active sounds
  window.speechSynthesis.cancel();

  // Build speech queue: Speak Letter, then phonetics, then corresponding word
  const utteranceText = `${item.letter}. ${item.translit}. for ${item.meaning}.`;
  const utterance = new SpeechSynthesisUtterance(utteranceText);
  
  if (ttsVoice) {
    utterance.voice = ttsVoice;
  }
  utterance.rate = 0.85; // slightly slower for instructional clarity
  utterance.pitch = 1.05;
  
  window.speechSynthesis.speak(utterance);
}

// Setup all UI Event Handlers
function setupEventListeners() {
  // Vowels tab trigger
  document.getElementById('tab-achulu').addEventListener('click', (e) => {
    switchCategory('achulu', e.currentTarget);
  });

  // Consonants tab trigger
  document.getElementById('tab-hallulu').addEventListener('click', (e) => {
    switchCategory('hallulu', e.currentTarget);
  });

  // Interactive Quiz Game trigger
  document.getElementById('tab-quiz').addEventListener('click', () => {
    openQuizChallenge();
  });

  document.getElementById('btn-close-quiz').addEventListener('click', () => {
    document.getElementById('quiz-modal-container').classList.add('hidden');
  });

  // Search Filter input
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchFilter = e.target.value;
    renderLettersGrid();
  });

  // Audio toggle trigger
  document.getElementById('btn-toggle-tts').addEventListener('click', () => {
    ttsAudioEnabled = !ttsAudioEnabled;
    const indicator = document.getElementById('tts-indicator');
    if (ttsAudioEnabled) {
      indicator.className = "w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse";
    } else {
      indicator.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
      window.speechSynthesis.cancel();
    }
  });

  // Speak main panel sound trigger
  document.getElementById('btn-speak-main').addEventListener('click', () => {
    triggerSpeak(activeSelectedLetter);
  });

  // Favorite Bookmark dummy indicator interaction
  const favBtn = document.getElementById('btn-fav');
  favBtn.addEventListener('click', () => {
    favBtn.classList.toggle('bg-rose-650');
    favBtn.classList.toggle('scale-110');
    // Create a mini notification/visual log in canvas area instead of alerts
    const toast = document.createElement('div');
    toast.className = "absolute bottom-3 left-3 bg-rose-500 text-slate-950 font-bold text-xs py-1.5 px-3 rounded shadow-lg transition-opacity duration-300 z-30";
    toast.textContent = `Saved ${activeSelectedLetter.letter} to practice list!`;
    canvas.parentElement.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });

  // Tracing Canvas Actions
  document.getElementById('btn-canvas-clear').addEventListener('click', clearCanvasDrawing);
  
  // Tracing brush color swatches
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      swatches.forEach(s => s.classList.remove('ring-2', 'ring-amber-400/50', 'scale-110'));
      e.currentTarget.classList.add('ring-2', 'ring-amber-400/50', 'scale-110');
      brushColor = e.currentTarget.getAttribute('data-color');
    });
  });

  // Brush thickness slider
  document.getElementById('brush-size').addEventListener('input', (e) => {
    brushThickness = parseInt(e.target.value, 10);
  });
}

// Switch Category between Vowels & Consonants
function switchCategory(catKey, buttonElement) {
  currentCategory = catKey;
  
  // Update tab navigation button styles
  const buttons = [document.getElementById('tab-achulu'), document.getElementById('tab-hallulu')];
  buttons.forEach(btn => {
    btn.className = "flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white";
  });
  buttonElement.className = "flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md transform scale-100";

  // Update grid header titles
  const titleMap = {
    achulu: { title: "అచ్చులు (Vowels)", count: "15 Letters" },
    hallulu: { title: "హల్లులు (Consonants)", count: "21 Letters" }
  };
  document.getElementById('grid-title').textContent = titleMap[catKey].title;
  document.getElementById('letter-count-badge').textContent = titleMap[catKey].count;

  // Reset selected letter to first of chosen group
  activeSelectedLetter = TELUGU_DATA[catKey][0];
  renderLettersGrid();
  updateDetailCard(activeSelectedLetter);
}

// Game Engine logic
function openQuizChallenge() {
  const modal = document.getElementById('quiz-modal-container');
  modal.classList.remove('hidden');
  generateNewQuizQuestion();
}

function generateNewQuizQuestion() {
  // Mix vowels and consonants
  const allLetters = [...TELUGU_DATA.achulu, ...TELUGU_DATA.hallulu];
  
  // Select one target letter
  const target = allLetters[Math.floor(Math.random() * allLetters.length)];
  currentQuizQuestion = target;

  // Display information
  document.getElementById('quiz-pic-container').textContent = target.emoji;
  document.getElementById('quiz-english-word').textContent = `${target.meaning} (${target.translit})`;
  document.getElementById('quiz-telugu-word').textContent = target.word;

  // Generate options (1 correct + 3 random distracting candidates)
  const optionsPool = allLetters.filter(item => item.letter !== target.letter);
  const shuffledDistractors = optionsPool.sort(() => 0.5 - Math.random()).slice(0, 3);
  const finalOptions = [target, ...shuffledDistractors].sort(() => 0.5 - Math.random());

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';
  
  const banner = document.getElementById('quiz-feedback-banner');
  banner.classList.add('hidden');

  finalOptions.forEach(opt => {
    const optBtn = document.createElement('button');
    optBtn.className = "bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 font-bold py-3 px-4 rounded-xl border border-slate-700 hover:border-amber-500/50 text-2xl transition-all";
    optBtn.textContent = opt.letter;
    optBtn.addEventListener('click', () => handleQuizAnswer(opt.letter, target.letter, optBtn));
    optionsContainer.appendChild(optBtn);
  });
}

function handleQuizAnswer(selected, correct, selectedBtn) {
  const banner = document.getElementById('quiz-feedback-banner');
  const btns = document.getElementById('quiz-options-container').getElementsByTagName('button');

  // Disable further clicks momentarily
  for (let b of btns) {
    b.disabled = true;
    if (b.textContent === correct) {
      b.className = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold py-3 px-4 rounded-xl border text-2xl";
    }
  }

  if (selected === correct) {
    quizScore += 10;
    quizStreak += 1;
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-streak').textContent = quizStreak;
    
    banner.className = "mt-4 p-3 rounded-lg text-sm text-center font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block animate-bounce-slow";
    banner.innerHTML = `🎉 Correct! <strong>${correct}</strong> is the starting letter!`;
  } else {
    quizStreak = 0;
    document.getElementById('quiz-streak').textContent = 0;
    
    selectedBtn.className = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold py-3 px-4 rounded-xl border text-2xl";
    banner.className = "mt-4 p-3 rounded-lg text-sm text-center font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 block";
    banner.innerHTML = `❌ Incorrect. The starting letter is actually <strong>${correct}</strong>.`;
  }

  // Speak response context
  if (ttsAudioEnabled) {
    const utterance = new SpeechSynthesisUtterance(selected === correct ? 'Excellent, that is correct!' : 'Try again.');
    if (ttsVoice) utterance.voice = ttsVoice;
    window.speechSynthesis.speak(utterance);
  }

  // Next question after brief pause
  setTimeout(() => {
    generateNewQuizQuestion();
  }, 2200);
}