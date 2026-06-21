// Educational Data Sets: Achulu (Vowels) & Hallulu (Consonants)
const vowels = [
  { char: "అ", roman: "a", word: "అమ్మ (Amma)", mean: "Mother", type: "Vowel" },
  { char: "ఆ", roman: "aa", word: "ఆట (Aata)", mean: "Game", type: "Vowel" },
  { char: "ఇ", roman: "i", word: "ఇల్లు (Illu)", mean: "House", type: "Vowel" },
  { char: "ఈ", roman: "ee", word: "ఈల (Eela)", mean: "Whistle", type: "Vowel" },
  { char: "ఉ", roman: "u", word: "ఉడుత (Uduta)", mean: "Squirrel", type: "Vowel" },
  { char: "ఊ", roman: "oo", word: "ఊయల (Ooyala)", mean: "Cradle", type: "Vowel" },
  { char: "ఋ", roman: "ru", word: "ఋషి (Rushi)", mean: "Sage", type: "Vowel" },
  { char: "ఎ", roman: "e", word: "ఎలుక (Eluka)", mean: "Rat", type: "Vowel" },
  { char: "ఏ", roman: "ae", word: "ఏనుగు (Aenugu)", mean: "Elephant", type: "Vowel" },
  { char: "ఐ", roman: "ai", word: "ఐదు (Aidu)", mean: "Five", type: "Vowel" },
  { char: "ఒ", roman: "o", word: "ఒంటె (Onte)", mean: "Camel", type: "Vowel" },
  { char: "ఓ", roman: "oo", word: "ఓడ (Oda)", mean: "Ship", type: "Vowel" },
  { char: "ఔ", roman: "au", word: "ఔషధం (Aushadham)", mean: "Medicine", type: "Vowel" },
  { char: "అం", roman: "am", word: "అందము (Andhamu)", mean: "Beauty", type: "Vowel" },
  { char: "అః", roman: "aha", word: "అంతఃపురం (Anthapuram)", mean: "Palace", type: "Vowel" }
];

const consonants = [
  { char: "క", roman: "ka", word: "కల (Kala)", mean: "Dream", type: "Consonant" },
  { char: "ఖ", roman: "kha", word: "ఖడ్గం (Khadgam)", mean: "Sword", type: "Consonant" },
  { char: "గ", roman: "ga", word: "గడియారం (Gadiyaram)", mean: "Clock", type: "Consonant" },
  { char: "ఘ", roman: "gha", word: "ఘటం (Ghatam)", mean: "Pot", type: "Consonant" },
  { char: "చ", roman: "cha", word: "చక్రం (Chakram)", mean: "Wheel", type: "Consonant" },
  { char: "ఛ", roman: "chha", word: "ఛత్రి (Chhatri)", mean: "Umbrella", type: "Consonant" },
  { char: "జ", roman: "ja", word: "జడ (Jada)", mean: "Plait / Hair braid", type: "Consonant" },
  { char: "ఝ", roman: "jha", word: "ఝషం (Jhasham)", mean: "Fish", type: "Consonant" },
  { char: "ట", roman: "ta", word: "టమాటా (Tamata)", mean: "Tomato", type: "Consonant" },
  { char: "డ", roman: "da", word: "డబ్బా (Dabba)", mean: "Box", type: "Consonant" },
  { char: "త", roman: "tha", word: "తబలా (Tabala)", mean: "Tabla drum", type: "Consonant" },
  { char: "ద", roman: "da", word: "దండ (Danda)", mean: "Garland", type: "Consonant" },
  { char: "ధ", roman: "dha", word: "ధనస్సు (Dhanassu)", mean: "Bow", type: "Consonant" },
  { char: "న", roman: "na", word: "నగ (Naga)", mean: "Jewel", type: "Consonant" },
  { char: "ప", roman: "pa", word: "పడవ (Padava)", mean: "Boat", type: "Consonant" },
  { char: "ఫ", roman: "pha", word: "ఫలం (Phalam)", mean: "Fruit", type: "Consonant" },
  { char: "బ", roman: "ba", word: "బంతి (Banthi)", mean: "Ball", type: "Consonant" },
  { char: "భ", roman: "bha", word: "భల్లూకం (Bhallookam)", mean: "Bear", type: "Consonant" },
  { char: "మ", roman: "ma", word: "మంచం (Mancham)", mean: "Cot", type: "Consonant" },
  { char: "య", roman: "ya", word: "యజ్ఞం (Yagnam)", mean: "Ritual fire", type: "Consonant" },
  { char: "ర", roman: "ra", word: "రథం (Ratham)", mean: "Chariot", type: "Consonant" },
  { char: "ల", roman: "la", word: "లత (Lata)", mean: "Creeper plant", type: "Consonant" },
  { char: "వ", roman: "va", word: "వల (Vala)", mean: "Net", type: "Consonant" },
  { char: "శ", roman: "sha", word: "శంఖం (Shankham)", mean: "Conch", type: "Consonant" },
  { char: "స", roman: "sa", word: "సబ్బు (Sabbu)", mean: "Soap", type: "Consonant" },
  { char: "హ", roman: "ha", word: "హంస (Hamsa)", mean: "Swan", type: "Consonant" }
];

// Comprehensive list of questions for the dynamic Quiz challenge
const quizQuestions = [
  { q: "Which Telugu letter represents the vowel sound 'a' (as in Mother)?", options: ["అ", "ఆ", "ఇ", "ఈ"], answer: "అ" },
  { q: "Identify the consonant 'ka' (క) from the options below:", options: ["క", "ఖ", "గ", "ఘ"], answer: "క" },
  { q: "What does the word 'అమ్మ (Amma)' mean?", options: ["Mother", "Game", "House", "Swan"], answer: "Mother" },
  { q: "Which Telugu consonant represents the sound 'la' as in Net/Creeper?", options: ["మ", "య", "ర", "ల"], answer: "ల" },
  { q: "What is the meaning of the Telugu word 'ఈల (Eela)'?", options: ["Whistle", "Elephant", "Cradle", "Medicine"], answer: "Whistle" },
  { q: "Identify the Telugu letter representing 'oo' as in Cradle/Ship:", options: ["ఊ", "ఋ", "ఎ", "ఓ"], answer: "ఊ" },
  { q: "What is the meaning of the consonant-based word 'కల (Kala)'?", options: ["Dream", "Fruit", "Garland", "Jewel"], answer: "Dream" }
];

// State variables
let selectedLetter = vowels[0];
let activeTab = "vowels"; // 'vowels' or 'consonants'
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let guideVisible = true;
let userScore = 0;

// Quiz variables
let activeQuizQuestions = [];
let currentQuestionIndex = 0;
let quizCorrectCount = 0;
let isQuizAnswered = false;

// Word Sandbox
let constructedWord = "";

// Web Audio API Synth for elegant retro sounds
let audioCtx = null;
function playSynthSound(freq, type, duration) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Web Audio not fully supported or blocked by browser policy.");
  }
}

// Toast feedback trigger
function triggerToast(message) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    
    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-20", "opacity-0");
    }, 2800);
  }
}

// Update XP Global Score Visuals
function changeScore(points) {
  userScore += points;
  if (userScore < 0) userScore = 0;
  const scoreBadge = document.getElementById("global-score-badge");
  if (scoreBadge) {
    scoreBadge.innerText = userScore;
  }
  localStorage.setItem("telugu_app_score", userScore);
}

// Initialize Sandbox & Canvas drawing logic
const canvas = document.getElementById("drawing-canvas");
let ctx = null;
if (canvas) {
  ctx = canvas.getContext("2d");
}

function setupDrawingCanvas() {
  if (!canvas || !ctx) return;
  
  // Handle resizing/responsive canvas alignment
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.strokeStyle = "#fbbf24"; // Amber color
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  
  // Drawing events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);
  
  // Touch events for tablets/mobiles
  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    e.preventDefault();
  }, { passive: false });
  
  canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    e.preventDefault();
  }, { passive: false });
  
  canvas.addEventListener("touchend", (e) => {
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  });
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  
  document.getElementById("canvas-status").innerText = "Writing...";
  document.getElementById("canvas-status").classList.add("text-amber-400");
  playSynthSound(420, "sine", 0.05);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const currX = e.clientX - rect.left;
  const currY = e.clientY - rect.top;

  // Get dynamic brush size
  const brushVal = document.getElementById("canvas-brush-size").value || 6;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currX, currY);
  ctx.lineWidth = brushVal;
  ctx.stroke();
  
  lastX = currX;
  lastY = currY;
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    document.getElementById("canvas-status").innerText = "Drawn successfully";
    document.getElementById("canvas-status").classList.remove("text-amber-400");
  }
}

// Load letters into UI grid selector
function populateLettersGrid() {
  const grid = document.getElementById("letters-grid");
  if (!grid) return;
  
  grid.innerHTML = "";
  const list = activeTab === "vowels" ? vowels : consonants;
  
  list.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `letter-card flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 shadow-md ${selectedLetter.char === item.char ? 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-100 hover:border-amber-500/40'}`;
    btn.id = `letter-card-${activeTab}-${index}`;
    btn.innerHTML = `
      <span class="text-2xl mb-1">${item.char}</span>
      <span class="text-[10px] uppercase tracking-wider ${selectedLetter.char === item.char ? 'text-slate-900' : 'text-slate-400'}">${item.roman}</span>
    `;
    
    btn.addEventListener("click", () => {
      selectLetter(item);
      // Sound effect
      playSynthSound(550, "triangle", 0.1);
    });
    grid.appendChild(btn);
  });
}

// Update Pronunciation card and dynamic Canvas bg guide
function selectLetter(letter) {
  selectedLetter = letter;
  
  // Re-render grid to update active card states
  populateLettersGrid();

  // Update UI guide card elements
  document.getElementById("card-big-char").innerText = letter.char;
  document.getElementById("card-roman-sound").innerText = letter.roman;
  document.getElementById("card-example-word").innerHTML = `${letter.word}`;
  document.getElementById("card-example-meaning").innerText = `Meaning: ${letter.mean}`;
  
  const badge = document.getElementById("selected-letter-type");
  badge.innerText = letter.type;
  if (letter.type === "Vowel") {
    badge.className = "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30";
  } else {
    badge.className = "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  }

  // Update Canvas background Trace guide text
  const traceBg = document.getElementById("canvas-trace-background");
  if (traceBg) {
    traceBg.innerHTML = `<span class="text-slate-800/60 text-9xl font-bold select-none">${letter.char}</span>`;
  }
  
  triggerToast(`Loaded '${letter.char}' into the writing pad guide.`);
}

// Simulated Web Audio synth Voice pronunciation guide!
function generateSimulatedSpeech(char, roman) {
  // Attempt real browser Speech Synthesis, default fallback to nice customized modular synth chime
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(char);
    // Try setting voice to Indian accent if possible
    const voices = window.speechSynthesis.getVoices();
    const inVoice = voices.find(v => v.lang.includes("TE") || v.lang.includes("IN"));
    if (inVoice) utterance.voice = inVoice;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    triggerToast(`Audio: Pronouncing '${char}' (${roman})`);
  }
  
  // Sound effect feedback
  playSynthSound(600, "sine", 0.15);
  setTimeout(() => {
    playSynthSound(780, "sine", 0.12);
  }, 80);
}

// Quiz System Logic
function setupQuiz() {
  // Randomize a pool of 5 questions
  activeQuizQuestions = [...quizQuestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
    
  currentQuestionIndex = 0;
  quizCorrectCount = 0;
  isQuizAnswered = false;
  
  document.getElementById("quiz-content-wrapper").classList.remove("hidden");
  document.getElementById("quiz-result-view").classList.add("hidden");
  
  loadQuizQuestion();
}

function loadQuizQuestion() {
  isQuizAnswered = false;
  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.classList.add("hidden");
  
  const qData = activeQuizQuestions[currentQuestionIndex];
  document.getElementById("quiz-curr-index").innerText = currentQuestionIndex + 1;
  document.getElementById("quiz-question-text").innerText = qData.q;
  
  // Update Progress Bar
  const progressPct = ((currentQuestionIndex) / 5) * 100;
  document.getElementById("quiz-progress-bar").style.width = `${progressPct}%`;
  document.getElementById("quiz-score-fraction").innerText = `${quizCorrectCount} / 5 Correct`;
  
  // Render Options
  const optionsGrid = document.getElementById("quiz-options-grid");
  optionsGrid.innerHTML = "";
  
  qData.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.id = `quiz-option-btn-${idx}`;
    btn.className = "option-btn w-full p-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition duration-200 active:scale-98";
    btn.innerText = opt;
    
    btn.addEventListener("click", () => {
      handleQuizAnswer(opt, btn, qData.answer);
    });
    
    optionsGrid.appendChild(btn);
  });
}

function handleQuizAnswer(selectedOption, clickedButton, correctAnswer) {
  if (isQuizAnswered) return;
  isQuizAnswered = true;
  
  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.classList.remove("hidden");
  
  // Highlight options
  const optionsGrid = document.getElementById("quiz-options-grid");
  const buttons = optionsGrid.querySelectorAll("button");
  
  if (selectedOption === correctAnswer) {
    clickedButton.classList.add("option-btn-correct");
    quizCorrectCount++;
    changeScore(20);
    
    feedbackBox.className = "p-3 rounded-xl border text-xs text-center font-semibold bg-emerald-950/80 text-emerald-300 border-emerald-500/40 animate-bounce";
    feedbackBox.innerText = "✨ Correct! Excellent memory! (+20 XP)";
    playSynthSound(880, "sine", 0.15);
  } else {
    clickedButton.classList.add("option-btn-incorrect");
    changeScore(-5);
    
    // Highlight correct option
    buttons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.classList.add("option-btn-correct");
      }
    });
    
    feedbackBox.className = "p-3 rounded-xl border text-xs text-center font-semibold bg-rose-950/80 text-rose-300 border-rose-500/40";
    feedbackBox.innerText = `Incorrect. The correct answer was "${correctAnswer}"`;
    playSynthSound(220, "sawtooth", 0.3);
  }
  
  // Update Progress fraction real-time
  document.getElementById("quiz-score-fraction").innerText = `${quizCorrectCount} / 5 Correct`;
  
  // Transition to next or results after a delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 5) {
      loadQuizQuestion();
    } else {
      showQuizResults();
    }
  }, 2200);
}

function showQuizResults() {
  document.getElementById("quiz-progress-bar").style.width = `100%`;
  document.getElementById("quiz-content-wrapper").classList.add("hidden");
  document.getElementById("quiz-result-view").classList.remove("hidden");
  
  document.getElementById("quiz-final-score-text").innerText = `${quizCorrectCount} / 5`;
  
  let achievementMsg = "Keep practicing to master Telugu!";
  if (quizCorrectCount === 5) {
    achievementMsg = "👑 PERFECT SCORE! You are a Telugu genius! (+100 XP)";
    changeScore(100);
  } else if (quizCorrectCount >= 3) {
    achievementMsg = "👍 Good job! Keep practicing to get a perfect score!";
    changeScore(30);
  }
  
  triggerToast(achievementMsg);
}

// Word Constructor Logic
function setupWordBuilder() {
  const display = document.getElementById("constructed-word-display");
  const translationDisplay = document.getElementById("constructed-word-translation");
  const emptyMsg = document.getElementById("constructor-empty-text");
  
  // Render helpers
  function updateWordDisplay() {
    if (constructedWord.length > 0) {
      emptyMsg.classList.add("hidden");
      display.innerText = constructedWord;
    } else {
      emptyMsg.classList.remove("hidden");
      display.innerText = "";
      translationDisplay.innerText = "";
    }
  }

  // Click custom helper letters
  const paletteButtons = document.querySelectorAll(".btn-palette-char");
  paletteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const letterChar = btn.getAttribute("data-char");
      constructedWord += letterChar;
      updateWordDisplay();
      playSynthSound(480, "triangle", 0.1);
    });
  });

  // Clear word sandbox
  document.getElementById("btn-clear-constructed").addEventListener("click", () => {
    constructedWord = "";
    updateWordDisplay();
    playSynthSound(300, "sine", 0.1);
    triggerToast("Cleared spelled word");
  });

  // Spell Checker Action
  document.getElementById("btn-check-constructed").addEventListener("click", () => {
    if (constructedWord === "") {
      triggerToast("Add some character blocks first!");
      return;
    }
    
    // Check curated Telugu simple words
    const parsedWord = constructedWord.replace(/\s+/g, '');
    let matched = null;
    
    if (parsedWord === "అమ్మ") {
      matched = { translation: "Mother", roman: "Amma", bonus: 40 };
    } else if (parsedWord === "ఆట") {
      matched = { translation: "Game / Play", roman: "Aata", bonus: 40 };
    } else if (parsedWord === "ఈల") {
      matched = { translation: "Whistle", roman: "Eela", bonus: 40 };
    } else if (parsedWord === "కల") {
      matched = { translation: "Dream", roman: "Kala", bonus: 40 };
    } else if (parsedWord === "వల") {
      matched = { translation: "Net", roman: "Vala", bonus: 30 };
    } else if (parsedWord === "పడవ") {
      matched = { translation: "Boat", roman: "Padava", bonus: 30 };
    }
    
    if (matched) {
      translationDisplay.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Spelled Correctly!</span> - "${matched.translation}" (${matched.roman})`;
      changeScore(matched.bonus);
      triggerToast(`Magnificent! Spelled "${matched.roman}" (+${matched.bonus} XP)`);
      playSynthSound(950, "sine", 0.2);
    } else {
      translationDisplay.innerHTML = `<span class="text-rose-400 font-semibold">Unrecognized Word</span> - Try tracing clues below.`;
      playSynthSound(280, "sawtooth", 0.25);
      triggerToast("That sequence doesn't match our sandbox target words! Keep trying.");
    }
  });
}

// Reset application progress
function resetProgress() {
  userScore = 0;
  localStorage.removeItem("telugu_app_score");
  const scoreBadge = document.getElementById("global-score-badge");
  if (scoreBadge) scoreBadge.innerText = "0";
  
  setupQuiz();
  constructedWord = "";
  const display = document.getElementById("constructed-word-display");
  const translationDisplay = document.getElementById("constructed-word-translation");
  const emptyMsg = document.getElementById("constructor-empty-text");
  if (display) display.innerText = "";
  if (translationDisplay) translationDisplay.innerText = "";
  if (emptyMsg) emptyMsg.classList.remove("hidden");
  
  triggerToast("All educational points and progress have been reset.");
  playSynthSound(350, "sawtooth", 0.3);
}

// Main Setup entry on load
document.addEventListener("DOMContentLoaded", () => {
  // Load saved score from Storage
  const savedScore = localStorage.getItem("telugu_app_score");
  if (savedScore) {
    userScore = parseInt(savedScore, 10) || 0;
    const scoreBadge = document.getElementById("global-score-badge");
    if (scoreBadge) scoreBadge.innerText = userScore;
  }
  
  // Initialize sub-modules
  setupDrawingCanvas();
  populateLettersGrid();
  setupQuiz();
  setupWordBuilder();

  // Tab listeners
  const tabVowels = document.getElementById("tab-vowels");
  const tabConsonants = document.getElementById("tab-consonants");
  
  tabVowels.addEventListener("click", () => {
    activeTab = "vowels";
    tabVowels.className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 shadow-md transition-all duration-200";
    tabConsonants.className = "px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200";
    populateLettersGrid();
    selectLetter(vowels[0]);
  });

  tabConsonants.addEventListener("click", () => {
    activeTab = "consonants";
    tabConsonants.className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 shadow-md transition-all duration-200";
    tabVowels.className = "px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200";
    populateLettersGrid();
    selectLetter(consonants[0]);
  });

  // Canvas control actions
  document.getElementById("btn-canvas-clear").addEventListener("click", () => {
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById("canvas-status").innerText = "Canvas cleared";
      playSynthSound(300, "sine", 0.15);
    }
  });

  // Toggle Canvas trace guide
  document.getElementById("btn-toggle-guide").addEventListener("click", () => {
    const traceBg = document.getElementById("canvas-trace-background");
    const toggleBtn = document.getElementById("btn-toggle-guide");
    
    guideVisible = !guideVisible;
    if (guideVisible) {
      traceBg.style.opacity = "1";
      toggleBtn.innerText = "Hide Guide";
      toggleBtn.className = "px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 text-xs font-medium rounded-lg transition";
    } else {
      traceBg.style.opacity = "0";
      toggleBtn.innerText = "Show Guide";
      toggleBtn.className = "px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-lg transition";
    }
    playSynthSound(620, "sine", 0.05);
  });

  // Voice pronunciation clicker
  document.getElementById("btn-speak-letter").addEventListener("click", () => {
    generateSimulatedSpeech(selectedLetter.char, selectedLetter.roman);
  });

  // Quiz controls
  document.getElementById("btn-restart-quiz").addEventListener("click", () => {
    setupQuiz();
    triggerToast("New quiz challenge started!");
    playSynthSound(700, "sine", 0.1);
  });
  
  // General App Reset progression trigger
  document.getElementById("btn-reset-app").addEventListener("click", resetProgress);
});