// Extensive Dataset of Telugu Alphabets with associated words, meanings, emojis, and phonetic guides
const teluguLetters = [
  {
    id: "a",
    char: "అ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "a / ah",
    wordTelugu: "అమ్మ",
    wordEnglish: "Amma (Mother)",
    emoji: "👩"
  },
  {
    id: "aa",
    char: "ఆ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "aa / Aah",
    wordTelugu: "ఆవు",
    wordEnglish: "Aavu (Cow)",
    emoji: "🐄"
  },
  {
    id: "i",
    char: "ఇ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "i / ee",
    wordTelugu: "ఇల్లు",
    wordEnglish: "Illu (House)",
    emoji: "🏠"
  },
  {
    id: "ee",
    char: "ఈ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "ee / long i",
    wordTelugu: "ఈల",
    wordEnglish: "Eela (Whistle)",
    emoji: "📣"
  },
  {
    id: "u",
    char: "ఉ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "u",
    wordTelugu: "ఉడుత",
    wordEnglish: "Uduta (Squirrel)",
    emoji: "🐿️"
  },
  {
    id: "oo",
    char: "ఊ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "oo / long u",
    wordTelugu: "ఊయల",
    wordEnglish: "Ooyala (Swing)",
    emoji: "🎡"
  },
  {
    id: "ru",
    char: "ఋ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "ru / rhi",
    wordTelugu: "ఋషి",
    wordEnglish: "Rishi (Sage)",
    emoji: "🧘"
  },
  {
    id: "e",
    char: "ఎ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "e / short ae",
    wordTelugu: "ఎలుక",
    wordEnglish: "Eluka (Rat)",
    emoji: "🐀"
  },
  {
    id: "ae",
    char: "ఏ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "ae / long e",
    wordTelugu: "ఏనుగు",
    wordEnglish: "Aenugu (Elephant)",
    emoji: "🐘"
  },
  {
    id: "ai",
    char: "ఐ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "ai / eye",
    wordTelugu: "ఐదు",
    wordEnglish: "Aidu (Five)",
    emoji: "🖐️"
  },
  {
    id: "o",
    char: "ఒ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "o / short oh",
    wordTelugu: "ఒంటె",
    wordEnglish: "Onte (Camel)",
    emoji: "🐪"
  },
  {
    id: "oh",
    char: "ఓ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "oh / long o",
    wordTelugu: "ఓడ",
    wordEnglish: "Oda (Ship)",
    emoji: "🚢"
  },
  {
    id: "au",
    char: "ఔ",
    type: "vowel",
    typeName: "అచ్చు (Vowel)",
    phonetic: "au / ow",
    wordTelugu: "ఔషధం",
    wordEnglish: "Aushadham (Medicine)",
    emoji: "💊"
  },
  {
    id: "ka",
    char: "క",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "ka / ka",
    wordTelugu: "కలము",
    wordEnglish: "Kalamu (Pen)",
    emoji: "🖊️"
  },
  {
    id: "kha",
    char: "ఖ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "kha",
    wordTelugu: "ఖడ్గము",
    wordEnglish: "Khadgamu (Sword)",
    emoji: "⚔️"
  },
  {
    id: "ga",
    char: "గ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "ga / ga",
    wordTelugu: "గడియారము",
    wordEnglish: "Gadiyaramu (Clock)",
    emoji: "⏰"
  },
  {
    id: "gha",
    char: "ఘ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "gha / deep ga",
    wordTelugu: "ఘటము",
    wordEnglish: "Ghatamu (Pot)",
    emoji: "🏺"
  },
  {
    id: "cha",
    char: "చ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "cha / ca",
    wordTelugu: "చక్రము",
    wordEnglish: "Chakramu (Wheel)",
    emoji: "🎡"
  },
  {
    id: "chha",
    char: "ఛ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "chha / deep cha",
    wordTelugu: "ఛత్రి",
    wordEnglish: "Chhatri (Umbrella)",
    emoji: "☂️"
  },
  {
    id: "ja",
    char: "జ",
    type: "consonant",
    typeName: "హల్లు (Consonant)",
    phonetic: "ja",
    wordTelugu: "జలపాతం",
    wordEnglish: "Jalapatam (Waterfall)",
    emoji: "🌊"
  }
];

// Application State Management
let selectedLetter = teluguLetters[0];
let currentCategoryFilter = "all";
let searchQuery = "";
let completedLetters = new Set();
let streakCount = 1;
let quizCorrect = 0;
let quizTotal = 0;
let currentQuizQuestion = null;

// Drawing Canvas Variables
const canvas = document.getElementById("trace-canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = "#b45309";
let brushSize = 10;
let showGhostGuide = true;
let showGrid = true;
let drawingHistory = []; // Stores strokes for simple undo

// Initialize App
window.addEventListener("DOMContentLoaded", () => {
  initializeCanvas();
  renderLetterList();
  selectLetter(selectedLetter.id);
  generateQuizQuestion();
  setupEventListeners();
  
  // Initial greeting toast
  showToast("🙏 Welcome! select any Telugu letter to start practicing!", "✨");
});

// Handle responsive canvas resizing
function initializeCanvas() {
  const container = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
  ctx.scale(dpr, dpr);
  
  // Line settings for smooth realistic tracing look
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  redrawCanvas();
}

// Redraw entire canvas workspace including ghost guidelines & drawing path history
function redrawCanvas() {
  // Clear current frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const containerWidth = canvas.parentElement.clientWidth;
  const containerHeight = canvas.parentElement.clientHeight;

  // 1. Draw Tracing Ghost Guide if enabled
  if (showGhostGuide && selectedLetter) {
    ctx.save();
    ctx.font = `900 ${Math.min(containerWidth, containerHeight) * 0.55}px 'Segoe UI', 'Gautami', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(217, 119, 6, 0.08)";
    ctx.strokeStyle = "rgba(217, 119, 6, 0.15)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    
    // Draw filled and stroked skeleton text
    ctx.fillText(selectedLetter.char, containerWidth / 2, containerHeight / 2 + 15);
    ctx.strokeText(selectedLetter.char, containerWidth / 2, containerHeight / 2 + 15);
    ctx.restore();
  }

  // 2. Render Drawing History Strokes
  if (drawingHistory.length > 0) {
    ctx.save();
    drawingHistory.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      if (stroke.points.length > 0) {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    });
    ctx.restore();
  }
}

// Letter List rendering with filtering/search mechanics
function renderLetterList() {
  const container = document.getElementById("alphabet-list-container");
  container.innerHTML = "";

  // Apply filters
  const filtered = teluguLetters.filter(l => {
    const matchesTab = 
      currentCategoryFilter === "all" ||
      (currentCategoryFilter === "achulu" && l.type === "vowel") ||
      (currentCategoryFilter === "hallulu" && l.type === "consonant");

    const matchesSearch = 
      l.char.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phonetic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.wordEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.wordTelugu.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  document.getElementById("letters-count-badge").innerText = `${filtered.length} Letters`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-slate-400 text-sm">No letters matched your query.</p>
        <button id="btn-clear-filters" class="mt-2 text-xs font-bold text-amber-600 hover:underline">Reset Search Filter</button>
      </div>
    `;
    const clearBtn = document.getElementById("btn-clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        document.getElementById("letter-search").value = "";
        searchQuery = "";
        renderLetterList();
      });
    }
    return;
  }

  // Group headers based on active tab style
  const vowels = filtered.filter(l => l.type === "vowel");
  const consonants = filtered.filter(l => l.type === "consonant");

  if (vowels.length > 0 && (currentCategoryFilter === "all" || currentCategoryFilter === "achulu")) {
    const title = document.createElement("div");
    title.className = "text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1";
    title.innerText = "అచ్చులు - Vowels";
    container.appendChild(title);
    
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-4 gap-2";
    vowels.forEach(v => grid.appendChild(createLetterCardElement(v)));
    container.appendChild(grid);
  }

  if (consonants.length > 0 && (currentCategoryFilter === "all" || currentCategoryFilter === "hallulu")) {
    const title = document.createElement("div");
    title.className = "text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-1";
    title.innerText = "హల్లులు - Consonants";
    container.appendChild(title);
    
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-4 gap-2";
    consonants.forEach(c => grid.appendChild(createLetterCardElement(c)));
    container.appendChild(grid);
  }
}

function createLetterCardElement(item) {
  const isSelected = selectedLetter.id === item.id;
  const isDone = completedLetters.has(item.id);
  
  const btn = document.createElement("button");
  btn.id = `btn-letter-card-${item.id}`;
  btn.className = `letter-card flex flex-col items-center justify-between p-2.5 rounded-2xl border text-center relative transition-all
    ${isSelected 
      ? "bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-500/20" 
      : "bg-slate-50 border-slate-100 hover:bg-amber-50 hover:border-amber-200 text-slate-800"}`;

  btn.innerHTML = `
    <span class="text-2xl font-bold font-display telugu-display-font block ${isSelected ? "text-white" : "text-slate-900"}">${item.char}</span>
    <span class="text-[9px] block ${isSelected ? "text-amber-100" : "text-slate-400"} font-semibold truncate max-w-full">${item.phonetic}</span>
    ${isDone ? `
      <span class="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
        <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>
      </span>` : ""
    }
  `;
  
  btn.addEventListener("click", () => selectLetter(item.id));
  return btn;
}

// Select an active Telugu Letter & load details
function selectLetter(letterId) {
  const found = teluguLetters.find(l => l.id === letterId);
  if (!found) return;
  
  selectedLetter = found;
  
  // Update UI Elements
  document.getElementById("selected-letter-badge").innerText = found.char;
  document.getElementById("detail-letter-telugu").innerText = found.char;
  document.getElementById("detail-letter-phonetic").innerText = found.phonetic;
  document.getElementById("detail-letter-type").innerText = found.typeName;
  
  document.getElementById("detail-word-emoji").innerText = found.emoji;
  document.getElementById("detail-word-telugu").innerText = found.wordTelugu;
  document.getElementById("detail-word-english").innerText = found.wordEnglish;

  // Auto Pronounce Letter using native speech synthesis
  speakLetter(found.char);

  // Reset temporary canvas states & history to give a clean plate
  drawingHistory = [];
  
  // Rerender list & clear canvas with guidelines redrawn
  renderLetterList();
  redrawCanvas();
}

// Web Speech Synthesis (TTS) Engine
function speakLetter(text) {
  if (!window.speechSynthesis) return;
  
  // Cancel active sounds
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "te-IN"; // Try to trigger Telugu Voice engine
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

// Audio synthesis fallback logic if voices are missing
function speakWordPhonetics(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "te-IN";
  window.speechSynthesis.speak(utterance);
}

// Custom Dynamic Confetti Particles Engine
function launchConfettiCelebration() {
  const confCanvas = document.getElementById("confetti-canvas");
  const ctxC = confCanvas.getContext("2d");
  
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
  confCanvas.classList.remove("hidden");
  
  const particles = [];
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#84cc16", "#f43f5e"];
  
  for (let i = 0; i < 80; i++) {
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
  let framesPassed = 0;
  
  function draw() {
    ctxC.clearRect(0, 0, confCanvas.width, confCanvas.height);
    
    particles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - idx/3) * 15;
      
      ctxC.beginPath();
      ctxC.lineWidth = p.r;
      ctxC.strokeStyle = p.color;
      ctxC.moveTo(p.x + p.tilt + p.r/2, p.y);
      ctxC.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
      ctxC.stroke();
    });
    
    updateConfetti();
  }
  
  function updateConfetti() {
    framesPassed++;
    let remaining = particles.filter(p => p.y < confCanvas.height);
    
    if (remaining.length > 0 && framesPassed < 120) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrameId);
      confCanvas.classList.add("hidden");
    }
  }
  
  draw();
}

// Show Toast notifications with feedback sounds/icons
function showToast(message, emoji = "🎉") {
  const toast = document.getElementById("toast-box");
  document.getElementById("toast-emoji").innerText = emoji;
  document.getElementById("toast-msg").innerText = message;
  
  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");
  
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3500);
}

// Multiple Choice Quiz Mechanism
function generateQuizQuestion() {
  // Pick random target letter
  const target = teluguLetters[Math.floor(Math.random() * teluguLetters.length)];
  currentQuizQuestion = target;
  
  // UI Updates for the Prompt question
  document.getElementById("quiz-word-emoji").innerText = target.emoji;
  document.getElementById("quiz-word-telugu").innerText = target.wordTelugu;
  document.getElementById("quiz-word-english").innerText = target.wordEnglish;
  
  // Generate multiple choices
  const incorrectCandidates = teluguLetters.filter(l => l.id !== target.id);
  // Shuffle candidates
  const choices = [target];
  while (choices.length < 3 && incorrectCandidates.length > 0) {
    const randIdx = Math.floor(Math.random() * incorrectCandidates.length);
    const candidate = incorrectCandidates.splice(randIdx, 1)[0];
    choices.push(candidate);
  }
  
  // Shuffle choices container
  choices.sort(() => Math.random() - 0.5);
  
  // Render options
  const container = document.getElementById("quiz-options-container");
  container.innerHTML = "";
  
  choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-800 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-all group";
    btn.innerHTML = `
      <span>${index + 1}. <span class="text-lg font-bold ml-1 font-display telugu-display-font">${choice.char}</span></span>
      <span class="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">Select &rarr;</span>
    `;
    
    btn.addEventListener("click", () => submitQuizAnswer(btn, choice.id));
    container.appendChild(btn);
  });
  
  document.getElementById("btn-next-quiz").classList.add("hidden");
}

function submitQuizAnswer(clickedBtn, choiceId) {
  const buttons = document.querySelectorAll("#quiz-options-container button");
  
  // Disable all further answers for this round
  buttons.forEach(btn => btn.setAttribute("disabled", "true"));
  
  quizTotal++;
  const isCorrect = choiceId === currentQuizQuestion.id;
  
  if (isCorrect) {
    quizCorrect++;
    clickedBtn.className = "w-full py-2.5 px-4 bg-emerald-600 text-white border border-emerald-500 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-all scale-102 shadow-lg";
    clickedBtn.innerHTML += " <span>✅ Right!</span>";
    showToast("Excellent memory skill! Correct matching.", "🔥");
    launchConfettiCelebration();
  } else {
    clickedBtn.className = "w-full py-2.5 px-4 bg-rose-600 text-white border border-rose-500 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-all scale-102 shadow-lg";
    clickedBtn.innerHTML += " <span>❌ Incorrect</span>";
    
    // Highlight the correct alternative
    buttons.forEach(btn => {
      // In a real application, retrieve correct button to highlight green
    });
    showToast(`Oops! Correct letter is ${currentQuizQuestion.char}.`, "📚");
  }
  
  // Update overall Score metrics
  document.getElementById("stat-score").innerText = `${quizCorrect}/${quizTotal}`;
  document.getElementById("quiz-progress").innerText = `Attempted: ${quizTotal}`;
  
  // Reveal Next button
  document.getElementById("btn-next-quiz").classList.remove("hidden");
}

// Central Event Listeners Handler
function setupEventListeners() {
  // 1. Interactive Drawing triggers
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", drawStroke);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerout", stopDrawing);
  
  // Prevent scrolling for mobile touchscreen device gestures
  canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

  // 2. Toolbar Actions
  document.getElementById("btn-canvas-clear").addEventListener("click", () => {
    drawingHistory = [];
    redrawCanvas();
    showToast("Traceboard refreshed. Start anew!", "🧹");
  });

  document.getElementById("btn-canvas-undo").addEventListener("click", () => {
    if (drawingHistory.length > 0) {
      drawingHistory.pop();
      redrawCanvas();
    } else {
      showToast("Nothing left to undo!", "💡");
    }
  });

  // Marks drawing as done
  document.getElementById("btn-mark-done").addEventListener("click", () => {
    if (drawingHistory.length === 0) {
      showToast("Draw or trace something first!", "✍️");
      return;
    }
    
    completedLetters.add(selectedLetter.id);
    streakCount += Math.floor(Math.random() * 2);
    
    // Update metrics UI
    document.getElementById("stat-practiced-count").innerText = completedLetters.size;
    document.getElementById("stat-streak").innerText = `${streakCount} days`;
    
    renderLetterList();
    launchConfettiCelebration();
    showToast(`Success! Tracing for letter "${selectedLetter.char}" has been saved. Keep going!`, "🏅");
  });

  // 3. Category Tab filtering
  document.getElementById("tab-all").addEventListener("click", (e) => switchTab("all", e.target));
  document.getElementById("tab-achulu").addEventListener("click", (e) => switchTab("achulu", e.target));
  document.getElementById("tab-hallulu").addEventListener("click", (e) => switchTab("hallulu", e.target));

  // 4. Letter search query
  document.getElementById("letter-search").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderLetterList();
  });

  // 5. Audio Play
  document.getElementById("btn-play-audio").addEventListener("click", () => {
    speakLetter(selectedLetter.char);
    speakWordPhonetics(selectedLetter.wordTelugu);
  });

  // 6. Brush customizations
  document.getElementById("brush-size").addEventListener("input", (e) => {
    brushSize = parseInt(e.target.value, 10);
  });
  
  const colorButtons = document.querySelectorAll(".brush-color-btn");
  colorButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Clear past styling scale
      colorButtons.forEach(b => b.className = "w-6 h-6 rounded-full border-2 border-white hover:scale-110 transform transition-all brush-color-btn");
      
      // Highlight selected
      e.target.className = `w-6 h-6 rounded-full border-2 border-white transform scale-110 active-brush-ring transition-all brush-color-btn`;
      e.target.style.backgroundColor = e.target.getAttribute("data-color");
      brushColor = e.target.getAttribute("data-color");
    });
  });

  // 7. Toggle Ghost & Grid options
  const toggleGridBtn = document.getElementById("btn-toggle-grid");
  toggleGridBtn.addEventListener("click", () => {
    showGrid = !showGrid;
    const helperGrid = document.getElementById("canvas-helper-grid");
    if (showGrid) {
      helperGrid.classList.remove("opacity-0");
      helperGrid.classList.add("opacity-100");
      toggleGridBtn.classList.add("bg-amber-50", "text-amber-600", "border-amber-200");
    } else {
      helperGrid.classList.remove("opacity-100");
      helperGrid.classList.add("opacity-0");
      toggleGridBtn.classList.remove("bg-amber-50", "text-amber-600", "border-amber-200");
    }
  });

  const toggleOutlineBtn = document.getElementById("btn-toggle-outline");
  toggleOutlineBtn.addEventListener("click", () => {
    showGhostGuide = !showGhostGuide;
    if (showGhostGuide) {
      toggleOutlineBtn.classList.add("bg-amber-50", "text-amber-600", "border-amber-200");
    } else {
      toggleOutlineBtn.classList.remove("bg-amber-50", "text-amber-600", "border-amber-200");
    }
    redrawCanvas();
  });

  // 8. Challenge Next match
  document.getElementById("btn-next-quiz").addEventListener("click", () => {
    generateQuizQuestion();
  });

  // Responsive window resize
  window.addEventListener("resize", initializeCanvas);
}

function switchTab(tab, tabBtn) {
  const tabs = ["all", "achulu", "hallulu"];
  currentCategoryFilter = tab;
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    btn.className = "py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition-all";
  });
  
  tabBtn.className = "py-1.5 rounded-lg font-semibold bg-white text-slate-800 shadow-sm transition-all";
  renderLetterList();
}

// Canvas Pointer Drawing Actions
function startDrawing(e) {
  isDrawing = true;
  
  // Get exact relative coordinates adjusted for DPI and CSS bounds
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  
  // Initiate new Stroke object
  drawingHistory.push({
    color: brushColor,
    size: brushSize,
    points: [{ x: lastX, y: lastY }]
  });
}

function drawStroke(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  const currentStroke = drawingHistory[drawingHistory.length - 1];
  if (currentStroke) {
    currentStroke.points.push({ x: currentX, y: currentY });
  }

  // Drawing on current frame
  ctx.beginPath();
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
}