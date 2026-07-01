// Wait for DOM to be fully prepared
window.addEventListener('DOMContentLoaded', () => {
  // Elements
  const unitMetricBtn = document.getElementById('unitMetricBtn');
  const unitImperialBtn = document.getElementById('unitImperialBtn');
  const unitIndicatorText = document.getElementById('unitIndicatorText');
  
  const genderMaleBtn = document.getElementById('genderMaleBtn');
  const genderFemaleBtn = document.getElementById('genderFemaleBtn');
  
  const ageSlider = document.getElementById('ageSlider');
  const ageInput = document.getElementById('ageInput');
  const ageDisplay = document.getElementById('ageDisplay');
  
  const heightDisplay = document.getElementById('heightDisplay');
  const heightLabel = document.getElementById('heightLabel');
  const heightSlider = document.getElementById('heightSlider');
  const heightInputCm = document.getElementById('heightInputCm');
  
  const metricHeightSliderContainer = document.getElementById('metricHeightSliderContainer');
  const metricHeightInputs = document.getElementById('metricHeightInputs');
  const imperialHeightInputs = document.getElementById('imperialHeightInputs');
  const heightInputFt = document.getElementById('heightInputFt');
  const heightInputIn = document.getElementById('heightInputIn');
  
  const weightDisplay = document.getElementById('weightDisplay');
  const weightLabel = document.getElementById('weightLabel');
  const weightSlider = document.getElementById('weightSlider');
  const weightInput = document.getElementById('weightInput');
  const weightUnitLabel = document.getElementById('weightUnitLabel');
  
  const goalDisplay = document.getElementById('goalDisplay');
  const goalWeightInput = document.getElementById('goalWeightInput');
  const goalWeightUnitLabel = document.getElementById('goalWeightUnitLabel');
  
  // Presets
  const presetAverageMale = document.getElementById('presetAverageMale');
  const presetAverageFemale = document.getElementById('presetAverageFemale');
  const presetAthlete = document.getElementById('presetAthlete');
  
  // Right Column outputs
  const bmiNumericValue = document.getElementById('bmiNumericValue');
  const bmiCategoryBadge = document.getElementById('bmiCategoryBadge');
  const bmiStatusHeadline = document.getElementById('bmiStatusHeadline');
  const bmiStatusDescription = document.getElementById('bmiStatusDescription');
  const bmiArc = document.getElementById('bmiArc');
  const bmiPointer = document.getElementById('bmiPointer');
  
  const idealWeightRangeText = document.getElementById('idealWeightRangeText');
  const bmrRateText = document.getElementById('bmrRateText');
  const waterTargetText = document.getElementById('waterTargetText');
  
  const goalDeltaBadge = document.getElementById('goalDeltaBadge');
  const goalStartDisplay = document.getElementById('goalStartDisplay');
  const goalTargetDisplay = document.getElementById('goalTargetDisplay');
  const goalProgressBar = document.getElementById('goalProgressBar');
  const goalMessageText = document.getElementById('goalMessageText');
  
  // Saved Log elements
  const saveRecordBtn = document.getElementById('saveRecordBtn');
  const clearAllRecordsBtn = document.getElementById('clearAllRecordsBtn');
  const historyEmptyState = document.getElementById('historyEmptyState');
  const historyContainerList = document.getElementById('historyContainerList');
  const historyTableBody = document.getElementById('historyTableBody');

  // App State variables
  let isMetric = true;
  let selectedGender = 'male'; // 'male' | 'female'
  let savedLogs = JSON.parse(localStorage.getItem('aura_bmi_logs') || '[]');

  // Initialize on start
  renderHistoryLogs();
  triggerRecalculation();

  // Switch to Metric Mode
  unitMetricBtn.addEventListener('click', () => {
    if (isMetric) return;
    isMetric = true;
    
    // Visual toggling on buttons
    unitMetricBtn.className = "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 bg-teal-500 text-slate-950 shadow-md";
    unitImperialBtn.className = "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 text-slate-400 hover:text-slate-200";
    unitIndicatorText.textContent = "Metric (cm, kg)";
    weightUnitLabel.textContent = "kg";
    goalWeightUnitLabel.textContent = "kg";
    
    // Hide imperial fields, reveal metric fields
    metricHeightSliderContainer.classList.remove('hidden');
    metricHeightInputs.classList.remove('hidden');
    imperialHeightInputs.classList.add('hidden');
    
    // Convert current Imperial inputs back to Metric
    const feet = parseFloat(heightInputFt.value) || 0;
    const inches = parseFloat(heightInputIn.value) || 0;
    const totalInches = (feet * 12) + inches;
    const calculatedCm = Math.round(totalInches * 2.54);
    
    heightSlider.min = "100";
    heightSlider.max = "250";
    heightSlider.value = calculatedCm;
    heightInputCm.value = calculatedCm;
    
    // Convert weight from lbs to kg
    const currentLbs = parseFloat(weightInput.value) || 165;
    const calculatedKg = Math.round(currentLbs / 2.20462 * 10) / 10;
    weightSlider.min = "20";
    weightSlider.max = "250";
    weightSlider.value = calculatedKg;
    weightInput.value = calculatedKg;
    
    // Convert target weight
    const currentGoalLbs = parseFloat(goalWeightInput.value) || 150;
    const calculatedGoalKg = Math.round(currentGoalLbs / 2.20462 * 10) / 10;
    goalWeightInput.value = calculatedGoalKg;
    
    triggerRecalculation();
  });

  // Switch to Imperial Mode
  unitImperialBtn.addEventListener('click', () => {
    if (!isMetric) return;
    isMetric = false;
    
    // Visual toggling on buttons
    unitImperialBtn.className = "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 bg-teal-500 text-slate-950 shadow-md";
    unitMetricBtn.className = "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 text-slate-400 hover:text-slate-200";
    unitIndicatorText.textContent = "Imperial (in, lbs)";
    weightUnitLabel.textContent = "lbs";
    goalWeightUnitLabel.textContent = "lbs";
    
    // Show imperial height inputs, hide metric inputs
    metricHeightSliderContainer.classList.add('hidden');
    metricHeightInputs.classList.add('hidden');
    imperialHeightInputs.classList.remove('hidden');
    
    // Convert metric cm to feet/inches
    const cmVal = parseFloat(heightInputCm.value) || 175;
    const totalInches = cmVal / 2.54;
    const calculatedFeet = Math.floor(totalInches / 12);
    const calculatedRemainingInches = Math.round(totalInches % 12);
    
    heightInputFt.value = calculatedFeet;
    heightInputIn.value = calculatedRemainingInches;
    
    // Convert weight from kg to lbs
    const currentKg = parseFloat(weightInput.value) || 75;
    const calculatedLbs = Math.round(currentKg * 2.20462);
    weightSlider.min = "45";
    weightSlider.max = "550";
    weightSlider.value = calculatedLbs;
    weightInput.value = calculatedLbs;
    
    // Convert target weight
    const currentGoalKg = parseFloat(goalWeightInput.value) || 70;
    const calculatedGoalLbs = Math.round(currentGoalKg * 2.20462);
    goalWeightInput.value = calculatedGoalLbs;
    
    triggerRecalculation();
  });

  // Gender Toggling
  genderMaleBtn.addEventListener('click', () => {
    selectedGender = 'male';
    genderMaleBtn.className = "flex items-center justify-center gap-2 py-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 font-semibold transition-all duration-200";
    genderFemaleBtn.className = "flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-all duration-200";
    triggerRecalculation();
  });

  genderFemaleBtn.addEventListener('click', () => {
    selectedGender = 'female';
    genderFemaleBtn.className = "flex items-center justify-center gap-2 py-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 font-semibold transition-all duration-200";
    genderMaleBtn.className = "flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-all duration-200";
    triggerRecalculation();
  });

  // Sync Sliders and Numerical Inputs
  // Age
  ageSlider.addEventListener('input', (e) => {
    ageInput.value = e.target.value;
    triggerRecalculation();
  });
  ageInput.addEventListener('input', (e) => {
    let val = parseInt(e.target.value) || 28;
    if (val < 2) val = 2;
    if (val > 120) val = 120;
    ageSlider.value = val;
    triggerRecalculation();
  });

  // Height (Metric)
  heightSlider.addEventListener('input', (e) => {
    heightInputCm.value = e.target.value;
    triggerRecalculation();
  });
  heightInputCm.addEventListener('input', (e) => {
    let val = parseInt(e.target.value) || 150;
    if (val < 100) val = 100;
    if (val > 250) val = 250;
    heightSlider.value = val;
    triggerRecalculation();
  });

  // Imperial Height switches
  heightInputFt.addEventListener('input', triggerRecalculation);
  heightInputIn.addEventListener('input', triggerRecalculation);

  // Weight
  weightSlider.addEventListener('input', (e) => {
    weightInput.value = e.target.value;
    triggerRecalculation();
  });
  weightInput.addEventListener('input', (e) => {
    let val = parseFloat(e.target.value) || 70;
    if (val < 20) val = 20;
    if (val > 500) val = 500;
    weightSlider.value = Math.round(val);
    triggerRecalculation();
  });

  // Goal Weight
  goalWeightInput.addEventListener('input', triggerRecalculation);

  // Preset Profiles Loader
  presetAverageMale.addEventListener('click', () => {
    loadPresetProfile('male', 30, 178, 80, 75);
  });
  presetAverageFemale.addEventListener('click', () => {
    loadPresetProfile('female', 28, 163, 62, 57);
  });
  presetAthlete.addEventListener('click', () => {
    loadPresetProfile('male', 26, 185, 88, 84);
  });

  function loadPresetProfile(gender, age, heightCm, weightKg, goalWeightKg) {
    selectedGender = gender;
    if (gender === 'male') {
      genderMaleBtn.click();
    } else {
      genderFemaleBtn.click();
    }
    
    ageSlider.value = age;
    ageInput.value = age;
    
    if (isMetric) {
      heightSlider.value = heightCm;
      heightInputCm.value = heightCm;
      weightSlider.value = weightKg;
      weightInput.value = weightKg;
      goalWeightInput.value = goalWeightKg;
    } else {
      // Convert presets to imperial format
      const totalInches = heightCm / 2.54;
      heightInputFt.value = Math.floor(totalInches / 12);
      heightInputIn.value = Math.round(totalInches % 12);
      
      const weightLbs = Math.round(weightKg * 2.20462);
      weightSlider.value = weightLbs;
      weightInput.value = weightLbs;
      
      const goalLbs = Math.round(goalWeightKg * 2.20462);
      goalWeightInput.value = goalLbs;
    }
    triggerRecalculation();
  }

  // Central calculation algorithm
  function triggerRecalculation() {
    const age = parseInt(ageInput.value) || 28;
    ageDisplay.textContent = age;
    
    let heightInCm = 175;
    let weightInKg = 75;
    let goalWeightInKg = 70;
    
    // Convert and read according to system settings
    if (isMetric) {
      heightInCm = parseFloat(heightInputCm.value) || 175;
      weightInKg = parseFloat(weightInput.value) || 75;
      goalWeightInKg = parseFloat(goalWeightInput.value) || 0;
      
      heightDisplay.textContent = `${heightInCm} cm`;
      weightDisplay.textContent = `${weightInKg} kg`;
      goalDisplay.textContent = goalWeightInKg > 0 ? `${goalWeightInKg} kg` : 'Not set';
    } else {
      const feet = parseFloat(heightInputFt.value) || 5;
      const inches = parseFloat(heightInputIn.value) || 8;
      const totalInches = (feet * 12) + inches;
      heightInCm = totalInches * 2.54;
      
      const weightLbs = parseFloat(weightInput.value) || 165;
      weightInKg = weightLbs / 2.20462;
      
      const goalLbs = parseFloat(goalWeightInput.value) || 0;
      goalWeightInKg = goalLbs > 0 ? (goalLbs / 2.20462) : 0;
      
      heightDisplay.textContent = `${feet}'${Math.round(inches)}"`;
      weightDisplay.textContent = `${Math.round(weightLbs)} lbs`;
      goalDisplay.textContent = goalLbs > 0 ? `${Math.round(goalLbs)} lbs` : 'Not set';
    }
    
    // Prevent division errors
    if (!heightInCm || heightInCm <= 0) heightInCm = 1;
    
    // BMI Calculation
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmi * 10) / 10;
    
    // Update primary UI metrics displays
    bmiNumericValue.textContent = roundedBmi.toFixed(1);
    
    // Categorization logic
    let category = "";
    let badgeClass = "";
    let headline = "";
    let description = "";
    
    if (bmi < 18.5) {
      category = "Underweight";
      badgeClass = "bg-bmi-underweight";
      headline = "Below Recommended Ranges";
      description = "A BMI below 18.5 points to lower than normal energy stores. Consider consulting with a nutritionist.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal Weight";
      badgeClass = "bg-bmi-normal";
      headline = "Optimized Metabolic Standard";
      description = "Excellent work. You fall precisely in the statistical target zone for lowest risk metrics.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      badgeClass = "bg-bmi-overweight";
      headline = "Moderate Health Risk Zone";
      description = "Increased risk indicators for long-term respiratory and cardiovascular parameters. Active monitoring is helpful.";
    } else {
      category = "Obese";
      badgeClass = "bg-bmi-obese";
      headline = "Significant Clinical Zone";
      description = "Highly elevated risks for hypertension and systemic metabolic imbalances. Reach out to primary health caretakers.";
    }
    
    bmiCategoryBadge.textContent = category;
    bmiCategoryBadge.className = `mt-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-300 ${badgeClass}`;
    bmiStatusHeadline.textContent = headline;
    bmiStatusDescription.textContent = description;
    
    // Set Arc circumference attributes
    // Total stroke-dasharray = 2 * PI * r = 2 * 3.14159 * 42 = 263.8
    // Let's scale visual range from BMI 15 to 40.
    const minBmiScale = 15;
    const maxBmiScale = 40;
    let scalePercentage = (bmi - minBmiScale) / (maxBmiScale - minBmiScale);
    if (scalePercentage < 0) scalePercentage = 0;
    if (scalePercentage > 1) scalePercentage = 1;
    
    const strokeOffset = 263.8 - (scalePercentage * 263.8);
    bmiArc.setAttribute('stroke-dashoffset', strokeOffset);
    
    // Dynamic Pointer update
    const leftPercent = Math.min(Math.max(scalePercentage * 100, 0), 100);
    bmiPointer.style.left = `${leftPercent}%`;
    
    // Ideal Weight Range limiters (BMI 18.5 up to 24.9)
    const idealMinWeight = 18.5 * (heightInMeters * heightInMeters);
    const idealMaxWeight = 24.9 * (heightInMeters * heightInMeters);
    
    if (isMetric) {
      idealWeightRangeText.textContent = `${Math.round(idealMinWeight * 10) / 10} - ${Math.round(idealMaxWeight * 10) / 10} kg`;
    } else {
      idealWeightRangeText.textContent = `${Math.round(idealMinWeight * 2.20462)} - ${Math.round(idealMaxWeight * 2.20462)} lbs`;
    }
    
    // Mifflin-St Jeor formula for BMR
    let bmr = 0;
    if (selectedGender === 'male') {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }
    bmrRateText.textContent = `${Math.round(bmr)} kcal/day`;
    
    // Water Target (approx. 35 ml per kilogram of body mass)
    const waterLiters = (weightInKg * 0.035);
    waterTargetText.textContent = `${waterLiters.toFixed(1)} Liters`;
    
    // Goal Weight Progress tracking
    if (goalWeightInKg > 0) {
      const diff = Math.abs(weightInKg - goalWeightInKg);
      const badgeLabelText = `${Math.round(diff * (isMetric ? 1 : 2.20462) * 10) / 10} ${isMetric ? 'kg' : 'lbs'} diff`;
      goalDeltaBadge.textContent = badgeLabelText;
      goalDeltaBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400";
      
      if (isMetric) {
        goalStartDisplay.textContent = `Now: ${Math.round(weightInKg * 10) / 10}kg`;
        goalTargetDisplay.textContent = `Goal: ${Math.round(goalWeightInKg * 10) / 10}kg`;
      } else {
        goalStartDisplay.textContent = `Now: ${Math.round(weightInKg * 2.20462)}lbs`;
        goalTargetDisplay.textContent = `Goal: ${Math.round(goalWeightInKg * 2.20462)}lbs`;
      }
      
      // Simple progress towards goal
      // Assuming arbitrary target boundaries to scale visual progress indicator nicely
      const initialRef = weightInKg > goalWeightInKg ? goalWeightInKg + 15 : goalWeightInKg - 15;
      const totalJourney = Math.abs(initialRef - goalWeightInKg);
      const currentJourney = Math.abs(weightInKg - goalWeightInKg);
      let progressPercent = 100 - ((currentJourney / totalJourney) * 100);
      if (progressPercent < 5) progressPercent = 5;
      if (progressPercent > 100) progressPercent = 100;
      
      goalProgressBar.style.width = `${Math.round(progressPercent)}%`;
      
      if (diff < 1) {
        goalMessageText.textContent = "Outstanding, target goal weight achieved!";
        goalDeltaBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400";
      } else if (weightInKg > goalWeightInKg) {
        goalMessageText.textContent = `Caloric deficit targeting required to lose ${Math.round(diff * (isMetric ? 1 : 2.20462))} ${isMetric ? 'kg' : 'lbs'}.`;
      } else {
        goalMessageText.textContent = `Caloric surplus targeting required to gain ${Math.round(diff * (isMetric ? 1 : 2.20462))} ${isMetric ? 'kg' : 'lbs'}.`;
      }
    } else {
      goalDeltaBadge.textContent = "Not Configured";
      goalDeltaBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400";
      goalStartDisplay.textContent = "--";
      goalTargetDisplay.textContent = "--";
      goalProgressBar.style.width = "0%";
      goalMessageText.textContent = "Set a target weight inside the calculator panel to map targets.";
    }
  }

  // History Log Handling
  saveRecordBtn.addEventListener('click', () => {
    const timestamp = new Date().toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
    const age = parseInt(ageInput.value) || 28;
    
    let heightLabel = "";
    let weightLabel = "";
    
    let heightInCm = 175;
    let weightInKg = 75;
    
    if (isMetric) {
      heightInCm = parseFloat(heightInputCm.value) || 175;
      weightInKg = parseFloat(weightInput.value) || 75;
      heightLabel = `${heightInCm} cm`;
      weightLabel = `${weightInKg} kg`;
    } else {
      const feet = parseFloat(heightInputFt.value) || 5;
      const inches = parseFloat(heightInputIn.value) || 8;
      heightInCm = ((feet * 12) + inches) * 2.54;
      
      const weightLbs = parseFloat(weightInput.value) || 165;
      weightInKg = weightLbs / 2.20462;
      
      heightLabel = `${feet}'${Math.round(inches)}"`;
      weightLabel = `${Math.round(weightLbs)} lbs`;
    }
    
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmi * 10) / 10;
    
    let category = "";
    if (roundedBmi < 18.5) category = "Underweight";
    else if (roundedBmi >= 18.5 && roundedBmi < 25) category = "Normal";
    else if (roundedBmi >= 25 && roundedBmi < 30) category = "Overweight";
    else category = "Obese";

    const newRecord = {
      id: Date.now(),
      date: timestamp,
      gender: selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
      age: age,
      height: heightLabel,
      weight: weightLabel,
      bmi: roundedBmi,
      category: category
    };

    savedLogs.unshift(newRecord); // Add to beginning of history
    localStorage.setItem('aura_bmi_logs', JSON.stringify(savedLogs));
    
    renderHistoryLogs();
    
    // Visual Confirmation Action
    const originalText = saveRecordBtn.innerHTML;
    saveRecordBtn.innerHTML = `
      <svg class="w-5 h-5 text-emerald-950 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
      Assessment Saved!
    `;
    saveRecordBtn.classList.remove('from-teal-500', 'to-emerald-500');
    saveRecordBtn.classList.add('from-emerald-400', 'to-green-400');
    
    setTimeout(() => {
      saveRecordBtn.innerHTML = originalText;
      saveRecordBtn.classList.add('from-teal-500', 'to-emerald-500');
      saveRecordBtn.classList.remove('from-emerald-400', 'to-green-400');
    }, 1800);
  });

  // Render log elements table
  function renderHistoryLogs() {
    if (savedLogs.length === 0) {
      historyEmptyState.classList.remove('hidden');
      historyContainerList.classList.add('hidden');
      return;
    }
    
    historyEmptyState.classList.add('hidden');
    historyContainerList.classList.remove('hidden');
    
    historyTableBody.innerHTML = '';
    
    savedLogs.forEach((item) => {
      let classificationColor = "text-teal-400 bg-teal-500/10";
      if (item.category === "Underweight") classificationColor = "text-blue-400 bg-blue-500/10";
      if (item.category === "Overweight") classificationColor = "text-amber-400 bg-amber-500/10";
      if (item.category === "Obese") classificationColor = "text-red-400 bg-red-500/10";

      const row = document.createElement('tr');
      row.className = "hover:bg-slate-800/45 transition-colors duration-150 border-b border-slate-800/60";
      
      row.innerHTML = `
        <td class="py-3.5 px-4 font-medium text-slate-300">${item.date}</td>
        <td class="py-3.5 px-4 text-slate-400">${item.gender}, ${item.age}y</td>
        <td class="py-3.5 px-4 font-mono">${item.height}</td>
        <td class="py-3.5 px-4 font-mono">${item.weight}</td>
        <td class="py-3.5 px-4 text-center font-bold text-white font-mono">
          <span class="px-2 py-1 rounded bg-slate-950 border border-slate-800">${item.bmi}</span>
        </td>
        <td class="py-3.5 px-4">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${classificationColor}">${item.category}</span>
        </td>
        <td class="py-3.5 px-4 text-right">
          <button class="delete-log-btn text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-all" data-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      `;
      
      // Event listener for current row delete btn
      row.querySelector('.delete-log-btn').addEventListener('click', (e) => {
        const recordId = parseInt(e.currentTarget.getAttribute('data-id'));
        savedLogs = savedLogs.filter(log => log.id !== recordId);
        localStorage.setItem('aura_bmi_logs', JSON.stringify(savedLogs));
        renderHistoryLogs();
      });

      historyTableBody.appendChild(row);
    });
  }

  // Clear All Records logic
  clearAllRecordsBtn.addEventListener('click', () => {
    if (confirm('Are you certain you wish to completely clear your historical logs? This cannot be undone.')) {
      savedLogs = [];
      localStorage.removeItem('aura_bmi_logs');
      renderHistoryLogs();
    }
  });
});