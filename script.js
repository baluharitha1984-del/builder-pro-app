// CartoCraft Dynamic Simulation Engine

// Prepopulated custom location nodes
let waypoints = [
  { id: "wp1", name: "Hyper-City Core", x: 400, y: 300, cat: "landmark", desc: "Highly congested metropolitan center", categoryIcon: "🏛" },
  { id: "wp2", name: "Starlight Cargo Docks", x: 150, y: 180, cat: "port", desc: "Primary marine import facilities", categoryIcon: "⚓" },
  { id: "wp3", name: "Titan Energy Spire", x: 650, y: 150, cat: "danger", desc: "High voltage thermonuclear complex", categoryIcon: "⚡" },
  { id: "wp4", name: "Verdant Canopy Reserve", x: 220, y: 480, cat: "outpost", desc: "Sustainable biological research sector", categoryIcon: "⛺" },
  { id: "wp5", name: "Subterranean Conduit Delta", x: 680, y: 420, cat: "landmark", desc: "Technological water purification grid", categoryIcon: "🏛" },
  { id: "wp6", name: "Pinnacle Peak Outpost", x: 800, y: 250, cat: "outpost", desc: "High elevation meteorological station", categoryIcon: "⛺" }
];

// Roads dataset for simulated path rendering & map visuals
const roads = [
  { from: "wp1", to: "wp2" },
  { from: "wp1", to: "wp3" },
  { from: "wp1", to: "wp4" },
  { from: "wp1", to: "wp5" },
  { from: "wp3", to: "wp6" },
  { from: "wp4", to: "wp2" },
  { from: "wp5", to: "wp6" }
];

// Map Engine State
let mapStyle = "cyber"; // cyber | blueprint | topo
let zoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let startDragX = 0;
let startDragY = 0;
let activeRoute = null;
let simulateTraffic = true;
let simulateWeather = false;
let trafficTick = 0;
let weatherTick = 0;
let searchFilter = "";
let currentModalCoords = { x: 0, y: 0 };
let selectedCategory = "landmark"; // for modal

// Setup Canvas
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");

// Handle responsive sizing of map element
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Center map initially if pan is 0
  if (panX === 0 && panY === 0) {
    panX = canvas.width / 2 - 450;
    panY = canvas.height / 2 - 300;
  }
  drawMap();
}

// Draw full dynamic landscape, coordinates, and pins
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  // 1. Draw Map Style Specific Backgrounds & Terrain Grids
  drawTerrain();

  // 2. Draw Vector Roads
  drawRoads();

  // 3. Draw Active glowing Route under the pins
  if (activeRoute) {
    drawRoutePath();
  }

  // 4. Draw Traffic Elements if enabled
  if (simulateTraffic) {
    drawTraffic();
  }

  // 5. Draw Waypoint Nodes / Pins
  drawWaypoints();

  // 6. Draw Weather Overlays (Rendered relative to view)
  ctx.restore();

  if (simulateWeather) {
    drawWeather();
  }

  // Update telemetry details
  updateTelemetry();
}

// Renders stylistic grids, rivers, and areas based on current theme
function drawTerrain() {
  // Grid Size
  const gridSize = 80;
  const totalWidth = 1400;
  const totalHeight = 900;

  // Map boundary block
  if (mapStyle === "cyber") {
    ctx.fillStyle = "#050811";
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    // Cyan/Purple grids
    ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= totalWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, totalHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= totalHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(totalWidth, y);
      ctx.stroke();
    }
    
    // Draw Simulated Cyber River (Glowing dark blue channel)
    ctx.beginPath();
    ctx.moveTo(-50, 450);
    ctx.bezierCurveTo(400, 420, 500, 680, 1450, 600);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
    ctx.lineWidth = 45;
    ctx.stroke();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
    ctx.lineWidth = 70;
    ctx.stroke();

  } else if (mapStyle === "blueprint") {
    ctx.fillStyle = "#021636";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Fine blueprints ticks
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= totalWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, totalHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= totalHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(totalWidth, y);
      ctx.stroke();
    }
    
    // Blueprint Technical circular targets
    ctx.beginPath();
    ctx.arc(400, 300, 250, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
    ctx.lineWidth = 2;
    ctx.stroke();

  } else {
    // TOPO GRAY theme
    ctx.fillStyle = "#151518";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Topographical rings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= 6; i++) {
      ctx.beginPath();
      ctx.arc(400, 300, i * 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(800, 250, i * 75, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Border contour
  ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, totalWidth, totalHeight);
}

// Draw structural connector lanes
function drawRoads() {
  ctx.save();
  roads.forEach(road => {
    const fromNode = waypoints.find(w => w.id === road.from);
    const toNode = waypoints.find(w => w.id === road.to);
    if (fromNode && toNode) {
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      if (mapStyle === "cyber") {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mapStyle === "blueprint") {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  });
  ctx.restore();
}

// Highlight calculated active path
function drawRoutePath() {
  const fromNode = waypoints.find(w => w.id === activeRoute.from);
  const toNode = waypoints.find(w => w.id === activeRoute.to);
  if (fromNode && toNode) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    
    // Glowing neon purple path
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Fine glowing center line
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.stroke();

    ctx.restore();
  }
}

// Draw little dynamic simulated traffic signals
function drawTraffic() {
  trafficTick += 0.005;
  ctx.save();
  roads.forEach(road => {
    const fromNode = waypoints.find(w => w.id === road.from);
    const toNode = waypoints.find(w => w.id === road.to);
    if (fromNode && toNode) {
      // Interpolate positions over time
      const steps = 3;
      for (let i = 1; i <= steps; i++) {
        const offset = (trafficTick + (i / steps)) % 1.0;
        const tx = fromNode.x + (toNode.x - fromNode.x) * offset;
        const ty = fromNode.y + (toNode.y - fromNode.y) * offset;

        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fillStyle = (i % 2 === 0) ? "#e11d48" : "#fbbf24"; // alternating red & yellow vehicles
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }
  });
  ctx.restore();
}

// Beautiful pins rendering with text and icon
function drawWaypoints() {
  ctx.save();
  waypoints.forEach(wp => {
    // Check if matches filter
    if (searchFilter && !wp.name.toLowerCase().includes(searchFilter.toLowerCase())) {
      ctx.globalAlpha = 0.25; // Dim filtered items
    } else {
      ctx.globalAlpha = 1.0;
    }

    const radius = 15;
    
    // Outer soft glow ring
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.fill();

    // Core Anchor Pin Color based on category
    let color = "#6366f1"; // default indigo
    if (wp.cat === "danger") color = "#f43f5e";
    if (wp.cat === "port") color = "#06b6d4";
    if (wp.cat === "outpost") color = "#10b981";

    // Draw pin container
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Text Icon inside
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(wp.categoryIcon || "📍", wp.x, wp.y);

    // Floating Label Text below
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText(wp.name, wp.x, wp.y + 28);
    
    // Subtext coordinates
    ctx.font = "9px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`X:${Math.round(wp.x)} Y:${Math.round(wp.y)}`, wp.x, wp.y + 39);
  });
  ctx.restore();
}

// Full canvas weather animation
function drawWeather() {
  weatherTick += 1;
  ctx.save();
  ctx.strokeStyle = "rgba(186, 230, 253, 0.2)";
  ctx.lineWidth = 1.5;
  
  // Draw diagonal rain lines
  for (let i = 0; i < canvas.width; i += 50) {
    const yStart = (weatherTick * 4 + i) % canvas.height;
    ctx.beginPath();
    ctx.moveTo(i + (yStart * 0.2), yStart);
    ctx.lineTo(i + (yStart * 0.2) + 10, yStart + 25);
    ctx.stroke();
  }
  ctx.restore();
}

// Redraw and update dynamic side panel lists
function updateWaypointList() {
  const container = document.getElementById("waypoint-list");
  const filtered = waypoints.filter(wp => 
    wp.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
        No waypoints match "${searchFilter}"
      </div>
    `;
    return;
  }

  filtered.forEach(wp => {
    const div = document.createElement("div");
    div.className = "group p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all flex items-center justify-between cursor-pointer";
    div.setAttribute("data-id", wp.id);
    
    // Category color tag
    let catBorder = "border-indigo-500/30";
    if (wp.cat === "danger") catBorder = "border-rose-500/30";
    if (wp.cat === "port") catBorder = "border-cyan-500/30";
    if (wp.cat === "outpost") catBorder = "border-emerald-500/30";

    div.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        <span class="p-1 bg-slate-900 border ${catBorder} rounded-lg text-sm shrink-0">${wp.categoryIcon || "📍"}</span>
        <div class="truncate">
          <p class="font-medium text-slate-200 truncate group-hover:text-white transition-colors">${wp.name}</p>
          <p class="text-[10px] text-slate-500 truncate">${wp.desc || "No extra coordinates telemetry"}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0 ml-2">
        <button class="btn-delete-wp p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all" title="Delete Marker">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;

    // Click to fly map focus
    div.addEventListener("click", (e) => {
      if (e.target.closest(".btn-delete-wp")) return;
      flyToWaypoint(wp);
    });

    // Wire delete button
    div.querySelector(".btn-delete-wp").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteWaypoint(wp.id);
    });

    container.appendChild(div);
  });

  // Update Select Menus for Routing dropdowns
  populateRouteSelects();
}

// Populates Route origin and destination menus
function populateRouteSelects() {
  const originSelect = document.getElementById("route-origin");
  const destSelect = document.getElementById("route-destination");
  
  const prevOrigin = originSelect.value;
  const prevDest = destSelect.value;

  originSelect.innerHTML = "";
  destSelect.innerHTML = "";

  waypoints.forEach(wp => {
    const opt1 = document.createElement("option");
    opt1.value = wp.id;
    opt1.textContent = `${wp.categoryIcon || "📍"} ${wp.name}`;
    originSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = wp.id;
    opt2.textContent = `${wp.categoryIcon || "📍"} ${wp.name}`;
    destSelect.appendChild(opt2);
  });

  // Restore previous selections if valid
  if (waypoints.some(w => w.id === prevOrigin)) originSelect.value = prevOrigin;
  else if (waypoints.length > 0) originSelect.value = waypoints[0].id;

  if (waypoints.some(w => w.id === prevDest)) destSelect.value = prevDest;
  else if (waypoints.length > 1) destSelect.value = waypoints[1].id;
}

// Deletes selected custom marker node
function deleteWaypoint(id) {
  waypoints = waypoints.filter(wp => wp.id !== id);
  if (activeRoute && (activeRoute.from === id || activeRoute.to === id)) {
    activeRoute = null;
    document.getElementById("route-details-panel").classList.add("hidden");
  }
  updateWaypointList();
  drawMap();
  logTerminal(`Waypoint [${id}] removed successfully.`);
}

// Center view and zoom to clicked pin
function flyToWaypoint(wp) {
  zoom = 1.25;
  panX = canvas.width / 2 - wp.x * zoom;
  panY = canvas.height / 2 - wp.y * zoom;
  drawMap();
  logTerminal(`Telemetry shifted focus to node: ${wp.name} [X: ${Math.round(wp.x)}, Y: ${Math.round(wp.y)}]`);
}

// Custom terminal output logger
function logTerminal(message) {
  document.getElementById("terminal-status").textContent = `Status: ${message}`;
}

// Update live bottom panel coordinates
function updateTelemetry() {
  const centerX = Math.round((canvas.width / 2 - panX) / zoom);
  const centerY = Math.round((canvas.height / 2 - panY) / zoom);
  document.getElementById("coord-tracker").textContent = `X: ${centerX}, Y: ${centerY}`;
  document.getElementById("zoom-tracker").textContent = `${zoom.toFixed(2)}x`;
  document.getElementById("telemetry-waypoint-count").textContent = `${waypoints.length} Active Points`;
}

// Setup Mouse Drag Map Pan Events
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startDragX = e.clientX - panX;
  startDragY = e.clientY - panY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    panX = e.clientX - startDragX;
    panY = e.clientY - startDragY;
    drawMap();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

// Double-Click anywhere on the map grid to request custom pin creation modal
canvas.addEventListener("dblclick", (e) => {
  // Calculate true map relative coordinates
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  currentModalCoords.x = Math.round((clickX - panX) / zoom);
  currentModalCoords.y = Math.round((clickY - panY) / zoom);

  document.getElementById("new-wp-x").textContent = currentModalCoords.x;
  document.getElementById("new-wp-y").textContent = currentModalCoords.y;
  document.getElementById("new-wp-title").value = "";
  
  // Show Modal
  document.getElementById("add-waypoint-modal").classList.remove("hidden");
});

// Mouse scroll wheel to zoom map relative to center
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomFactor = 1.1;
  if (e.deltaY < 0) {
    // Zoom In
    if (zoom < 3.0) zoom *= zoomFactor;
  } else {
    // Zoom Out
    if (zoom > 0.4) zoom /= zoomFactor;
  }
  drawMap();
}, { passive: false });

// Zoom Controls button wiring
document.getElementById("btn-zoom-in").addEventListener("click", () => {
  if (zoom < 3.0) zoom *= 1.2;
  drawMap();
});

document.getElementById("btn-zoom-out").addEventListener("click", () => {
  if (zoom > 0.4) zoom /= 1.2;
  drawMap();
});

document.getElementById("btn-zoom-reset").addEventListener("click", () => {
  zoom = 1.0;
  panX = canvas.width / 2 - 450;
  panY = canvas.height / 2 - 300;
  drawMap();
});

// Theme Layer Swapping Logic
function selectTheme(style) {
  mapStyle = style;
  
  // Clear active style buttons
  const buttons = ["layer-cyber", "layer-blueprint", "layer-topo"];
  buttons.forEach(bId => {
    const btn = document.getElementById(bId);
    btn.className = "px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all";
  });

  // Highlight selected button
  const selectedBtn = document.getElementById(`layer-${style}`);
  selectedBtn.className = "px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-lg bg-indigo-600 text-white transition-all";

  // Change label
  const labels = {
    cyber: "Cyberpunk Cyber-Grid",
    blueprint: "Architectural Blueprint",
    topo: "Topographical Outlands"
  };
  document.getElementById("telemetry-style-label").textContent = labels[style] || style;
  
  drawMap();
  logTerminal(`Map overlay visual skin toggled to ${labels[style]}`);
}

document.getElementById("layer-cyber").addEventListener("click", () => selectTheme("cyber"));
document.getElementById("layer-blueprint").addEventListener("click", () => selectTheme("blueprint"));
document.getElementById("layer-topo").addEventListener("click", () => selectTheme("topo"));

// Modal category buttons handler
const catButtons = document.querySelectorAll(".cat-btn");
catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Reset all others to default slate
    catButtons.forEach(b => {
      b.className = "cat-btn py-1.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold text-center hover:bg-slate-700 hover:text-slate-200";
    });
    // Highlight current
    btn.className = "cat-btn py-1.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 text-[10px] font-semibold text-center hover:bg-indigo-600/50";
    selectedCategory = btn.getAttribute("data-cat");
  });
});

// Save New Custom Waypoint Action
document.getElementById("btn-save-waypoint").addEventListener("click", () => {
  const titleInput = document.getElementById("new-wp-title").value.trim();
  const finalTitle = titleInput || `Sector Delta-${Math.floor(Math.random() * 900) + 100}`;

  // Pick icon based on category
  let icon = "📍";
  if (selectedCategory === "landmark") icon = "🏛";
  if (selectedCategory === "port") icon = "⚓";
  if (selectedCategory === "danger") icon = "⚡";
  if (selectedCategory === "outpost") icon = "⛺";

  const newId = "wp" + (Date.now());
  const newPoint = {
    id: newId,
    name: finalTitle,
    x: currentModalCoords.x,
    y: currentModalCoords.y,
    cat: selectedCategory,
    desc: `User deployed node at [${currentModalCoords.x}, ${currentModalCoords.y}]`,
    categoryIcon: icon
  };

  waypoints.push(newPoint);
  
  // Connect dynamically to nearest existing waypoint to ensure a valid route option
  let nearestWp = null;
  let minDist = Infinity;
  waypoints.forEach(wp => {
    if (wp.id === newId) return;
    const dist = Math.hypot(wp.x - newPoint.x, wp.y - newPoint.y);
    if (dist < minDist) {
      minDist = dist;
      nearestWp = wp.id;
    }
  });
  if (nearestWp) {
    roads.push({ from: newId, to: nearestWp });
  }

  document.getElementById("add-waypoint-modal").classList.add("hidden");
  updateWaypointList();
  drawMap();
  logTerminal(`Successfully deployed brand new custom marker: "${finalTitle}"`);
});

// Cancel modal interactions
const closeModal = () => {
  document.getElementById("add-waypoint-modal").classList.add("hidden");
};
document.getElementById("btn-cancel-modal").addEventListener("click", closeModal);
document.getElementById("btn-close-modal").addEventListener("click", closeModal);

// Calculate Route Interaction
document.getElementById("btn-calculate-route").addEventListener("click", () => {
  const originId = document.getElementById("route-origin").value;
  const destId = document.getElementById("route-destination").value;

  if (originId === destId) {
    logTerminal("Warning: Origin and Destination must be distinct waypoints!");
    alert("Please select two distinct waypoints to calculate route.");
    return;
  }

  const fromNode = waypoints.find(w => w.id === originId);
  const toNode = waypoints.find(w => w.id === destId);

  if (fromNode && toNode) {
    activeRoute = { from: originId, to: destId };
    
    // Calculate distance mathematically
    const pxDistance = Math.round(Math.hypot(fromNode.x - toNode.x, fromNode.y - toNode.y));
    const travelTime = Math.round(pxDistance * 0.45 + (simulateTraffic ? 12 : 0));
    
    // Render calculated analytics to sidebar panels
    document.getElementById("route-time").textContent = `${travelTime} mins`;
    document.getElementById("route-distance").textContent = `${pxDistance} km`;
    document.getElementById("route-delay").textContent = simulateTraffic ? "Moderate congestion delay (+12m)" : "Optimized path green";
    
    const detailsPanel = document.getElementById("route-details-panel");
    detailsPanel.classList.remove("hidden");

    document.getElementById("telemetry-route-status").textContent = "Active Route Enroute";
    document.getElementById("telemetry-route-status").className = "font-medium text-pink-400";

    drawMap();
    logTerminal(`Optimal Route established between ${fromNode.name} and ${toNode.name}.`);
  }
});

// Clear Route Interaction
document.getElementById("btn-clear-route").addEventListener("click", () => {
  activeRoute = null;
  document.getElementById("route-details-panel").classList.add("hidden");
  document.getElementById("telemetry-route-status").textContent = "Ready";
  document.getElementById("telemetry-route-status").className = "font-medium text-emerald-400";
  drawMap();
  logTerminal("Active route cleared.");
});

// Simulate Traffic Toggle
document.getElementById("btn-toggle-traffic").addEventListener("click", () => {
  simulateTraffic = !simulateTraffic;
  const btn = document.getElementById("btn-toggle-traffic");
  if (simulateTraffic) {
    btn.className = "px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-900/40 hover:text-indigo-300 border border-slate-700 transition-all flex items-center gap-1.5";
    logTerminal("Traffic simulations initialized.");
  } else {
    btn.className = "px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-500 border border-slate-800 transition-all flex items-center gap-1.5 opacity-60";
    logTerminal("Traffic simulations disabled.");
  }
  drawMap();
});

// Weather Overlay Toggle
document.getElementById("btn-toggle-weather").addEventListener("click", () => {
  simulateWeather = !simulateWeather;
  const btn = document.getElementById("btn-toggle-weather");
  const indicator = document.getElementById("weather-indicator");
  if (simulateWeather) {
    btn.className = "px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5";
    indicator.textContent = "⛈";
    logTerminal("Atmospheric weather telemetry overlay rendered live.");
  } else {
    btn.className = "px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-900/40 hover:text-indigo-300 border border-slate-700 transition-all flex items-center gap-1.5";
    indicator.textContent = "☀️";
    logTerminal("Weather overlay turned off.");
  }
  drawMap();
});

// Dynamic Search Filter logic
document.getElementById("search-places").addEventListener("input", (e) => {
  searchFilter = e.target.value;
  updateWaypointList();
  drawMap();
});

// Real-time animation loop for traffic movements & rain
function animate() {
  if (simulateTraffic || simulateWeather) {
    drawMap();
  }
  requestAnimationFrame(animate);
}

// Initiate System
window.addEventListener("resize", resizeCanvas);
setTimeout(() => {
  resizeCanvas();
  updateWaypointList();
  animate();
}, 100);