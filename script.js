// Virtual Lab State & Management

// --- TAB SWITCHING SYSTEM ---
function switchTab(tabId) {
  const tabs = ['labs', 'periodic', 'notebook', 'trivia'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (t === tabId) {
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/20');
      btn.classList.remove('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
      content.classList.remove('hidden');
      content.classList.add('block');
    } else {
      btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/20');
      btn.classList.add('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
      content.classList.remove('block');
      content.classList.add('hidden');
    }
  });

  // Refresh Pendulum Canvas dimensions or state if selected
  if (tabId === 'labs') {
    setupCanvas();
  }
}

// --- SUB-LAB A: CHEMISTRY MIXER LOGIC ---
let beakerState = {
  waterVolume: 100, // ml
  hclVolume: 0, // ml
  naohVolume: 0, // ml
  indicatorEnabled: false
};

function calculatePH() {
  // Simple simulation algorithm for educational chemistry mixing
  const totalAcid = beakerState.hclVolume;
  const totalBase = beakerState.naohVolume;
  
  if (totalAcid === totalBase) return 7.0;
  
  if (totalAcid > totalBase) {
    const excessAcid = totalAcid - totalBase;
    const ratio = excessAcid / (beakerState.waterVolume + totalAcid + totalBase);
    // Calculate log-like linear mapping for virtual experience
    const ph = 7.0 - (Math.log10(1 + ratio * 100) * 4);
    return Math.max(1.0, parseFloat(ph.toFixed(1)));
  } else {
    const excessBase = totalBase - totalAcid;
    const ratio = excessBase / (beakerState.waterVolume + totalAcid + totalBase);
    const ph = 7.0 + (Math.log10(1 + ratio * 100) * 4.5);
    return Math.min(14.0, parseFloat(ph.toFixed(1)));
  }
}

function getIndicatorColor(ph) {
  // Phenolphthalein shifts from colorless to magenta around pH 8.2 - 10
  if (beakerState.indicatorEnabled) {
    if (ph >= 8.2) {
      // Deep magenta color with alpha channel varying based on high base levels
      const baseIntensity = Math.min(1.0, (ph - 8.2) / 2);
      return `rgba(219, 39, 119, ${0.4 + (baseIntensity * 0.5)})`;
    }
    return 'rgba(224, 242, 254, 0.6)'; // Clear/Watery blue overlay
  }
  
  // Universal Indicator mode colors
  if (ph < 3) return 'rgba(239, 68, 68, 0.8)'; // Acid Red
  if (ph < 5) return 'rgba(249, 115, 22, 0.8)'; // Orange
  if (ph < 6.8) return 'rgba(234, 179, 8, 0.8)'; // Yellow
  if (ph < 7.5) return 'rgba(16, 185, 129, 0.8)'; // Emerald Neutral Green
  if (ph < 9) return 'rgba(14, 165, 233, 0.8)'; // Sky Blue
  if (ph < 11) return 'rgba(67, 56, 202, 0.8)'; // Indigo
  return 'rgba(124, 58, 237, 0.8)'; // Purple
}

function addChemLog(msg, type = 'info') {
  const logger = document.getElementById('chem-logger');
  const p = document.createElement('p');
  if (type === 'acid') p.className = 'text-red-400';
  else if (type === 'base') p.className = 'text-violet-400';
  else if (type === 'water') p.className = 'text-sky-400';
  else if (type === 'indicator') p.className = 'text-amber-400';
  else if (type === 'success') p.className = 'text-emerald-400';
  else p.className = 'text-slate-500';
  
  p.innerText = `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${msg}`;
  logger.appendChild(p);
  logger.scrollTop = logger.scrollHeight;
}

function updateBeakerUI() {
  const ph = calculatePH();
  const color = getIndicatorColor(ph);
  const fluidEl = document.getElementById('beaker-fluid');
  const phDisplay = document.getElementById('ph-display-val');
  const phPin = document.getElementById('ph-indicator-pin');
  
  // Update CSS variables for fluid levels/colors
  const totalVolume = beakerState.waterVolume + beakerState.hclVolume + beakerState.naohVolume;
  const visualPercentage = Math.min(95, Math.max(25, (totalVolume / 250) * 100));
  
  fluidEl.style.height = `${visualPercentage}%`;
  fluidEl.style.backgroundColor = color;
  
  phDisplay.innerText = `pH ${ph}`;
  
  // Handle color classes for text readout
  phDisplay.className = 'text-sm font-extrabold ' + (ph < 6.5 ? 'text-red-400' : ph > 7.5 ? 'text-violet-400' : 'text-emerald-400');
  
  // Map pH 1-14 to 0%-100% slider pin location
  const pinPercent = ((ph - 1) / 13) * 100;
  phPin.style.left = `${pinPercent}%`;
}

// Chemistry Events Setup
document.getElementById('add-hcl-btn').addEventListener('click', () => {
  beakerState.hclVolume += 10;
  addChemLog('Added 10ml Hydrochloric Acid (HCl).', 'acid');
  updateBeakerUI();
});

document.getElementById('add-naoh-btn').addEventListener('click', () => {
  beakerState.naohVolume += 10;
  addChemLog('Added 10ml Sodium Hydroxide (NaOH).', 'base');
  updateBeakerUI();
});

document.getElementById('add-water-btn').addEventListener('click', () => {
  beakerState.waterVolume += 30;
  addChemLog('Poured 30ml Neutral H₂O.', 'water');
  updateBeakerUI();
});

document.getElementById('add-indicator-btn').addEventListener('click', () => {
  beakerState.indicatorEnabled = !beakerState.indicatorEnabled;
  const statusText = beakerState.indicatorEnabled ? 'Phenolphthalein Dye Active (turns pink in alkaline)' : 'Universal Indicator active';
  addChemLog(statusText, 'indicator');
  document.getElementById('add-indicator-btn').classList.toggle('border-amber-400', beakerState.indicatorEnabled);
  updateBeakerUI();
});

document.getElementById('reset-chem-btn').addEventListener('click', () => {
  beakerState = {
    waterVolume: 100,
    hclVolume: 0,
    naohVolume: 0,
    indicatorEnabled: false
  };
  document.getElementById('add-indicator-btn').classList.remove('border-amber-400');
  addChemLog('Beaker cleaned & refilled with fresh H₂O.', 'success');
  updateBeakerUI();
});


// --- SUB-LAB B: PHYSICS PENDULUM MOTION SIMULATION ---
const canvas = document.getElementById('pendulum-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

// Pendulum physical parameters
let length = 120; // visual scale representation
let mass = 1.0;
let gravity = 9.8;
let angle = Math.PI / 4; // current angle in radians
let angularVelocity = 0.0;
let angularAcceleration = 0.0;
let isRunning = false;
let originX, originY;

// Configuration Sliders
const lengthSlider = document.getElementById('slider-length');
const massSlider = document.getElementById('slider-mass');
const lengthVal = document.getElementById('slider-length-val');
const massVal = document.getElementById('slider-mass-val');

function setupCanvas() {
  // Set internal resolution of physics simulator matching DOM layout sizes safely
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  originX = canvas.width / 2;
  originY = 25;
}

function updatePendulumParameters() {
  const lengthRaw = parseFloat(lengthSlider.value);
  length = lengthRaw * (canvas.height / 250); // relative scaled length
  lengthVal.innerText = `${lengthRaw} cm`;
  
  mass = parseFloat(massSlider.value);
  massVal.innerText = `${mass.toFixed(1)} kg`;
  
  // Calculate theoretical period T = 2 * pi * sqrt(L/g)
  const period = 2 * Math.PI * Math.sqrt((lengthRaw / 100) / gravity);
  document.getElementById('pendulum-period-val').innerText = `${period.toFixed(2)}s`;
}

// Gravity environment selection listeners
function setGravityPreset(gVal, buttonId) {
  gravity = gVal;
  const btns = ['g-earth-btn', 'g-moon-btn', 'g-jupiter-btn'];
  btns.forEach(id => {
    const btn = document.getElementById(id);
    if (id === buttonId) {
      btn.className = 'px-2 py-1.5 text-xs rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors';
    } else {
      btn.className = 'px-2 py-1.5 text-xs rounded bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors';
    }
  });
  updatePendulumParameters();
}

document.getElementById('g-earth-btn').addEventListener('click', () => setGravityPreset(9.8, 'g-earth-btn'));
document.getElementById('g-moon-btn').addEventListener('click', () => setGravityPreset(1.6, 'g-moon-btn'));
document.getElementById('g-jupiter-btn').addEventListener('click', () => setGravityPreset(24.8, 'g-jupiter-btn'));

lengthSlider.addEventListener('input', updatePendulumParameters);
massSlider.addEventListener('input', updatePendulumParameters);

function drawPendulum() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Coordinates of the bob
  const bobX = originX + length * Math.sin(angle);
  const bobY = originY + length * Math.cos(angle);
  
  // Draw ceiling anchor
  ctx.beginPath();
  ctx.arc(originX, originY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#64748b';
  ctx.fill();
  
  // Draw support beam line
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(originX - 40, originY - 10, 80, 5);
  
  // Draw String
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(bobX, bobY);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = Math.max(1, mass * 1.5); // Thickness based on visual mass
  ctx.stroke();
  
  // Draw Bob sphere
  ctx.beginPath();
  ctx.arc(bobX, bobY, 10 + (mass * 5), 0, 2 * Math.PI);
  ctx.fillStyle = '#4f46e5';
  ctx.shadowColor = '#6366f1';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0; // reset blur
  
  // Update peak angle label
  const degAngle = Math.round(Math.abs(angle * (180 / Math.PI)));
  document.getElementById('pendulum-angle-val').innerText = `${degAngle}°`;
}

function animate() {
  if (isRunning) {
    // Pendulum differential equation: theta'' = -(g/L) * sin(theta)
    // Dampen angular velocity slightly for realistic lab environment drag
    const damping = 0.995;
    const gScaled = gravity * 0.05; // speed factor tweak
    
    angularAcceleration = (-gScaled / (length / 10)) * Math.sin(angle);
    angularVelocity += angularAcceleration;
    angularVelocity *= damping;
    angle += angularVelocity;
  }
  
  drawPendulum();
  animationFrameId = requestAnimationFrame(animate);
}

// Pendulum Interactive Controls
const playBtn = document.getElementById('pendulum-play-btn');
playBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  if (isRunning) {
    playBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    playBtn.classList.remove('text-emerald-400');
    playBtn.classList.add('text-amber-400');
  } else {
    playBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    playBtn.classList.remove('text-amber-400');
    playBtn.classList.add('text-emerald-400');
  }
});

document.getElementById('pendulum-reset-btn').addEventListener('click', () => {
  isRunning = false;
  angle = Math.PI / 4; // Reset to standard offset swing
  angularVelocity = 0.0;
  angularAcceleration = 0.0;
  
  // Update play icon button state
  playBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  playBtn.classList.remove('text-amber-400');
  playBtn.classList.add('text-emerald-400');
  
  drawPendulum();
});


// --- TAB 2: INTERACTIVE PERIODIC TABLE ---
const mockElements = [
  { number: 1, symbol: 'H', name: 'Hydrogen', weight: '1.008', group: 'Reactive Nonmetal', state: 'Gas', discoverer: 'Henry Cavendish', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40', trivia: 'Hydrogen is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass.' },
  { number: 2, symbol: 'He', name: 'Helium', weight: '4.0026', group: 'Noble Gas', state: 'Gas', discoverer: 'Jansen & Lockyer', color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/40', trivia: 'It has the lowest boiling & melting points of any element and is widely used in cooling superconductive MRI magnets.' },
  { number: 3, symbol: 'Li', name: 'Lithium', weight: '6.94', group: 'Alkali Metal', state: 'Solid', discoverer: 'Johan August Arfwedson', color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/40', trivia: 'As the lightest of all metals, Lithium is essential in the production of modern rechargeable smartphone & EV batteries.' },
  { number: 6, symbol: 'C', name: 'Carbon', weight: '12.011', group: 'Reactive Nonmetal', state: 'Solid', discoverer: 'Ancient Egypt', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40', trivia: 'Carbon compounds form the basis of all known organic life on Earth. Graphite & diamond are pure allotropes of Carbon.' },
  { number: 7, symbol: 'N', name: 'Nitrogen', weight: '14.007', group: 'Reactive Nonmetal', state: 'Gas', discoverer: 'Daniel Rutherford', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40', trivia: 'Nitrogen gas (N₂) makes up roughly 78% of Earth\'s atmosphere, outnumbering oxygen nearly four to one.' },
  { number: 8, symbol: 'O', name: 'Oxygen', weight: '15.999', group: 'Reactive Nonmetal', state: 'Gas', discoverer: 'Joseph Priestley', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40', trivia: 'Oxygen is highly reactive with other elements and organic matter. It fuels cellular respiration in almost all living lifeforms.' },
  { number: 11, symbol: 'Na', name: 'Sodium', weight: '22.990', group: 'Alkali Metal', state: 'Solid', discoverer: 'Humphry Davy', color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/40', trivia: 'Sodium is highly explosive when exposed to liquid water, but is perfectly safe and essential in ordinary table salt (NaCl).' },
  { number: 13, symbol: 'Al', name: 'Aluminum', weight: '26.982', group: 'Post-transition Metal', state: 'Solid', discoverer: 'Hans Christian Ørsted', color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/40', trivia: 'Due to its low density and immense natural resistance to corrosion, Aluminum is widely favored in aviation engineering.' },
  { number: 14, symbol: 'Si', name: 'Silicon', weight: '28.085', group: 'Metalloid', state: 'Solid', discoverer: 'Jöns Jacob Berzelius', color: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/40', trivia: 'Silicon is the key structural material behind semiconductor transistors and microprocessors that power the digital age.' },
  { number: 26, symbol: 'Fe', name: 'Iron', weight: '55.845', group: 'Transition Metal', state: 'Solid', discoverer: 'Before 5000 BC', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40', trivia: 'By mass, Iron is the most abundant element on Earth, making up much of the inner core. It conducts crucial oxygen in hemoglobin.' },
  { number: 29, symbol: 'Cu', name: 'Copper', weight: '63.546', group: 'Transition Metal', state: 'Solid', discoverer: 'Middle East (9000 BC)', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40', trivia: 'Renowned for exceptionally high thermal & electrical conductivity. Pure copper develops a green protective layer called patina.' },
  { number: 79, symbol: 'Au', name: 'Gold', weight: '196.97', group: 'Transition Metal', state: 'Solid', discoverer: 'Ancient Civilizations', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40', trivia: 'A highly malleable precious metal that does not tarnish or rust. It has been used as a standard of currency value for millennia.' },
  { number: 80, symbol: 'Hg', name: 'Mercury', weight: '200.59', group: 'Transition Metal', state: 'Liquid', discoverer: 'Ancient Egyptians', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40', trivia: 'Famously nicknamed "quicksilver", Mercury is the only metallic element that remains completely liquid at standard temperature.' },
  { number: 92, symbol: 'U', name: 'Uranium', weight: '238.03', group: 'Actinide', state: 'Solid', discoverer: 'Martin Heinrich Klaproth', color: 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/40', trivia: 'A highly dense, naturally radioactive metal. Its isotope U-235 is the primary fuel block driving nuclear power stations.' },
  { number: 118, symbol: 'Og', name: 'Oganesson', weight: '294', group: 'Noble Gas (Predicted)', state: 'Gas (Predicted)', discoverer: 'Joint Institute for Nuclear Research', color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/40', trivia: 'A synthetic element that currently sits as the highest atomic number and heaviest ever synthesized on the periodic grid.' },
  { number: 47, symbol: 'Ag', name: 'Silver', weight: '107.87', group: 'Transition Metal', state: 'Solid', discoverer: 'Prehistoric humans', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40', trivia: 'Possesses the highest electrical conductivity, thermal conductivity, and reflectivity of any known metal on Earth.' }
];

function initPeriodicTable() {
  const container = document.getElementById('elements-container');
  container.innerHTML = '';
  
  mockElements.forEach(elem => {
    const btn = document.createElement('button');
    btn.className = `flex flex-col items-center justify-between p-2 rounded-lg border transition-all text-center aspect-square ${elem.color}`;
    btn.id = `element-card-${elem.symbol}`;
    btn.innerHTML = `
      <span class="text-[9px] font-mono text-slate-400 block w-full text-left">${elem.number}</span>
      <span class="text-lg font-bold tracking-tight">${elem.symbol}</span>
      <span class="text-[8px] truncate max-w-full">${elem.name}</span>
    `;
    btn.addEventListener('click', () => selectElement(elem));
    container.appendChild(btn);
  });
}

function selectElement(elem) {
  document.getElementById('elem-number').innerText = `#${elem.number}`;
  document.getElementById('elem-name').innerText = elem.name;
  document.getElementById('elem-category').innerText = elem.group;
  document.getElementById('elem-weight').innerText = `${elem.weight} u`;
  document.getElementById('elem-state').innerText = elem.state;
  document.getElementById('elem-discoverer').innerText = elem.discoverer;
  document.getElementById('elem-trivia').innerText = elem.trivia;
  
  const symbolBox = document.getElementById('elem-symbol-box');
  symbolBox.innerText = elem.symbol;
}


// --- TAB 3: LAB NOTEBOOK / PLANNER LOGIC ---
let localExperiments = [];

const defaultExperiments = [
  {
    id: 1,
    title: "Baking Soda Volcano",
    hypothesis: "Mixing sodium bicarbonate (base) and acetic acid (vinegar) releases carbon dioxide gas, producing dynamic bubbling fizz resembling an eruption.",
    materials: "Baking soda, vinegar, red dye, plastic cup, tray",
    steps: "1. Place cup on protective flat tray.\n2. Fill with 3 tablespoons baking soda & some red dye.\n3. Pour in half a cup of vinegar and quickly observe the bubbling foam!",
    completed: true,
    outcome: "Succeeded. Huge foam eruption occurred within 2 seconds. Releasing CO2 creates rapid gas expansion!"
  },
  {
    id: 2,
    title: "Invisible Lemon Ink",
    hypothesis: "Lemon juice is acidic and weakens paper. Heat will oxidize the residual citric acid, turning the hidden text brown first.",
    materials: "Lemon juice, cotton swab, plain paper, table lamp or candle heat",
    steps: "1. Dip cotton swab in lemon juice.\n2. Write a secret code on normal printer paper.\n3. Allow paper to dry completely.\n4. Hold carefully near a warm lightbulb to read.",
    completed: false,
    outcome: ""
  }
];

function loadNotebook() {
  const stored = localStorage.getItem('scilab_experiments');
  if (stored) {
    localExperiments = JSON.parse(stored);
  } else {
    localExperiments = [...defaultExperiments];
    saveToStorage();
  }
  renderNotebook();
}

function saveToStorage() {
  localStorage.setItem('scilab_experiments', JSON.stringify(localExperiments));
}

function renderNotebook() {
  const list = document.getElementById('notebook-list');
  list.innerHTML = '';
  
  if (localExperiments.length === 0) {
    list.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center text-slate-500">
        <svg class="w-12 h-12 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-sm">No active experiments found in your log book.</p>
        <p class="text-xs mt-1">Fill out the template inputs to add your first project.</p>
      </div>
    `;
    return;
  }
  
  localExperiments.forEach((exp, index) => {
    const card = document.createElement('div');
    card.className = `p-5 rounded-xl border transition-all ${exp.completed ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-slate-950 border-slate-800'}`;
    
    // Format steps for rendering
    const formattedSteps = exp.steps.split('\n').map(s => `<li>${s}</li>`).join('');
    
    card.innerHTML = `
      <div class="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            ${exp.completed ? '<span class="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-500/10">Completed</span>' : '<span class="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-500/10">In Progress</span>'}
            ${exp.title}
          </h3>
          <p class="text-xs text-slate-400 mt-1"><strong>Hypothesis:</strong> ${exp.hypothesis}</p>
        </div>
        <button class="text-slate-500 hover:text-red-400 p-1 rounded transition-colors" onclick="deleteExperiment(${exp.id})">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-900/80 text-xs">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">🔧 Materials:</p>
          <p class="text-slate-300">${exp.materials}</p>
          
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-3 mb-1">📋 Directions:</p>
          <ol class="list-decimal pl-4 space-y-1 text-slate-300">
            ${formattedSteps}
          </ol>
        </div>
        
        <div class="flex flex-col justify-between bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">📝 Log Outcome:</p>
            ${exp.completed ? 
              `<p class="text-emerald-300 italic">"${exp.outcome}"</p>` : 
              `<textarea id="outcome-input-${exp.id}" placeholder="Log what happened during testing..." class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"></textarea>`
            }
          </div>
          
          ${!exp.completed ? 
            `<button onclick="completeExperiment(${exp.id})" class="mt-3 w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded text-xs font-semibold transition-all">
              Mark as Done & Save Log
             </button>` : ''
          }
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

window.completeExperiment = function(id) {
  const textarea = document.getElementById(`outcome-input-${id}`);
  const outcomeText = textarea ? textarea.value.trim() : 'Experiment completed successfully.';
  
  const index = localExperiments.findIndex(x => x.id === id);
  if (index !== -1) {
    localExperiments[index].completed = true;
    localExperiments[index].outcome = outcomeText || 'Observation logged without extra notes.';
    saveToStorage();
    renderNotebook();
  }
};

window.deleteExperiment = function(id) {
  localExperiments = localExperiments.filter(x => x.id !== id);
  saveToStorage();
  renderNotebook();
};

document.getElementById('experiment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('exp-title').value.trim();
  const hypothesis = document.getElementById('exp-hypothesis').value.trim();
  const materials = document.getElementById('exp-materials').value.trim();
  const steps = document.getElementById('exp-steps').value.trim();
  
  const newObj = {
    id: Date.now(),
    title,
    hypothesis,
    materials,
    steps,
    completed: false,
    outcome: ''
  };
  
  localExperiments.unshift(newObj); // Add to beginning of view list
  saveToStorage();
  renderNotebook();
  
  // Reset fields cleanly
  document.getElementById('experiment-form').reset();
});

document.getElementById('clear-all-notebook').addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all saved notebook entries?')) {
    localExperiments = [];
    saveToStorage();
    renderNotebook();
  }
});


// --- TAB 4: TRIVIA / QUIZ LOGIC ---
const quizPool = [
  {
    category: 'Physics',
    difficulty: 'Easy',
    question: 'Which subatomic particle carries a negative electrical charge?',
    options: ['Proton', 'Electron', 'Neutron', 'Positron'],
    correct: 1,
    reason: 'Electrons orbit the nucleus of an atom and carry a standard charge of -1.'
  },
  {
    category: 'Chemistry',
    difficulty: 'Medium',
    question: 'What is the chemical element with atomic number 79?',
    options: ['Silver', 'Platinum', 'Gold', 'Mercury'],
    correct: 2,
    reason: 'The Latin name for Gold is Aurum, which explains its symbol Au and atomic number 79.'
  },
  {
    category: 'Physics',
    difficulty: 'Medium',
    question: 'Under constant gravity, what governs the swing period duration of a simple pendulum?',
    options: ['The mass of the bob', 'The visual color of the string', 'The physical length of the string', 'The air temperature'],
    correct: 2,
    reason: 'T = 2 * pi * sqrt(L / g). The swinging period is solely dictated by gravity acceleration and string length.'
  },
  {
    category: 'Biology',
    difficulty: 'Easy',
    question: 'Which cellular structure is famously known as the powerhouse of the eukaryotic cell?',
    options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Nucleolus'],
    correct: 1,
    reason: 'The Mitochondria produce Adenosine Triphosphate (ATP) to chemical energy standards.'
  },
  {
    category: 'Earth Science',
    difficulty: 'Hard',
    question: 'Which geologic layer of the Earth acts as a liquid convective fluid that powers our protective magnetic field?',
    options: ['The Asthenosphere', 'The Inner Core', 'The Crust', 'The Outer Core'],
    correct: 3,
    reason: 'Convection of liquid iron and nickel in the planet outer core creates the dynamo effect generating our magnetic field.'
  }
];

let currentQuizIndex = 0;
let streak = 0;
let answeredThisRound = false;

function renderQuizQuestion() {
  const q = quizPool[currentQuizIndex];
  document.getElementById('quiz-difficulty').innerText = `Difficulty: ${q.difficulty}`;
  document.getElementById('quiz-category').innerText = q.category;
  document.getElementById('quiz-question').innerText = q.question;
  
  const optContainer = document.getElementById('quiz-options-container');
  optContainer.innerHTML = '';
  
  answeredThisRound = false;
  
  const feedback = document.getElementById('quiz-feedback');
  feedback.className = 'mt-6 p-4 rounded-lg hidden transition-all duration-300';
  
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'w-full py-3 px-4 text-left text-sm font-semibold rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-slate-900 transition-all text-slate-200';
    btn.innerText = opt;
    btn.addEventListener('click', () => submitAnswer(idx, btn));
    optContainer.appendChild(btn);
  });
}

function submitAnswer(chosenIdx, clickedBtn) {
  if (answeredThisRound) return;
  answeredThisRound = true;
  
  const q = quizPool[currentQuizIndex];
  const feedback = document.getElementById('quiz-feedback');
  const text = document.getElementById('feedback-text');
  
  const optContainer = document.getElementById('quiz-options-container');
  const buttons = optContainer.getElementsByTagName('button');
  
  if (chosenIdx === q.correct) {
    clickedBtn.className = 'w-full py-3 px-4 text-left text-sm font-bold rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300';
    feedback.className = 'mt-6 p-4 rounded-lg block bg-emerald-950/40 border border-emerald-800/60 text-emerald-300';
    text.innerHTML = `✨ <strong>Correct!</strong> ${q.reason}`;
    streak++;
  } else {
    clickedBtn.className = 'w-full py-3 px-4 text-left text-sm font-bold rounded-lg bg-red-950 border border-red-500 text-red-300';
    feedback.className = 'mt-6 p-4 rounded-lg block bg-red-950/40 border border-red-800/60 text-red-300';
    text.innerHTML = `❌ <strong>Incorrect!</strong> The correct answer was <em>"${q.options[q.correct]}"</em>. <br><span class="text-xs mt-1 block text-slate-400">${q.reason}</span>`;
    streak = 0; // Reset streak
    
    // Highlight the correct answer button as well
    buttons[q.correct].className = 'w-full py-3 px-4 text-left text-sm font-bold rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300';
  }
  
  document.getElementById('streak-counter').innerText = `${streak} 🔥`;
}

document.getElementById('next-quiz-btn').addEventListener('click', () => {
  currentQuizIndex = (currentQuizIndex + 1) % quizPool.length;
  renderQuizQuestion();
});


// --- ON LOAD INITIALIZATIONS ---
window.addEventListener('load', () => {
  // Init Chemistry display
  updateBeakerUI();
  
  // Init Physics Pendulum
  setupCanvas();
  updatePendulumParameters();
  animate();
  
  // Init Periodic Table
  initPeriodicTable();
  // Select hydrogen by default
  selectElement(mockElements[0]);
  
  // Init Lab Notebook
  loadNotebook();
  
  // Init Trivia
  renderQuizQuestion();
});

// Capture resize safely to maintain pendulum positioning correctly
window.addEventListener('resize', () => {
  setupCanvas();
});