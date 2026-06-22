document.addEventListener('DOMContentLoaded', () => {
  // --- STATE DEFINITIONS ---
  let collatzMode = true; // true = Collatz Conjecture, false = Fibonacci Steps
  let gameActive = false;
  let gameCurrentNum = 17;
  let gameStreak = 0;
  let gameHighScore = 0;
  let gameTimer = 10;
  let gameInterval = null;
  
  // Fun Facts Pool
  const NUM_FACTS = [
    "42 is the 'Answer to the Ultimate Question of Life, the Universe, and Everything'.",
    "1729 is the Hardy-Ramanujan number, the smallest sum of two cubes in two different ways.",
    "2520 is the smallest number divisible by all integers from 1 to 10.",
    "Primes are the 'atoms' of mathematics; every whole number can be uniquely factored into primes.",
    "There are infinitely many prime numbers, first proven by Euclid in 300 BC.",
    "A 'Perfect Number' equals the sum of its proper divisors (e.g., 6, 28, 496).",
    "The Golden Ratio is approximately 1.6180339887, deeply bound to the Fibonacci sequence.",
    "Zero was first formally integrated into mathematics by Indian astronomer Brahmagupta.",
    "9 is the maximum number of cubes needed to represent any positive integer.",
    "The number 7 is universally cited as the most common 'favorite number' across civilizations."
  ];

  // --- INTERACTIVITY HOOKS & ELEMENTS ---
  
  // Fact Ticker
  const tickerEl = document.getElementById('fact-ticker');
  function rotateFact() {
    const randomFact = NUM_FACTS[Math.floor(Math.random() * NUM_FACTS.length)];
    tickerEl.style.opacity = 0;
    setTimeout(() => {
      tickerEl.textContent = randomFact;
      tickerEl.style.opacity = 1;
    }, 300);
  }
  setInterval(rotateFact, 12000);
  rotateFact(); // Initial trigger

  // --- SECTION 1: BASE RADIATOR (CONVERTER) ---
  const decInput = document.getElementById('base-dec');
  const binInput = document.getElementById('base-bin');
  const hexInput = document.getElementById('base-hex');
  const octInput = document.getElementById('base-oct');
  const romanInput = document.getElementById('base-roman');
  const resetConverterBtn = document.getElementById('reset-converter');

  // Helper: Decimal to Roman
  function decimalToRoman(num) {
    if (isNaN(num) || num <= 0 || num > 3999) return 'N/A';
    const lookup = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 };
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  // Helper: Roman to Decimal
  function romanToDecimal(str) {
    str = str.toUpperCase().trim();
    const romanRules = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      const current = romanRules[str[i]];
      const next = romanRules[str[i + 1]];
      if (!current) return NaN;
      if (next && current < next) {
        num += next - current;
        i++;
      } else {
        num += current;
      }
    }
    return num > 3999 ? NaN : num;
  }

  function updateAllBases(value, origin) {
    let dec = parseInt(value, 10);
    if (origin === 'bin') dec = parseInt(value, 2);
    if (origin === 'hex') dec = parseInt(value, 16);
    if (origin === 'oct') dec = parseInt(value, 8);
    if (origin === 'roman') dec = romanToDecimal(value);

    if (isNaN(dec) || dec < 0) {
      // Clear/Invalid warning feedback state
      if (origin !== 'dec') decInput.value = '';
      if (origin !== 'bin') binInput.value = '';
      if (origin !== 'hex') hexInput.value = '';
      if (origin !== 'oct') octInput.value = '';
      if (origin !== 'roman') romanInput.value = 'Invalid';
      return;
    }

    // Prevent Roman overflow
    if (dec > 3999) {
      romanInput.value = "MAX 3999";
    }

    if (origin !== 'dec') decInput.value = dec;
    if (origin !== 'bin') binInput.value = dec.toString(2);
    if (origin !== 'hex') hexInput.value = dec.toString(16).toUpperCase();
    if (origin !== 'oct') octInput.value = dec.toString(8);
    if (origin !== 'roman' && dec <= 3999) romanInput.value = decimalToRoman(dec);
  }

  decInput.addEventListener('input', (e) => updateAllBases(e.target.value, 'dec'));
  binInput.addEventListener('input', (e) => updateAllBases(e.target.value, 'bin'));
  hexInput.addEventListener('input', (e) => updateAllBases(e.target.value, 'hex'));
  octInput.addEventListener('input', (e) => updateAllBases(e.target.value, 'oct'));
  romanInput.addEventListener('input', (e) => updateAllBases(e.target.value, 'roman'));
  
  resetConverterBtn.addEventListener('click', () => {
    decInput.value = '42';
    updateAllBases('42', 'dec');
  });


  // --- SECTION 2: STATISTICAL ANALYZER ---
  const statsInput = document.getElementById('stats-input');
  const statSum = document.getElementById('stat-sum');
  const statMean = document.getElementById('stat-mean');
  const statMedian = document.getElementById('stat-median');
  const statMode = document.getElementById('stat-mode');
  const statMinMax = document.getElementById('stat-minmax');
  const statCount = document.getElementById('stat-count');

  const statsPresetFib = document.getElementById('stats-preset-fib');
  const statsPresetPrimes = document.getElementById('stats-preset-primes');

  function analyzeStats() {
    const text = statsInput.value;
    // Parse integers
    const parsed = text
      .replace(/[^0-9.-]/g, ' ') // replace punctuation/symbols with space
      .split(/\s+/)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (parsed.length === 0) {
      statSum.textContent = '-';
      statMean.textContent = '-';
      statMedian.textContent = '-';
      statMode.textContent = '-';
      statMinMax.textContent = '-';
      statCount.textContent = '0';
      return;
    }

    // Sum
    const sum = parsed.reduce((a, b) => a + b, 0);
    // Mean
    const mean = (sum / parsed.length).toFixed(2);
    
    // Sorted array for Median & Range
    const sorted = [...parsed].sort((a, b) => a - b);
    
    // Median
    let median;
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      median = sorted[mid];
    } else {
      median = ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
    }

    // Mode
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    parsed.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
      if (frequency[val] > maxFreq) {
        maxFreq = frequency[val];
      }
    });
    for (let key in frequency) {
      if (frequency[key] === maxFreq) {
        modes.push(key);
      }
    }
    const modeStr = (maxFreq > 1) ? modes.slice(0, 3).join(', ') : 'None';

    // Min & Max
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Update DOM
    statSum.textContent = Number.isInteger(sum) ? sum : sum.toFixed(2);
    statMean.textContent = mean;
    statMedian.textContent = median;
    statMode.textContent = modeStr + (modes.length > 3 ? '...' : '');
    statMinMax.textContent = `${min} / ${max}`;
    statCount.textContent = parsed.length;
  }

  statsInput.addEventListener('input', analyzeStats);
  
  statsPresetFib.addEventListener('click', () => {
    statsInput.value = "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144";
    analyzeStats();
  });
  statsPresetPrimes.addEventListener('click', () => {
    statsInput.value = "2, 3, 5, 7, 11, 13, 17, 19, 23, 29";
    analyzeStats();
  });

  // Run initial calculation
  analyzeStats();


  // --- SECTION 3: DEEP NUMBER PROFILE ---
  const profileInput = document.getElementById('profile-input');
  const profileBtn = document.getElementById('profile-btn');
  const profileRandomBtn = document.getElementById('profile-random-btn');

  const profileClass = document.getElementById('profile-class');
  const profileParity = document.getElementById('profile-parity');
  const profileSquare = document.getElementById('profile-square');
  const profilePerfect = document.getElementById('profile-perfect');
  const profileDivisors = document.getElementById('profile-divisors');

  function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  function findDivisors(num) {
    const list = [];
    for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        list.push(i);
        if (i !== num / i) {
          list.push(num / i);
        }
      }
    }
    return list.sort((a, b) => a - b);
  }

  function runProfiling() {
    let val = parseInt(profileInput.value, 10);
    if (isNaN(val) || val < 1) {
      val = 128;
      profileInput.value = 128;
    }
    if (val > 1000000) {
      val = 1000000;
      profileInput.value = 1000000;
    }

    // 1. Classification (Prime / Composite)
    if (val === 1) {
      profileClass.textContent = 'Unit (Neither)';
    } else if (isPrime(val)) {
      profileClass.textContent = 'Prime Number';
    } else {
      profileClass.textContent = 'Composite';
    }

    // 2. Parity
    profileParity.textContent = (val % 2 === 0) ? 'Even' : 'Odd';

    // 3. Square
    const root = Math.sqrt(val);
    if (Number.isInteger(root)) {
      profileSquare.textContent = `Yes (Square of ${root})`;
    } else {
      profileSquare.textContent = 'No';
    }

    // 4. Perfect / Abundant / Deficient
    const divs = findDivisors(val);
    const sumOfDivisors = divs.reduce((a, b) => a + b, 0) - val; // exclude self
    if (val === 1) {
      profilePerfect.textContent = 'Unit';
    } else if (sumOfDivisors === val) {
      profilePerfect.textContent = 'Perfect!';
    } else if (sumOfDivisors > val) {
      profilePerfect.textContent = `Abundant (+${sumOfDivisors - val})`;
    } else {
      profilePerfect.textContent = `Deficient (-${val - sumOfDivisors})`;
    }

    // 5. Divisors List
    profileDivisors.textContent = divs.join(', ');
    profileDivisors.title = divs.join(', ');
  }

  profileBtn.addEventListener('click', runProfiling);
  profileInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runProfiling();
  });

  profileRandomBtn.addEventListener('click', () => {
    // Pick beautiful dynamic random integers
    const rand = Math.floor(Math.random() * 2000) + 1;
    profileInput.value = rand;
    runProfiling();
  });

  // Trigger initial Profiler
  runProfiling();


  // --- SECTION 4: INTERACTIVE DYNAMIC MATRIX / SIEVE ---
  const matrixContainer = document.getElementById('numbers-matrix');
  const multipleInput = document.getElementById('sieve-multiplier-input');
  const feedbackText = document.getElementById('matrix-feedback-text');
  const resetMatrixBtn = document.getElementById('reset-matrix-highlights');
  
  const filterAll = document.getElementById('sieve-filter-all');
  const filterPrime = document.getElementById('sieve-filter-prime');
  const filterEven = document.getElementById('sieve-filter-even');
  const filterOdd = document.getElementById('sieve-filter-odd');
  const filterSquare = document.getElementById('sieve-filter-square');
  
  let activeFilter = 'all'; // all, prime, even, odd, square
  
  // Generate Matrix cells (1 to 120)
  function buildMatrix() {
    matrixContainer.innerHTML = '';
    for (let i = 1; i <= 120; i++) {
      const cell = document.createElement('button');
      cell.id = `cell-${i}`;
      cell.className = 'matrix-cell bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs py-2 rounded-lg font-bold flex flex-col items-center justify-center transition-all hover:bg-slate-800 hover:text-white';
      
      // Inner Label
      const label = document.createElement('span');
      label.textContent = i;
      cell.appendChild(label);

      // Simple indicator dot inside cell for primes
      if (isPrime(i)) {
        const dot = document.createElement('span');
        dot.className = 'w-1 h-1 bg-emerald-400 rounded-full mt-0.5';
        cell.appendChild(dot);
      }

      // Event: click cell to highlight divisors/multiples
      cell.addEventListener('click', () => {
        highlightDivisorsOf(i);
      });

      matrixContainer.appendChild(cell);
    }
    applyCurrentFilters();
  }

  function applyCurrentFilters() {
    const multVal = parseInt(multipleInput.value, 10) || 0;
    
    for (let i = 1; i <= 120; i++) {
      const cell = document.getElementById(`cell-${i}`);
      if (!cell) continue;

      // Reset visual effects
      cell.className = 'matrix-cell bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs py-2 rounded-lg font-bold flex flex-col items-center justify-center';
      
      let matchesFilter = false;
      if (activeFilter === 'all') matchesFilter = true;
      else if (activeFilter === 'prime' && isPrime(i)) matchesFilter = true;
      else if (activeFilter === 'even' && i % 2 === 0) matchesFilter = true;
      else if (activeFilter === 'odd' && i % 2 !== 0) matchesFilter = true;
      else if (activeFilter === 'square' && Number.isInteger(Math.sqrt(i))) matchesFilter = true;

      // Apply filter highlight style
      if (matchesFilter) {
        cell.classList.add('border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-300');
      } else {
        cell.classList.add('opacity-40');
      }

      // Highlight multiplier overlap if active
      if (multVal > 1 && i % multVal === 0) {
        cell.classList.remove('border-slate-800', 'border-emerald-500/30');
        cell.classList.add('border-indigo-500', 'ring-1', 'ring-indigo-500/40');
      }
    }
  }

  function highlightDivisorsOf(num) {
    applyCurrentFilters(); // Reset to standard filter view first
    
    const divisors = findDivisors(num);
    feedbackText.innerHTML = `Analyzing <strong class="text-indigo-400">${num}</strong>. Divisors: <span class="text-emerald-400">${divisors.join(', ')}</span>. It has ${divisors.length} unique components.`;

    divisors.forEach(div => {
      const cell = document.getElementById(`cell-${div}`);
      if (cell) {
        cell.classList.remove('opacity-40');
        cell.classList.add('bg-indigo-500/20', 'border-indigo-400', 'text-indigo-200');
      }
    });
    
    // Pulse clicked cell
    const mainCell = document.getElementById(`cell-${num}`);
    if (mainCell) {
      mainCell.classList.add('ring-2', 'ring-pink-500');
    }
  }

  // Listeners for Matrix Filters
  const filterButtons = [filterAll, filterPrime, filterEven, filterOdd, filterSquare];
  
  function setFilterActive(btn, type) {
    filterButtons.forEach(b => b.classList.remove('bg-slate-800', 'text-slate-100'));
    filterButtons.forEach(b => b.classList.add('text-slate-400', 'hover:text-slate-200'));
    btn.classList.add('bg-slate-800', 'text-slate-100');
    btn.classList.remove('text-slate-400', 'hover:text-slate-200');
    activeFilter = type;
    applyCurrentFilters();
  }

  filterAll.addEventListener('click', () => setFilterActive(filterAll, 'all'));
  filterPrime.addEventListener('click', () => setFilterActive(filterPrime, 'prime'));
  filterEven.addEventListener('click', () => setFilterActive(filterEven, 'even'));
  filterOdd.addEventListener('click', () => setFilterActive(filterOdd, 'odd'));
  filterSquare.addEventListener('click', () => setFilterActive(filterSquare, 'square'));

  multipleInput.addEventListener('input', applyCurrentFilters);
  resetMatrixBtn.addEventListener('click', () => {
    activeFilter = 'all';
    setFilterActive(filterAll, 'all');
    multipleInput.value = '';
    applyCurrentFilters();
    feedbackText.textContent = 'Click any number above to trace its components and factors instantly.';
  });

  buildMatrix();


  // --- SECTION 5: SERIES / SEQUENCE GENERATOR (Collatz vs Fibonacci) ---
  const tabCollatz = document.getElementById('tab-collatz');
  const tabFib = document.getElementById('tab-fib');
  const seqInputLabel = document.getElementById('seq-input-label');
  const seqStartVal = document.getElementById('seq-start-val');
  const runSeqBtn = document.getElementById('run-sequence-btn');
  
  const seqStat1Lbl = document.getElementById('seq-stat-1-lbl');
  const seqStat1Val = document.getElementById('seq-stat-1-val');
  const seqStat2Lbl = document.getElementById('seq-stat-2-lbl');
  const seqStat2Val = document.getElementById('seq-stat-2-val');
  const sequenceVisualOutput = document.getElementById('sequence-visual-output');

  tabCollatz.addEventListener('click', () => {
    collatzMode = true;
    tabCollatz.className = 'border-b-2 border-amber-400 px-4 py-2 text-xs font-semibold text-amber-300';
    tabFib.className = 'border-b-2 border-transparent px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200';
    seqInputLabel.textContent = 'Starting integer (N)';
    seqStartVal.value = '27';
    runSequence();
  });

  tabFib.addEventListener('click', () => {
    collatzMode = false;
    tabFib.className = 'border-b-2 border-amber-400 px-4 py-2 text-xs font-semibold text-amber-300';
    tabCollatz.className = 'border-b-2 border-transparent px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200';
    seqInputLabel.textContent = 'Number of elements';
    seqStartVal.value = '20';
    runSequence();
  });

  function runSequence() {
    const inputVal = parseInt(seqStartVal.value, 10);
    if (isNaN(inputVal) || inputVal < 1) {
      sequenceVisualOutput.textContent = 'Please provide a positive integer greater than 0.';
      return;
    }

    if (collatzMode) {
      // Collatz Logic
      let curr = inputVal;
      const path = [curr];
      let peak = curr;
      let safetyLimit = 1000;

      while (curr > 1 && safetyLimit > 0) {
        if (curr % 2 === 0) {
          curr = curr / 2;
        } else {
          curr = curr * 3 + 1;
        }
        path.push(curr);
        if (curr > peak) peak = curr;
        safetyLimit--;
      }

      seqStat1Lbl.textContent = 'Steps to Reach 1:';
      seqStat1Val.textContent = `${path.length - 1} steps`;
      seqStat2Lbl.textContent = 'Peak Hailstone Value:';
      seqStat2Val.textContent = peak.toLocaleString();

      // Generate beautiful formatted list
      sequenceVisualOutput.innerHTML = path.map((num, idx) => {
        return `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded ${num === 1 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-900 border border-slate-800'}"><span class="text-[9px] text-slate-500 mr-1">[${idx}]</span>${num}</span>`;
      }).join(' → ');
    } else {
      // Fibonacci Logic
      const limit = Math.min(inputVal, 100); // safety cap
      const path = [1, 1];
      for (let i = 2; i < limit; i++) {
        path.push(path[i - 1] + path[i - 2]);
      }
      
      // If requested just 1 element
      const finalPath = path.slice(0, limit);

      seqStat1Lbl.textContent = 'Computed Terms:';
      seqStat1Val.textContent = `${finalPath.length} numbers`;
      seqStat2Lbl.textContent = 'Last Fibonacci Term:';
      seqStat2Val.textContent = finalPath[finalPath.length - 1] ? finalPath[finalPath.length - 1].toLocaleString() : '0';

      sequenceVisualOutput.innerHTML = finalPath.map((num, idx) => {
        return `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded bg-slate-900 border border-slate-800"><span class="text-[9px] text-slate-500 mr-1">[F<sub>${idx + 1}</sub>]</span>${num.toLocaleString()}</span>`;
      }).join(', ');
    }
  }

  runSeqBtn.addEventListener('click', runSequence);
  seqStartVal.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runSequence();
  });

  // Initial Run of default tab
  runSequence();


  // --- SECTION 6: BRAIN TRAINING PRIME SPEEDRUN GAME ---
  const gameNumDisplay = document.getElementById('game-number-display');
  const gameTimerFill = document.getElementById('game-timer-fill');
  const gameStreakCounter = document.getElementById('game-streak-counter');
  const gameHighScoreEl = document.getElementById('game-high-score');
  const gameTimerNum = document.getElementById('game-timer-num');
  const gameFeedback = document.getElementById('game-feedback');
  const gameToggleBtn = document.getElementById('game-toggle-btn');

  const gameBtnPrime = document.getElementById('game-btn-prime');
  const gameBtnComposite = document.getElementById('game-btn-composite');

  function generateNextGameNumber() {
    // Random integer between 2 and 199
    gameCurrentNum = Math.floor(Math.random() * 198) + 2;
    gameNumDisplay.textContent = gameCurrentNum;
    resetTurnTimer();
  }

  function startTurnTimer() {
    gameTimer = 10; 
    gameTimerNum.textContent = `${gameTimer}s`;
    gameTimerFill.style.width = '100%';
    
    if (gameInterval) clearInterval(gameInterval);
    
    gameInterval = setInterval(() => {
      gameTimer -= 1;
      gameTimerNum.textContent = `${gameTimer}s`;
      const percent = (gameTimer / 10) * 100;
      gameTimerFill.style.width = `${percent}%`;

      if (gameTimer <= 0) {
        endGame(false, "Out of time! ⌛");
      }
    }, 1000);
  }

  function resetTurnTimer() {
    startTurnTimer();
  }

  function startGame() {
    gameActive = true;
    gameStreak = 0;
    gameStreakCounter.textContent = '0';
    gameToggleBtn.textContent = 'End Speedrun';
    gameFeedback.textContent = 'Keep your streak going! Is the number below Prime or Composite?';
    generateNextGameNumber();
  }

  function endGame(complete, reason) {
    gameActive = false;
    if (gameInterval) clearInterval(gameInterval);
    gameTimerFill.style.width = '0%';
    gameToggleBtn.textContent = 'Start Speedrun';
    
    if (gameStreak > gameHighScore) {
      gameHighScore = gameStreak;
      gameHighScoreEl.textContent = gameHighScore;
    }
    
    gameFeedback.innerHTML = `<span class="text-pink-400 font-bold">Game Over!</span> ${reason} You scored a streak of <strong class="text-indigo-400">${gameStreak}</strong>.`;
  }

  function handlePlayerChoice(isChoosingPrime) {
    if (!gameActive) {
      gameFeedback.textContent = 'Please click "Start Speedrun" below to begin!';
      return;
    }

    const correctIsPrime = isPrime(gameCurrentNum);
    const correctChoice = (isChoosingPrime && correctIsPrime) || (!isChoosingPrime && !correctIsPrime);

    if (correctChoice) {
      gameStreak++;
      gameStreakCounter.textContent = gameStreak;
      gameFeedback.innerHTML = `<span class="text-emerald-400 font-bold">Correct!</span> ${gameCurrentNum} is ${correctIsPrime ? 'Prime' : 'Composite'}. +1 streak point!`;
      generateNextGameNumber();
    } else {
      endGame(false, `Incorrect. ${gameCurrentNum} is actually ${correctIsPrime ? 'a Prime' : 'a Composite'} number.`);
    }
  }

  gameBtnPrime.addEventListener('click', () => handlePlayerChoice(true));
  gameBtnComposite.addEventListener('click', () => handlePlayerChoice(false));

  gameToggleBtn.addEventListener('click', () => {
    if (gameActive) {
      endGame(true, "Voluntarily exited early.");
    } else {
      startGame();
    }
  });


  // --- HARD RESET GLOBAL BUTTON ---
  document.getElementById('btn-quick-reset-all').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Reset Bases
    decInput.value = '42';
    updateAllBases('42', 'dec');
    
    // Reset Stats
    statsInput.value = "15, 23, 42, 8, 4, 16, 23";
    analyzeStats();

    // Reset Profile
    profileInput.value = '128';
    runProfiling();

    // Reset Sieve
    activeFilter = 'all';
    setFilterActive(filterAll, 'all');
    multipleInput.value = '3';
    applyCurrentFilters();

    // Reset Sequences
    collatzMode = true;
    tabCollatz.click();
    
    // Reset Game
    if (gameActive) {
      endGame(true, "Widgets reset.");
    }
    gameStreak = 0;
    gameHighScore = 0;
    gameHighScoreEl.textContent = '0';
    gameStreakCounter.textContent = '0';
    gameFeedback.textContent = 'Click Start Speedrun below to begin testing your factor instinct!';
  });
});