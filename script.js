/**
 * Dynamic State & Word Library Management
 * Includes native Hindi voice detection, flashcard flips, custom stats trackers,
 * interactive word banking with search/sort features, and an adaptive Quiz arena.
 */

// Default baseline dictionary
const INITIAL_WORDS = [
  { id: "w1", hindi: "नमस्ते", translit: "Namaste", english: "Hello / Greetings", category: "Common Words", mastered: false, usage: "Namaste! Aap kaise hain?" },
  { id: "w2", hindi: "धन्यवाद", translit: "Dhanyavaad", english: "Thank you", category: "Common Words", mastered: false, usage: "Helpful gesture: Dhanyavaad, mere dost!" },
  { id: "w3", hindi: "प्यार", translit: "Pyaar", english: "Love", category: "Common Words", mastered: false, usage: "Pyaar ek sundar bhavna hai." },
  { id: "w4", hindi: "मित्र", translit: "Mitra", english: "Friend", category: "Common Words", mastered: false, usage: "Mera mitra hamesha madad karta hai." },
  { id: "w5", hindi: "खुशी", translit: "Khushi", english: "Happiness", category: "Common Words", mastered: false, usage: "Aapko jeevan me dher saari khushi mile." },
  { id: "w6", hindi: "सूरज", translit: "Sooraj", english: "Sun", category: "Common Words", mastered: false, usage: "Sooraj subah nikalta hai." },
  { id: "w7", hindi: "किताब", translit: "Kitaab", english: "Book", category: "Common Words", mastered: false, usage: "Mujhe nayi kitaab padhna pasand hai." },
  { id: "w8", hindi: "नीला", translit: "Neela", english: "Blue", category: "Colors", mastered: false, usage: "Aakash ka rang neela hai." },
  { id: "w9", hindi: "लाल", translit: "Laal", english: "Red", category: "Colors", mastered: false, usage: "Seb ka rang laal hota hai." },
  { id: "w10", hindi: "एक", translit: "Ek", english: "One", category: "Numbers", mastered: false, usage: "Mere paas ek hi kalam hai." },
  { id: "w11", hindi: "पाँच", translit: "Paanch", english: "Five", category: "Numbers", mastered: false, usage: "Hath me paanch ungliyan hoti hain." },
  { id: "w12", hindi: "हाथी", translit: "Haathi", english: "Elephant", category: "Animals", mastered: false, usage: "Haathi sabse bada thal jantu hai." },
  { id: "w13", hindi: "बिल्ली", translit: "Billi", english: "Cat", category: "Animals", mastered: false, usage: "Mera billi dhoodh peeti hai." },
  { id: "w14", hindi: "आम", translit: "Aam", english: "Mango", category: "Food & Fruits", mastered: false, usage: "Aam ko phalo ka raja kaha jata hai." }
];

// State Store
let state = {
  words: [],
  currentCategory: 'all', 
  currentWordIndex: 0,
  quiz: {
    isActive: false,
    questions: [],
    currentIndex: 0,
    score: 0,
    totalPointsGained: 0,
    timerSecs: 15,
    highScore: 0
  },
  streak: 1
};

// Load from localStorage or set defaults
function loadState() {
  const cachedWords = localStorage.getItem('shabda_vocab_words');
  const cachedStreak = localStorage.getItem('shabda_streak');
  const cachedHighScore = localStorage.getItem('shabda_high_score');
  
  if (cachedWords) {
    try {
      state.words = JSON.parse(cachedWords);
    } catch (e) {
      state.words = [...INITIAL_WORDS];
    }
  } else {
    state.words = [...INITIAL_WORDS];
  }

  if (cachedStreak) {
    state.streak = parseInt(cachedStreak, 10) || 1;
  }

  if (cachedHighScore) {
    state.quiz.highScore = parseInt(cachedHighScore, 10) || 0;
  }
}

function saveStateToStorage() {
  localStorage.setItem('shabda_vocab_words', JSON.stringify(state.words));
  localStorage.setItem('shabda_streak', state.streak.toString());
  localStorage.setItem('shabda_high_score', state.quiz.highScore.toString());
}

// Text To Speech Native Voice Loader
function setupSpeechEngine() {
  const voiceSelect = document.getElementById('voice-select');
  if ('speechSynthesis' in window) {
    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // clear default option first
      voiceSelect.innerHTML = '<option value="default">System Standard Voice</option>';
      
      // filter or sort to present Hindi voices first, then general English/others
      const hiVoices = voices.filter(v => v.lang.startsWith('hi') || v.lang.includes('IN'));
      const otherVoices = voices.filter(v => !v.lang.startsWith('hi') && !v.lang.includes('IN'));
      
      hiVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `🇮🇳 ${voice.name} (${voice.lang})`;
        option.selected = true; // Auto pick if native hindi found
        voiceSelect.appendChild(option);
      });

      otherVoices.slice(0, 10).forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
      });
    };

    populateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  } else {
    voiceSelect.innerHTML = '<option value="unsupported">Not supported by browser</option>';
    voiceSelect.disabled = true;
  }
}

// Pronunciation Speaker
function speakWord(hindiText) {
  if ('speechSynthesis' in window) {
    // Cancel any active speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(hindiText);
    const voiceSelect = document.getElementById('voice-select');
    const selectedVoiceName = voiceSelect.value;
    
    if (selectedVoiceName !== 'default' && selectedVoiceName !== 'unsupported') {
      const voices = window.speechSynthesis.getVoices();
      const chosenVoice = voices.find(v => v.name === selectedVoiceName);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    } else {
      // fallback language set to Hindi India
      utterance.lang = 'hi-IN';
    }
    
    utterance.rate = 0.85; // Slightly slower for crisp pronunciation practice
    window.speechSynthesis.speak(utterance);
  } else {
    showToast("Audio synthesis not supported by your current browser.", "⚠️");
  }
}

// UI Toast Alerts
function showToast(message, emoji = '🚀') {
  const toast = document.getElementById('toast-message');
  document.getElementById('toast-emoji').innerText = emoji;
  document.getElementById('toast-text').innerText = message;
  
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 3000);
}

// Filtered words pool based on current dynamic category sidebar selection
function getFilteredWords() {
  if (state.currentCategory === 'all') {
    return state.words;
  }
  return state.words.filter(w => w.category === state.currentCategory);
}

// Extract all unique categories
function getUniqueCategories() {
  const cats = new Set(state.words.map(w => w.category));
  return Array.from(cats);
}

// Redraw category side menu
function renderCategoriesMenu() {
  const container = document.getElementById('categories-container');
  const badgeCount = document.getElementById('category-badge-count');
  const uniqueCats = getUniqueCategories();
  
  badgeCount.textContent = uniqueCats.length;
  
  let html = `
    <button data-cat="all" class="cat-pill w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${state.currentCategory === 'all' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}">
      <span class="flex items-center gap-2">🌟 Show All</span>
      <span class="bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">${state.words.length}</span>
    </button>
  `;

  uniqueCats.forEach(cat => {
    const count = state.words.filter(w => w.category === cat).length;
    const isActive = state.currentCategory === cat;
    html += `
      <button data-cat="${cat}" class="cat-pill w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}">
        <span>📂 ${cat}</span>
        <span class="bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;

  // Attach listeners to newly generated side menu options
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedCat = btn.getAttribute('data-cat');
      state.currentCategory = selectedCat;
      state.currentWordIndex = 0;
      
      renderCategoriesMenu();
      updateFlashcardView();
      showToast(`Switched filter to "${selectedCat}"`, "📂");
    });
  });
}

// Statistics updates
function updateStatsDashboard() {
  const masteredCount = state.words.filter(w => w.mastered).length;
  const totalCount = state.words.length;
  
  document.getElementById('stat-mastered-count').textContent = masteredCount;
  document.getElementById('stat-streak').textContent = state.streak;
  
  document.getElementById('vocab-progress-label').textContent = `${masteredCount} of ${totalCount} mastered`;
  
  const percent = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
  document.getElementById('vocab-progress-bar').style.width = `${percent}%`;
  
  // highscore display
  document.getElementById('quiz-high-score').textContent = `${state.quiz.highScore} pts`;
}

// Update single flashcard elements
function updateFlashcardView() {
  const filtered = getFilteredWords();
  const cardInner = document.getElementById('flashcard-inner');
  
  // Always unflip to front when loading a new card
  cardInner.classList.remove('card-flipped');

  if (filtered.length === 0) {
    document.getElementById('card-hindi-word').textContent = "कोई शब्द नहीं";
    document.getElementById('card-transliteration').textContent = "No words in this category";
    document.getElementById('card-english-translation').textContent = "Use the word bank to add a card!";
    document.getElementById('card-usage').textContent = "n/a";
    document.getElementById('card-badge-category').textContent = "Empty";
    document.getElementById('card-index-indicator').textContent = "0 of 0";
    return;
  }

  // Clamp index
  if (state.currentWordIndex >= filtered.length) {
    state.currentWordIndex = 0;
  }
  if (state.currentWordIndex < 0) {
    state.currentWordIndex = filtered.length - 1;
  }

  const word = filtered[state.currentWordIndex];
  
  document.getElementById('card-hindi-word').textContent = word.hindi;
  document.getElementById('card-transliteration').textContent = word.translit;
  document.getElementById('card-english-translation').textContent = word.english;
  document.getElementById('card-usage').textContent = word.usage ? `"${word.usage}"` : "No example custom sentence available.";
  document.getElementById('card-badge-category').textContent = word.category;
  document.getElementById('card-index-indicator').textContent = `Card ${state.currentWordIndex + 1} of ${filtered.length}`;

  // Check if easy/mastered to change UI state
  const btnEasy = document.getElementById('btn-mark-easy');
  if (word.mastered) {
    btnEasy.innerHTML = `🌟 Mastered! (Click to Undo)`;
    btnEasy.className = "flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md";
  } else {
    btnEasy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Easy! Mastered`;
    btnEasy.className = "flex-1 bg-emerald-600/95 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md";
  }
}

// Navigation Switches between panels (Tabs)
function activateTab(tabId) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.id === tabId) {
      btn.className = "tab-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-white text-orange-600 shadow-sm";
    } else {
      btn.className = "tab-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900";
    }
  });

  // Hide all main section tags
  document.getElementById('section-flashcards').classList.add('hidden');
  document.getElementById('section-quiz').classList.add('hidden');
  document.getElementById('section-dictionary').classList.add('hidden');

  // Show specific section mapped
  if (tabId === 'tab-flashcards') {
    document.getElementById('section-flashcards').classList.remove('hidden');
  } else if (tabId === 'tab-quiz') {
    document.getElementById('section-quiz').classList.remove('hidden');
    // Stop running quiz if switching away and coming back, to let user start cleanly
  } else if (tabId === 'tab-dictionary') {
    document.getElementById('section-dictionary').classList.remove('hidden');
    renderDictionaryTable();
    populateDictionaryDropdowns();
  }
}

// --- QUIZ GAME LOGIC STATE MACHINE ---
function initiateQuiz(size) {
  const pool = [...state.words];
  if (pool.length < 4) {
    showToast("Add at least 4 Hindi words in vocabulary database to play standard Quiz!", "⚠️");
    return;
  }

  // Shuffle words
  const shuffled = pool.sort(() => 0.5 - Math.random());
  const selectedQuizSize = Math.min(size, shuffled.length);
  const questions = shuffled.slice(0, selectedQuizSize);

  state.quiz.isActive = true;
  state.quiz.questions = questions;
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.totalPointsGained = 0;

  document.getElementById('quiz-setup-panel').classList.add('hidden');
  document.getElementById('quiz-finished-panel').classList.add('hidden');
  document.getElementById('quiz-play-panel').classList.remove('hidden');
  document.getElementById('quiz-progress-header').classList.remove('hidden');

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const currentQuestionIndex = state.quiz.currentIndex;
  const totalQuestions = state.quiz.questions.length;

  // Setup progress info
  document.getElementById('quiz-question-index').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  document.getElementById('quiz-current-points').textContent = state.quiz.score;

  // Retrieve targets
  const correctWord = state.quiz.questions[currentQuestionIndex];
  document.getElementById('quiz-question-hindi').textContent = correctWord.hindi;
  document.getElementById('quiz-question-translit').textContent = correctWord.translit;

  // Clear/hide feedback alert
  const feedback = document.getElementById('quiz-feedback');
  feedback.className = "p-4 rounded-xl text-sm font-semibold text-center hidden transition-all duration-300";
  feedback.textContent = "";

  // Setup multiple choices (4 options)
  let options = [correctWord.english];
  
  // Populate random incorrect choices
  const incorrectPool = state.words.filter(w => w.id !== correctWord.id);
  const shuffledPool = incorrectPool.sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < Math.min(3, shuffledPool.length); i++) {
    options.push(shuffledPool[i].english);
  }

  // Ensure distinct choices
  options = Array.from(new Set(options));
  while (options.length < 4) {
    options.push("Alternate definition " + Math.floor(Math.random() * 100));
  }

  // Randomize positions
  options.sort(() => 0.5 - Math.random());

  // Render Options HTML
  const container = document.getElementById('quiz-options-container');
  container.innerHTML = "";
  
  options.forEach(optionText => {
    const btn = document.createElement('button');
    btn.className = "quiz-option-btn w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 bg-white font-medium text-slate-700 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500";
    btn.textContent = optionText;
    btn.addEventListener('click', () => selectQuizAnswer(btn, optionText, correctWord.english));
    container.appendChild(btn);
  });

  // Disable next button until option selected
  document.getElementById('btn-next-quiz-question').disabled = true;
}

function selectQuizAnswer(selectedButton, optionSelected, correctEnglish) {
  // Turn off clicks for other options in current question
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctEnglish) {
      btn.className = "quiz-option-btn w-full text-left p-4 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-800 font-bold text-sm transition-all";
    }
  });

  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.remove('hidden');

  if (optionSelected === correctEnglish) {
    state.quiz.score += 100;
    state.quiz.totalPointsGained += 1;
    feedback.textContent = "✨ Correct! Well done +100 XP!";
    feedback.className = "p-4 rounded-xl text-sm font-bold text-center text-emerald-700 bg-emerald-50 border border-emerald-100 transition-all duration-300";
    selectedButton.className = "quiz-option-btn w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-100 text-emerald-900 font-black text-sm transition-all";
    
    // Auto speak the word as correction reinforcement
    const targetWord = state.quiz.questions[state.quiz.currentIndex].hindi;
    speakWord(targetWord);
  } else {
    feedback.textContent = `❌ Incorrect! The correct answer is "${correctEnglish}"`;
    feedback.className = "p-4 rounded-xl text-sm font-bold text-center text-red-700 bg-red-50 border border-red-100 transition-all duration-300";
    selectedButton.className = "quiz-option-btn w-full text-left p-4 rounded-xl border-2 border-red-500 bg-red-100 text-red-900 font-black text-sm transition-all";
  }

  document.getElementById('quiz-current-points').textContent = state.quiz.score;
  document.getElementById('btn-next-quiz-question').disabled = false;
}

function advanceQuiz() {
  state.quiz.currentIndex++;
  if (state.quiz.currentIndex < state.quiz.questions.length) {
    renderQuizQuestion();
  } else {
    finishQuizGame();
  }
}

function finishQuizGame() {
  document.getElementById('quiz-play-panel').classList.add('hidden');
  document.getElementById('quiz-progress-header').classList.add('hidden');
  document.getElementById('quiz-finished-panel').classList.remove('hidden');

  const total = state.quiz.questions.length;
  document.getElementById('quiz-final-score').textContent = `${state.quiz.totalPointsGained}/${total}`;
  document.getElementById('quiz-gained-points').textContent = `+${state.quiz.score}`;

  // If streak multiplier
  state.streak += 1;

  // Check highscore
  if (state.quiz.score > state.quiz.highScore) {
    state.quiz.highScore = state.quiz.score;
    showToast("New High Score Reached! 🎉", "🏆");
  }

  saveStateToStorage();
  updateStatsDashboard();
}

// --- WORD BANK & DICTIONARY LOGIC ---
function populateDictionaryDropdowns() {
  const filterSelect = document.getElementById('dictionary-category-filter');
  const uniqueCats = getUniqueCategories();
  
  // Preserve current value if possible
  const currentVal = filterSelect.value;
  
  filterSelect.innerHTML = '<option value="all">All Categories</option>';
  uniqueCats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });

  filterSelect.value = currentVal;
}

function renderDictionaryTable() {
  const tbody = document.getElementById('dictionary-table-body');
  const emptyState = document.getElementById('dictionary-empty-state');
  const searchQuery = document.getElementById('dictionary-search-input').value.toLowerCase().trim();
  const selectedCategory = document.getElementById('dictionary-category-filter').value;
  const selectedSort = document.getElementById('dictionary-sort-filter').value;

  // Filter
  let filtered = state.words.filter(w => {
    const matchesSearch = w.hindi.toLowerCase().includes(searchQuery) ||
                          w.translit.toLowerCase().includes(searchQuery) ||
                          w.english.toLowerCase().includes(searchQuery) ||
                          (w.usage && w.usage.toLowerCase().includes(searchQuery));
    
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort
  if (selectedSort === 'hindi-asc') {
    filtered.sort((a, b) => a.hindi.localeCompare(b.hindi, 'hi'));
  } else if (selectedSort === 'english-asc') {
    filtered.sort((a, b) => a.english.localeCompare(b.english));
  } else {
    // custom / recently added is natural state reverse
    filtered = [...filtered].reverse();
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  tbody.innerHTML = filtered.map(w => {
    return `
      <tr class="hover:bg-slate-50 transition-colors group">
        <td class="px-6 py-4 whitespace-nowrap text-base font-extrabold text-slate-900 font-devanagari">
          ${w.hindi}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 italic">
          ${w.translit}
        </td>
        <td class="px-6 py-4 text-sm text-slate-700">
          <span class="font-medium">${w.english}</span>
          <p class="text-[11px] text-slate-400 mt-0.5">${w.usage || ''}</p>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-xs">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
            ${w.category}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-xs">
          <button onclick="toggleMasteredStatus('${w.id}')" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${w.mastered ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}">
            <span>${w.mastered ? '🌟 Mastered' : '⏳ Practice'}</span>
          </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="speakWord('${w.hindi}')" class="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Pronounce">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>
            <button onclick="deleteWord('${w.id}')" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Word">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Toggle mastery
window.toggleMasteredStatus = function(wordId) {
  const word = state.words.find(w => w.id === wordId);
  if (word) {
    word.mastered = !word.mastered;
    saveStateToStorage();
    updateStatsDashboard();
    renderDictionaryTable();
    updateFlashcardView();
    showToast(`Updated progress for "${word.translit}"!`, "📈");
  }
};

// Delete single word
window.deleteWord = function(wordId) {
  const target = state.words.find(w => w.id === wordId);
  if (!target) return;
  
  if (confirm(`Are you sure you want to delete "${target.hindi}" (${target.english})?`)) {
    state.words = state.words.filter(w => w.id !== wordId);
    saveStateToStorage();
    updateStatsDashboard();
    renderCategoriesMenu();
    renderDictionaryTable();
    updateFlashcardView();
    showToast(`Deleted "${target.translit}"`, "🗑️");
  }
};

// Trigger speech utility externally
window.speakWord = function(hindiText) {
  speakWord(hindiText);
};

// --- EVENT LISTENERS & INITS ---
function setupEventListeners() {
  // Tab Switching
  document.getElementById('tab-flashcards').addEventListener('click', () => activateTab('tab-flashcards'));
  document.getElementById('tab-quiz').addEventListener('click', () => activateTab('tab-quiz'));
  document.getElementById('tab-dictionary').addEventListener('click', () => activateTab('tab-dictionary'));

  // Flashcard Actions
  const card = document.getElementById('flashcard');
  const cardInner = document.getElementById('flashcard-inner');
  
  const flipCard = () => {
    cardInner.classList.toggle('card-flipped');
  };
  
  // Flip on click
  card.addEventListener('click', (e) => {
    // Avoid flip trigger if audio button, easy or needs practice button is clicked
    if (e.target.closest('#card-audio-btn') || e.target.closest('#btn-mark-easy') || e.target.closest('#btn-mark-hard')) {
      return;
    }
    flipCard();
  });

  document.getElementById('btn-flip-trigger').addEventListener('click', flipCard);

  // Audio cue inside flashcard front
  document.getElementById('card-audio-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const filtered = getFilteredWords();
    if (filtered.length > 0) {
      speakWord(filtered[state.currentWordIndex].hindi);
    }
  });

  // Previous & Next Card Controls
  document.getElementById('btn-prev').addEventListener('click', () => {
    state.currentWordIndex--;
    updateFlashcardView();
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    state.currentWordIndex++;
    updateFlashcardView();
  });

  // Easy / Hard card rating buttons inside back
  document.getElementById('btn-mark-easy').addEventListener('click', (e) => {
    e.stopPropagation();
    const filtered = getFilteredWords();
    if (filtered.length > 0) {
      const word = filtered[state.currentWordIndex];
      word.mastered = !word.mastered; // Toggle mastery state
      saveStateToStorage();
      updateStatsDashboard();
      updateFlashcardView();
      showToast(word.mastered ? "Word marked as Mastered! 🎉" : "Word removed from Mastered status.", "⭐");
    }
  });

  document.getElementById('btn-mark-hard').addEventListener('click', (e) => {
    e.stopPropagation();
    const filtered = getFilteredWords();
    if (filtered.length > 0) {
      const word = filtered[state.currentWordIndex];
      word.mastered = false;
      saveStateToStorage();
      updateStatsDashboard();
      updateFlashcardView();
      showToast("Kept in daily practice rotation!", "📚");
      // Auto proceed to next card for flow
      setTimeout(() => {
        state.currentWordIndex++;
        updateFlashcardView();
      }, 800);
    }
  });

  // Reset all mastery status helper
  document.getElementById('btn-reset-mastery').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all vocabulary mastery? This starts all words as 'Needs Practice'.")) {
      state.words.forEach(w => w.mastered = false);
      saveStateToStorage();
      updateStatsDashboard();
      updateFlashcardView();
      showToast("All word mastery status cleared!", "🔄");
    }
  });

  // Keyboard hotkey listeners
  document.addEventListener('keydown', (e) => {
    // Only capture keys if not actively typing inside input fields
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
      return;
    }

    const isFlashcardsVisible = !document.getElementById('section-flashcards').classList.contains('hidden');
    if (!isFlashcardsVisible) return;

    if (e.code === 'Space') {
      e.preventDefault();
      flipCard();
    } else if (e.code === 'ArrowLeft') {
      state.currentWordIndex--;
      updateFlashcardView();
    } else if (e.code === 'ArrowRight') {
      state.currentWordIndex++;
      updateFlashcardView();
    }
  });

  // --- QUIZ ACTIONS ---
  document.getElementById('btn-start-quiz-5').addEventListener('click', () => initiateQuiz(5));
  document.getElementById('btn-start-quiz-10').addEventListener('click', () => initiateQuiz(10));
  document.getElementById('btn-next-quiz-question').addEventListener('click', advanceQuiz);
  
  document.getElementById('btn-quit-quiz').addEventListener('click', () => {
    if (confirm("Are you sure you want to quit the current quiz?")) {
      state.quiz.isActive = false;
      document.getElementById('quiz-setup-panel').classList.remove('hidden');
      document.getElementById('quiz-play-panel').classList.add('hidden');
      document.getElementById('quiz-progress-header').classList.add('hidden');
      showToast("Quiz abandoned.", "🛑");
    }
  });

  document.getElementById('btn-quiz-retry').addEventListener('click', () => {
    document.getElementById('quiz-finished-panel').classList.add('hidden');
    document.getElementById('quiz-setup-panel').classList.remove('hidden');
  });

  document.getElementById('quiz-audio-cue').addEventListener('click', () => {
    const correctWord = state.quiz.questions[state.quiz.currentIndex];
    if (correctWord) {
      speakWord(correctWord.hindi);
    }
  });

  // --- DICTIONARY & MODAL MANAGEMENT ---
  const modal = document.getElementById('add-word-modal');
  const openModalBtn = document.getElementById('btn-open-add-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  const form = document.getElementById('add-word-form');

  const openModal = () => {
    modal.classList.remove('hidden');
    document.getElementById('form-input-hindi').focus();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
  };

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  // Modal outer-click cancel
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const hindiVal = document.getElementById('form-input-hindi').value.trim();
    const translitVal = document.getElementById('form-input-translit').value.trim();
    const englishVal = document.getElementById('form-input-english').value.trim();
    const categoryVal = document.getElementById('form-input-category').value;
    const usageVal = document.getElementById('form-input-usage').value.trim();

    if (!hindiVal || !translitVal || !englishVal) {
      showToast("Please fill all required values!", "⚠️");
      return;
    }

    const newWord = {
      id: 'w_custom_' + Date.now(),
      hindi: hindiVal,
      translit: translitVal,
      english: englishVal,
      category: categoryVal,
      usage: usageVal,
      mastered: false
    };

    // Add to local list state
    state.words.push(newWord);
    saveStateToStorage();
    
    // UI updates
    updateStatsDashboard();
    renderCategoriesMenu();
    populateDictionaryDropdowns();
    
    // If in dictionary section, reload
    if (!document.getElementById('section-dictionary').classList.contains('hidden')) {
      renderDictionaryTable();
    }
    
    closeModal();
    showToast(`Successfully added "${translitVal}"!`, "✨");
  });

  // Search / filter inputs
  document.getElementById('dictionary-search-input').addEventListener('input', renderDictionaryTable);
  document.getElementById('dictionary-category-filter').addEventListener('change', renderDictionaryTable);
  document.getElementById('dictionary-sort-filter').addEventListener('change', renderDictionaryTable);
}

// --- ENTRY POINT INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupSpeechEngine();
  renderCategoriesMenu();
  updateStatsDashboard();
  updateFlashcardView();
  setupEventListeners();
});