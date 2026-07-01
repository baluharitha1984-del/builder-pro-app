// Core state management
const state = {
  recentSearches: ['twilight', 'fire', 'dream', 'rhyme'],
  savedRhymes: [],
  activeWord: '',
  clickAction: 'insert', // 'insert' | 'copy'
  activeTab: 'favs' // 'favs' | 'history'
};

// Datamuse fallback dictionary to guarantee app stays highly functional even if API rates are hit or offline
const fallbackDictionary = {
  twilight: [
    { word: 'skylight', score: 300, numSyllables: 2 },
    { word: 'highlight', score: 290, numSyllables: 2 },
    { word: 'night', score: 280, numSyllables: 1 },
    { word: 'bright', score: 275, numSyllables: 1 },
    { word: 'flight', score: 260, numSyllables: 1 },
    { word: 'insight', score: 250, numSyllables: 2 },
    { word: 'satellite', score: 220, numSyllables: 3 },
    { word: 'daylight', score: 210, numSyllables: 2 }
  ],
  fire: [
    { word: 'wire', score: 320, numSyllables: 1 },
    { word: 'desire', score: 310, numSyllables: 2 },
    { word: 'higher', score: 300, numSyllables: 2 },
    { word: 'admire', score: 280, numSyllables: 2 },
    { word: 'aspire', score: 270, numSyllables: 2 },
    { word: 'choir', score: 260, numSyllables: 1 },
    { word: 'pyre', score: 250, numSyllables: 1 }
  ],
  dream: [
    { word: 'gleam', score: 310, numSyllables: 1 },
    { word: 'stream', score: 300, numSyllables: 1 },
    { word: 'scheme', score: 290, numSyllables: 1 },
    { word: 'scream', score: 280, numSyllables: 1 },
    { word: 'beam', score: 270, numSyllables: 1 },
    { word: 'theme', score: 260, numSyllables: 1 },
    { word: 'supreme', score: 240, numSyllables: 2 }
  ],
  rhyme: [
    { word: 'chime', score: 320, numSyllables: 1 },
    { word: 'climb', score: 310, numSyllables: 1 },
    { word: 'time', score: 300, numSyllables: 1 },
    { word: 'prime', score: 290, numSyllables: 1 },
    { word: 'slime', score: 280, numSyllables: 1 },
    { word: 'sublime', score: 270, numSyllables: 2 },
    { word: 'lifetime', score: 260, numSyllables: 2 }
  ],
  sky: [
    { word: 'high', score: 320, numSyllables: 1 },
    { word: 'fly', score: 310, numSyllables: 1 },
    { word: 'cry', score: 300, numSyllables: 1 },
    { word: 'sigh', score: 290, numSyllables: 1 },
    { word: 'why', score: 280, numSyllables: 1 },
    { word: 'butterfly', score: 260, numSyllables: 3 },
    { word: 'reply', score: 250, numSyllables: 2 }
  ],
  shadow: [
    { word: 'meadow', score: 290, numSyllables: 2 },
    { word: 'shallow', score: 280, numSyllables: 2 },
    { word: 'widow', score: 270, numSyllables: 2 },
    { word: 'elbow', score: 240, numSyllables: 2 },
    { word: 'yellow', score: 230, numSyllables: 2 }
  ],
  night: [
    { word: 'bright', score: 330, numSyllables: 1 },
    { word: 'light', score: 320, numSyllables: 1 },
    { word: 'might', score: 310, numSyllables: 1 },
    { word: 'tight', score: 300, numSyllables: 1 },
    { word: 'flight', score: 290, numSyllables: 1 },
    { word: 'insight', score: 270, numSyllables: 2 },
    { word: 'overnight', score: 250, numSyllables: 3 }
  ],
  dance: [
    { word: 'glance', score: 310, numSyllables: 1 },
    { word: 'romance', score: 300, numSyllables: 2 },
    { word: 'chance', score: 290, numSyllables: 1 },
    { word: 'trance', score: 280, numSyllables: 1 },
    { word: 'stance', score: 270, numSyllables: 1 },
    { word: 'circumstance', score: 240, numSyllables: 3 }
  ],
  ocean: [
    { word: 'motion', score: 320, numSyllables: 2 },
    { word: 'devotion', score: 310, numSyllables: 3 },
    { word: 'potion', score: 300, numSyllables: 2 },
    { word: 'notion', score: 290, numSyllables: 2 },
    { word: 'emotion', score: 280, numSyllables: 3 }
  ]
};

// DOM Elements References
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const relationType = document.getElementById('relationType');
const syllableFilter = document.getElementById('syllableFilter');
const rhymeResultsGrid = document.getElementById('rhymeResultsGrid');
const resultsTitle = document.getElementById('resultsTitle');
const resultsSummary = document.getElementById('resultsSummary');
const loadingSpinner = document.getElementById('loadingSpinner');
const matchCountBadge = document.getElementById('matchCountBadge');

const rhymePadTextArea = document.getElementById('rhymePadTextArea');
const lineSyllablesCount = document.getElementById('lineSyllablesCount');
const totalWordsCount = document.getElementById('totalWordsCount');
const globalSyllableIndicator = document.getElementById('globalSyllableIndicator');

const modeInsertBtn = document.getElementById('modeInsertBtn');
const modeCopyBtn = document.getElementById('modeCopyBtn');
const clearPadBtn = document.getElementById('clearPadBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const triggerDemoBtn = document.getElementById('triggerDemoBtn');

const tabFavs = document.getElementById('tabFavs');
const tabHistory = document.getElementById('tabHistory');
const favsPanel = document.getElementById('favsPanel');
const historyPanel = document.getElementById('historyPanel');
const favsGrid = document.getElementById('favsGrid');
const historyList = document.getElementById('historyList');
const noFavsMsg = document.getElementById('noFavsMsg');
const noHistoryMsg = document.getElementById('noHistoryMsg');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const favCountBadge = document.getElementById('favCount');

const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMsg = document.getElementById('toastMsg');

// Load from Local Storage
function loadFromLocalStorage() {
  const saved = localStorage.getItem('versecraft_favs');
  if (saved) {
    state.savedRhymes = JSON.parse(saved);
  }
  const hist = localStorage.getItem('versecraft_history');
  if (hist) {
    state.recentSearches = JSON.parse(hist);
  }
  renderSavedRhymes();
  renderHistory();
}

// Save to Local Storage
function saveToLocalStorage() {
  localStorage.setItem('versecraft_favs', JSON.stringify(state.savedRhymes));
  localStorage.setItem('versecraft_history', JSON.stringify(state.recentSearches));
  favCountBadge.textContent = state.savedRhymes.length;
}

// Show Toast notifications
function showToast(message, icon = '✨') {
  toastMsg.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.remove('opacity-0', 'translate-y-10');
  toast.classList.add('opacity-100', 'translate-y-0');
  
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-10');
  }, 2400);
}

// Estimate syllables simplified fallback function
function estimateSyllableCount(word) {
  let cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanWord.length <= 3) return 1;
  cleanWord = cleanWord.replace(/(?:uo|ea|oa|ai|oi|ae|ou|au|oo|ee)/g, 'a');
  cleanWord = cleanWord.replace(/[^aeiouy]e$/g, '');
  const matches = cleanWord.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Count syllables inside textarea's active/focused line
function updatePadCounts() {
  const text = rhymePadTextArea.value;
  
  // Word counter
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  totalWordsCount.textContent = words.length;

  // Line-by-line analyzer for active line
  const cursorPosition = rhymePadTextArea.selectionStart;
  const lines = text.substring(0, cursorPosition).split('\n');
  const activeLineText = lines[lines.length - 1] || '';
  
  // Count syllables in that line
  const lineWords = activeLineText.split(/\s+/).filter(w => w.length > 0);
  let lineSyllableSum = 0;
  lineWords.forEach(w => {
    lineSyllableSum += estimateSyllableCount(w);
  });
  
  lineSyllablesCount.textContent = lineSyllableSum;
  globalSyllableIndicator.textContent = `${lineSyllableSum} Syllable${lineSyllableSum === 1 ? '' : 's'} (Line)`;
}

// Main API / Local dictionary lookup function
async function searchRhymes(word, type = 'rhy', userInitiated = true) {
  if (!word) return;
  
  // Format word input
  const searchWord = word.trim().toLowerCase();
  state.activeWord = searchWord;
  
  // Add to History
  if (userInitiated) {
    state.recentSearches = [searchWord, ...state.recentSearches.filter(w => w !== searchWord)].slice(0, 15);
    renderHistory();
    saveToLocalStorage();
  }

  // Setup UI elements for loading
  loadingSpinner.classList.remove('hidden');
  rhymeResultsGrid.innerHTML = '';
  resultsTitle.textContent = `Finding Matches...`;
  resultsSummary.textContent = `Scouring matching patterns for "${searchWord}"`;
  matchCountBadge.classList.add('hidden');

  // Datamuse API map criteria
  const apiRelMap = {
    'rhy': 'rel_rhy',
    'nry': 'rel_nry',
    'hom': 'rel_hom',
    'cns': 'rel_cns',
    'syn': 'ml',
    'ant': 'rel_ant'
  };

  const relParam = apiRelMap[type] || 'rel_rhy';
  let results = [];
  let isFallbackUsed = false;

  try {
    // Dynamic Fetch call to the awesome public Datamuse API
    const response = await fetch(`https://api.datamuse.com/words?${relParam}=${encodeURIComponent(searchWord)}&max=100`);
    if (!response.ok) throw new Error('API request failed');
    results = await response.json();
  } catch (err) {
    // Graceful offline fallback
    console.warn('Datamuse API unavailable, switching to localized offline thesaurus.');
    isFallbackUsed = true;
    if (fallbackDictionary[searchWord]) {
      results = fallbackDictionary[searchWord];
    } else {
      // Fallback word gen algorithm dynamically if input is not in dictionary
      results = generateSimulatedRhymes(searchWord);
    }
  }

  // Render Results
  loadingSpinner.classList.add('hidden');
  
  // Filter by Syllables
  const currentSyllableValue = syllableFilter.value;
  let filteredResults = results;
  if (currentSyllableValue !== 'all') {
    const targetSyllables = parseInt(currentSyllableValue, 10);
    filteredResults = results.filter(item => {
      const count = item.numSyllables || estimateSyllableCount(item.word);
      if (targetSyllables === 3) return count >= 3;
      return count === targetSyllables;
    });
  }

  if (!filteredResults || filteredResults.length === 0) {
    rhymeResultsGrid.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-slate-400 text-sm font-medium">No perfect match found in instant vault.</p>
        <p class="text-xs text-slate-500 mt-1">Try changing relation type or clearing syllable filter constraints.</p>
      </div>
    `;
    resultsTitle.textContent = `Matches for "${searchWord}"`;
    resultsSummary.textContent = `No matches found matching criteria.`;
    return;
  }

  resultsTitle.textContent = `Matches for "${searchWord}"`;
  resultsSummary.textContent = `${isFallbackUsed ? 'Offline Local Dictionary' : 'Datamuse Direct Vault'} • Syllables: ${currentSyllableValue}`;
  matchCountBadge.textContent = `${filteredResults.length} items`;
  matchCountBadge.classList.remove('hidden');

  filteredResults.forEach((item, index) => {
    const wordSyllables = item.numSyllables || estimateSyllableCount(item.word);
    const isSaved = state.savedRhymes.includes(item.word);
    
    const card = document.createElement('div');
    card.className = 'word-badge-entry bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl p-3 flex flex-col justify-between hover:bg-slate-800/40 cursor-pointer transition-all duration-150 relative group';
    card.style.animationDelay = `${index * 15}ms`;
    
    card.innerHTML = `
      <div class="flex items-center justify-between gap-1">
        <span class="font-medium text-slate-100 hover:text-white transition break-all select-all text-sm" onclick="handleWordAction(event, '${item.word}')">${item.word}</span>
        <button class="text-slate-500 hover:text-amber-400 transition transform hover:scale-115 focus:outline-none" onclick="toggleSaveWord(event, '${item.word}')">
          ${isSaved ? '★' : '☆'}
        </button>
      </div>
      <div class="flex items-center justify-between mt-2.5">
        <span class="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-indigo-400 font-mono">${wordSyllables} syl</span>
        <div class="flex items-center space-x-1">
          <button class="p-1 text-[10px] hover:bg-indigo-950 text-slate-400 hover:text-indigo-400 rounded transition" onclick="speakWord(event, '${item.word}')" title="Listen">
            🔊
          </button>
        </div>
      </div>
    `;
    
    // Let card itself trigger click action when clicked on non-button elements
    card.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('span')) {
        handleWordAction(e, item.word);
      }
    });

    rhymeResultsGrid.appendChild(card);
  });
}

// Generate random mock items based on common suffix
function generateSimulatedRhymes(word) {
  const commonSuffixes = ['ing', 'ed', 'er', 'y', 'al', 'ion', 'ly', 'est', 'or'];
  const matchedSuffix = commonSuffixes.find(sfx => word.endsWith(sfx)) || '';
  
  const basePool = [
    'flight', 'night', 'bright', 'clear', 'dear', 'fear', 'light', 'mind', 
    'find', 'blind', 'wind', 'line', 'fine', 'shine', 'glow', 'show', 
    'grow', 'flow', 'spring', 'sing', 'ring', 'bring', 'king', 'thing'
  ];
  
  // Shuffle & pick 10 items mapping to some arbitrary syllables
  return basePool.slice(0, 12).map((w, index) => ({
    word: matchedSuffix ? (w.replace(/e$/, '') + matchedSuffix) : w,
    score: 200 - (index * 10),
    numSyllables: estimateSyllableCount(w) + (matchedSuffix ? 1 : 0)
  }));
}

// Handle inserting or copying selected word
function handleWordAction(event, word) {
  event.stopPropagation();
  if (state.clickAction === 'insert') {
    insertWordToPad(word);
  } else {
    copyToClipboard(word);
  }
}

// Speech Synthesis API audio feedback
function speakWord(event, word) {
  event.stopPropagation();
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    showToast("Speech synthesis not supported in browser", "⚠️");
  }
}

// Insert word into RhymePad
function insertWordToPad(word) {
  const textarea = rhymePadTextArea;
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  const text = textarea.value;
  
  // Insert word at cursor or append to end
  if (startPos || startPos === 0) {
    textarea.value = text.substring(0, startPos) + word + text.substring(endPos, text.length);
    // Set cursor just after the inserted word
    textarea.selectionStart = startPos + word.length;
    textarea.selectionEnd = startPos + word.length;
  } else {
    textarea.value += (textarea.value ? ' ' : '') + word;
  }
  
  textarea.focus();
  updatePadCounts();
  showToast(`Inserted "${word}" into Verse Pad`, "📝");
}

// Copy single word helper
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard`, "📋");
  }).catch(() => {
    showToast("Unable to copy to clipboard", "❌");
  });
}

// Save & Toggle Favourites Word State
function toggleSaveWord(event, word) {
  event.stopPropagation();
  const isAlreadySaved = state.savedRhymes.includes(word);
  if (isAlreadySaved) {
    state.savedRhymes = state.savedRhymes.filter(item => item !== word);
    showToast(`Removed "${word}" from Saved`, "⭐");
  } else {
    state.savedRhymes.push(word);
    showToast(`Saved "${word}"!`, "⭐");
  }
  
  saveToLocalStorage();
  renderSavedRhymes();
  
  // Refresh active rhymes layout to keep states uniform
  if (state.activeWord) {
    const currentQueryWord = state.activeWord;
    const relationValue = relationType.value;
    searchRhymes(currentQueryWord, relationValue, false);
  }
}

// Render Saved Words Grid
function renderSavedRhymes() {
  favsGrid.innerHTML = '';
  if (state.savedRhymes.length === 0) {
    noFavsMsg.classList.remove('hidden');
    return;
  }
  noFavsMsg.classList.add('hidden');

  state.savedRhymes.forEach(word => {
    const sylCount = estimateSyllableCount(word);
    const wrapper = document.createElement('div');
    wrapper.className = 'group flex items-center justify-between p-2 bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 rounded-lg text-xs transition duration-150';
    wrapper.innerHTML = `
      <div class="flex flex-col truncate cursor-pointer" onclick="quickSearch('${word}')">
        <span class="font-medium text-slate-300 group-hover:text-indigo-300 transition truncate">${word}</span>
        <span class="text-[9px] text-slate-500">${sylCount} syl</span>
      </div>
      <div class="flex items-center space-x-1">
        <button class="text-slate-600 hover:text-indigo-400 p-0.5" onclick="insertWordToPad('${word}')" title="Insert">
          ✍️
        </button>
        <button class="text-rose-500 hover:text-rose-400 font-bold p-0.5" onclick="toggleSaveWord(event, '${word}')" title="Unsave">
          ×
        </button>
      </div>
    `;
    favsGrid.appendChild(wrapper);
  });
}

// Render History List
function renderHistory() {
  historyList.innerHTML = '';
  if (state.recentSearches.length === 0) {
    noHistoryMsg.classList.remove('hidden');
    clearHistoryBtn.classList.add('hidden');
    return;
  }
  noHistoryMsg.classList.add('hidden');
  clearHistoryBtn.classList.remove('hidden');

  state.recentSearches.forEach(word => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center justify-between p-2 bg-slate-950/60 hover:bg-slate-950 border border-slate-900 rounded-lg text-xs cursor-pointer hover:border-slate-800 transition duration-150';
    wrapper.innerHTML = `
      <span class="text-slate-300 font-medium capitalize" onclick="quickSearch('${word}')">🔍 ${word}</span>
      <button class="text-slate-500 hover:text-rose-400 text-[11px] px-1" onclick="removeHistoryItem(event, '${word}')">
        Delete
      </button>
    `;
    historyList.appendChild(wrapper);
  });
}

// Quick Search Helper triggered by tag or history item
window.quickSearch = function(word) {
  searchInput.value = word;
  const relationValue = relationType.value;
  searchRhymes(word, relationValue, true);
};

// Remove single history item
window.removeHistoryItem = function(event, word) {
  event.stopPropagation();
  state.recentSearches = state.recentSearches.filter(item => item !== word);
  renderHistory();
  saveToLocalStorage();
  showToast('Removed history item', '🗑️');
};

// Register listeners & UI interactions

// Search submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value;
  const rel = relationType.value;
  searchRhymes(query, rel, true);
});

// On Type select or Syllable filter change, instantly query if there's an active word
relationType.addEventListener('change', () => {
  if (searchInput.value) {
    searchRhymes(searchInput.value, relationType.value, false);
  }
});

syllableFilter.addEventListener('change', () => {
  if (searchInput.value) {
    searchRhymes(searchInput.value, relationType.value, false);
  }
});

// Action Mode Toggles
modeInsertBtn.addEventListener('click', () => {
  state.clickAction = 'insert';
  modeInsertBtn.className = 'px-2 py-1 text-xs font-medium rounded bg-indigo-600 text-white transition';
  modeCopyBtn.className = 'px-2 py-1 text-xs font-medium rounded text-slate-400 hover:text-slate-200 transition';
});

modeCopyBtn.addEventListener('click', () => {
  state.clickAction = 'copy';
  modeCopyBtn.className = 'px-2 py-1 text-xs font-medium rounded bg-indigo-600 text-white transition';
  modeInsertBtn.className = 'px-2 py-1 text-xs font-medium rounded text-slate-400 hover:text-slate-200 transition';
});

// Clear Pad
clearPadBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your current work?")) {
    rhymePadTextArea.value = '';
    updatePadCounts();
    showToast('Verse Pad Cleared', '🗑️');
  }
});

// Copy All
copyAllBtn.addEventListener('click', () => {
  const text = rhymePadTextArea.value;
  if (!text.trim()) {
    showToast('Verse Pad is empty. Write something first!', '📝');
    return;
  }
  copyToClipboard(text);
});

// Tab switcher handlers
tabFavs.addEventListener('click', () => {
  state.activeTab = 'favs';
  tabFavs.className = 'flex-1 py-3 px-4 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 focus:outline-none flex items-center justify-center space-x-2';
  tabHistory.className = 'flex-1 py-3 px-4 text-sm font-semibold text-slate-400 hover:text-slate-200 border-b-2 border-transparent focus:outline-none flex items-center justify-center space-x-2';
  favsPanel.classList.remove('hidden');
  historyPanel.classList.add('hidden');
});

tabHistory.addEventListener('click', () => {
  state.activeTab = 'history';
  tabHistory.className = 'flex-1 py-3 px-4 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 focus:outline-none flex items-center justify-center space-x-2';
  tabFavs.className = 'flex-1 py-3 px-4 text-sm font-semibold text-slate-400 hover:text-slate-200 border-b-2 border-transparent focus:outline-none flex items-center justify-center space-x-2';
  historyPanel.classList.remove('hidden');
  favsPanel.classList.add('hidden');
});

// Clear History
clearHistoryBtn.addEventListener('click', () => {
  state.recentSearches = [];
  renderHistory();
  saveToLocalStorage();
  showToast('Search history cleared', '🗑️');
});

// Live counting on Verse Pad text keypresses
rhymePadTextArea.addEventListener('input', updatePadCounts);
rhymePadTextArea.addEventListener('keyup', updatePadCounts);
rhymePadTextArea.addEventListener('click', updatePadCounts);

// Double-click word look-up inside the textarea
rhymePadTextArea.addEventListener('dblclick', () => {
  const text = rhymePadTextArea.value;
  const selStart = rhymePadTextArea.selectionStart;
  const selEnd = rhymePadTextArea.selectionEnd;
  
  if (selStart !== selEnd) {
    const selectedWord = text.substring(selStart, selEnd).trim().replace(/[^a-zA-Z]/g, '');
    if (selectedWord.length > 1) {
      quickSearch(selectedWord);
      showToast(`Quick lookup for "${selectedWord}"`, '🔍');
    }
  }
});

// Load Inspiration button demo template text
triggerDemoBtn.addEventListener('click', () => {
  const inspirationList = [
    "I seek the silence of the night,\nIn search of words to make it bright.\nA lonely path where stars align,\nTo form a simple rhyming sign.",
    "The ocean whispers to the sand,\nA secret language across the land.\nA perfect wave of quiet grace,\nTo wash away the time and space.",
    "A burning fire inside the soul,\nTo make the broken spirits whole.\nWith every spark, a story told,\nOf silver dreams and sunset gold."
  ];
  const randomLine = inspirationList[Math.floor(Math.random() * inspirationList.length)];
  rhymePadTextArea.value = randomLine;
  updatePadCounts();
  showToast('Inspiration Loaded', '💡');
});

// Boot Initialization
function init() {
  loadFromLocalStorage();
  updatePadCounts();
  // Warmup default search of 'twilight' so page has visual contents immediately
  quickSearch('twilight');
}

init();