document.addEventListener('DOMContentLoaded', () => {
  /* State Stores */
  let appState = {
    // Quiz Sub-system
    quiz: {
      difficulty: 'easy',
      score: 0,
      timer: null,
      timeLeft: 15,
      correctAnswer: 0,
      currentQuestionIndex: 1,
      totalQuestions: 5,
      active: false
    },
    // Team Partition Sub-system
    teamMembers: ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Isabella', 'Jack'],
    // Expense / Liability Dividends
    expenseSplitters: ['Sarah', 'James', 'Emily', 'Leo'],
    expenses: [
      { id: 'exp-1', label: 'Cloud Hosting Division', cost: 120, paidBy: 'Sarah' },
      { id: 'exp-2', label: 'Joint Hackathon Meals', cost: 80, paidBy: 'James' }
    ]
  };

  /* UI Helpers & Components */
  const showToast = (message) => {
    const toast = document.getElementById('custom-toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2800);
  };

  /* ----------------- TAB SWITCHING ----------------- */
  const tabs = {
    'tab-math': 'section-math',
    'tab-teams': 'section-teams',
    'tab-assets': 'section-assets'
  };

  Object.keys(tabs).forEach(tabId => {
    document.getElementById(tabId).addEventListener('click', (e) => {
      // Reset styles
      Object.keys(tabs).forEach(tId => {
        document.getElementById(tId).classList.remove('text-indigo-400', 'bg-slate-800/80', 'text-white');
        document.getElementById(tId).classList.add('text-slate-400');
        document.getElementById(tabs[tId]).classList.add('hidden');
        document.getElementById(tabs[tId]).classList.remove('active-section');
      });

      // Make active
      const btn = e.currentTarget;
      btn.classList.add('text-indigo-400', 'bg-slate-800/80');
      btn.classList.remove('text-slate-400');
      
      const targetSec = document.getElementById(tabs[tabId]);
      targetSec.classList.remove('hidden');
      if (tabId === 'tab-math') {
        targetSec.classList.add('active-section');
      } else {
        targetSec.style.display = 'grid';
      }
    });
  });

  /* ----------------- TAB 1: MATH DIVISION & TUTOR ----------------- */
  const dividendInput = document.getElementById('math-dividend');
  const divisorInput = document.getElementById('math-divisor');
  const calcBtn = document.getElementById('btn-calculate-division');
  const visualBoard = document.getElementById('division-interactive-board');

  function solveLongDivision(dividend, divisor) {
    if (isNaN(dividend) || isNaN(divisor) || divisor <= 0) {
      return '<p class="text-rose-400 font-semibold">Please enter a valid Dividend and non-zero Divisor.</p>';
    }

    const integerQuotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    
    // Create interactive graphical long division rendering
    let stepsHtml = `
      <div class="w-full max-w-md mx-auto space-y-4 font-mono text-left bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div class="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Math Identity Result</span>
          <span class="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full">Standard Formula</span>
        </div>
        
        <div class="flex items-center gap-2 py-2">
          <div class="text-slate-400 text-lg font-bold">${dividend}</div>
          <span class="text-indigo-500 text-lg font-black">÷</span>
          <div class="text-emerald-400 text-lg font-bold">${divisor}</div>
          <span class="text-slate-500 text-lg font-bold">=</span>
          <div class="text-violet-400 text-2xl font-black">${integerQuotient}</div>
          ${remainder > 0 ? `<span class="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">Rem ${remainder}</span>` : '<span class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">Exact</span>'}
        </div>

        <!-- Vertical Long division trace -->
        <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5">
          <span class="block text-xs text-slate-500 uppercase tracking-widest mb-3">Interactive Long Division steps:</span>
          
          <!-- Quotient position -->
          <div class="flex items-center">
            <div class="w-16 text-right text-slate-600 mr-2">Quotient:</div>
            <div class="text-violet-400 font-extrabold tracking-widest text-lg pl-8">${integerQuotient}</div>
          </div>
          
          <!-- Division Bar visualizer -->
          <div class="flex items-center">
            <div class="w-16 text-right text-emerald-400 font-extrabold mr-2">${divisor}</div>
            <div class="division-bar tracking-widest text-slate-100 text-lg min-w-[120px]">
              ${dividend}
            </div>
          </div>
    `;

    // Detailed Step Generation
    let dividendStr = dividend.toString();
    let currentRem = 0;
    let workStr = "";

    for (let i = 0; i < dividendStr.length; i++) {
      let nextDigit = dividendStr[i];
      let prevRem = currentRem;
      let targetVal = (currentRem * 10) + parseInt(nextDigit);
      let stepQuotient = Math.floor(targetVal / divisor);
      let subValue = stepQuotient * divisor;
      currentRem = targetVal - subValue;

      if (i === 0) {
        workStr += `<div class="text-xs text-slate-500 mt-2 mb-1">Step 1: Focus on digit '${nextDigit}' -> target value is ${targetVal}</div>`;
      } else {
        workStr += `<div class="text-xs text-slate-500 mt-2 mb-1">Step ${i+1}: Bring down '${nextDigit}' making target value ${targetVal}</div>`;
      }

      workStr += `
        <div class="pl-20 text-xs md:text-sm font-semibold text-slate-300 space-y-1">
          <p class="text-indigo-300">→ Divide: <span class="text-slate-100">${targetVal} ÷ ${divisor} = ${stepQuotient}</span></p>
          <p class="text-rose-400">→ Subtract: <span class="text-slate-100">${targetVal} - ${subValue} = ${currentRem}</span></p>
        </div>
      `;
    }

    stepsHtml += `
          <div class="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            ${workStr}
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <span class="text-slate-500">Remainder Answer:</span>
            <span class="font-bold font-mono text-amber-400">${currentRem}</span>
          </div>
        </div>
      </div>
    `;
    return stepsHtml;
  }

  calcBtn.addEventListener('click', () => {
    const divVal = parseInt(dividendInput.value);
    const divisorVal = parseInt(divisorInput.value);
    visualBoard.innerHTML = solveLongDivision(divVal, divisorVal);
    showToast('Calculated step-by-step math!');
  });

  // Handle math preset clicks
  document.querySelectorAll('.preset-math-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const divVal = e.target.getAttribute('data-dividend');
      const divisorVal = e.target.getAttribute('data-divisor');
      dividendInput.value = divVal;
      divisorInput.value = divisorVal;
      visualBoard.innerHTML = solveLongDivision(parseInt(divVal), parseInt(divisorVal));
      showToast(`Loaded Preset: ${divVal} ÷ ${divisorVal}`);
    });
  });

  /* ----------------- QUIZ SUB-SYSTEM ----------------- */
  const quizScoreVal = document.getElementById('quiz-score-val');
  const quizSetupZone = document.getElementById('quiz-setup-zone');
  const quizActiveZone = document.getElementById('quiz-active-zone');
  const btnStartQuiz = document.getElementById('btn-start-quiz');
  const quizFormula = document.getElementById('quiz-formula');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizTimerSpan = document.getElementById('quiz-timer-span');
  const quizQuestionCounter = document.getElementById('quiz-question-counter');
  const quizProgressBar = document.getElementById('quiz-progress-bar');

  // Difficulty selection
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.difficulty-btn').forEach(b => {
        b.classList.remove('bg-indigo-600/20', 'text-indigo-300', 'border-indigo-500/30', 'active');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      e.target.classList.add('bg-indigo-600/20', 'text-indigo-300', 'border-indigo-500/30', 'active');
      appState.quiz.difficulty = e.target.getAttribute('data-diff');
    });
  });

  function generateQuizQuestion() {
    let dividend = 0;
    let divisor = 1;
    let quotient = 0;

    if (appState.quiz.difficulty === 'easy') {
      quotient = Math.floor(Math.random() * 10) + 1;
      divisor = Math.floor(Math.random() * 9) + 2;
      dividend = quotient * divisor;
    } else if (appState.quiz.difficulty === 'medium') {
      quotient = Math.floor(Math.random() * 25) + 5;
      divisor = Math.floor(Math.random() * 12) + 4;
      dividend = quotient * divisor;
    } else {
      // Hard mode allows remainders or larger quotients
      divisor = Math.floor(Math.random() * 15) + 6;
      dividend = Math.floor(Math.random() * 240) + 30;
      quotient = Math.floor(dividend / divisor); // Remainder solved explicitly
    }

    appState.quiz.correctAnswer = quotient;
    quizFormula.textContent = `${dividend} ÷ ${divisor} = ?`;
    
    // Create choices
    let choices = new Set();
    choices.add(quotient);
    while (choices.size < 4) {
      let wrongVal = quotient + (Math.floor(Math.random() * 11) - 5);
      if (wrongVal >= 0 && wrongVal !== quotient) {
        choices.add(wrongVal);
      }
    }

    // Shuffle choices array
    let choicesArr = Array.from(choices).sort(() => Math.random() - 0.5);
    
    // Render Choices
    quizOptionsContainer.innerHTML = '';
    choicesArr.forEach(choice => {
      const choiceBtn = document.createElement('button');
      choiceBtn.className = 'py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl border border-slate-700/60 transition active:scale-95';
      choiceBtn.textContent = choice;
      choiceBtn.addEventListener('click', () => handleQuizSubmission(choice, choiceBtn));
      quizOptionsContainer.appendChild(choiceBtn);
    });
  }

  function startQuizTimer() {
    clearInterval(appState.quiz.timer);
    appState.quiz.timeLeft = 15;
    quizTimerSpan.textContent = `Time Left: ${appState.quiz.timeLeft}s`;

    appState.quiz.timer = setInterval(() => {
      appState.quiz.timeLeft--;
      quizTimerSpan.textContent = `Time Left: ${appState.quiz.timeLeft}s`;
      if (appState.quiz.timeLeft <= 0) {
        clearInterval(appState.quiz.timer);
        handleQuizSubmission(null, null); // Timeout act
      }
    }, 1000);
  }

  function handleQuizSubmission(selectedAnswer, btnElement) {
    clearInterval(appState.quiz.timer);
    quizFeedbackBox.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-400', 'bg-rose-500/10', 'text-rose-400');

    const correct = selectedAnswer === appState.quiz.correctAnswer;
    
    if (correct) {
      appState.quiz.score += 10;
      quizScoreVal.textContent = appState.quiz.score;
      quizFeedbackBox.textContent = '✓ Correct Answer! (+10 PTS)';
      quizFeedbackBox.classList.add('bg-emerald-500/10', 'text-emerald-400', 'block');
      if (btnElement) btnElement.classList.add('border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
    } else {
      quizFeedbackBox.textContent = `✗ Incorrect. Correct answer was ${appState.quiz.correctAnswer}`;
      quizFeedbackBox.classList.add('bg-rose-500/10', 'text-rose-400', 'block');
      if (btnElement) btnElement.classList.add('border-rose-500', 'bg-rose-500/20', 'text-rose-300');
    }

    // Freeze all other option buttons
    const allBtns = quizOptionsContainer.querySelectorAll('button');
    allBtns.forEach(btn => btn.disabled = true);

    // Progress step
    setTimeout(() => {
      appState.quiz.currentQuestionIndex++;
      if (appState.quiz.currentQuestionIndex > appState.quiz.totalQuestions) {
        // End quiz session
        quizFeedbackBox.innerHTML = `🏆 Challenge Complete! Total Score: <span class="text-indigo-400 font-bold">${appState.quiz.score}</span>`;
        quizFeedbackBox.className = 'block bg-indigo-500/10 text-indigo-300 text-center font-bold p-4 rounded-xl border border-indigo-500/20';
        quizOptionsContainer.innerHTML = '';
        quizFormula.textContent = 'Done!';
        btnStartQuiz.textContent = '⚡ Practice Again';
        quizSetupZone.classList.remove('hidden');
      } else {
        quizQuestionCounter.textContent = `Question ${appState.quiz.currentQuestionIndex} of ${appState.quiz.totalQuestions}`;
        quizProgressBar.style.width = `${(appState.quiz.currentQuestionIndex / appState.quiz.totalQuestions) * 100}%`;
        quizFeedbackBox.classList.add('hidden');
        generateQuizQuestion();
        startQuizTimer();
      }
    }, 1800);
  }

  btnStartQuiz.addEventListener('click', () => {
    quizSetupZone.classList.add('hidden');
    quizActiveZone.classList.remove('hidden');
    appState.quiz.score = 0;
    quizScoreVal.textContent = '0';
    appState.quiz.currentQuestionIndex = 1;
    quizQuestionCounter.textContent = `Question 1 of ${appState.quiz.totalQuestions}`;
    quizProgressBar.style.width = `20%`;
    quizFeedbackBox.classList.add('hidden');
    
    generateQuizQuestion();
    startQuizTimer();
    showToast('Quiz session started!');
  });


  /* ----------------- TAB 2: TEAM & GROUP DIVIDER ----------------- */
  const teamNamesInput = document.getElementById('team-names-input');
  const btnClearNames = document.getElementById('btn-clear-names');
  const teamNamesCountSpan = document.getElementById('team-names-count');
  const teamSplitType = document.getElementById('team-split-type');
  const teamSplitLabel = document.getElementById('team-split-label');
  const teamSplitValue = document.getElementById('team-split-value');
  const btnGenerateTeams = document.getElementById('btn-generate-teams');
  const teamResultsBoard = document.getElementById('team-results-board');
  const btnShuffleTeams = document.getElementById('btn-shuffle-teams');

  // Update member count real-time
  teamNamesInput.addEventListener('input', () => {
    const lines = teamNamesInput.value.split('\n').map(name => name.trim()).filter(Boolean);
    teamNamesCountSpan.textContent = `${lines.length} Members Entered`;
    appState.teamMembers = lines;
  });

  btnClearNames.addEventListener('click', () => {
    teamNamesInput.value = '';
    teamNamesCountSpan.textContent = '0 Members Entered';
    appState.teamMembers = [];
    showToast('Cleared member database!');
  });

  teamSplitType.addEventListener('change', (e) => {
    if (e.target.value === 'count') {
      teamSplitLabel.textContent = 'Number of Teams';
      teamSplitValue.value = 3;
    } else {
      teamSplitLabel.textContent = 'Max Members Per Team';
      teamSplitValue.value = 4;
    }
  });

  function buildBalancedTeams() {
    const members = [...appState.teamMembers];
    if (members.length === 0) {
      teamResultsBoard.innerHTML = `
        <div class="col-span-full text-center py-12 text-rose-400 font-semibold">
          ⚠️ Please fill in at least one member name to split.
        </div>
      `;
      return;
    }

    // Shuffle helper
    for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]];
    }

    const splitVal = parseInt(teamSplitValue.value) || 2;
    let teams = [];

    if (teamSplitType.value === 'count') {
      // Divide into specific number of groups
      const numTeams = Math.max(1, Math.min(splitVal, members.length));
      for (let i = 0; i < numTeams; i++) {
        teams.push({ name: `Division ${String.fromCharCode(65 + i)}`, members: [] });
      }
      members.forEach((member, index) => {
        teams[index % numTeams].members.push(member);
      });
    } else {
      // Divide based on max capacity
      const maxPerTeam = Math.max(1, splitVal);
      let teamIdx = 0;
      while (members.length > 0) {
        let chunk = members.splice(0, maxPerTeam);
        teams.push({
          name: `Division ${String.fromCharCode(65 + teamIdx)}`,
          members: chunk
        });
        teamIdx++;
      }
    }

    // Render team cards
    teamResultsBoard.innerHTML = '';
    teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition duration-300';
      
      let memberListHtml = team.members.map(m => `
        <li class="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-900/60 rounded border border-slate-800/40">
          <span class="text-slate-200 font-medium">${m}</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </li>
      `).join('');

      if (team.members.length === 0) {
        memberListHtml = '<p class="text-xs text-slate-500 italic">Empty division</p>';
      }

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-sm font-extrabold text-emerald-400 tracking-wider">${team.name}</h4>
            <span class="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">${team.members.length} members</span>
          </div>
          <ul class="space-y-1.5">
            ${memberListHtml}
          </ul>
        </div>
      `;
      teamResultsBoard.appendChild(card);
    });
    showToast('Shuffled & partitioned divisions!');
  }

  btnGenerateTeams.addEventListener('click', buildBalancedTeams);
  btnShuffleTeams.addEventListener('click', buildBalancedTeams);


  /* ----------------- TAB 3: ASSET & EXPENSE SPLITTER ----------------- */
  const shareMemberNameInput = document.getElementById('share-member-name');
  const btnAddShareMember = document.getElementById('btn-add-share-member');
  const shareMembersChips = document.getElementById('share-members-chips');
  const shareItemNameInput = document.getElementById('share-item-name');
  const shareItemCostInput = document.getElementById('share-item-cost');
  const shareItemPayerSelect = document.getElementById('share-item-payer');
  const btnAddExpense = document.getElementById('btn-add-expense');
  const ledgerItemsList = document.getElementById('ledger-items-list');
  const simplifiedSettlementsContainer = document.getElementById('simplified-settlements-container');
  const btnResetLedger = document.getElementById('btn-reset-ledger');
  const totalDivisionSumSpan = document.getElementById('total-division-sum');
  const eachShareholderCountSpan = document.getElementById('each-shareholder-count');
  const perCapitaShareSpan = document.getElementById('per-capita-share');

  // Render registered shareowner chips & populate selection dropdown
  function updateShareownersUI() {
    // Chips
    shareMembersChips.innerHTML = '';
    if (appState.expenseSplitters.length === 0) {
      shareMembersChips.innerHTML = '<span class="text-[11px] text-slate-500 p-1">No active owners</span>';
    } else {
      appState.expenseSplitters.forEach((person, idx) => {
        const chip = document.createElement('span');
        chip.className = 'text-[11px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:bg-pink-600/20 transition cursor-pointer';
        chip.innerHTML = `
          ${person}
          <span class="text-red-400 font-extrabold text-[10px] hover:text-red-200" data-index="${idx}">&times;</span>
        `;
        // Remove action
        chip.querySelector('span').addEventListener('click', (e) => {
          e.stopPropagation();
          appState.expenseSplitters.splice(idx, 1);
          updateShareownersUI();
          calculateLedgerSplits();
        });
        shareMembersChips.appendChild(chip);
      });
    }

    // Payer Selector Dropdown
    const previouslySelected = shareItemPayerSelect.value;
    shareItemPayerSelect.innerHTML = '<option value="">-- Select Payer --</option>';
    appState.expenseSplitters.forEach(person => {
      const opt = document.createElement('option');
      opt.value = person;
      opt.textContent = person;
      if (person === previouslySelected) opt.selected = true;
      shareItemPayerSelect.appendChild(opt);
    });
  }

  btnAddShareMember.addEventListener('click', () => {
    const val = shareMemberNameInput.value.trim();
    if (val) {
      if (!appState.expenseSplitters.includes(val)) {
        appState.expenseSplitters.push(val);
        shareMemberNameInput.value = '';
        updateShareownersUI();
        calculateLedgerSplits();
        showToast(`Added shareowner ${val}!`);
      } else {
        showToast('Name already exists in ledger!');
      }
    }
  });

  btnAddExpense.addEventListener('click', () => {
    const name = shareItemNameInput.value.trim();
    const cost = parseFloat(shareItemCostInput.value);
    const payer = shareItemPayerSelect.value;

    if (!name || isNaN(cost) || cost <= 0 || !payer) {
      showToast('⚠️ Please enter item name, valid total cost, and select who paid.');
      return;
    }

    const newExp = {
      id: 'exp-' + Date.now(),
      label: name,
      cost: cost,
      paidBy: payer
    };

    appState.expenses.push(newExp);
    shareItemNameInput.value = '';
    shareItemCostInput.value = '';
    calculateLedgerSplits();
    showToast('New asset split added!');
  });

  btnResetLedger.addEventListener('click', () => {
    appState.expenses = [];
    calculateLedgerSplits();
    showToast('Ledger has been cleared.');
  });

  // Primary engine to divide costs & compute exact settlements
  function calculateLedgerSplits() {
    const totalExpenseSum = appState.expenses.reduce((sum, item) => sum + item.cost, 0);
    const numPeople = appState.expenseSplitters.length;
    
    totalDivisionSumSpan.textContent = `$${totalExpenseSum.toFixed(2)}`;
    eachShareholderCountSpan.textContent = `${numPeople} Shareowners total`;

    const perCapita = numPeople > 0 ? (totalExpenseSum / numPeople) : 0;
    perCapitaShareSpan.textContent = `Per capita: $${perCapita.toFixed(2)} each`;

    // Render Ledger Items
    ledgerItemsList.innerHTML = '';
    if (appState.expenses.length === 0) {
      ledgerItemsList.innerHTML = `
        <div class="text-center py-6 text-slate-500 text-xs border border-slate-800 rounded-xl bg-slate-950/20">
          No active assets or bills. Add above to split.
        </div>
      `;
    } else {
      appState.expenses.forEach(item => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 hover:border-pink-500/20 transition';
        row.innerHTML = `
          <div>
            <span class="text-xs font-bold text-slate-100 block">${item.label}</span>
            <span class="text-[10px] text-slate-400">Paid by <span class="text-pink-300 font-semibold">${item.paidBy}</span></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs font-bold text-emerald-400">$${item.cost.toFixed(2)}</span>
            <button class="text-slate-500 hover:text-red-400 text-xs font-bold px-1" data-del-id="${item.id}">&times;</button>
          </div>
        `;
        row.querySelector('button').addEventListener('click', () => {
          appState.expenses = appState.expenses.filter(e => e.id !== item.id);
          calculateLedgerSplits();
        });
        ledgerItemsList.appendChild(row);
      });
    }

    // Net debt calculation logic
    // Net flow = paid - idealShare
    if (numPeople <= 1) {
      simplifiedSettlementsContainer.innerHTML = `
        <div class="text-center py-6 text-slate-500 text-xs border border-slate-800 rounded-xl bg-slate-950/20">
          Please add at least 2 shareowners to compute settlements.
        </div>
      `;
      return;
    }

    let balanceSheet = {};
    appState.expenseSplitters.forEach(p => {
      balanceSheet[p] = 0;
    });

    // Build personal paid matrix
    appState.expenses.forEach(item => {
      if (balanceSheet[item.paidBy] !== undefined) {
        balanceSheet[item.paidBy] += item.cost;
      }
    });

    // Calculate net status (positive means owned surplus, negative means debtor)
    let netStatus = [];
    for (let person in balanceSheet) {
      let net = balanceSheet[person] - perCapita;
      netStatus.push({ name: person, balance: net });
    }

    // Separate debtors and creditors
    let debtors = netStatus.filter(x => x.balance < -0.01).sort((a, b) => a.balance - b.balance);
    let creditors = netStatus.filter(x => x.balance > 0.01).sort((a, b) => b.balance - a.balance);

    let settlements = [];

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      let debtor = debtors[dIdx];
      let creditor = creditors[cIdx];

      let oweAmount = Math.abs(debtor.balance);
      let creditAmount = creditor.balance;

      let transfer = Math.min(oweAmount, creditAmount);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: transfer
      });

      debtor.balance += transfer;
      creditor.balance -= transfer;

      if (Math.abs(debtor.balance) < 0.01) dIdx++;
      if (Math.abs(creditor.balance) < 0.01) cIdx++;
    }

    // Render Settlements
    simplifiedSettlementsContainer.innerHTML = '';
    if (settlements.length === 0) {
      simplifiedSettlementsContainer.innerHTML = `
        <div class="text-center py-6 text-emerald-400 text-xs border border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5 font-semibold">
          🎉 Perfect Equality! Everyone owes $0.00.
        </div>
      `;
    } else {
      settlements.forEach(setl => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between bg-slate-950/60 border border-slate-800 p-3 rounded-xl hover:border-indigo-500/30 transition';
        div.innerHTML = `
          <div class="flex items-center gap-2.5 text-xs">
            <span class="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">${setl.from}</span>
            <span class="text-slate-500">owes</span>
            <span class="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">${setl.to}</span>
          </div>
          <div class="text-right">
            <span class="font-mono font-bold text-indigo-300 text-sm">$${setl.amount.toFixed(2)}</span>
          </div>
        `;
        simplifiedSettlementsContainer.appendChild(div);
      });
    }
  }

  // Initialize sub-systems
  updateShareownersUI();
  calculateLedgerSplits();

  // Render initial standard math demo
  visualBoard.innerHTML = solveLongDivision(256, 12);
});