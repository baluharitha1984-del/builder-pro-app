// StrideFlow - Dynamic Step & Activity Tracker Engine

(function () {
  // State definition
  const state = {
    stepsToday: 6420,
    stepGoal: 10000,
    userWeight: 70,    // in kg
    stepLength: 75,    // in cm
    simulationActive: false,
    simulationInterval: null,
    simStepsAccumulated: 0,
    simLocation: { lat: 37.7749, lon: -122.4194 },
    routePath: []
  };

  // Cache DOM elements
  const displaySteps = document.getElementById('display-steps');
  const displayGoal = document.getElementById('display-goal');
  const statDistance = document.getElementById('stat-distance');
  const statCalories = document.getElementById('stat-calories');
  const statDuration = document.getElementById('stat-duration');
  const progressCircle = document.getElementById('progress-ring-circle');
  const goalRatioText = document.getElementById('goal-ratio-text');
  const todayBar = document.getElementById('today-bar');
  const todayBarLabel = document.getElementById('today-bar-label');

  const btnQuick100 = document.getElementById('btn-quick-100');
  const btnQuick500 = document.getElementById('btn-quick-500');
  const btnQuick1000 = document.getElementById('btn-quick-1000');
  const btnQuick5000 = document.getElementById('btn-quick-5000');
  const btnResetAll = document.getElementById('btn-reset-all');

  const inputManualSteps = document.getElementById('input-manual-steps');
  const btnSubmitSteps = document.getElementById('btn-submit-steps');

  const rangeGoal = document.getElementById('range-goal');
  const rangeGoalVal = document.getElementById('range-goal-val');
  const inputWeight = document.getElementById('input-weight');
  const inputStepLen = document.getElementById('input-step-len');

  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const simBtnLabel = document.getElementById('sim-btn-label');
  const simLat = document.getElementById('sim-lat');
  const simLon = document.getElementById('sim-lon');
  const simActivityStatus = document.getElementById('sim-activity-status');
  const simCanvas = document.getElementById('sim-canvas');
  const simCtx = simCanvas.getContext('2d');

  const badgeUnlockRatio = document.getElementById('badge-unlock-ratio');
  const badge1 = document.getElementById('badge-1');
  const badge2 = document.getElementById('badge-2');
  const badge3 = document.getElementById('badge-3');
  const badge4 = document.getElementById('badge-4');

  // SVG Progress Ring calculations
  // For mobile r=120 (circumference = 2 * PI * 120 = 753.98)
  // For dynamic responsive, we retrieve values directly from the DOM circle strokeDasharray.
  const getCircumference = () => {
    const radius = progressCircle.r.baseVal.value;
    return 2 * Math.PI * radius;
  };

  // Update metrics based on current steps
  const updateMetrics = () => {
    // Distance in km: (steps * stepLength in cm) / 100,000
    const distanceKm = (state.stepsToday * state.stepLength) / 100000;
    statDistance.innerHTML = `${distanceKm.toFixed(2)} <span class="text-xs text-slate-500 font-sans">km</span>`;

    // Calories: approx 0.04 calories per step for average person of 70kg
    // Scale factor by weight relative to baseline 70kg
    const weightFactor = state.userWeight / 70;
    const caloriesBurned = Math.round(state.stepsToday * 0.043 * weightFactor);
    statCalories.innerHTML = `${caloriesBurned} <span class="text-xs text-slate-500 font-sans">kcal</span>`;

    // Duration: approx 100 steps per minute pace
    const activeMinutes = Math.round(state.stepsToday / 105);
    statDuration.innerHTML = `${activeMinutes} <span class="text-xs text-slate-500 font-sans">mins</span>`;

    // Update primary text display
    displaySteps.textContent = state.stepsToday.toLocaleString();
    displayGoal.textContent = state.stepGoal.toLocaleString();

    // Goal Ratio
    const ratio = Math.min((state.stepsToday / state.stepGoal) * 100, 100);
    goalRatioText.textContent = `${ratio.toFixed(1)}%`;

    // SVG progress offset
    const circumference = getCircumference();
    const offset = circumference - (ratio / 100) * circumference;
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = offset;

    // Weekly summary layout today-bar
    const scaleHeight = Math.min((state.stepsToday / state.stepGoal) * 100, 100);
    todayBar.style.height = `${scaleHeight}%`;
    todayBarLabel.textContent = `${(state.stepsToday / 1000).toFixed(1)}k`;

    // Evaluate Achievements
    evaluateBadges();
  };

  // Check criteria for achievement badges
  const evaluateBadges = () => {
    let unlockedCount = 0;

    // Badge 1: 1,000 steps
    if (state.stepsToday >= 1000) {
      badge1.classList.remove('opacity-50', 'bg-slate-950');
      badge1.classList.add('opacity-100', 'bg-orange-500/5', 'border-orange-500/30');
      unlockedCount++;
    } else {
      badge1.classList.add('opacity-50', 'bg-slate-950');
      badge1.classList.remove('opacity-100', 'bg-orange-500/5', 'border-orange-500/30');
    }

    // Badge 2: 5,000 steps
    if (state.stepsToday >= 5000) {
      badge2.classList.remove('opacity-50', 'bg-slate-950');
      badge2.classList.add('opacity-100', 'bg-blue-500/5', 'border-blue-500/30');
      unlockedCount++;
    } else {
      badge2.classList.add('opacity-50', 'bg-slate-950');
      badge2.classList.remove('opacity-100', 'bg-blue-500/5', 'border-blue-500/30');
    }

    // Badge 3: Reach goal
    if (state.stepsToday >= state.stepGoal) {
      badge3.classList.remove('opacity-50', 'bg-slate-950');
      badge3.classList.add('opacity-100', 'bg-purple-500/5', 'border-purple-500/30');
      unlockedCount++;
    } else {
      badge3.classList.add('opacity-50', 'bg-slate-950');
      badge3.classList.remove('opacity-100', 'bg-purple-500/5', 'border-purple-500/30');
    }

    // Badge 4: Super strider 15k steps
    if (state.stepsToday >= 15000) {
      badge4.classList.remove('opacity-50', 'bg-slate-950');
      badge4.classList.add('opacity-100', 'bg-yellow-500/5', 'border-yellow-500/30');
      unlockedCount++;
    } else {
      badge4.classList.add('opacity-50', 'bg-slate-950');
      badge4.classList.remove('opacity-100', 'bg-yellow-500/5', 'border-yellow-500/30');
    }

    badgeUnlockRatio.textContent = `${unlockedCount}/4`;
  };

  // Set steps safely
  const addSteps = (amount) => {
    state.stepsToday = Math.max(0, state.stepsToday + amount);
    
    // Pulse animation trigger
    progressCircle.classList.remove('progress-ring-active');
    void progressCircle.offsetWidth; // Reflow trigger
    progressCircle.classList.add('progress-ring-active');

    updateMetrics();
  };

  // Canvas-based simulation renderer
  const initSimulatorCanvas = () => {
    // Set size properly
    const dpr = window.devicePixelRatio || 1;
    const rect = simCanvas.getBoundingClientRect();
    simCanvas.width = rect.width * dpr;
    simCanvas.height = rect.height * dpr;
    simCtx.scale(dpr, dpr);
    
    // Generate dynamic mock GPS grid
    drawSimulationMap();
  };

  const drawSimulationMap = () => {
    const w = simCanvas.width / (window.devicePixelRatio || 1);
    const h = simCanvas.height / (window.devicePixelRatio || 1);
    simCtx.clearRect(0, 0, w, h);

    // Draw Sci-fi Grid Matrix
    simCtx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
    simCtx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < w; x += gridSize) {
      simCtx.beginPath();
      simCtx.moveTo(x, 0);
      simCtx.lineTo(x, h);
      simCtx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      simCtx.beginPath();
      simCtx.moveTo(0, y);
      simCtx.lineTo(w, y);
      simCtx.stroke();
    }

    // Draw Simulated Neighborhood Nodes / Background Elements
    simCtx.fillStyle = 'rgba(51, 65, 85, 0.2)';
    const blocks = [
      {x: 30, y: 20, w: 60, h: 40},
      {x: 140, y: 30, w: 80, h: 50},
      {x: 40, y: 90, w: 50, h: 60},
      {x: 230, y: 100, w: 70, h: 40},
      {x: 110, y: 130, w: 90, h: 50}
    ];
    blocks.forEach(b => {
      simCtx.fillRect(b.x, b.y, b.w, b.h);
      simCtx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      simCtx.strokeRect(b.x, b.y, b.w, b.h);
    });

    // Draw Route Path Taken
    if (state.routePath.length > 0) {
      simCtx.strokeStyle = '#10b981';
      simCtx.lineWidth = 3;
      simCtx.lineCap = 'round';
      simCtx.lineJoin = 'round';
      simCtx.beginPath();
      simCtx.moveTo(state.routePath[0].x, state.routePath[0].y);
      for (let i = 1; i < state.routePath.length; i++) {
        simCtx.lineTo(state.routePath[i].x, state.routePath[i].y);
      }
      simCtx.stroke();

      // Draw path glowing shadow
      simCtx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      simCtx.lineWidth = 7;
      simCtx.stroke();
    }

    // Draw Live GPS position pulse
    const activeNode = state.routePath[state.routePath.length - 1] || { x: w / 2, y: h / 2 };
    
    simCtx.beginPath();
    simCtx.arc(activeNode.x, activeNode.y, 10, 0, Math.PI * 2);
    simCtx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    simCtx.fill();

    simCtx.beginPath();
    simCtx.arc(activeNode.x, activeNode.y, 4, 0, Math.PI * 2);
    simCtx.fillStyle = '#10b981';
    simCtx.fill();
  };

  // Start/Stop Walk Simulation
  const toggleSimulation = () => {
    const w = simCanvas.width / (window.devicePixelRatio || 1);
    const h = simCanvas.height / (window.devicePixelRatio || 1);

    if (state.simulationActive) {
      // Turn off
      clearInterval(state.simulationInterval);
      state.simulationActive = false;
      simBtnLabel.textContent = 'Start Walk';
      simActivityStatus.innerHTML = `Simulation ended. Accumulation complete. Ready to track next session.`;
      document.getElementById('live-status').textContent = 'Tracking On-Hold';
      document.getElementById('live-pulse-dot').classList.replace('bg-emerald-500', 'bg-amber-500');
      document.getElementById('live-pulse-ring').classList.remove('animate-ping');
    } else {
      // Turn on
      state.simulationActive = true;
      simBtnLabel.textContent = 'Pause Walk';
      document.getElementById('live-status').textContent = 'Simulating Active Step Feed...';
      document.getElementById('live-pulse-dot').classList.replace('bg-amber-500', 'bg-emerald-500');
      document.getElementById('live-pulse-ring').classList.add('animate-ping');

      // Seed path route starting coordinate
      if (state.routePath.length === 0) {
        state.routePath.push({ x: w / 2, y: h / 2 });
      }

      state.simulationInterval = setInterval(() => {
        // Generate random steps between 12 and 26 per cycle
        const stepsGained = Math.floor(Math.random() * 15) + 12;
        addSteps(stepsGained);

        // Update location coordinates simulation fractionally
        state.simLocation.lat += (Math.random() - 0.5) * 0.0003;
        state.simLocation.lon += (Math.random() - 0.5) * 0.0003;
        simLat.textContent = state.simLocation.lat.toFixed(5);
        simLon.textContent = state.simLocation.lon.toFixed(5);

        // Advance coordinates path point within boundary limits
        const currentPoint = state.routePath[state.routePath.length - 1];
        const nextX = Math.max(10, Math.min(w - 10, currentPoint.x + (Math.random() - 0.5) * 20));
        const nextY = Math.max(10, Math.min(h - 10, currentPoint.y + (Math.random() - 0.5) * 20));
        state.routePath.push({ x: nextX, y: nextY });

        // Keep path history trimmed to recent 40 points
        if (state.routePath.length > 40) {
          state.routePath.shift();
        }

        simActivityStatus.innerHTML = `<span class='text-emerald-400 font-bold animate-pulse'>Walking live!</span> Simulated steps: <strong class='font-mono'>+${stepsGained}</strong> added.`;
        drawSimulationMap();
      }, 1500);
    }
  };

  // Event Listeners registration
  const initListeners = () => {
    // Quick increments
    btnQuick100.addEventListener('click', () => addSteps(100));
    btnQuick500.addEventListener('click', () => addSteps(500));
    btnQuick1000.addEventListener('click', () => addSteps(1000));
    btnQuick5000.addEventListener('click', () => addSteps(5000));

    // Manual entry submission
    btnSubmitSteps.addEventListener('click', () => {
      const value = parseInt(inputManualSteps.value, 10);
      if (!isNaN(value) && value > 0) {
        addSteps(value);
        inputManualSteps.value = '';
      }
    });

    // Goal range configuration modifier
    rangeGoal.addEventListener('input', (e) => {
      const newGoal = parseInt(e.target.value, 10);
      state.stepGoal = newGoal;
      rangeGoalVal.textContent = newGoal.toLocaleString();
      updateMetrics();
    });

    // Weight/Length updates triggers recalculations
    inputWeight.addEventListener('input', (e) => {
      const w = parseFloat(e.target.value);
      if (!isNaN(w) && w > 0) {
        state.userWeight = w;
        updateMetrics();
      }
    });

    inputStepLen.addEventListener('input', (e) => {
      const l = parseFloat(e.target.value);
      if (!isNaN(l) && l > 0) {
        state.stepLength = l;
        updateMetrics();
      }
    });

    // Simulation click handler
    btnToggleSim.addEventListener('click', toggleSimulation);

    // Master reset
    btnResetAll.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your current progress session?')) {
        state.stepsToday = 0;
        state.routePath = [];
        if (state.simulationActive) {
          toggleSimulation();
        }
        updateMetrics();
        drawSimulationMap();
      }
    });

    // Handle responsive canvas sizes correctly on window resizing
    window.addEventListener('resize', () => {
      initSimulatorCanvas();
    });
  };

  // Entry initialize system
  const init = () => {
    updateMetrics();
    initSimulatorCanvas();
    initListeners();
  };

  // Boot on DOM content ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();