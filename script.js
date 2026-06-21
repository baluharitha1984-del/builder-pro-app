document.addEventListener("DOMContentLoaded", () => {
  // Canvas Setup
  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");

  // Resize handler / pixel ratio support
  const DPR = window.devicePixelRatio || 1;
  const logicalSize = 520;
  canvas.width = logicalSize * DPR;
  canvas.height = logicalSize * DPR;
  ctx.scale(DPR, DPR);

  // Audio Synthesizer for educational feedback (success/click/error sounds)
  const playSound = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      // AudioContext fails gracefully if browser blocks it
    }
  };

  // State Variables
  let currentMode = "quadratic"; // 'quadratic' | 'linear' | 'free'
  let plottedPoints = []; // list of {x: number, y: number, color: string, label: string}
  let showGuideCurve = true;
  let showAxesLabels = true;

  // Core Graph Configurations
  const centerX = logicalSize / 2;
  const centerY = logicalSize / 2;
  const scalePx = 22; // 1 Graph unit = 22 pixels

  // Equations mapped with standard 10th-grade values
  const mathLessons = {
    quadratic: {
      equationText: "y = x² - 3x - 4",
      xValues: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
      calculateY: (x) => x * x - 3 * x - 4,
      expectedZeroes: [-1, 4],
      note: "Standard Quadratic graph: Cuts X-axis at (-1, 0) and (4, 0). The roots/zeroes are -1 and 4."
    },
    linear: {
      equationText: "y = 2x - 3",
      xValues: [-2, -1, 0, 1, 2, 3, 4],
      calculateY: (x) => 2 * x - 3,
      expectedZeroes: [1.5],
      note: "Linear graph: Forms a perfect straight line. Cuts X-axis at (1.5, 0). The zero is 1.5."
    },
    free: {
      equationText: "Free Plotting Mode",
      xValues: [-4, -2, 0, 2, 4],
      calculateY: (x) => x,
      expectedZeroes: [],
      note: "Sandbox Mode. Click anywhere on the grid board to plot standard coordinate points manually."
    }
  };

  // Coordinates mapper helper functions
  function toScreenX(graphX) {
    return centerX + graphX * scalePx;
  }
  function toScreenY(graphY) {
    return centerY - graphY * scalePx; // Flip coordinate space for traditional Cartesians
  }
  function toGraphX(screenX) {
    return (screenX - centerX) / scalePx;
  }
  function toGraphY(screenY) {
    return (centerY - screenY) / scalePx;
  }

  // Main Render Engine for graph canvas
  function renderGraph() {
    // Clear
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // 1. Draw Fine Graph Paper Minor Grid (Every 1/5th of a unit representing millimeter lines)
    ctx.strokeStyle = "#0d1d33";
    ctx.lineWidth = 0.5;
    for (let x = -11; x <= 11; x += 0.2) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), logicalSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, toScreenY(x));
      ctx.lineTo(logicalSize, toScreenY(x));
      ctx.stroke();
    }

    // 2. Draw standard Major Grid (Every 1 unit)
    ctx.strokeStyle = "#132e4d";
    ctx.lineWidth = 1.0;
    for (let x = -11; x <= 11; x += 1) {
      if (x === 0) continue; // Skip principal axes lines to paint them thicker later
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), logicalSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, toScreenY(x));
      ctx.lineTo(logicalSize, toScreenY(x));
      ctx.stroke();
    }

    // 3. Draw Principal X and Y Axes
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, logicalSize);
    ctx.stroke();
    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(logicalSize, centerY);
    ctx.stroke();

    // 4. Grid Mark Ticks & Numbers
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = -11; i <= 11; i++) {
      if (i === 0) continue;

      // X-Axis ticks and labels
      const sX = toScreenX(i);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sX, centerY - 4);
      ctx.lineTo(sX, centerY + 4);
      ctx.stroke();
      ctx.fillText(i, sX, centerY + 15);

      // Y-Axis ticks and labels
      const sY = toScreenY(i);
      ctx.beginPath();
      ctx.moveTo(centerX - 4, sY);
      ctx.lineTo(centerX + 4, sY);
      ctx.stroke();
      ctx.fillText(i, centerX - 15, sY);
    }

    // Origin sign
    ctx.fillStyle = "#2dd4bf";
    ctx.fillText("O(0,0)", centerX + 20, centerY + 15);

    // Draw Quadrant Labels if enabled
    if (showAxesLabels) {
      ctx.font = "900 11px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillText("QUADRANT I (+,+)", logicalSize - 75, 25);
      ctx.fillText("QUADRANT II (-,+)", 75, 25);
      ctx.fillText("QUADRANT III (-,-)", 75, logicalSize - 25);
      ctx.fillText("QUADRANT IV (+,-)", logicalSize - 75, logicalSize - 25);

      // Axes Arrow markers labels
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("X", logicalSize - 12, centerY - 15);
      ctx.fillText("X'", 12, centerY - 15);
      ctx.fillText("Y", centerX + 15, 12);
      ctx.fillText("Y'", centerX + 15, logicalSize - 12);
    }

    // 5. Draw continuous math guiding functions (Linear / Quadratic Parabolas) as requested by users
    if (showGuideCurve) {
      if (currentMode === "quadratic") {
        ctx.strokeStyle = "rgba(245, 158, 11, 0.85)"; // Orange/Amber curve
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let sx = 0; sx <= logicalSize; sx++) {
          const gx = toGraphX(sx);
          const gy = mathLessons.quadratic.calculateY(gx);
          const sy = toScreenY(gy);
          if (sx === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();

        // Draw Root Indicators
        ctx.fillStyle = "#f59e0b";
        mathLessons.quadratic.expectedZeroes.forEach(root => {
          ctx.beginPath();
          ctx.arc(toScreenX(root), toScreenY(0), 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.fillText(`Zero: ${root}`, toScreenX(root), toScreenY(0) - 15);
        });

      } else if (currentMode === "linear") {
        ctx.strokeStyle = "rgba(236, 72, 153, 0.85)"; // Pink line
        ctx.lineWidth = 3;
        ctx.beginPath();
        const xMin = toGraphX(0);
        const xMax = toGraphX(logicalSize);
        ctx.moveTo(0, toScreenY(mathLessons.linear.calculateY(xMin)));
        ctx.lineTo(logicalSize, toScreenY(mathLessons.linear.calculateY(xMax)));
        ctx.stroke();

        // Root Indicator
        ctx.fillStyle = "#ec4899";
        mathLessons.linear.expectedZeroes.forEach(root => {
          ctx.beginPath();
          ctx.arc(toScreenX(root), toScreenY(0), 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.fillText(`Zero: ${root}`, toScreenX(root), toScreenY(0) - 15);
        });
      }
    }

    // 6. Draw all Plotted Points dynamically
    plottedPoints.forEach(pt => {
      const sx = toScreenX(pt.x);
      const sy = toScreenY(pt.y);

      // Animated highlight ring around plotted points
      ctx.strokeStyle = pt.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Solid center circle
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Label text coordinates e.g., A(2, 3)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.fillText(`${pt.label}(${pt.x}, ${pt.y})`, sx, sy - 15);
      ctx.shadowBlur = 0; // reset shadow
    });
  }

  // Generate and setup value table markup depending on mode
  function rebuildValueTable() {
    const lesson = mathLessons[currentMode];
    const tableHeaderEquation = document.getElementById("tableHeaderEquation");
    tableHeaderEquation.textContent = lesson.equationText;

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    // Disable plot table button initially
    document.getElementById("btnPlotAllTable").disabled = true;

    lesson.xValues.forEach((x, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-700/60 hover:bg-slate-800/40 transition-colors";

      // Column 1: X value
      const tdX = document.createElement("td");
      tdX.className = "p-2 font-semibold text-slate-300";
      tdX.textContent = x;
      tr.appendChild(tdX);

      // Column 2: Y Input calculated by student
      const tdYInput = document.createElement("td");
      tdYInput.className = "p-2";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "cell-input";
      input.id = `val-y-input-${index}`;
      input.placeholder = "?";
      input.dataset.x = x;
      input.dataset.correctY = lesson.calculateY(x);
      tdYInput.appendChild(input);
      tr.appendChild(tdYInput);

      // Column 3: Result ordered pair text indicator
      const tdPair = document.createElement("td");
      tdPair.className = "p-2 font-mono text-slate-400";
      tdPair.id = `val-pair-${index}`;
      tdPair.textContent = `(${x}, ?)`;
      tr.appendChild(tdPair);

      // Column 4: Check icon indicator
      const tdCheck = document.createElement("td");
      tdCheck.className = "p-2";
      tdCheck.id = `val-status-${index}`;
      tdCheck.innerHTML = `
        <span class="text-slate-600">
          <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </span>
      `;
      tr.appendChild(tdCheck);

      // Input auto pair listener
      input.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val !== "") {
          tdPair.textContent = `(${x}, ${val})`;
        } else {
          tdPair.textContent = `(${x}, ?)`;
        }
      });

      tbody.appendChild(tr);
    });

    document.getElementById("tableStatusText").innerHTML = `<span class="text-slate-400">Verify all outputs to enable batch graph plotting.</span>`;
    updateVerdict();
  }

  // Check standard table user responses
  function checkTableResponses() {
    const inputs = document.querySelectorAll(".cell-input");
    let allCorrect = true;
    let countChecked = 0;

    inputs.forEach((input, index) => {
      const valStr = input.value.trim();
      const correctVal = parseFloat(input.dataset.correctY);
      const statusCol = document.getElementById(`val-status-${index}`);

      if (valStr === "") {
        allCorrect = false;
        statusCol.innerHTML = `
          <span class="text-yellow-500 font-medium text-xs">Blank</span>
        `;
        return;
      }

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed) && parsed === correctVal) {
        countChecked++;
        statusCol.innerHTML = `
          <span class="text-emerald-400">
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4"></path></svg>
          </span>
        `;
        input.classList.remove("border-rose-500", "text-rose-400");
        input.classList.add("border-emerald-500", "text-emerald-400");
      } else {
        allCorrect = false;
        statusCol.innerHTML = `
          <span class="text-rose-500">
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </span>
        `;
        input.classList.remove("border-emerald-500", "text-emerald-400");
        input.classList.add("border-rose-500", "text-rose-400");
      }
    });

    if (allCorrect && inputs.length > 0) {
      playSound('success');
      document.getElementById("tableStatusText").innerHTML = `<span class="text-emerald-400 font-bold">🎉 Correct! Ready to plot graph now!</span>`;
      document.getElementById("btnPlotAllTable").disabled = false;
    } else {
      playSound('error');
      document.getElementById("tableStatusText").innerHTML = `<span class="text-rose-400 font-semibold">⚠️ Some answers are incorrect or empty. Try again!</span>`;
      document.getElementById("btnPlotAllTable").disabled = true;
    }
  }

  // Auto fill helper for learning support
  function autoFillTable() {
    const inputs = document.querySelectorAll(".cell-input");
    inputs.forEach((input, index) => {
      const correctVal = input.dataset.correctY;
      input.value = correctVal;
      // Trigger visual update
      const x = input.dataset.x;
      document.getElementById(`val-pair-${index}`).textContent = `(${x}, ${correctVal})`;
    });
    playSound('click');
    checkTableResponses();
  }

  // Convert and add table points to the visual graph
  function plotAllTablePoints() {
    const inputs = document.querySelectorAll(".cell-input");
    plottedPoints = []; // reset current plotting point array
    let labelCounter = 65; // 'A' ASCII key

    inputs.forEach((input) => {
      const x = parseFloat(input.dataset.x);
      const y = parseFloat(input.value);
      if (!isNaN(x) && !isNaN(y)) {
        plottedPoints.push({
          x: x,
          y: y,
          color: "#2dd4bf",
          label: String.fromCharCode(labelCounter++)
        });
      }
    });

    playSound('success');
    renderGraph();
    updatePlottedBadges();
    updateVerdict();
  }

  // Manual addition of coordinate coordinate values
  function handleManualPlot() {
    const xVal = parseFloat(document.getElementById("manualX").value);
    const yVal = parseFloat(document.getElementById("manualY").value);

    if (isNaN(xVal) || isNaN(yVal)) {
      playSound('error');
      return;
    }

    // Check limits to keep on graph standard screen space
    if (Math.abs(xVal) > 11 || Math.abs(yVal) > 11) {
      alert("To keep values clean for exam standard prep, please choose coordinate values between -11 and 11.");
      return;
    }

    const nextLabel = String.fromCharCode(65 + (plottedPoints.length % 26));
    plottedPoints.push({
      x: xVal,
      y: yVal,
      color: "#f43f5e", // Bright Rose for custom marks
      label: nextLabel
    });

    playSound('click');
    renderGraph();
    updatePlottedBadges();
    updateVerdict();
  }

  // Remove single point from board array
  window.removePoint = function(index) {
    plottedPoints.splice(index, 1);
    playSound('click');
    renderGraph();
    updatePlottedBadges();
    updateVerdict();
  };

  // Render side panels list
  function updatePlottedBadges() {
    const container = document.getElementById("plottedPointsBadgeList");
    container.innerHTML = "";

    if (plottedPoints.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-500 italic">No points plotted yet. Click the graph grid or use the table above.</p>`;
      return;
    }

    plottedPoints.forEach((pt, index) => {
      const badge = document.createElement("div");
      badge.className = "inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold";
      badge.innerHTML = `
        <span style="color: ${pt.color}">${pt.label}(${pt.x}, ${pt.y})</span>
        <button onclick="removePoint(${index})" class="text-slate-500 hover:text-rose-400 transition-colors focus:outline-none ml-1" title="Delete coordinate">&times;</button>
      `;
      container.appendChild(badge);
    });
  }

  // Verdict panel updates with Telugu and English helper hints for 10th-grade exams
  function updateVerdict() {
    const title = document.getElementById("resultVerdictTitle");
    const desc = document.getElementById("resultVerdictText");

    if (currentMode === "quadratic") {
      title.innerHTML = "Zeroes of Polynomial y = x² - 3x - 4";
      if (plottedPoints.length > 0) {
        desc.innerHTML = `
          <p class="mb-2">💡 <strong>Telugu standard instruction:</strong> గ్రాఫ్ x-అక్షాన్ని ఎక్కడ ఖండిస్తుందో ఆ బిందువులే శూన్యాలు. (The values where graph cuts X-axis are the zeroes).</p>
          <p class="text-teal-300 font-semibold">Observed intersecting points on X-axis: <strong>(-1, 0) and (4, 0)</strong>. Therefore, Zeroes are x = -1, 4.</p>
        `;
      } else {
        desc.textContent = "Plot the value table to visually determine where the curve touches and intersects the X-axis.";
      }
    } else if (currentMode === "linear") {
      title.innerHTML = "Solutions of Linear equation y = 2x - 3";
      if (plottedPoints.length > 0) {
        desc.innerHTML = `
          <p class="mb-2">💡 <strong>Exam Rule:</strong> A linear equation represents a straight line. The point of intersection on x-axis shows the zero root.</p>
          <p class="text-pink-400 font-semibold">Line intersects X-axis at x = 1.5. Coordinates: <strong>(1.5, 0)</strong></p>
        `;
      } else {
        desc.textContent = "Plot points to view the straight linear path intersecting the axes.";
      }
    } else {
      title.textContent = "Sandbox Mode Active";
      desc.textContent = "No preset solutions. Add customized coordinates or connect dots via drawing tools to explore.";
    }
  }

  // Canvas interactions (Plotting points via mouse click coordinate recognition)
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = logicalSize / rect.width;
    const scaleY = logicalSize / rect.height;
    
    const screenMouseX = (event.clientX - rect.left) * scaleX;
    const screenMouseY = (event.clientY - rect.top) * scaleY;

    const rawGX = toGraphX(screenMouseX);
    const rawGY = toGraphY(screenMouseY);

    // Snap coordinates to nearest half or integer value for perfect graph plotting experience
    const snapVal = (val) => {
      const rounded = Math.round(val);
      if (Math.abs(val - rounded) < 0.25) {
        return rounded;
      }
      const half = Math.floor(val) + 0.5;
      if (Math.abs(val - half) < 0.25) {
        return half;
      }
      return Math.round(val);
    };

    const graphSnappedX = snapVal(rawGX);
    const graphSnappedY = snapVal(rawGY);

    // Maximum boundaries verification
    if (Math.abs(graphSnappedX) <= 11 && Math.abs(graphSnappedY) <= 11) {
      const nextLabel = String.fromCharCode(65 + (plottedPoints.length % 26));
      
      // Avoid plotting duplicates at exact same location
      const exists = plottedPoints.some(pt => pt.x === graphSnappedX && pt.y === graphSnappedY);
      if (!exists) {
        plottedPoints.push({
          x: graphSnappedX,
          y: graphSnappedY,
          color: "#14b8a6", // Teal color marker
          label: nextLabel
        });
        playSound('click');
        renderGraph();
        updatePlottedBadges();
        updateVerdict();
      }
    }
  });

  // Real-time hover display on header
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = logicalSize / rect.width;
    const scaleY = logicalSize / rect.height;

    const screenMouseX = (event.clientX - rect.left) * scaleX;
    const screenMouseY = (event.clientY - rect.top) * scaleY;

    const gx = toGraphX(screenMouseX).toFixed(1);
    const gy = toGraphY(screenMouseY).toFixed(1);

    document.getElementById("hoverCoordinateText").textContent = `X: ${gx}, Y: ${gy}`;
  });

  // Menu Option Selection updates
  function setLessonMode(mode) {
    currentMode = mode;
    
    // Switch active style classes on button nodes
    const btns = {
      quadratic: document.getElementById("optQuad"),
      linear: document.getElementById("optLinear"),
      free: document.getElementById("optFree")
    };

    Object.keys(btns).forEach(key => {
      if (key === mode) {
        btns[key].className = "topic-opt flex items-center justify-between p-3.5 rounded-xl border border-teal-500 bg-teal-950/20 text-left transition hover:bg-teal-950/30 group";
      } else {
        btns[key].className = "topic-opt flex items-center justify-between p-3.5 rounded-xl border border-slate-700 bg-slate-850 text-left transition hover:bg-slate-750 group";
      }
    });

    // Setup standard defaults
    plottedPoints = [];
    rebuildValueTable();
    renderGraph();
    updatePlottedBadges();
    playSound('click');
  }

  // Button Event Bindings
  document.getElementById("optQuad").addEventListener("click", () => setLessonMode("quadratic"));
  document.getElementById("optLinear").addEventListener("click", () => setLessonMode("linear"));
  document.getElementById("optFree").addEventListener("click", () => setLessonMode("free"));

  document.getElementById("btnCheckTable").addEventListener("click", checkTableResponses);
  document.getElementById("btnAutoFill").addEventListener("click", autoFillTable);
  document.getElementById("btnPlotAllTable").addEventListener("click", plotAllTablePoints);
  document.getElementById("btnManualPlot").addEventListener("click", handleManualPlot);
  
  document.getElementById("btnClearPoints").addEventListener("click", () => {
    plottedPoints = [];
    playSound('click');
    renderGraph();
    updatePlottedBadges();
    updateVerdict();
  });

  // Toggle options
  document.getElementById("btnToggleGuide").addEventListener("click", () => {
    showGuideCurve = !showGuideCurve;
    const txt = document.getElementById("guideBtnText");
    txt.textContent = showGuideCurve ? "Hide Math Curve" : "Show Math Curve";
    playSound('click');
    renderGraph();
  });

  document.getElementById("btnToggleAxesLabels").addEventListener("click", () => {
    showAxesLabels = !showAxesLabels;
    playSound('click');
    renderGraph();
  });

  // Board Exam Helper Modal actions
  const modal = document.getElementById("modalHelp");
  const openModal = () => modal.classList.remove("hidden");
  const closeModal = () => modal.classList.add("hidden");

  document.getElementById("btnHelpModal").addEventListener("click", openModal);
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("btnCloseModalBtn").addEventListener("click", closeModal);

  // Quick Setup Demo button script
  document.getElementById("btnDemoSetup").addEventListener("click", () => {
    // Setup automatic values for current selected mode
    autoFillTable();
    plotAllTablePoints();
    playSound('success');
  });

  // Init setup first time
  rebuildValueTable();
  renderGraph();
});