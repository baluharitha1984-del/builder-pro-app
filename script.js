document.addEventListener('DOMContentLoaded', () => {
  // Periodic table data array with full set of elements up to key interactive range, structured precisely.
  const elements = [
    { number: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', category: 'nonmetal', period: 1, group: 1, state: 'gas', melting: 14, boiling: 20, discoverer: 'Henry Cavendish', summary: 'Hydrogen is the chemical element with the symbol H and atomic number 1. It is the lightest element in the periodic table.' },
    { number: 2, symbol: 'He', name: 'Helium', mass: '4.0026', category: 'noble', period: 1, group: 18, state: 'gas', melting: 1, boiling: 4, discoverer: 'Jansen & Lockyer', summary: 'Helium is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group.' },
    
    { number: 3, symbol: 'Li', name: 'Lithium', mass: '6.94', category: 'alkali', period: 2, group: 1, state: 'solid', melting: 453, boiling: 1615, discoverer: 'Johan August Arfwedson', summary: 'Lithium is a soft, silvery-white alkali metal. Under standard conditions, it is the least dense solid element.' },
    { number: 4, symbol: 'Be', name: 'Beryllium', mass: '9.0122', category: 'alkaline', period: 2, group: 2, state: 'solid', melting: 1560, boiling: 2742, discoverer: 'Louis Nicolas Vauquelin', summary: 'Beryllium is a relatively rare element in the universe, often forming as a product of the spallation of larger nuclei.' },
    { number: 5, symbol: 'B', name: 'Boron', mass: '10.81', category: 'metalloid', period: 2, group: 13, state: 'solid', melting: 2349, boiling: 4200, discoverer: 'Joseph Louis Gay-Lussac', summary: 'Boron is a low-abundance cosmic element produced by cosmic-ray spallation and supernovae rather than stellar nucleosynthesis.' },
    { number: 6, symbol: 'C', name: 'Carbon', mass: '12.011', category: 'nonmetal', period: 2, group: 14, state: 'solid', melting: 3823, boiling: 4300, discoverer: 'Ancient Egypt', summary: 'Carbon is a tetravalent nonmetal element, forming the essential backbone of all organic life forms.' },
    { number: 7, symbol: 'N', name: 'Nitrogen', mass: '14.007', category: 'nonmetal', period: 2, group: 15, state: 'gas', melting: 63, boiling: 77, discoverer: 'Daniel Rutherford', summary: 'Nitrogen is a common nonmetal gas making up about 78% of Earth\'s atmosphere, critical to amino acids.' },
    { number: 8, symbol: 'O', name: 'Oxygen', mass: '15.999', category: 'nonmetal', period: 2, group: 16, state: 'gas', melting: 54, boiling: 90, discoverer: 'Carl Wilhelm Scheele', summary: 'Oxygen is highly reactive with other elements and organic compounds, vital for human cellular respiration.' },
    { number: 9, symbol: 'F', name: 'Fluorine', mass: '18.998', category: 'halogen', period: 2, group: 17, state: 'gas', melting: 53, boiling: 85, discoverer: 'André-Marie Ampère', summary: 'Fluorine is an extremely toxic halogen gas, highly reactive with virtually all other substances.' },
    { number: 10, symbol: 'Ne', name: 'Neon', mass: '20.180', category: 'noble', period: 2, group: 18, state: 'gas', melting: 24, boiling: 27, discoverer: 'Morris Travers', summary: 'Neon is a colorless inert gas that glows with a distinct reddish-orange light when used in high-voltage discharge tubes.' },

    { number: 11, symbol: 'Na', name: 'Sodium', mass: '22.990', category: 'alkali', period: 3, group: 1, state: 'solid', melting: 371, boiling: 1156, discoverer: 'Humphry Davy', summary: 'Sodium is a highly reactive alkali metal that reacts violently with water. Found abundantly in ocean table salt.' },
    { number: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.305', category: 'alkaline', period: 3, group: 2, state: 'solid', melting: 923, boiling: 1363, discoverer: 'Joseph Black', summary: 'Magnesium is a shiny gray solid which bears a close physical resemblance to the other five alkaline earth metals.' },
    { number: 13, symbol: 'Al', name: 'Aluminium', mass: '26.982', category: 'post-transition', period: 3, group: 13, state: 'solid', melting: 933, boiling: 2792, discoverer: 'Hans Christian Ørsted', summary: 'Aluminium is a lightweight, non-magnetic post-transition metal, crucial for aerospace engineering.' },
    { number: 14, symbol: 'Si', name: 'Silicon', mass: '28.085', category: 'metalloid', period: 3, group: 14, state: 'solid', melting: 1687, boiling: 3538, discoverer: 'Jöns Jacob Berzelius', summary: 'Silicon is a hard, crystalline metalloid widely used as the basis of modern computer semiconductor chips.' },
    { number: 15, symbol: 'P', name: 'Phosphorus', mass: '30.974', category: 'nonmetal', period: 3, group: 15, state: 'solid', melting: 317, boiling: 553, discoverer: 'Hennig Brand', summary: 'Phosphorus exists in highly reactive red and white allotropes, critical for life energy-transfer compounds like ATP.' },
    { number: 16, symbol: 'S', name: 'Sulfur', mass: '32.06', category: 'nonmetal', period: 3, group: 16, state: 'solid', melting: 388, boiling: 717, discoverer: 'Chinese Chemists', summary: 'Sulfur is an abundant, multivalent nonmetal. Under normal conditions, sulfur atoms form cyclic octatomic molecules with a yellow chemical formula.' },
    { number: 17, symbol: 'Cl', name: 'Chlorine', mass: '35.45', category: 'halogen', period: 3, group: 17, state: 'gas', melting: 171, boiling: 239, discoverer: 'Carl Wilhelm Scheele', summary: 'Chlorine is a yellow-green halogen gas, widely used as an oxidizing agent in water purification and bleaches.' },
    { number: 18, symbol: 'Ar', name: 'Argon', mass: '39.948', category: 'noble', period: 3, group: 18, state: 'gas', melting: 83, boiling: 87, discoverer: 'Lord Rayleigh', summary: 'Argon is the third-most abundant gas in the Earth\'s atmosphere, at 0.934%, making it useful as an inert shielding environment.' },

    { number: 19, symbol: 'K', name: 'Potassium', mass: '39.098', category: 'alkali', period: 4, group: 1, state: 'solid', melting: 336, boiling: 1032, discoverer: 'Humphry Davy', summary: 'Potassium is a silvery-white metal that is soft enough to be cut with a knife with little effort. Highly reactive with water.' },
    { number: 20, symbol: 'Ca', name: 'Calcium', mass: '40.078', category: 'alkaline', period: 4, group: 2, state: 'solid', melting: 1115, boiling: 1757, discoverer: 'Humphry Davy', summary: 'Calcium is vital for living organisms, particularly in cell physiology, bone formation, and shell structures.' },
    { number: 21, symbol: 'Sc', name: 'Scandium', mass: '44.956', category: 'transition', period: 4, group: 3, state: 'solid', melting: 1814, boiling: 3109, discoverer: 'Lars Fredrik Nilson', summary: 'Scandium is a silvery-white metallic d-block transition element, historically classified as a rare-earth element.' },
    { number: 22, symbol: 'Ti', name: 'Titanium', mass: '47.867', category: 'transition', period: 4, group: 4, state: 'solid', melting: 1941, boiling: 3560, discoverer: 'William Gregor', summary: 'Titanium is a lustrous transition metal with a silver color, low density, high strength, and highly resistant to corrosion.' },
    { number: 23, symbol: 'V', name: 'Vanadium', mass: '50.942', category: 'transition', period: 4, group: 5, state: 'solid', melting: 2183, boiling: 3680, discoverer: 'Andrés Manuel del Río', summary: 'Vanadium is a hard, silvery-grey, malleable transition metal. It is rarely found as a free element in nature.' },
    { number: 24, symbol: 'Cr', name: 'Chromium', mass: '51.996', category: 'transition', period: 4, group: 6, state: 'solid', melting: 2180, boiling: 2944, discoverer: 'Louis Nicolas Vauquelin', summary: 'Chromium is a steely-gray, lustrous, hard and brittle transition metal, valued for its high corrosion resistance and hardness.' },
    { number: 25, symbol: 'Mn', name: 'Manganese', mass: '54.938', category: 'transition', period: 4, group: 7, state: 'solid', melting: 1519, boiling: 2334, discoverer: 'Carl Wilhelm Scheele', summary: 'Manganese is a transition metal with important industrial alloy uses, particularly in stainless steels.' },
    { number: 26, symbol: 'Fe', name: 'Iron', mass: '55.845', category: 'transition', period: 4, group: 8, state: 'solid', melting: 1811, boiling: 3134, discoverer: 'Ancient civilizations', summary: 'Iron is by mass the most common element on Earth, forming much of Earth\'s outer and inner core.' },
    { number: 27, symbol: 'Co', name: 'Cobalt', mass: '58.933', category: 'transition', period: 4, group: 9, state: 'solid', melting: 1768, boiling: 3200, discoverer: 'Georg Brandt', summary: 'Cobalt is a ferromagnetic metal used extensively in superalloys, magnetic media, and rechargeable lithium batteries.' },
    { number: 28, symbol: 'Ni', name: 'Nickel', mass: '58.693', category: 'transition', period: 4, group: 10, state: 'solid', melting: 1728, boiling: 3186, discoverer: 'Axel Fredrik Cronstedt', summary: 'Nickel is a silvery-white lustrous metal with a slight golden tinge. It belongs to the transition metals.' },
    { number: 29, symbol: 'Cu', name: 'Copper', mass: '63.546', category: 'transition', period: 4, group: 11, state: 'solid', melting: 1358, boiling: 2835, discoverer: 'Middle East', summary: 'Copper is a soft, malleable, and ductile metal with very high thermal and electrical conductivity.' },
    { number: 30, symbol: 'Zn', name: 'Zinc', mass: '65.38', category: 'transition', period: 4, group: 12, state: 'solid', melting: 693, boiling: 1180, discoverer: 'Indian chemists', summary: 'Zinc is a slightly brittle metal at room temperature, with a blue-silvery appearance when oxidation is removed.' },
    { number: 31, symbol: 'Ga', name: 'Gallium', mass: '69.723', category: 'post-transition', period: 4, group: 13, state: 'solid', melting: 303, boiling: 2673, discoverer: 'Paul-Émile Lecoq de Boisbaudran', summary: 'Gallium has a melting point near room temperature (29.7°C), letting it melt in an observer\'s hand.' },
    { number: 32, symbol: 'Ge', name: 'Germanium', mass: '72.630', category: 'metalloid', period: 4, group: 14, state: 'solid', melting: 1211, boiling: 3106, discoverer: 'Clemens Winkler', summary: 'Germanium is a lustrous, hard-brittle, grayish-white metalloid in the carbon group, chemically similar to silicon.' },
    { number: 33, symbol: 'As', name: 'Arsenic', mass: '74.922', category: 'metalloid', period: 4, group: 15, state: 'solid', melting: 1090, boiling: 887, discoverer: 'Albertus Magnus', summary: 'Arsenic occurs in many minerals, usually in combination with sulfur and metals. Historically infamous as a potent poison.' },
    { number: 34, symbol: 'Se', name: 'Selenium', mass: '78.971', category: 'nonmetal', period: 4, group: 16, state: 'solid', melting: 494, boiling: 958, discoverer: 'Jöns Jacob Berzelius', summary: 'Selenium is a nonmetal with properties that are intermediate between the elements sulfur and tellurium.' },
    { number: 35, symbol: 'Br', name: 'Bromine', mass: '79.904', category: 'halogen', period: 4, group: 17, state: 'liquid', melting: 266, boiling: 332, discoverer: 'Antoine Jérôme Balard', summary: 'Bromine is a reddish-brown liquid halogen at standard temperatures. Volatile and highly irritating.' },
    { number: 36, symbol: 'Kr', name: 'Krypton', mass: '83.798', category: 'noble', period: 4, group: 18, state: 'gas', melting: 115, boiling: 120, discoverer: 'William Ramsay', summary: 'Krypton is a colorless, odorless, tasteless noble gas that occurs in trace amounts in the atmosphere.' },

    // Selected heavy elements for complete feel
    { number: 47, symbol: 'Ag', name: 'Silver', mass: '107.87', category: 'transition', period: 5, group: 11, state: 'solid', melting: 1235, boiling: 2435, discoverer: 'Prehistoric', summary: 'Silver is a soft, white, lustrous transition metal, exhibiting the highest electrical conductivity of any element.' },
    { number: 50, symbol: 'Sn', name: 'Tin', mass: '118.71', category: 'post-transition', period: 5, group: 14, state: 'solid', melting: 505, boiling: 2875, discoverer: '3000 BC', summary: 'Tin is a post-transition metal in group 14, obtained chiefly from the mineral cassiterite.' },
    { number: 53, symbol: 'I', name: 'Iodine', mass: '126.90', category: 'halogen', period: 5, group: 17, state: 'solid', melting: 387, boiling: 457, discoverer: 'Bernard Courtois', summary: 'Iodine is a lustrous, purple-black non-metallic solid. Essential for synthesis of thyroid hormones.' },
    { number: 54, symbol: 'Xe', name: 'Xenon', mass: '131.29', category: 'noble', period: 5, group: 18, state: 'gas', melting: 161, boiling: 165, discoverer: 'William Ramsay', summary: 'Xenon is an extremely dense, colorless, odorless noble gas, used in flash lamps and ion propulsion thrusters.' },
    
    { number: 79, symbol: 'Au', name: 'Gold', mass: '196.97', category: 'transition', period: 6, group: 11, state: 'solid', melting: 1337, boiling: 3129, discoverer: 'Before 3000 BC', summary: 'Gold is a highly sought-after dense precious transition metal, resistant to chemical attack.' },
    { number: 80, symbol: 'Hg', name: 'Mercury', mass: '200.59', category: 'transition', period: 6, group: 12, state: 'liquid', melting: 234, boiling: 630, discoverer: 'Ancient Chinese', summary: 'Mercury is the only metallic element that is liquid at standard conditions for temperature and pressure.' },
    { number: 82, symbol: 'Pb', name: 'Lead', mass: '207.2', category: 'post-transition', period: 6, group: 14, state: 'solid', melting: 601, boiling: 2022, discoverer: 'Middle East', summary: 'Lead is a heavy metal denser than most common materials, with a dull gray look when tarnished.' },
    { number: 86, symbol: 'Rn', name: 'Radon', mass: '222', category: 'noble', period: 6, group: 18, state: 'gas', melting: 202, boiling: 211, discoverer: 'Ernest Rutherford', summary: 'Radon is a radioactive, colorless, odorless, tasteless noble gas, naturally formed from radium decay.' },
    
    { number: 92, symbol: 'U', name: 'Uranium', mass: '238.03', category: 'actinide', period: 7, group: 6, state: 'synthetic', melting: 1405, boiling: 4404, discoverer: 'Martin Heinrich Klaproth', summary: 'Uranium is a weakly radioactive metal which has a unique role in nuclear fission power generation.' },

    // Lanthanides Representation F-block
    { number: 57, symbol: 'La', name: 'Lanthanum', mass: '138.91', category: 'lanthanide', period: 6, group: 3, state: 'solid', melting: 1193, boiling: 3737, discoverer: 'Carl Gustaf Mosander', summary: 'Lanthanum is the prototype of the lanthanide series, found in rare-earth minerals.' },
    { number: 58, symbol: 'Ce', name: 'Cerium', mass: '140.12', category: 'lanthanide', period: 6, group: 3, state: 'solid', melting: 1068, boiling: 3716, discoverer: 'Martin Heinrich Klaproth', summary: 'Cerium is a soft, ductile, and silvery-white metal that oxidizes readily in the atmosphere.' },
    { number: 59, symbol: 'Pr', name: 'Praseodymium', mass: '140.91', category: 'lanthanide', period: 6, group: 3, state: 'solid', melting: 1208, boiling: 3793, discoverer: 'Carl Auer von Welsbach', summary: 'Praseodymium is a soft, silvery, malleable and ductile metal, valued for its magnetic, electrical and chemical properties.' },

    // Actinides Representation F-block
    { number: 89, symbol: 'Ac', name: 'Actinium', mass: '227', category: 'actinide', period: 7, group: 3, state: 'synthetic', melting: 1323, boiling: 3471, discoverer: 'Friedrich Oskar Giesel', summary: 'Actinium is a radioactive metallic chemical element, glowing with an eerie pale blue light in the dark.' },
    { number: 90, symbol: 'Th', name: 'Thorium', mass: '232.04', category: 'actinide', period: 7, group: 3, state: 'synthetic', melting: 2023, boiling: 5061, discoverer: 'Jöns Jacob Berzelius', summary: 'Thorium is a weakly radioactive silver-white metal, explored as an alternative fuel for nuclear power generation.' }
  ];

  // Cache Dom Elements
  const gridContainer = document.getElementById('periodic-table-grid');
  const fBlockContainer = document.getElementById('periodic-table-f-block');
  const searchInput = document.getElementById('table-search');
  const tempSlider = document.getElementById('temp-slider');
  const tempValText = document.getElementById('temp-val');

  // Inspect Panel
  const detailNumber = document.getElementById('detail-number');
  const detailMass = document.getElementById('detail-mass');
  const detailSymbol = document.getElementById('detail-symbol');
  const detailName = document.getElementById('detail-name');
  const detailCategory = document.getElementById('detail-category');
  const detailPhase = document.getElementById('detail-phase');
  const detailDiscoverer = document.getElementById('detail-discoverer');
  const detailMelting = document.getElementById('detail-melting');
  const detailBoiling = document.getElementById('detail-boiling');
  const detailSummary = document.getElementById('detail-summary');
  const detailStateBadge = document.getElementById('detail-state');

  // Panels
  const panelDetails = document.getElementById('panel-details');
  const panelCompare = document.getElementById('panel-compare');
  const panelQuiz = document.getElementById('panel-quiz');

  // Mode Switchers
  const btnQuizMode = document.getElementById('btn-quiz-mode');
  const btnCompareMode = document.getElementById('btn-compare-mode');
  const closeQuizBtn = document.getElementById('close-quiz-btn');
  const closeCompareBtn = document.getElementById('close-compare-btn');

  // Quiz state
  let quizScoreCorrect = 0;
  let quizScoreTotal = 0;
  let quizCurrentTarget = null;

  // Category Filters
  const categoryFilterChips = document.querySelectorAll('.filter-chip');
  let activeCategory = 'all';

  // Temperature tracking state
  let currentTempKelvin = 298;

  // Helper function to get element category color classes
  function getCategoryColorClass(category) {
    switch (category) {
      case 'nonmetal': return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30';
      case 'noble': return 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30';
      case 'alkali': return 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30';
      case 'alkaline': return 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30';
      case 'metalloid': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30';
      case 'halogen': return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30';
      case 'post-transition': return 'bg-sky-500/20 border-sky-500/40 text-sky-300 hover:bg-sky-500/30';
      case 'lanthanide': return 'bg-pink-500/20 border-pink-500/40 text-pink-300 hover:bg-pink-500/30';
      case 'actinide': return 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30';
      default: return 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30';
    }
  }

  // Determine state of matter at specific temperature
  function calculateStateAtTemp(elem, tempK) {
    if (elem.state === 'synthetic') return 'synthetic';
    if (tempK <= elem.melting) return 'solid';
    if (tempK > elem.melting && tempK < elem.boiling) return 'liquid';
    return 'gas';
  }

  // Return simple text color or dot style based on temperature state
  function getStateIndicatorColor(state) {
    switch (state) {
      case 'liquid': return 'bg-blue-400';
      case 'gas': return 'bg-red-400';
      case 'synthetic': return 'bg-pink-400';
      default: return 'bg-slate-300';
    }
  }

  // Primary Render Function for Periodic Grid
  function renderGrid() {
    gridContainer.innerHTML = '';
    fBlockContainer.innerHTML = '';

    // Create coordinates mapping standard periodic table grid system
    // rows 1-7, cols 1-18
    const gridPositions = {};
    elements.forEach(el => {
      // Exclude F-block (Lanthanides and Actinides are period 6/7 but visual subgrid)
      if (el.category !== 'lanthanide' && el.category !== 'actinide') {
        gridPositions[`${el.period}-${el.group}`] = el;
      }
    });

    // Render Main Grid
    for (let r = 1; r <= 7; r++) {
      for (let c = 1; c <= 18; c++) {
        const key = `${r}-${c}`;
        const elem = gridPositions[key];

        if (elem) {
          const cell = createCellElement(elem);
          gridContainer.appendChild(cell);
        } else {
          // Empty cell placeholder
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'aspect-ratio-1-1'; // Keeps square scale
          gridContainer.appendChild(emptyDiv);
        }
      }
    }

    // Render F-block (row 1 Lanthanides, row 2 Actinides)
    // Standard 18 grid layout, empty space on left
    const lanthanides = elements.filter(el => el.category === 'lanthanide');
    const actinides = elements.filter(el => el.category === 'actinide');

    // Row 1: Lanthanides spacer col 1-2, elements 3-17
    createFBlockRow(lanthanides);
    createFBlockRow(actinides);

    applyFiltersAndSearches();
  }

  function createFBlockRow(subset) {
    // Spacer columns
    for (let i = 0; i < 2; i++) {
      const emptyDiv = document.createElement('div');
      fBlockContainer.appendChild(emptyDiv);
    }
    // Elements
    subset.forEach(elem => {
      const cell = createCellElement(elem);
      fBlockContainer.appendChild(cell);
    });
    // Remaining empty columns
    for (let i = 0; i < 1; i++) {
      const emptyDiv = document.createElement('div');
      fBlockContainer.appendChild(emptyDiv);
    }
  }

  // Cell Creation and Action Bindings
  function createCellElement(elem) {
    const cell = document.createElement('div');
    cell.className = `element-cell border ${getCategoryColorClass(elem.category)}`;
    cell.id = `el-${elem.symbol.toLowerCase()}`;
    cell.dataset.symbol = elem.symbol;
    cell.dataset.name = elem.name;
    cell.dataset.number = elem.number;
    cell.dataset.category = elem.category;

    // Determine dynamic phase state based on temp
    const stateAtTemp = calculateStateAtTemp(elem, currentTempKelvin);
    const dotColor = getStateIndicatorColor(stateAtTemp);

    cell.innerHTML = `
      <div class="flex justify-between items-center text-[9px] font-mono opacity-80">
        <span>${elem.number}</span>
        <span class="font-semibold">${elem.mass}</span>
      </div>
      <div class="text-center text-sm font-black tracking-wide my-1">${elem.symbol}</div>
      <div class="text-[8px] font-semibold text-center truncate w-full opacity-90">${elem.name}</div>
      <span class="state-indicator-dot ${dotColor}" title="State: ${stateAtTemp}"></span>
    `;

    // Trigger Detail View on click
    cell.addEventListener('click', () => {
      selectElement(elem);
    });

    return cell;
  }

  // Handle searching and active category filtering
  function applyFiltersAndSearches() {
    const query = searchInput.value.toLowerCase().trim();
    const allCells = document.querySelectorAll('.element-cell');

    allCells.forEach(cell => {
      const symbol = cell.dataset.symbol.toLowerCase();
      const name = cell.dataset.name.toLowerCase();
      const number = cell.dataset.number;
      const category = cell.dataset.category;

      const matchesSearch = !query || symbol.includes(query) || name.includes(query) || number.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        cell.style.opacity = '1';
        cell.style.pointerEvents = 'auto';
        cell.classList.remove('grayscale');
      } else {
        cell.style.opacity = '0.15';
        cell.classList.add('grayscale');
      }
    });
  }

  // Populate details on the Inspector panel
  function selectElement(elem) {
    detailNumber.textContent = elem.number;
    detailMass.textContent = elem.mass;
    detailSymbol.textContent = elem.symbol;
    detailName.textContent = elem.name;
    detailCategory.textContent = elem.category.toUpperCase();
    
    const activeState = calculateStateAtTemp(elem, currentTempKelvin);
    detailStateBadge.textContent = activeState.toUpperCase();
    detailPhase.textContent = elem.state.toUpperCase();
    detailDiscoverer.textContent = elem.discoverer || 'N/A';
    detailDiscoverer.title = elem.discoverer || 'N/A';
    detailMelting.textContent = elem.melting === 1 ? 'Unknown' : `${elem.melting} K`;
    detailBoiling.textContent = elem.boiling === 4 ? 'Unknown' : `${elem.boiling} K`;
    detailSummary.textContent = elem.summary;

    // Visually highlight
    const previouslySelected = document.querySelectorAll('.element-cell.ring-2');
    previouslySelected.forEach(el => el.classList.remove('ring-2', 'ring-indigo-400'));

    const elementCard = document.getElementById(`el-${elem.symbol.toLowerCase()}`);
    if (elementCard) {
      elementCard.classList.add('ring-2', 'ring-indigo-400');
    }
  }

  // Temperature Slider Activity
  tempSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    currentTempKelvin = val;
    const celsius = Math.round(val - 273.15);
    tempValText.textContent = `${val} K (${celsius}°C)`;
    
    // Re-render elements to display fluid phase transitions
    renderGrid();
  });

  // Search Input Activity
  searchInput.addEventListener('input', () => {
    applyFiltersAndSearches();
  });

  // Category Filter chips logic
  categoryFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      applyFiltersAndSearches();
    });
  });

  // View Setup - Compare elements system
  function setupCompareSelectors() {
    const selectA = document.getElementById('compare-select-a');
    const selectB = document.getElementById('compare-select-b');

    // Clear previous items
    selectA.innerHTML = '';
    selectB.innerHTML = '';

    // Alphabetical elements sorting
    const sortedElements = [...elements].sort((a, b) => a.name.localeCompare(b.name));

    sortedElements.forEach(elem => {
      const optionA = document.createElement('option');
      optionA.value = elem.symbol;
      optionA.textContent = `${elem.name} (${elem.symbol})`;
      selectA.appendChild(optionA);

      const optionB = document.createElement('option');
      optionB.value = elem.symbol;
      optionB.textContent = `${elem.name} (${elem.symbol})`;
      selectB.appendChild(optionB);
    });

    // Pick first two as default
    if (sortedElements.length >= 2) {
      selectA.value = sortedElements[0].symbol;
      selectB.value = sortedElements[1].symbol;
    }

    updateComparison();
  }

  function updateComparison() {
    const symA = document.getElementById('compare-select-a').value;
    const symB = document.getElementById('compare-select-b').value;

    const elemA = elements.find(el => el.symbol === symA);
    const elemB = elements.find(el => el.symbol === symB);

    if (!elemA || !elemB) return;

    document.getElementById('compare-label-a').textContent = elemA.name;
    document.getElementById('compare-label-b').textContent = elemB.name;

    document.getElementById('comp-num-a').textContent = elemA.number;
    document.getElementById('comp-num-b').textContent = elemB.number;

    document.getElementById('comp-mass-a').textContent = elemA.mass;
    document.getElementById('comp-mass-b').textContent = elemB.mass;

    document.getElementById('comp-cat-a').textContent = elemA.category;
    document.getElementById('comp-cat-b').textContent = elemB.category;
    document.getElementById('comp-cat-a').title = elemA.category;
    document.getElementById('comp-cat-b').title = elemB.category;

    document.getElementById('comp-state-a').textContent = elemA.state;
    document.getElementById('comp-state-b').textContent = elemB.state;

    document.getElementById('comp-disco-a').textContent = elemA.discoverer || 'Unknown';
    document.getElementById('comp-disco-b').textContent = elemB.discoverer || 'Unknown';
    document.getElementById('comp-disco-a').title = elemA.discoverer || 'Unknown';
    document.getElementById('comp-disco-b').title = elemB.discoverer || 'Unknown';
  }

  document.getElementById('compare-select-a').addEventListener('change', updateComparison);
  document.getElementById('compare-select-b').addEventListener('change', updateComparison);

  // Quiz System mechanics
  function startNewQuizQuestion() {
    // Pick random element
    const randomIndex = Math.floor(Math.random() * elements.length);
    quizCurrentTarget = elements[randomIndex];

    // Display target symbol
    document.getElementById('quiz-target-symbol').textContent = quizCurrentTarget.symbol;

    // Generate multiple choice options including correct one
    const choices = [quizCurrentTarget];
    while (choices.length < 4) {
      const randElem = elements[Math.floor(Math.random() * elements.length)];
      if (!choices.some(item => item.symbol === randElem.symbol)) {
        choices.push(randElem);
      }
    }

    // Shuffle choices array
    choices.sort(() => Math.random() - 0.5);

    // Render options
    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';

    choices.forEach(option => {
      const button = document.createElement('button');
      button.className = 'quiz-option-btn';
      button.textContent = option.name;
      button.addEventListener('click', (e) => handleQuizAnswer(option, button));
      container.appendChild(button);
    });

    // Hide previous feedback
    const fb = document.getElementById('quiz-feedback');
    fb.className = 'text-xs text-center font-semibold rounded-lg py-2 hidden';
  }

  function handleQuizAnswer(selectedOption, clickedButton) {
    quizScoreTotal++;
    const fb = document.getElementById('quiz-feedback');
    fb.classList.remove('hidden');

    // Disable all options
    const allOptionBtns = document.querySelectorAll('.quiz-option-btn');
    allOptionBtns.forEach(btn => btn.disabled = true);

    if (selectedOption.symbol === quizCurrentTarget.symbol) {
      quizScoreCorrect++;
      clickedButton.classList.add('correct');
      fb.textContent = `Correct! ${quizCurrentTarget.name} (${quizCurrentTarget.symbol}) is indeed atomic number ${quizCurrentTarget.number}.`;
      fb.classList.add('bg-emerald-500/20', 'text-emerald-400');
    } else {
      clickedButton.classList.add('incorrect');
      // Find and highlight correct answer
      allOptionBtns.forEach(btn => {
        if (btn.textContent === quizCurrentTarget.name) {
          btn.classList.add('correct');
        }
      });
      fb.textContent = `Incorrect! That was ${selectedOption.name}. The correct answer was ${quizCurrentTarget.name}.`;
      fb.classList.add('bg-rose-500/20', 'text-rose-400');
    }

    document.getElementById('quiz-score').textContent = `Score: ${quizScoreCorrect}/${quizScoreTotal}`;

    // Auto transition to next question after 2.5s
    setTimeout(() => {
      startNewQuizQuestion();
    }, 2800);
  }

  // Panel mode switch UI bindings
  btnQuizMode.addEventListener('click', () => {
    panelDetails.classList.add('hidden');
    panelCompare.classList.add('hidden');
    panelQuiz.classList.remove('hidden');
    startNewQuizQuestion();
  });

  btnCompareMode.addEventListener('click', () => {
    panelDetails.classList.add('hidden');
    panelQuiz.classList.add('hidden');
    panelCompare.classList.remove('hidden');
    setupCompareSelectors();
  });

  closeQuizBtn.addEventListener('click', () => {
    panelQuiz.classList.add('hidden');
    panelDetails.classList.remove('hidden');
  });

  closeCompareBtn.addEventListener('click', () => {
    panelCompare.classList.add('hidden');
    panelDetails.classList.remove('hidden');
  });

  document.getElementById('btn-skip-quiz').addEventListener('click', () => {
    startNewQuizQuestion();
  });

  document.getElementById('btn-reset-quiz').addEventListener('click', () => {
    quizScoreCorrect = 0;
    quizScoreTotal = 0;
    document.getElementById('quiz-score').textContent = 'Score: 0/0';
    startNewQuizQuestion();
  });

  // Footer tools
  document.getElementById('btn-clear-settings').addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
    tempSlider.value = 298;
    currentTempKelvin = 298;
    tempValText.textContent = '298 K (25°C)';
    activeCategory = 'all';
    categoryFilterChips.forEach(c => {
      c.classList.remove('active');
      if (c.dataset.category === 'all') c.classList.add('active');
    });
    renderGrid();
    selectElement(elements[5]); // default to Carbon
  });

  document.getElementById('btn-about-chem').addEventListener('click', (e) => {
    e.preventDefault();
    alert(`Chemical periodic database v2.4 initialized. Contains ${elements.length} mapped core elements with exact thermodynamics variables, thermal phases, discoverer lists, and group designations.`);
  });

  // Initial render lifecycle
  renderGrid();
  selectElement(elements[5]); // Default to Carbon
});