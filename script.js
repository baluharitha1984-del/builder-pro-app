// Comprehensive Child-friendly Word Dataset (6 levels x 20 words = 120 words total in absolute CAPITAL LETTERS)
const vocabLevels = [
  {
    title: "🦁 జంతువులు (Animals Word Board)",
    subtitle: "LEVEL 1: WILD & DOMESTIC ANIMALS",
    words: [
      { eng: "LION", tel: "సింహం", emoji: "🦁" },
      { eng: "TIGER", tel: "పులి", emoji: "🐯" },
      { eng: "ELEPHANT", tel: "ఏనుగు", emoji: "🐘" },
      { eng: "MONKEY", tel: "కోతి", emoji: "🐒" },
      { eng: "DOG", tel: "కుక్క", emoji: "🐶" },
      { eng: "CAT", tel: "పిల్లి", emoji: "🐱" },
      { eng: "COW", tel: "ఆవు", emoji: "🐮" },
      { eng: "HORSE", tel: "గుర్రం", emoji: "🐴" },
      { eng: "RABBIT", tel: "కుందేలు", emoji: "🐰" },
      { eng: "BEAR", tel: "ఎలుగుబంటి", emoji: "🐻" },
      { eng: "ZEBRA", tel: "చారల గుర్రం", emoji: "🦓" },
      { eng: "DEER", tel: "జింక", emoji: "🦌" },
      { eng: "FOX", tel: "నక్క", emoji: "🦊" },
      { eng: "SHEEP", tel: "గొర్రె", emoji: "🐑" },
      { eng: "GOAT", tel: "మేక", emoji: "🐐" },
      { eng: "PIG", tel: "పంది", emoji: "🐷" },
      { eng: "CAMEL", tel: "ఒంటె", emoji: "🐫" },
      { eng: "PANDA", tel: "పాండా", emoji: "🐼" },
      { eng: "GIRAFFE", tel: "జిరాఫీ", emoji: "🦒" },
      { eng: "DONKEY", tel: "గాడిద", emoji: "🫏" }
    ]
  },
  {
    title: "🍎 పండ్లు (Fruits Word Board)",
    subtitle: "LEVEL 2: DELICIOUS SWEET FRUITS",
    words: [
      { eng: "APPLE", tel: "ఆపిల్", emoji: "🍎" },
      { eng: "BANANA", tel: "అరటిపండు", emoji: "🍌" },
      { eng: "MANGO", tel: "మామిడి పండు", emoji: "🥭" },
      { eng: "ORANGE", tel: "నారింజ", emoji: "🍊" },
      { eng: "GRAPES", tel: "ద్రాక్ష", emoji: "🍇" },
      { eng: "PAPAYA", tel: "బొప్పాయి", emoji: "🍈" },
      { eng: "GUAVA", tel: "జామపండు", emoji: "🍏" },
      { eng: "WATERMELON", tel: "పుచ్చకాయ", emoji: "🍉" },
      { eng: "CHERRY", tel: "చెర్రీ", emoji: "🍒" },
      { eng: "PEACH", tel: "పీచ్ పండు", emoji: "🍑" },
      { eng: "PINEAPPLE", tel: "అనాసపండు", emoji: "🍍" },
      { eng: "COCONUT", tel: "కొబ్బరికాయ", emoji: "🥥" },
      { eng: "LEMON", tel: "నిమ్మకాయ", emoji: "🍋" },
      { eng: "STRAWBERRY", tel: "స్ట్రాబెర్రీ", emoji: "🍓" },
      { eng: "POMEGRANATE", tel: "దానిమ్మ", emoji: "🍎" },
      { eng: "KIWI", tel: "కివి పండు", emoji: "🥝" },
      { eng: "PEAR", tel: "బేరిపండు", emoji: "🍐" },
      { eng: "FIG", tel: "అంజీర", emoji: "🍇" },
      { eng: "AVOCADO", tel: "వెన్నపండు", emoji: "🥑" },
      { eng: "JACKFRUIT", tel: "పనసపండు", emoji: "🍉" }
    ]
  },
  {
    title: "🥦 కూరగాయలు (Vegetables Word Board)",
    subtitle: "LEVEL 3: HEALTHY VEGETABLES",
    words: [
      { eng: "POTATO", tel: "బంగాళదుంప", emoji: "🥔" },
      { eng: "TOMATO", tel: "టమోటా", emoji: "🍅" },
      { eng: "ONION", tel: "ఉల్లిపాయ", emoji: "🧅" },
      { eng: "CARROT", tel: "క్యారెట్", emoji: "🥕" },
      { eng: "CHILI", tel: "మిరపకాయ", emoji: "🌶️" },
      { eng: "CORN", tel: "మొక్కజొన్న", emoji: "🌽" },
      { eng: "CUCUMBER", tel: "కీరదోసకాయ", emoji: "🥒" },
      { eng: "GARLIC", tel: "వెల్లుల్లి", emoji: "🧄" },
      { eng: "GINGER", tel: "అల్లం", emoji: "🥔" },
      { eng: "BRINJAL", tel: "వంకాయ", emoji: "🍆" },
      { eng: "PUMPKIN", tel: "గుమ్మడికాయ", emoji: "🎃" },
      { eng: "SPINACH", tel: "పాలకూర", emoji: "🥬" },
      { eng: "PEAS", tel: "బఠానీలు", emoji: "🫛" },
      { eng: "BROCCOLI", tel: "బ్రోకలీ", emoji: "🥦" },
      { eng: "CABBAGE", tel: "క్యాబేజీ", emoji: "🥬" },
      { eng: "MUSHROOM", tel: "పుట్టగొడుగు", emoji: "🍄" },
      { eng: "RADISH", tel: "ముల్లంగి", emoji: "🥕" },
      { eng: "SWEET POTATO", tel: "చిలగడదుంప", emoji: "🥔" },
      { eng: "BEETROOT", tel: "బీట్‌రూట్", emoji: "🧅" },
      { eng: "LADYFINGER", tel: "బెండకాయ", emoji: "🥬" }
    ]
  },
  {
    title: "🎨 రంగులు & ఆకారాలు (Colors & Shapes)",
    subtitle: "LEVEL 4: BEAUTIFUL SHAPES & COLORS",
    words: [
      { eng: "RED", tel: "ఎరుపు రంగు", emoji: "🔴" },
      { eng: "BLUE", tel: "నీలం రంగు", emoji: "🔵" },
      { eng: "GREEN", tel: "ఆకుపచ్చ రంగు", emoji: "🟢" },
      { eng: "YELLOW", tel: "పసుపు రంగు", emoji: "🟡" },
      { eng: "PINK", tel: "గులాబీ రంగు", emoji: "🌸" },
      { eng: "ORANGE", tel: "నారింజ రంగు", emoji: "🍊" },
      { eng: "PURPLE", tel: "ఊదా రంగు", emoji: "💜" },
      { eng: "WHITE", tel: "తెలుపు రంగు", emoji: "⚪" },
      { eng: "BLACK", tel: "నలుపు రంగు", emoji: "⚫" },
      { eng: "BROWN", tel: "గోధుమ రంగు", emoji: "🟤" },
      { eng: "CIRCLE", tel: "గుండ్రము", emoji: "⭕" },
      { eng: "SQUARE", tel: "చతురస్రం", emoji: "⬛" },
      { eng: "TRIANGLE", tel: "త్రిభుజం", emoji: "🔺" },
      { eng: "STAR", tel: "నక్షత్రం", emoji: "⭐" },
      { eng: "HEART", tel: "గుండె ఆకారం", emoji: "❤️" },
      { eng: "DIAMOND", tel: "వజ్రం ఆకారం", emoji: "🔷" },
      { eng: "OVAL", tel: "గుడ్డు ఆకారం", emoji: "🥚" },
      { eng: "RECTANGLE", tel: "దీర్ఘచతురస్రం", emoji: "🟩" },
      { eng: "RING", tel: "రింగు ఆకారం", emoji: "💍" },
      { eng: "CUBE", tel: "ఘనము", emoji: "📦" }
    ]
  },
  {
    title: "🚀 వాహనాలు (Vehicles Word Board)",
    subtitle: "LEVEL 5: VEHICLES & TRANSPORT",
    words: [
      { eng: "CAR", tel: "కారు", emoji: "🚗" },
      { eng: "BUS", tel: "బస్సు", emoji: "🚌" },
      { eng: "TRAIN", tel: "రైలు బండి", emoji: "🚂" },
      { eng: "BICYCLE", tel: "సైకిల్", emoji: "🚲" },
      { eng: "MOTORBIKE", tel: "మోటార్ సైకిల్", emoji: "🏍️" },
      { eng: "AEROPLANE", tel: "విమానం", emoji: "✈️" },
      { eng: "HELICOPTER", tel: "హెలికాప్టర్", emoji: "🚁" },
      { eng: "ROCKET", tel: "రాకెట్", emoji: "🚀" },
      { eng: "BOAT", tel: "పడవ", emoji: "⛵" },
      { eng: "SHIP", tel: "ఓడ", emoji: "🚢" },
      { eng: "TRACTOR", tel: "ట్రాక్టర్", emoji: "🚜" },
      { eng: "TRUCK", tel: "లారీ", emoji: "🚚" },
      { eng: "AMBULANCE", tel: "ఆంబులెన్స్", emoji: "🚑" },
      { eng: "METRO", tel: "మెట్రో రైలు", emoji: "🚇" },
      { eng: "AUTO RICKSHAW", tel: "ఆటో రిక్షా", emoji: "🛺" },
      { eng: "JEEP", tel: "జీపు కారు", emoji: "🚙" },
      { eng: "HOT AIR BALLOON", tel: "బెలూన్ విమానం", emoji: "🎈" },
      { eng: "FIRE ENGINE", tel: "అగ్నిమాపక వాహనం", emoji: "🚒" },
      { eng: "SCOOTER", tel: "స్కూటర్", emoji: "🛵" },
      { eng: "VAN", tel: "వ్యాన్", emoji: "🚐" }
    ]
  },
  {
    title: "🏡 గృహ వస్తువులు (Nature & Household)",
    subtitle: "LEVEL 6: HOME & SCHOOL OBJECTS",
    words: [
      { eng: "HOUSE", tel: "ఇల్లు", emoji: "🏠" },
      { eng: "CHAIR", tel: "కుర్చీ", emoji: "🪑" },
      { eng: "TABLE", tel: "బల్ల", emoji: "🪵" },
      { eng: "BED", tel: "మంచం", emoji: "🛏️" },
      { eng: "BOOK", tel: "పుస్తకం", emoji: "📖" },
      { eng: "PEN", tel: "కలం", emoji: "🖊️" },
      { eng: "BAG", tel: "సంచి", emoji: "🎒" },
      { eng: "TOY", tel: "బొమ్మ", emoji: "🧸" },
      { eng: "BALL", tel: "బంతి", emoji: "⚽" },
      { eng: "CLOCK", tel: "గడియారం", emoji: "⏰" },
      { eng: "SPOON", tel: "చెంచా", emoji: "🥄" },
      { eng: "UMBRELLA", tel: "గొడుగు", emoji: "☂️" },
      { eng: "KEY", tel: "తాళంచెవి", emoji: "🔑" },
      { eng: "PHONE", tel: "ఫోన్", emoji: "📱" },
      { eng: "BOTTLE", tel: "సీసా", emoji: "🍾" },
      { eng: "SUN", tel: "సూర్యుడు", emoji: "☀️" },
      { eng: "MOON", tel: "చంద్రుడు", emoji: "🌙" },
      { eng: "FLOWER", tel: "పువ్వు", emoji: "🌸" },
      { eng: "TREE", tel: "చెట్టు", emoji: "🌳" },
      { eng: "BALLOON", tel: "బుడగ", emoji: "🎈" }
    ]
  }
];

// State variables
let currentLevelIndex = 0;
let score = parseInt(localStorage.getItem("kids_puzzle_score") || "0", 10);
let soundEnabled = true;
let activeMode = "vocab"; // 'vocab' or 'calculator'

// Simple sound effects using Web Audio API for fallback
function playBeep(freq, type, duration) {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.value = freq || 440;
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Audio API not supported directly.");
  }
}

// Text to Speech logic
function speakWord(englishText) {
  if (!soundEnabled) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // cancel current speeches
    const utterance = new SpeechSynthesisUtterance(englishText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slower & clear for kids
    utterance.pitch = 1.2; // cute kid pitch
    window.speechSynthesis.speak(utterance);
  }
}

// Display beautiful Custom Alert message
function showToast(message, emoji) {
  const bar = document.getElementById("notification-bar");
  const msgEl = document.getElementById("notif-message");
  const emojiEl = document.getElementById("notif-emoji");
  
  emojiEl.textContent = emoji || "🎉";
  msgEl.textContent = message;
  
  bar.classList.remove("hidden");
  bar.classList.add("animate-bounce");
  
  setTimeout(() => {
    bar.classList.remove("animate-bounce");
  }, 1000);
}

// Update Score Board UI
function addPoints(points) {
  score += points;
  localStorage.setItem("kids_puzzle_score", score);
  document.getElementById("score-value").textContent = score;
  
  // Motivating messages based on scores
  const motivateEl = document.getElementById("score-motivate");
  if (score < 50) {
    motivateEl.textContent = "చాలా బాగుంది! ఆట మొదలుపెట్టు! ✨";
  } else if (score < 150) {
    motivateEl.textContent = "శభాష్! అద్భుతంగా ఆడుతున్నావు! 🎈";
  } else if (score < 300) {
    motivateEl.textContent = "నువ్వు సూపర్ స్టార్ వి! కీప్ ఇట్ అప్! 🌟";
  } else {
    motivateEl.textContent = "నువ్వు జీనియస్! అన్ని పదాలూ నేర్చేసుకున్నావ్! 🏆";
  }
}

// Switch Levels dynamically
function switchLevel(index) {
  if (index < 0 || index >= vocabLevels.length) return;
  currentLevelIndex = index;
  
  // Update UI level active class states
  for (let i = 0; i < 6; i++) {
    const btn = document.getElementById(`lvl-btn-${i}`);
    if (btn) {
      if (i === index) {
        btn.className = "level-select-btn bg-gradient-to-br from-[#FF8E53] to-[#FF6B6B] text-white p-2.5 rounded-xl text-center text-xs font-black shadow transform scale-105 border-2 border-red-500 active-level";
      } else {
        btn.className = "level-select-btn bg-gray-100 text-gray-700 p-2.5 rounded-xl text-center text-xs font-black shadow-sm transition-all transform hover:scale-105 border-2 border-dashed border-gray-300 hover:bg-[#FFF5E4]";
      }
    }
  }

  // Load level details
  const levelData = vocabLevels[currentLevelIndex];
  document.getElementById("vocab-level-title").innerHTML = levelData.title;
  document.getElementById("vocab-level-title-sub").textContent = levelData.subtitle;

  // Render cards
  renderCards();
  playBeep(600, "sine", 0.15);
}

// Render active levels words in CAPITAL LETTERS
function renderCards() {
  const container = document.getElementById("words-grid");
  if (!container) return;
  
  container.innerHTML = "";
  const levelData = vocabLevels[currentLevelIndex];
  
  levelData.words.forEach((item) => {
    // Ensure word is fully capital letters!
    const capitalizedEng = item.eng.toUpperCase();
    
    // Create card element
    const card = document.createElement("div");
    card.className = "word-card bg-white p-4 rounded-2xl border-4 border-[#A0D468] hover:border-[#8CC152] hover:shadow-lg transition-all duration-300 text-center flex flex-col justify-between items-center relative transform hover:scale-[1.05] shadow-sm";
    
    card.innerHTML = `
      <span class="text-4xl mb-2 filter drop-shadow">${item.emoji}</span>
      <span class="text-lg font-black text-gray-900 tracking-wider block">${capitalizedEng}</span>
      <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1.5 block">${item.tel}</span>
      <div class="mt-3 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-500 shadow-inner hover:bg-blue-200 transition-all">
        🔊
      </div>
    `;
    
    // Sound trigger on click
    card.addEventListener("click", () => {
      speakWord(capitalizedEng);
      playBeep(880, "triangle", 0.1);
      addPoints(5);
      showToast(`నేర్చుకున్నారు: ${capitalizedEng} (${item.tel})`, item.emoji);
      
      // Mini animation effect
      card.classList.add("ring-4", "ring-[#FFD066]");
      setTimeout(() => {
        card.classList.remove("ring-4", "ring-[#FFD066]");
      }, 300);
    });
    
    container.appendChild(card);
  });
  
  document.getElementById("word-count-badge").textContent = levelData.words.length;
}

// Toggle between modes: Vocab Puzzle vs Math Toy Calculator
function setMode(mode) {
  activeMode = mode;
  const vocabBtn = document.getElementById("mode-vocab");
  const calcBtn = document.getElementById("mode-calculator");
  const vocabIndicator = document.getElementById("vocab-indicator");
  const calcIndicator = document.getElementById("calc-indicator");

  const vocabView = document.getElementById("vocab-view");
  const calcView = document.getElementById("calculator-view");

  if (mode === "vocab") {
    // active style for vocab button
    vocabBtn.className = "mode-btn bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white p-4 rounded-2xl font-bold flex items-center justify-between border-b-4 border-[#6C3483] shadow-md transition-all";
    calcBtn.className = "mode-btn bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 p-4 rounded-2xl font-bold flex items-center justify-between border-b-4 border-gray-400 shadow-md transition-all opacity-80 hover:opacity-100";
    vocabIndicator.textContent = "👉";
    calcIndicator.textContent = "";
    
    // views
    vocabView.classList.remove("hidden");
    calcView.classList.add("hidden");
  } else {
    // active style for calculator button
    calcBtn.className = "mode-btn bg-gradient-to-r from-[#16A085] to-[#1ABC9C] text-white p-4 rounded-2xl font-bold flex items-center justify-between border-b-4 border-[#117A65] shadow-md transition-all";
    vocabBtn.className = "mode-btn bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 p-4 rounded-2xl font-bold flex items-center justify-between border-b-4 border-gray-400 shadow-md transition-all opacity-80 hover:opacity-100";
    vocabIndicator.textContent = "";
    calcIndicator.textContent = "👉";
    
    // views
    vocabView.classList.add("hidden");
    calcView.classList.remove("hidden");
    
    // Generate dynamic question
    generateMathQuestion();
  }
  playBeep(520, "square", 0.12);
}

// --- Math Calculator & Challenge Logic ---
let currentMathAnswer = 0;
function generateMathQuestion() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const operators = ["+", "-", "*"];
  const op = operators[Math.floor(Math.random() * operators.length)];
  
  let questionText = "";
  if (op === "+") {
    currentMathAnswer = num1 + num2;
    questionText = `${num1} + ${num2} = ?`;
  } else if (op === "-") {
    // prevent negative answers for kids
    const max = Math.max(num1, num2);
    const min = Math.min(num1, num2);
    currentMathAnswer = max - min;
    questionText = `${max} - ${min} = ?`;
  } else {
    currentMathAnswer = num1 * num2;
    questionText = `${num1} × ${num2} = ?`;
  }
  
  document.getElementById("math-question").textContent = questionText;
  document.getElementById("math-answer-input").value = "";
}

// Calculator button inputs
let calcBuffer = "";
function pressCalc(char) {
  playBeep(900, "sine", 0.05);
  if (calcBuffer === "0") {
    calcBuffer = char;
  } else {
    calcBuffer += char;
  }
  updateCalcScreen();
}
function clearCalc() {
  playBeep(400, "sine", 0.1);
  calcBuffer = "";
  updateCalcScreen();
}
function updateCalcScreen() {
  const screen = document.getElementById("calc-screen");
  screen.textContent = calcBuffer || "0";
}
function evaluateCalc() {
  try {
    if (!calcBuffer) return;
    // Simple safe evaluation replacing visual symbols
    const sanitized = calcBuffer.replace(/×/g, '*').replace(/÷/g, '/');
    const result = eval(sanitized);
    document.getElementById("calc-history").textContent = calcBuffer + " =";
    calcBuffer = String(result);
    updateCalcScreen();
    playBeep(1200, "triangle", 0.2);
  } catch (err) {
    document.getElementById("calc-screen").textContent = "ERROR";
    calcBuffer = "";
    playBeep(250, "sawtooth", 0.3);
  }
}

// Check Answer Event
function checkMathAnswer() {
  const userInput = parseInt(document.getElementById("math-answer-input").value, 10);
  if (isNaN(userInput)) {
    showToast("దయచేసి జవాబు టైప్ చేయండి!", "❓");
    playBeep(300, "sine", 0.2);
    return;
  }
  
  if (userInput === currentMathAnswer) {
    playBeep(1000, "sine", 0.3);
    addPoints(10);
    showToast("శభాష్! సరైన సమాధానం! 🎉", "🏆");
    generateMathQuestion();
  } else {
    playBeep(300, "sawtooth", 0.4);
    showToast("అయ్యో! తప్పు సమాధానం. మళ్ళీ ప్రయత్నించు! ❌", "🧐");
  }
}

// Document Initializer
window.addEventListener("DOMContentLoaded", () => {
  // Render scoreboard initially
  document.getElementById("score-value").textContent = score;
  
  // Attach sound toggle event listener
  const soundBtn = document.getElementById("btn-sound-toggle");
  soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById("sound-icon");
    if (soundEnabled) {
      icon.textContent = "🔊";
      soundBtn.className = "px-4 py-2 bg-[#A0E7E5] hover:bg-[#B4F8C8] text-gray-800 text-xs font-bold rounded-full border-2 border-[#1ABC9C] flex items-center gap-2 transition-all active:scale-95 shadow-sm";
      soundBtn.innerHTML = "🔊 శబ్దం ఆన్";
      playBeep(520, "sine", 0.1);
    } else {
      icon.textContent = "🔇";
      soundBtn.className = "px-4 py-2 bg-gray-200 text-gray-500 text-xs font-bold rounded-full border-2 border-gray-300 flex items-center gap-2 transition-all active:scale-95 shadow-sm";
      soundBtn.innerHTML = "🔇 శబ్దం ఆఫ్";
    }
  });
  
  // Reset Game Score board
  const resetBtn = document.getElementById("btn-reset-game");
  resetBtn.addEventListener("click", () => {
    if (confirm("స్కోరును రీసెట్ చేయాలనుకుంటున్నారా?")) {
      score = 0;
      localStorage.setItem("kids_puzzle_score", score);
      document.getElementById("score-value").textContent = 0;
      document.getElementById("score-motivate").textContent = "చాలా బాగుంది! ఆట మొదలుపెట్టు!";
      playBeep(300, "sine", 0.3);
    }
  });

  // Set level selectors dynamically
  for (let i = 0; i < 6; i++) {
    const btn = document.getElementById(`lvl-btn-${i}`);
    if (btn) {
      btn.addEventListener("click", () => switchLevel(i));
    }
  }
  
  // Mode switch buttons
  document.getElementById("mode-vocab").addEventListener("click", () => setMode("vocab"));
  document.getElementById("mode-calculator").addEventListener("click", () => setMode("calculator"));
  
  // Math challenge click handlers
  document.getElementById("btn-check-answer").addEventListener("click", checkMathAnswer);
  document.getElementById("btn-next-question").addEventListener("click", generateMathQuestion);

  // Render initial level
  switchLevel(0);
});