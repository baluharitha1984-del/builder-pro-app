/**
 * LEXIQUEST - Elegant Web-Synthesized Interactive English Words Game
 */

// Dynamic client-side Rich Vocabulary Database
const WORD_DATABASE = [
  {
    word: "EFFERVESCENT",
    clue: "Vivacious, enthusiastic, or bubbling with excitement",
    synonyms: ["Bubbly", "Dull", "Heavy", "Sluggish"],
    correctSynonym: "Bubbly",
    subwords: ["VECT", "TEEN", "SEVER", "EVER", "RESET", "FEVER", "FREE"]
  },
  {
    word: "COGNIZANT",
    clue: "Having knowledge or being fully aware of something",
    synonyms: ["Aware", "Oblivious", "Ignorant", "Asleep"],
    correctSynonym: "Aware",
    subwords: ["COIN", "GONG", "COZ", "RAIN", "OAT", "AGO", "ZINC"]
  },
  {
    word: "ZEPHYR",
    clue: "A gentle, mild, or light breeze from the west",
    synonyms: ["Breeze", "Hurricane", "Torrent", "Blizzard"],
    correctSynonym: "Breeze",
    subwords: ["PRY", "PREY", "HER", "YEZ", "HEP"]
  },
  {
    word: "EPHEMERAL",
    clue: "Lasting for a very short, transient time",
    synonyms: ["Fleeting", "Eternal", "Timeless", "Durable"],
    correctSynonym: "Fleeting",
    subwords: ["PEAL", "PALE", "HEAL", "MEAL", "HAMP", "RAMP", "PEER"]
  },
  {
    word: "LUMINOUS",
    clue: "Full of or shedding bright glowing light",
    synonyms: ["Radiant", "Dim", "Obscure", "Opaque"],
    correctSynonym: "Radiant",
    subwords: ["ION", "SOUL", "MINU", "SUN", "NIL", "SUM"]
  },
  {
    word: "QUIRKY",
    clue: "Characterized by peculiar, eccentric, or unconventional habits",
    synonyms: ["Eccentric", "Ordinary", "Normal", "Standard"],
    correctSynonym: "Eccentric",
    subwords: ["YIRK", "QUIP", "YIP", "YRK", "RUY"]
  },
  {
    word: "WANDERLUST",
    clue: "A strong, innate desire to travel and explore the world",
    synonyms: ["Roam", "Stagnancy", "Settle", "Homebound"],
    correctSynonym: "Roam",
    subwords: ["WAND", "LUST", "WEST", "LAND", "DUST", "RUST", "LUTE", "SUNT"]
  },
  {
    word: "SAGACIOUS",
    clue: "Having or showing keen mental discernment and good judgment",
    synonyms: ["Wise", "Foolish", "Immature", "Naive"],
    correctSynonym: "Wise",
    subwords: ["SAGO", "SAGA", "COUS", "GAS", "SUG"]
  },
  {
    word: "NEBULOUS",
    clue: "Hazy, vague, indistinct, or cloud-like",
    synonyms: ["Cloudy", "Clear", "Distinct", "Precise"],
    correctSynonym: "Cloudy",
    subwords: ["BLUE", "LOBE", "SLOB", "BONE", "SOLE"]
  },
  {
    word: "MELLIFLUOUS",
    clue: "Sweet or musical, pleasant and smooth to hear",
    synonyms: ["Dulcet", "Harsh", "Shrill", "Noisy"],
    correctSynonym: "Dulcet",
    subwords: ["FILL", "MILL", "FLOW", "SOUL", "LIFE", "LIME", "SLIM"]
  },
  {
    word: "CACOPHONY",
    clue: "A harsh, discordant mixture of sounds",
    synonyms: ["Noise", "Harmony", "Melody", "Silence"],
    correctSynonym: "Noise",
    subwords: ["PONY", "COCO", "CYAN", "COAX", "COP"]
  },
  {
    word: "CAPRICIOUS",
    clue: "Given to sudden and unaccountable changes of mood or behavior",
    synonyms: ["Fickle", "Stable", "Reliable", "Constant"],
    correctSynonym: "Fickle",
    subwords: ["CAP", "RICE", "SOUP", "PACE", "SOUR"]
  }
];

// Audio Synthesis Engine using browser Web Audio API
class AudioEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API not supported/permitted yet.");
    }
  }

  correct() {
    this.playTone(523.25, 'triangle', 0.15, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.25, 0.15), 100); // E5
  }

  wrong() {
    this.playTone(220, 'sawtooth', 0.3, 0.15); // A3
  }

  click() {
    this.playTone(800, 'sine', 0.05, 0.08);
  }

  levelUp() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.2, 0.15);
      }, idx * 100);
    });
  }
}

const audio = new AudioEngine();

// Global Game State
const state = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  score: 0,
  streak: 0,
  maxStreak: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  discoveredWords: 0,
  currentMode: "scramble", // scramble, synonym, builder
  
  // Game 1: Scramble
  scrambleIndex: 0,
  scrambleOriginalWord: "",
  scrambleShuffledWord: "",

  // Game 2: Synonym
  synonymIndex: 0,
  synonymTimerVal: 15,
  synonymTimerInterval: null,

  // Game 3: Builder
  builderCoreLetter: "",
  builderRingLetters: [],
  builderCurrentDraft: "",
  builderPoolIndex: 0,
  builderFoundList: [],

  // Logs & Achievements
  questJournal: []
};

// Initialize App on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  setupMenuTabs();
  setupScrambleGame();
  setupSynonymGame();
  setupBuilderGame();
  setupGlobalEventListeners();
  renderStats();
  updateDailyWordWidget();
  showToast("Welcome to LexiQuest! Choose your arena mode and spell your way to glory.", "⚡", "success");
});

// LocalStorage helpers
function saveLocalStorage() {
  const dataToSave = {
    level: state.level,
    xp: state.xp,
    score: state.score,
    streak: state.streak,
    maxStreak: state.maxStreak,
    totalAnswers: state.totalAnswers,
    correctAnswers: state.correctAnswers,
    discoveredWords: state.discoveredWords,
    questJournal: state.questJournal
  };
  localStorage.setItem("lexiquest_save_v1", JSON.stringify(dataToSave));
}

function loadLocalStorage() {
  try {
    const saved = localStorage.getItem("lexiquest_save_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      state.level = parsed.level || 1;
      state.xp = parsed.xp || 0;
      state.score = parsed.score || 0;
      state.streak = parsed.streak || 0;
      state.maxStreak = parsed.maxStreak || 0;
      state.totalAnswers = parsed.totalAnswers || 0;
      state.correctAnswers = parsed.correctAnswers || 0;
      state.discoveredWords = parsed.discoveredWords || 0;
      state.questJournal = parsed.questJournal || [];
    }
  } catch (e) {
    console.error("Failed reading local storage state", e);
  }
}

// Mode Tab Switcher
function setupMenuTabs() {
  const tabScramble = document.getElementById("tab-scramble");
  const tabSynonym = document.getElementById("tab-synonym");
  const tabBuilder = document.getElementById("tab-builder");

  const viewScramble = document.getElementById("game-view-scramble");
  const viewSynonym = document.getElementById("game-view-synonym");
  const viewBuilder = document.getElementById("game-view-builder");

  function selectTab(mode) {
    audio.click();
    state.currentMode = mode;
    
    // Clear intervals if applicable
    if (state.synonymTimerInterval) {
      clearInterval(state.synonymTimerInterval);
    }

    // Reset buttons styles
    [tabScramble, tabSynonym, tabBuilder].forEach(btn => {
      btn.classList.remove("bg-indigo-600/20", "text-indigo-200", "border-indigo-500/50", "bg-purple-600/20", "text-purple-200", "border-purple-500/50", "bg-pink-600/20", "text-pink-200", "border-pink-500/50");
      btn.classList.add("hover:bg-slate-800", "text-slate-300");
      // Remove indicator ping
      const ping = btn.querySelector("span.animate-ping");
      if (ping) ping.classList.add("hidden");
    });

    // Hide all view screens
    viewScramble.classList.add("hidden");
    viewSynonym.classList.add("hidden");
    viewBuilder.classList.add("hidden");

    if (mode === "scramble") {
      tabScramble.classList.add("bg-indigo-600/20", "text-indigo-200", "border-indigo-500/50");
      tabScramble.classList.remove("hover:bg-slate-800");
      viewScramble.classList.remove("hidden");
      setupScrambleGame();
    } else if (mode === "synonym") {
      tabSynonym.classList.add("bg-purple-600/20", "text-purple-200", "border-purple-500/50");
      tabSynonym.classList.remove("hover:bg-slate-800");
      viewSynonym.classList.remove("hidden");
      startSynonymGame();
    } else if (mode === "builder") {
      tabBuilder.classList.add("bg-pink-600/20", "text-pink-200", "border-pink-500/50");
      tabBuilder.classList.remove("hover:bg-slate-800");
      viewBuilder.classList.remove("hidden");
      setupBuilderGame();
    }
  }

  tabScramble.addEventListener("click", () => selectTab("scramble"));
  tabSynonym.addEventListener("click", () => selectTab("synonym"));
  tabBuilder.addEventListener("click", () => selectTab("builder"));
}

// --- GAME 1: SCRAMBLE LOGIC ---
function setupScrambleGame() {
  // Load current index word
  const entry = WORD_DATABASE[state.scrambleIndex];
  state.scrambleOriginalWord = entry.word;
  
  // Suffle word helper
  state.scrambleShuffledWord = shuffleString(entry.word);
  // Ensure they are not exactly identical
  while (state.scrambleShuffledWord === state.scrambleOriginalWord && entry.word.length > 2) {
    state.scrambleShuffledWord = shuffleString(entry.word);
  }

  // Render letter tiles
  const container = document.getElementById("scramble-letters-container");
  container.innerHTML = "";
  
  state.scrambleShuffledWord.split("").forEach((char, index) => {
    const btn = document.createElement("button");
    btn.className = "h-12 w-12 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-lg rounded-xl transition-all active:scale-95 shadow border border-slate-700 hover:border-indigo-500";
    btn.textContent = char;
    btn.addEventListener("click", () => {
      audio.click();
      const inputField = document.getElementById("scramble-input");
      inputField.value += char;
      // visually disable/scale down selected button momentarily to act as pool
      btn.classList.add("opacity-40", "scale-90");
      setTimeout(() => {
        btn.classList.remove("opacity-40", "scale-90");
      }, 300);
    });
    container.appendChild(btn);
  });

  // Set clue text
  document.getElementById("scramble-clue-text").textContent = entry.clue;
  document.getElementById("scramble-input").value = "";
}

// Helper to shuffle strings
function shuffleString(str) {
  let arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

// Check Scramble Guess
function submitScramble() {
  const inputVal = document.getElementById("scramble-input").value.trim().toUpperCase();
  const entry = WORD_DATABASE[state.scrambleIndex];

  if (!inputVal) {
    showToast("Please enter/click letters to make a word guess first!", "⚠️", "error");
    shakeContainer("scramble-input");
    return;
  }

  state.totalAnswers++;
  if (inputVal === entry.word) {
    // Success!
    audio.correct();
    const gainXP = 30 + (state.streak * 5);
    awardXP(gainXP);
    state.score += 50;
    state.streak++;
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;
    state.correctAnswers++;
    state.discoveredWords++;

    addJournalEntry(entry.word, "Scramble Mastered", "Correct");
    showToast(`Perfect! "${entry.word}" is correct. (+${gainXP} XP)`, "🎉", "success");

    // Proceed to next word
    state.scrambleIndex = (state.scrambleIndex + 1) % WORD_DATABASE.length;
    setTimeout(setupScrambleGame, 800);
  } else {
    // Failed
    audio.wrong();
    state.streak = 0;
    showToast("Incorrect spelling! Try checking the clue definition again.", "❌", "error");
    shakeContainer("scramble-input");
  }
  renderStats();
  saveLocalStorage();
}

// --- GAME 2: SYNONYM LOGIC ---
function startSynonymGame() {
  const entry = WORD_DATABASE[state.synonymIndex];
  document.getElementById("synonym-target-word").textContent = entry.word;
  document.getElementById("synonym-hint-def").textContent = "Definition: " + entry.clue;

  // Mix synonyms options
  const options = [...entry.synonyms];
  // Shuffle options so correct answer is at variable spot
  options.sort(() => Math.random() - 0.5);

  const container = document.getElementById("synonym-options-container");
  container.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "p-4 bg-slate-800 hover:bg-slate-700 hover:border-purple-500 rounded-2xl border border-slate-700/80 text-sm font-black text-slate-100 transition-all text-center tracking-wide uppercase active:scale-95";
    btn.textContent = option;
    btn.addEventListener("click", () => {
      checkSynonym(option, entry.correctSynonym);
    });
    container.appendChild(btn);
  });

  // Start speedrun timer
  state.synonymTimerVal = 15;
  document.getElementById("synonym-timer").textContent = state.synonymTimerVal + "s";
  document.getElementById("synonym-timer").className = "text-sm font-bold text-emerald-400";

  if (state.synonymTimerInterval) clearInterval(state.synonymTimerInterval);
  state.synonymTimerInterval = setInterval(() => {
    state.synonymTimerVal--;
    const timerEl = document.getElementById("synonym-timer");
    timerEl.textContent = state.synonymTimerVal + "s";
    
    if (state.synonymTimerVal <= 5) {
      timerEl.className = "text-sm font-bold text-red-500 animate-pulse";
    } else {
      timerEl.className = "text-sm font-bold text-amber-400";
    }

    if (state.synonymTimerVal <= 0) {
      clearInterval(state.synonymTimerInterval);
      handleSynonymTimeout();
    }
  }, 1000);
}

function checkSynonym(selected, correct) {
  if (state.synonymTimerInterval) clearInterval(state.synonymTimerInterval);
  state.totalAnswers++;

  if (selected === correct) {
    audio.correct();
    // Multiplier for speed
    const speedBonus = Math.max(0, state.synonymTimerVal * 2);
    const finalXP = 20 + speedBonus;
    awardXP(finalXP);
    state.score += 40;
    state.streak++;
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;
    state.correctAnswers++;
    state.discoveredWords++;

    addJournalEntry(correct, "Synonym matched fast!", "Correct");
    showToast(`Superb! "${correct}" synonym linked correctly. (+${finalXP} XP)`, "🔥", "success");
    
    state.synonymIndex = (state.synonymIndex + 1) % WORD_DATABASE.length;
    setTimeout(startSynonymGame, 1000);
  } else {
    audio.wrong();
    state.streak = 0;
    showToast(`Mistake! The true synonym was "${correct}"`, "❌", "error");
    shakeContainer("synonym-options-container");
    
    state.synonymIndex = (state.synonymIndex + 1) % WORD_DATABASE.length;
    setTimeout(startSynonymGame, 1500);
  }
  renderStats();
  saveLocalStorage();
}

function handleSynonymTimeout() {
  state.totalAnswers++;
  state.streak = 0;
  audio.wrong();
  const correctAns = WORD_DATABASE[state.synonymIndex].correctSynonym;
  showToast(`Time ran out! The correct synonym was "${correctAns}"`, "⏰", "error");
  shakeContainer("synonym-target-word");
  
  state.synonymIndex = (state.synonymIndex + 1) % WORD_DATABASE.length;
  setTimeout(startSynonymGame, 1500);
  renderStats();
  saveLocalStorage();
}


// --- GAME 3: WORD BUILDER LOGIC ---
function setupBuilderGame() {
  const entry = WORD_DATABASE[state.builderPoolIndex];
  
  // Extract unique core letters from database entries
  const chars = Array.from(new Set(entry.word.split("")));
  if (chars.length < 4) {
    // backup letters just in case
    chars.push("A","E","R","S");
  }

  // Select center mandatory letter
  state.builderCoreLetter = chars[0];
  // Outer ring characters
  state.builderRingLetters = chars.slice(1, 7); // max 6 surrounding characters
  
  // Render dynamic values
  document.getElementById("builder-center-letter").textContent = state.builderCoreLetter;
  document.getElementById("builder-found-count").textContent = `0/${entry.subwords.length}`;
  state.builderFoundList = [];
  state.builderCurrentDraft = "";
  document.getElementById("builder-current-draft").textContent = "";

  // Render outer ring absolutely positioned circles
  const ringContainer = document.getElementById("builder-ring-letters-container");
  ringContainer.innerHTML = "";

  const radius = 64; // px distance from center
  const count = state.builderRingLetters.length;

  state.builderRingLetters.forEach((char, idx) => {
    const angle = (idx * 2 * Math.PI) / count;
    const x = Math.round(radius * Math.cos(angle)) + 88 - 19; // 88 is half of 176 (44rem equivalent)
    const y = Math.round(radius * Math.sin(angle)) + 88 - 19;

    const item = document.createElement("div");
    item.className = "hive-letter";
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.textContent = char;
    
    item.addEventListener("click", () => {
      audio.click();
      state.builderCurrentDraft += char;
      updateBuilderDraftUI();
    });
    
    ringContainer.appendChild(item);
  });

  // Center core click action
  const centerCore = document.getElementById("builder-center-letter");
  // clear existing clones to avoid duplicate event bounds
  const newCenter = centerCore.cloneNode(true);
  centerCore.parentNode.replaceChild(newCenter, centerCore);
  newCenter.addEventListener("click", () => {
    audio.click();
    state.builderCurrentDraft += state.builderCoreLetter;
    updateBuilderDraftUI();
  });

  // Redraw empty found list
  renderDiscoveredSubwords();
}

function updateBuilderDraftUI() {
  document.getElementById("builder-current-draft").textContent = state.builderCurrentDraft;
}

function renderDiscoveredSubwords() {
  const tagContainer = document.getElementById("builder-discovered-tags");
  if (state.builderFoundList.length === 0) {
    tagContainer.innerHTML = `<span class="text-xs text-slate-500 italic">None yet. Click the letters above to construct!</span>`;
  } else {
    tagContainer.innerHTML = state.builderFoundList.map(word => 
      `<span class="bg-pink-500/10 text-pink-300 px-2.5 py-1 rounded-md text-xs font-bold border border-pink-500/20 uppercase tracking-wider animate-bounce">${word}</span>`
    ).join("");
  }
}

function checkBuilderWord() {
  const draft = state.builderCurrentDraft.trim().toUpperCase();
  const entry = WORD_DATABASE[state.builderPoolIndex];

  if (!draft) {
    showToast("Click letters above to form a word first!", "⚠️", "error");
    shakeContainer("builder-current-draft");
    return;
  }

  // Must contain center mandatory letter
  if (!draft.includes(state.builderCoreLetter)) {
    audio.wrong();
    showToast(`Missing core letter! Form word with center core "${state.builderCoreLetter}"`, "⚠️", "error");
    shakeContainer("builder-center-letter");
    return;
  }

  if (state.builderFoundList.includes(draft)) {
    showToast(`Already discovered "${draft}"! Find another combination.`, "💡", "error");
    shakeContainer("builder-current-draft");
    return;
  }

  // Check validation in custom database words array list
  if (entry.subwords.includes(draft) || draft === entry.word) {
    audio.correct();
    state.builderFoundList.push(draft);
    state.discoveredWords++;
    state.correctAnswers++;
    state.score += 30;
    awardXP(25);

    addJournalEntry(draft, `Discovered inside ${entry.word}`, "Success");
    showToast(`Discovered word "${draft}"! (+25 XP)`, "✨", "success");

    document.getElementById("builder-found-count").textContent = `${state.builderFoundList.length}/${entry.subwords.length}`;
    renderDiscoveredSubwords();
    state.builderCurrentDraft = "";
    updateBuilderDraftUI();

    // Complete whole level bonus if found more than 3
    if (state.builderFoundList.length >= entry.subwords.length) {
      showToast(`Sensational! Completed the entire list of words in this pool!`, "🏆", "success");
      awardXP(100);
      state.builderPoolIndex = (state.builderPoolIndex + 1) % WORD_DATABASE.length;
      setTimeout(setupBuilderGame, 2000);
    }
  } else {
    audio.wrong();
    showToast(`"${draft}" is not in the subwords dictionary pool. Try again!`, "❌", "error");
    shakeContainer("builder-current-draft");
  }
  renderStats();
  saveLocalStorage();
}


// --- GLOBAL CORE HELPERS & UI UPDATES ---

function awardXP(amount) {
  state.xp += amount;
  if (state.xp >= state.xpToNextLevel) {
    state.xp -= state.xpToNextLevel;
    state.level++;
    audio.levelUp();
    showToast(`LEVEL UP! You reached Rank level ${state.level}!`, "👑", "success");
  }
  renderStats();
}

function renderStats() {
  // Header levels
  document.getElementById("user-level-val").textContent = state.level;
  document.getElementById("xp-ratio-text").textContent = `${state.xp}/${state.xpToNextLevel} XP`;
  
  const progressPercent = Math.min(100, Math.floor((state.xp / state.xpToNextLevel) * 100));
  document.getElementById("xp-progress-bar").style.width = `${progressPercent}%`;

  // Global sidebar state values
  document.getElementById("streak-val").textContent = state.streak;
  document.getElementById("score-val").textContent = state.score;
  document.getElementById("stats-total-answers").textContent = state.totalAnswers;
  document.getElementById("stats-correct-answers").textContent = state.correctAnswers;
  document.getElementById("stats-discovered").textContent = state.discoveredWords;
  document.getElementById("stats-max-streak").textContent = state.maxStreak;

  // Vocabulary Title Ranking mapper
  let rankName = "Neophyte Novice";
  if (state.score > 100) rankName = "Word apprentice";
  if (state.score > 300) rankName = "Lexicon Explorer";
  if (state.score > 600) rankName = "Elite Grammarian";
  if (state.score > 1000) rankName = "Phonetic Wizard";
  if (state.score > 2000) rankName = "Grand LexiQuest Lord";
  
  document.getElementById("rank-title").textContent = rankName;

  // Journal Count
  document.getElementById("journal-count").textContent = state.questJournal.length;
  renderJournalHTML();
}

// Sound Toggle Controller
const btnSound = document.getElementById("btn-toggle-sound");
btnSound.addEventListener("click", () => {
  audio.enabled = !audio.enabled;
  if (audio.enabled) {
    document.getElementById("sound-on-icon").classList.remove("hidden");
    document.getElementById("sound-off-icon").classList.add("hidden");
    audio.click();
  } else {
    document.getElementById("sound-on-icon").classList.add("hidden");
    document.getElementById("sound-off-icon").classList.remove("hidden");
  }
});

// Toast Alert Engine
function showToast(message, emoji = "🔔", type = "success") {
  const feedbackEl = document.getElementById("game-feedback");
  const emojiEl = document.getElementById("feedback-emoji");
  const titleEl = document.getElementById("feedback-title");
  const bodyEl = document.getElementById("feedback-body");

  emojiEl.textContent = emoji;
  bodyEl.textContent = message;

  if (type === "success") {
    feedbackEl.className = "flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-200 transition-all duration-300";
    titleEl.textContent = "Perfect Move!";
  } else {
    feedbackEl.className = "flex items-center justify-between p-3.5 rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 transition-all duration-300";
    titleEl.textContent = "Incorrect / Warning";
  }
  feedbackEl.classList.remove("hidden");
}

// Hide Toast event
document.getElementById("btn-dismiss-feedback").addEventListener("click", () => {
  document.getElementById("game-feedback").classList.add("hidden");
});

// Shake effect helper
function shakeContainer(elementId) {
  const target = document.getElementById(elementId);
  if (target) {
    target.classList.add("shake-wrong");
    setTimeout(() => {
      target.classList.remove("shake-wrong");
    }, 450);
  }
}

// Journal Storage log appends
function addJournalEntry(word, gameModeText, status) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.questJournal.unshift({
    word,
    mode: gameModeText,
    status,
    time: timestamp
  });
  // limit to 30 history entries
  if (state.questJournal.length > 30) {
    state.questJournal.pop();
  }
}

function renderJournalHTML() {
  const container = document.getElementById("journal-list");
  if (state.questJournal.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs italic">
        No word completions logged yet. Start playing either mode!
      </div>
    `;
    return;
  }

  container.innerHTML = state.questJournal.map(item => `
    <div class="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all">
      <div>
        <p class="text-xs font-bold text-slate-200 uppercase tracking-wide">${item.word}</p>
        <p class="text-[10px] text-slate-500">${item.mode} • ${item.time}</p>
      </div>
      <span class="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold">
        +XP
      </span>
    </div>
  `).join("");
}

// Reset Quest Game State
document.getElementById("btn-reset-stats").addEventListener("click", () => {
  if (confirm("Are you sure you want to completely reset all your LexiQuest score, XP, and words levels?")) {
    localStorage.removeItem("lexiquest_save_v1");
    state.level = 1;
    state.xp = 0;
    state.score = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.totalAnswers = 0;
    state.correctAnswers = 0;
    state.discoveredWords = 0;
    state.questJournal = [];
    
    renderStats();
    showToast("All quest progress data successfully wiped clean.", "🔄", "success");
  }
});

// Daily Word of the day logic
function updateDailyWordWidget() {
  const index = new Date().getDate() % WORD_DATABASE.length;
  const dailyItem = WORD_DATABASE[index];
  
  document.getElementById("daily-word-title").textContent = dailyItem.word;
  document.getElementById("daily-word-meaning").textContent = dailyItem.clue;

  document.getElementById("btn-learn-word").addEventListener("click", () => {
    audio.click();
    showToast(`Learning: ${dailyItem.word} is defined as ${dailyItem.clue}`, "📖", "success");
  });
}

// Click event triggers on Buttons inside individual views
function setupGlobalEventListeners() {
  // SCRAMBLE Buttons
  document.getElementById("btn-scramble-submit").addEventListener("click", () => {
    submitScramble();
  });

  document.getElementById("scramble-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitScramble();
    }
  });

  document.getElementById("btn-scramble-clear").addEventListener("click", () => {
    audio.click();
    document.getElementById("scramble-input").value = "";
  });

  document.getElementById("btn-scramble-shuffle").addEventListener("click", () => {
    audio.click();
    state.scrambleShuffledWord = shuffleString(state.scrambleOriginalWord);
    // Re-render
    const container = document.getElementById("scramble-letters-container");
    container.innerHTML = "";
    state.scrambleShuffledWord.split("").forEach((char) => {
      const btn = document.createElement("button");
      btn.className = "h-12 w-12 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-lg rounded-xl transition-all active:scale-95 shadow border border-slate-700";
      btn.textContent = char;
      btn.addEventListener("click", () => {
        audio.click();
        document.getElementById("scramble-input").value += char;
      });
      container.appendChild(btn);
    });
    showToast("Reshuffled spelling board letters!", "🔀", "success");
  });

  document.getElementById("scramble-hint-btn").addEventListener("click", () => {
    if (state.xp >= 15) {
      state.xp -= 15;
      renderStats();
      const entry = WORD_DATABASE[state.scrambleIndex];
      // Provide a letter clue
      const correctWord = entry.word;
      const hintChar = correctWord.slice(0, 2);
      showToast(`Hint letter clues: Starts with "${hintChar}"`, "💡", "success");
    } else {
      showToast(`Not enough XP to trade for a hint! Requires 15 XP.`, "❌", "error");
    }
  });

  document.getElementById("btn-scramble-skip").addEventListener("click", () => {
    audio.click();
    state.streak = 0;
    state.scrambleIndex = (state.scrambleIndex + 1) % WORD_DATABASE.length;
    setupScrambleGame();
    showToast("Word skipped. New scrambled word loaded!", "⏭️", "success");
    renderStats();
  });

  // BUILDER Buttons
  document.getElementById("btn-builder-delete").addEventListener("click", () => {
    audio.click();
    state.builderCurrentDraft = state.builderCurrentDraft.slice(0, -1);
    updateBuilderDraftUI();
  });

  document.getElementById("btn-builder-clear").addEventListener("click", () => {
    audio.click();
    state.builderCurrentDraft = "";
    updateBuilderDraftUI();
  });

  document.getElementById("btn-builder-shuffle").addEventListener("click", () => {
    audio.click();
    state.builderRingLetters.sort(() => Math.random() - 0.5);
    
    // Redraw circles
    const ringContainer = document.getElementById("builder-ring-letters-container");
    ringContainer.innerHTML = "";
    const radius = 64;
    const count = state.builderRingLetters.length;
    state.builderRingLetters.forEach((char, idx) => {
      const angle = (idx * 2 * Math.PI) / count;
      const x = Math.round(radius * Math.cos(angle)) + 88 - 19;
      const y = Math.round(radius * Math.sin(angle)) + 88 - 19;

      const item = document.createElement("div");
      item.className = "hive-letter";
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.textContent = char;
      item.addEventListener("click", () => {
        audio.click();
        state.builderCurrentDraft += char;
        updateBuilderDraftUI();
      });
      ringContainer.appendChild(item);
    });
  });

  document.getElementById("btn-builder-reroll").addEventListener("click", () => {
    audio.click();
    state.builderPoolIndex = (state.builderPoolIndex + 1) % WORD_DATABASE.length;
    setupBuilderGame();
    showToast("Loaded a brand new Spelling Builder letter challenge!", "🔄", "success");
  });

  document.getElementById("btn-builder-submit").addEventListener("click", () => {
    checkBuilderWord();
  });
}