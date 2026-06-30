// Virtual Lab State Management
const LAB_STATE = {
  solvent: 'water',
  reagent: 'none',
  temperature: 25,
  currentPH: 7.0,
  solubility: 'High',
  activePresetTitle: 'Water Sample Evaluation',
  logs: [],
  triviaScore: { correct: 0, total: 0 },
  currentQuestionIndex: 0
};

// Comprehensive scientific question database
const TRIVIA_QUESTIONS = [
  {
    question: "What color does a strong acid like Hydrochloric acid typically turn a Universal Indicator?",
    options: ["Deep Blue", "Emerald Green", "Bright Crimson / Red", "Golden Yellow"],
    correct: 2,
    feedback: "Yes! Highly acidic substances with pH 1-2 turn universal indicator red."
  },
  {
    question: "What indicator changes from completely colorless in acidic solutions to bright hot pink in basic solutions?",
    options: ["Litmus Paper", "Phenolphthalein", "Bromothymol Blue", "Turmeric Extract"],
    correct: 1,
    feedback: "Correct! Phenolphthalein is a legendary pH indicator used for strong bases."
  },
  {
    question: "When baking soda (base) reacts with vinegar (acid), what gas is released in high volume?",
    options: ["Nitrogen Dioxide", "Hydrogen Gas", "Carbon Dioxide", "Argon Gas"],
    correct: 2,
    feedback: "Excellent! The classic chemical fizz is created by Carbon Dioxide gas generation."
  },
  {
    question: "At what temperature range does water solvent begin violent boiling/vaporization at sea level?",
    options: ["0°C - 10°C", "50°C - 60°C", "100°C+", "200°C+"],
    correct: 2,
    feedback: "Perfect! Liquid water boils into steam at 100°C (212°F)."
  },
  {
    question: "Which of the following describes a substance that is classified with a pH level of 13.5?",
    options: ["Highly Acidic", "Extremely Basic / Alkaline", "Perfectly Neutral", "Inert Organic Vapor"],
    correct: 1,
    feedback: "Right! High pH levels above 7 indicate alkali/bases."
  }
];

// DOM Elements mapping
const selectSolvent = document.getElementById('select-solvent');
const selectReagent = document.getElementById('select-reagent');
const sliderTemp = document.getElementById('slider-temp');
const tempSliderLabel = document.getElementById('temp-slider-label');
const tempDigitalDisplay = document.getElementById('temp-digital-display');
const thermometerBar = document.getElementById('thermometer-bar');
const beakerLiquid = document.getElementById('beaker-liquid');
const liquidBubbles = document.getElementById('liquid-bubbles');
const steamEffect = document.getElementById('steam-effect');
const reactionFlash = document.getElementById('reaction-flash');
const simPHVal = document.getElementById('sim-ph-val');
const simPHClass = document.getElementById('sim-ph-class');
const simSolubility = document.getElementById('sim-solubility');
const warningDisplay = document.getElementById('lab-reaction-warning');
const warningText = document.getElementById('warning-text-content');

const formLabLog = document.getElementById('lab-log-form');
const logTitleInput = document.getElementById('log-title');
const logReactantInput = document.getElementById('log-reactant');
const logColorInput = document.getElementById('log-color');
const logNotesInput = document.getElementById('log-notes');
const loggedEntriesBox = document.getElementById('logged-entries-box');
const emptyLogsPlaceholder = document.getElementById('empty-logs-placeholder');
const btnClearLogs = document.getElementById('btn-clear-logs');
const notebookCounterBadge = document.getElementById('notebook-counter-badge');

const quizQuestion = document.getElementById('quiz-question');
const quizOptionsBox = document.getElementById('quiz-options-box');
const quizFeedback = document.getElementById('quiz-feedback');
const quizScoreDisplay = document.getElementById('quiz-score-display');
const btnNextQuestion = document.getElementById('btn-next-question');

// Initialization & Setup
window.addEventListener('DOMContentLoaded', () => {
  loadLabStateFromStorage();
  triggerReactionCalculation(false); // Silent calculation on startup
  loadTriviaQuestion(0);
  setupPresetCardListeners();
});

// Handle simulation inputs
selectSolvent.addEventListener('change', () => {
  LAB_STATE.solvent = selectSolvent.value;
  triggerReactionCalculation(true);
});

selectReagent.addEventListener('change', () => {
  LAB_STATE.reagent = selectReagent.value;
  triggerReactionCalculation(true);
});

sliderTemp.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  updateTemperatureUI(val);
});

// Instant temperature snap cool
document.getElementById('btn-quick-add-ice').addEventListener('click', () => {
  updateTemperatureUI(5);
  sliderTemp.value = 5;
  createToast("Chilled to 5°C with dynamic liquid cooling matrix!", "cyan");
  triggerReactionCalculation(true);
});

// Reset the entire lab setup
document.getElementById('btn-reset-simulation').addEventListener('click', () => {
  selectSolvent.value = 'water';
  selectReagent.value = 'none';
  sliderTemp.value = 25;
  LAB_STATE.solvent = 'water';
  LAB_STATE.reagent = 'none';
  LAB_STATE.temperature = 25;
  updateTemperatureUI(25);
  triggerReactionCalculation(true);
  
  // Clear preset borders
  document.querySelectorAll('.preset-card').forEach(card => card.classList.remove('preset-card-active'));
  createToast("Simulation core successfully calibrated to standard limits.", "indigo");
});

// Manual chemical trigger
document.getElementById('btn-trigger-mix').addEventListener('click', () => {
  // Flash effect
  reactionFlash.style.opacity = '0.7';
  setTimeout(() => {
    reactionFlash.style.opacity = '0';
  }, 250);
  
  triggerReactionCalculation(true);
  createToast("Chemical equation computed and visualized in core container!", "emerald");
});

// Live Reaction Physics calculations and DOM transformations
function triggerReactionCalculation(interactiveMode = true) {
  let calculatedPH = 7.0;
  let phName = "Neutral";
  let chemicalLiquidColor = "rgba(71, 85, 105, 0.45)"; // Standard slate watery tint
  let bubblesDensity = 0;
  let showDangerWarning = false;
  let dangerText = "";

  // Determine pH levels based on Solvent selected
  if (LAB_STATE.solvent === 'acid-hcl') {
    calculatedPH = 1.2;
    phName = "Strongly Acidic";
  } else if (LAB_STATE.solvent === 'base-naoh') {
    calculatedPH = 13.5;
    phName = "Highly Alkaline";
  } else if (LAB_STATE.solvent === 'vinegar') {
    calculatedPH = 3.0;
    phName = "Weakly Acidic";
  } else {
    calculatedPH = 7.0;
    phName = "Neutral Balance";
  }

  // Indicators colors combinations
  if (LAB_STATE.reagent === 'universal') {
    // Universal indicator scale representation
    if (calculatedPH <= 2) {
      chemicalLiquidColor = "rgba(239, 68, 68, 0.85)"; // Crimson Red
    } else if (calculatedPH <= 4) {
      chemicalLiquidColor = "rgba(249, 115, 22, 0.85)"; // Orange
    } else if (calculatedPH <= 7.2) {
      chemicalLiquidColor = "rgba(16, 185, 129, 0.85)"; // Emerald Green
    } else {
      chemicalLiquidColor = "rgba(139, 92, 246, 0.85)"; // Velvet Purple
    }
  } else if (LAB_STATE.reagent === 'phenolphthalein') {
    // Colorless in acidic, deep hot pink in strong alkaline
    if (calculatedPH >= 10) {
      chemicalLiquidColor = "rgba(236, 72, 153, 0.85)"; // Vivid Pink
    } else {
      chemicalLiquidColor = "rgba(226, 232, 240, 0.35)"; // Colorless transparent tint
    }
  } else if (LAB_STATE.reagent === 'litmus-blue') {
    // Stays blue in neutral/base, turns red in acid
    if (calculatedPH < 7) {
      chemicalLiquidColor = "rgba(225, 29, 72, 0.8)"; // Coral Red
    } else {
      chemicalLiquidColor = "rgba(59, 130, 246, 0.8)"; // Cobalt Blue
    }
  } else if (LAB_STATE.reagent === 'baking-soda') {
    // Neutralizing agent, drives pH closer to 8
    if (calculatedPH < 7) {
      calculatedPH = parseFloat((calculatedPH + 3.2).toFixed(1));
      phName = "Fizzy Carbonated Mix";
      bubblesDensity = 14; 
      chemicalLiquidColor = "rgba(203, 213, 225, 0.7)"; // Cloudy Grey-Blue
      
      if (interactiveMode) {
        createToast("High gas discharge: CO2 synthesis triggered!", "indigo");
      }
    } else if (calculatedPH > 8) {
      calculatedPH = parseFloat((calculatedPH - 1.5).toFixed(1));
      phName = "Mild Alkaline Buffering";
      bubblesDensity = 4;
      chemicalLiquidColor = "rgba(148, 163, 184, 0.55)";
    } else {
      calculatedPH = 8.1;
      phName = "Bicarbonate Solution";
      bubblesDensity = 2;
      chemicalLiquidColor = "rgba(148, 163, 184, 0.55)";
    }
  } else {
    // No reagent. Standard clear liquid look corresponding to solvent
    if (LAB_STATE.solvent === 'acid-hcl') {
      chemicalLiquidColor = "rgba(14, 165, 233, 0.25)"; // Subtle blue tint
    } else if (LAB_STATE.solvent === 'base-naoh') {
      chemicalLiquidColor = "rgba(168, 85, 247, 0.25)"; // Subtle violet tint
    } else if (LAB_STATE.solvent === 'vinegar') {
      chemicalLiquidColor = "rgba(234, 179, 8, 0.15)"; // Subtle amber tint
    } else {
      chemicalLiquidColor = "rgba(71, 85, 105, 0.35)"; // Standard slate water
    }
  }

  // Compute thermodynamic states
  if (LAB_STATE.temperature >= 75) {
    bubblesDensity += 12; 
    showDangerWarning = true;
    dangerText = `Rapid Exothermic Vaporization! (${LAB_STATE.temperature}°C)`;
    steamEffect.classList.remove('opacity-0');
    steamEffect.classList.add('opacity-100');
  } else {
    steamEffect.classList.remove('opacity-100');
    steamEffect.classList.add('opacity-0');
  }

  // Basic danger conditions
  if (LAB_STATE.solvent === 'acid-hcl' && LAB_STATE.temperature > 85) {
    showDangerWarning = true;
    dangerText = "DANGER: Acid fumes localized risk! Reduce temp immediately.";
  } else if (LAB_STATE.solvent === 'base-naoh' && LAB_STATE.temperature > 80) {
    showDangerWarning = true;
    dangerText = "CAUTION: Alkaline corrosion risk enhanced by heat.";
  }

  // Update Virtual elements states
  LAB_STATE.currentPH = calculatedPH;
  LAB_STATE.solubility = LAB_STATE.temperature > 50 ? "Very High" : (LAB_STATE.temperature < 15 ? "Minimal" : "Standard");
  
  // Apply styles & text to HTML
  simPHVal.innerText = calculatedPH.toFixed(1);
  simPHClass.innerText = phName;
  simSolubility.innerText = LAB_STATE.solubility;
  beakerLiquid.style.backgroundColor = chemicalLiquidColor;

  // Trigger bubbles injection
  injectBubbles(bubblesDensity);

  // Danger alert component toggle
  if (showDangerWarning) {
    warningDisplay.classList.remove('hidden');
    warningText.innerText = dangerText;
  } else {
    warningDisplay.classList.add('hidden');
  }

  // Populate Form helper suggestions dynamically
  if (interactiveMode) {
    logTitleInput.value = LAB_STATE.activePresetTitle;
    logReactantInput.value = `${LAB_STATE.solvent.toUpperCase()} + ${LAB_STATE.reagent.toUpperCase()}`;
    logColorInput.value = getApproximateColorName(chemicalLiquidColor);
  }
}

// Update temperature levels dynamically
function updateTemperatureUI(tempVal) {
  LAB_STATE.temperature = tempVal;
  tempSliderLabel.innerText = `${tempVal}°C`;
  tempDigitalDisplay.innerText = `${tempVal}°C`;

  // Height of thermometer column (5% to 100% representation scale)
  const percentage = Math.max(5, Math.min(100, tempVal));
  thermometerBar.style.height = `${percentage}%`;
  
  // Dynamically trigger changes without full screen re-render
  triggerReactionCalculation(false);
}

// Inject dynamic bubbles animation elements into liquid
function injectBubbles(density) {
  liquidBubbles.innerHTML = '';
  if (density <= 0) return;

  const count = Math.min(density, 25); 
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble-unit');
    
    // Randomized layouts
    const size = Math.floor(Math.random() * 8) + 4;
    const leftOffset = Math.floor(Math.random() * 95);
    const animDuration = (Math.random() * 2) + 1;
    const animDelay = Math.random() * 1.5;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${leftOffset}%`;
    bubble.style.animationDuration = `${animDuration}s`;
    bubble.style.animationDelay = `${animDelay}s`;

    liquidBubbles.appendChild(bubble);
  }
}

// Utility function to convert liquid color states to simplified lab text format
function getApproximateColorName(rgbaString) {
  if (rgbaString.includes('239, 68, 68')) return "Crimson Acidic Red";
  if (rgbaString.includes('249, 115, 22')) return "Orange Buffer Tint";
  if (rgbaString.includes('16, 185, 129')) return "Neutral Vibrant Emerald";
  if (rgbaString.includes('139, 92, 246')) return "Alkaline Deep Violet";
  if (rgbaString.includes('236, 72, 153')) return "Exothermic Hot Pink";
  if (rgbaString.includes('225, 29, 72')) return "Acidic Rose Litmus";
  if (rgbaString.includes('59, 130, 246')) return "Basic Ocean Blue Litmus";
  if (rgbaString.includes('203, 213, 225')) return "Cloudy Fizz Emulsion";
  return "Translucent Water Clear";
}

// Preset Protocols selector implementation
function setupPresetCardListeners() {
  const cards = document.querySelectorAll('.preset-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Reset styles
      cards.forEach(c => c.classList.remove('preset-card-active'));
      
      // Select active card design
      card.classList.add('preset-card-active');

      // Grab custom data-attributes
      const solvent = card.getAttribute('data-solvent');
      const reagent = card.getAttribute('data-reagent');
      const targetTemp = parseInt(card.getAttribute('data-temp'));
      const title = card.getAttribute('data-title');

      // Apply preset to active state representation
      selectSolvent.value = solvent;
      selectReagent.value = reagent;
      sliderTemp.value = targetTemp;
      LAB_STATE.solvent = solvent;
      LAB_STATE.reagent = reagent;
      LAB_STATE.activePresetTitle = title;

      updateTemperatureUI(targetTemp);
      triggerReactionCalculation(true);
      
      createToast(`Loaded protocol: "${title}" into core chamber!`, "indigo");
    });
  });
}

// Dynamic Science Trivia Engine
function loadTriviaQuestion(index) {
  LAB_STATE.currentQuestionIndex = index % TRIVIA_QUESTIONS.length;
  const currentQ = TRIVIA_QUESTIONS[LAB_STATE.currentQuestionIndex];
  
  quizQuestion.innerText = currentQ.question;
  quizOptionsBox.innerHTML = '';
  quizFeedback.classList.add('hidden');

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = "w-full p-2.5 text-left text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 hover:border-slate-700 transition duration-150 font-medium flex items-center justify-between";
    btn.innerHTML = `<span>${opt}</span><span class='text-slate-600 font-mono text-[9px]'>[Option ${String.fromCharCode(65 + idx)}]</span>`;
    
    btn.addEventListener('click', () => {
      checkAnswer(idx, currentQ.correct, currentQ.feedback);
    });
    quizOptionsBox.appendChild(btn);
  });
}

function checkAnswer(chosenIndex, correctIndex, feedbackText) {
  const optionButtons = quizOptionsBox.querySelectorAll('button');
  
  // Disable option clicks
  optionButtons.forEach(btn => btn.disabled = true);
  
  LAB_STATE.triviaScore.total += 1;

  if (chosenIndex === correctIndex) {
    LAB_STATE.triviaScore.correct += 1;
    quizFeedback.innerText = "✓ Correct! " + feedbackText;
    quizFeedback.className = "mt-3 text-xs font-semibold p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block";
    optionButtons[chosenIndex].classList.add('border-emerald-500', 'bg-emerald-950/40');
  } else {
    quizFeedback.innerText = "✗ Incorrect. " + feedbackText;
    quizFeedback.className = "mt-3 text-xs font-semibold p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 block";
    optionButtons[chosenIndex].classList.add('border-rose-500', 'bg-rose-950/40');
    optionButtons[correctIndex].classList.add('border-emerald-500', 'bg-emerald-950/20');
  }

  // Update Score metrics on UI
  quizScoreDisplay.innerText = `Score: ${LAB_STATE.triviaScore.correct}/${LAB_STATE.triviaScore.total}`;
}

btnNextQuestion.addEventListener('click', () => {
  const nextIndex = (LAB_STATE.currentQuestionIndex + 1) % TRIVIA_QUESTIONS.length;
  loadTriviaQuestion(nextIndex);
});

// Lab Notebook Form Processing & Log management
formLabLog.addEventListener('submit', (e) => {
  e.preventDefault();

  const newLog = {
    id: Date.now(),
    title: logTitleInput.value.trim(),
    reactant: logReactantInput.value.trim() || "N/A",
    color: logColorInput.value.trim() || "Clear Solution",
    temperature: LAB_STATE.temperature,
    pH: LAB_STATE.currentPH,
    notes: logNotesInput.value.trim() || "No additional observations recorded.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  LAB_STATE.logs.unshift(newLog);
  saveLogsToStorage();
  renderLogEntries();
  
  // Reset fields
  logNotesInput.value = '';
  
  createToast("Entry added to local digital Log Ledger!", "emerald");
});

// Render active logs ledger
function renderLogEntries() {
  if (LAB_STATE.logs.length === 0) {
    emptyLogsPlaceholder.classList.remove('hidden');
    loggedEntriesBox.innerHTML = '';
    notebookCounterBadge.innerText = "0 Logged";
    return;
  }

  emptyLogsPlaceholder.classList.add('hidden');
  loggedEntriesBox.innerHTML = '';
  
  LAB_STATE.logs.forEach((log) => {
    const entry = document.createElement('div');
    entry.className = "p-3.5 bg-slate-950 border border-slate-800 rounded-xl relative hover:border-slate-700 transition duration-150 space-y-2";
    
    // pH tag color coding
    let phColorBadge = "text-cyan-400 bg-cyan-900/20 border-cyan-500/20";
    if (log.pH <= 3) phColorBadge = "text-red-400 bg-red-900/20 border-red-500/20";
    else if (log.pH >= 10) phColorBadge = "text-purple-400 bg-purple-900/20 border-purple-500/20";
    
    entry.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="space-y-0.5">
          <h4 class="text-xs font-bold text-slate-100">${escapeHTML(log.title)}</h4>
          <p class="text-[10px] text-slate-500 font-mono">Recorded: ${log.timestamp} | ${log.temperature}°C</p>
        </div>
        <button class="btn-delete-log text-slate-500 hover:text-red-400 transition duration-100" data-id="${log.id}" title="Remove Log Entry">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div class="p-1.5 bg-slate-900 rounded border border-slate-800/80">
          <span class="text-slate-500 block">REACTANT:</span>
          <span class="text-slate-300">${escapeHTML(log.reactant)}</span>
        </div>
        <div class="p-1.5 bg-slate-900 rounded border border-slate-800/80">
          <span class="text-slate-500 block">CHAMBER COLOR:</span>
          <span class="text-slate-300">${escapeHTML(log.color)}</span>
        </div>
      </div>
      <div class="text-xs text-slate-300 bg-slate-900/30 p-2 rounded-lg border border-slate-800/50">
        <span class="text-[9px] text-slate-500 font-bold block mb-1">OBSERVATIONS:</span>
        ${escapeHTML(log.notes)}
      </div>
      <div class="flex justify-end">
        <span class="px-2 py-0.5 rounded-full text-[9px] font-mono border ${phColorBadge}">
          pH level: ${log.pH}
        </span>
      </div>
    `;

    // Delete listener
    entry.querySelector('.btn-delete-log').addEventListener('click', (e) => {
      const targetId = parseInt(e.currentTarget.getAttribute('data-id'));
      deleteLogEntry(targetId);
    });

    loggedEntriesBox.appendChild(entry);
  });

  // Update header / count labels
  notebookCounterBadge.innerText = `${LAB_STATE.logs.length} Logged`;
}

// Handle log deletion
function deleteLogEntry(id) {
  LAB_STATE.logs = LAB_STATE.logs.filter(log => log.id !== id);
  saveLogsToStorage();
  renderLogEntries();
  createToast("Entry deleted from workspace notebook.", "amber");
}

// Clear entire ledger log entries
btnClearLogs.addEventListener('click', () => {
  if (LAB_STATE.logs.length === 0) return;
  if (confirm("Are you sure you want to completely erase your science notebook entries? This action cannot be reversed.")) {
    LAB_STATE.logs = [];
    saveLogsToStorage();
    renderLogEntries();
    createToast("Notebook log database cleared successfully!", "rose");
  }
});

// Storage & Persistence utilities
function saveLogsToStorage() {
  localStorage.setItem('scilab_notebook_logs', JSON.stringify(LAB_STATE.logs));
}

function loadLabStateFromStorage() {
  const cached = localStorage.getItem('scilab_notebook_logs');
  if (cached) {
    try {
      LAB_STATE.logs = JSON.parse(cached);
    } catch (e) {
      LAB_STATE.logs = [];
    }
  }
  renderLogEntries();
}

// Custom dynamic Toast system notifications
function createToast(message, variant = "indigo") {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  // Style variation
  let borderClr = "border-indigo-500";
  let bgClr = "bg-slate-900";
  let textClr = "text-indigo-400";

  if (variant === "emerald") {
    borderClr = "border-emerald-500";
    textClr = "text-emerald-400";
  } else if (variant === "amber") {
    borderClr = "border-amber-500";
    textClr = "text-amber-400";
  } else if (variant === "rose") {
    borderClr = "border-rose-500";
    textClr = "text-rose-400";
  } else if (variant === "cyan") {
    borderClr = "border-cyan-500";
    textClr = "text-cyan-400";
  }

  toast.className = `flex items-center space-x-3 p-3 rounded-xl border ${borderClr} ${bgClr} shadow-xl max-w-sm transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <div class="p-1.5 rounded-lg bg-slate-950">
      🧪
    </div>
    <div class="flex-1 text-xs font-semibold ${textClr}">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger enter animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 50);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Sanitization utility
function escapeHTML(str) {
  return str.replace(/[&<>'"/]/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '/': '&#x2F;'
    }[m];
  });
}