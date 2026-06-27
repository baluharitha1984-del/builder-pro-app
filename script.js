document.addEventListener('DOMContentLoaded', () => {
  // --- DATA SEED: CURATED VEGETABLE LIST ---
  const vegetables = [
    {
      id: 'carrot',
      name: 'Carrot',
      emoji: '🥕',
      type: 'root',
      calories: '41 kcal',
      water: '88%',
      fiber: '2.8g',
      sunlight: 'Full to partial sun (5-6 hours)',
      growDays: 12,
      wateringTips: 'Water deeply once a week, prevent soil from crusting on top.',
      companion: 'Sow next to Rosemary and Chives to naturally deter carrot rust flies.',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'tomato',
      name: 'Tomato',
      emoji: '🍅',
      type: 'fruiting',
      calories: '18 kcal',
      water: '94%',
      fiber: '1.2g',
      sunlight: 'Intense direct sunlight (7-8 hours)',
      growDays: 18,
      wateringTips: 'Water consistently at base level. Avoid splashing the foliage.',
      companion: 'Marigolds and Basil companion planting improves taste and repels thrips.',
      color: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'spinach',
      name: 'Spinach',
      emoji: '🥬',
      type: 'leafy',
      calories: '23 kcal',
      water: '91%',
      fiber: '2.2g',
      sunlight: 'Partial shade or filtered sun',
      growDays: 8,
      wateringTips: 'Enjoys consistently damp, well-draining soil. Do not overwater.',
      companion: 'Companion plant with Strawberries or Radishes for excellent space usage.',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      emoji: '🥦',
      type: 'brassica',
      calories: '34 kcal',
      water: '89%',
      fiber: '2.6g',
      sunlight: 'Full Sun (6+ hours)',
      growDays: 20,
      wateringTips: 'Needs heavy moisture. Mulch well to suppress weeds and cool the roots.',
      companion: 'Plant beside Dill or Mint. Avoid nightshades like tomatoes near broccoli.',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      emoji: '🥒',
      type: 'fruiting',
      calories: '15 kcal',
      water: '95%',
      fiber: '0.5g',
      sunlight: 'Full warm sun (6-8 hours)',
      growDays: 14,
      wateringTips: 'Keep soil moist. Dry spells can cause bitter tasting fruit.',
      companion: 'Sunflowers serve as great natural support trellises for climbing cucumbers.',
      color: 'bg-teal-100 text-teal-800 border-teal-200'
    },
    {
      id: 'eggplant',
      name: 'Eggplant',
      emoji: '🍆',
      type: 'fruiting',
      calories: '25 kcal',
      water: '92%',
      fiber: '3.0g',
      sunlight: 'Extremely hot full sun (8 hours)',
      growDays: 22,
      wateringTips: 'Requires rich composted soil and deep uniform watering schedule.',
      companion: 'French beans ward off potato beetles; plant them nearby.',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  // --- GARDEN PLOT INITIAL STATE ---
  // We define 8 digital garden slots
  let gardenSlots = [
    { id: 1, planted: null, progress: 0, watered: true, ready: false },
    { id: 2, planted: null, progress: 0, watered: true, ready: false },
    { id: 3, planted: null, progress: 0, watered: true, ready: false },
    { id: 4, planted: null, progress: 0, watered: true, ready: false },
    { id: 5, planted: null, progress: 0, watered: true, ready: false },
    { id: 6, planted: null, progress: 0, watered: true, ready: false },
    { id: 7, planted: null, progress: 0, watered: true, ready: false },
    { id: 8, planted: null, progress: 0, watered: true, ready: false }
  ];

  // --- TASKS INITIAL STATE ---
  let tasks = [
    { id: 1, text: 'Order Organic Seed Starter Kits', completed: true },
    { id: 2, text: 'Clear weeds and compost Bed A', completed: false },
    { id: 3, text: 'Check pH balance of cucumber soil', completed: false }
  ];

  let selectedSeedId = 'carrot'; // default brush
  let statsHarvestedCount = 0;
  let activeCategoryFilter = 'all';

  // --- DOM SELECTORS ---
  const seedSelectorGrid = document.getElementById('seed-selector-grid');
  const activeSeedBadge = document.getElementById('active-seed-badge');
  const gardenGridContainer = document.getElementById('garden-grid-container');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogTabsContainer = document.getElementById('catalog-tabs-container');
  const catalogSearchInput = document.getElementById('catalog-search');
  const btnWaterAll = document.getElementById('btn-water-all');
  const btnClearGarden = document.getElementById('btn-clear-garden');
  
  // Recipe elements
  const recipeChecklistContainer = document.getElementById('recipe-ingredient-checklist');
  const btnSuggestRecipes = document.getElementById('btn-suggest-recipes');
  const recipeResultsBox = document.getElementById('recipe-results-box');
  const recipeTitle = document.getElementById('recipe-title');
  const recipeDesc = document.getElementById('recipe-desc');

  // Tasks element
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const btnClearCompleted = document.getElementById('btn-clear-completed');

  // Stats element
  const statsHarvested = document.getElementById('stats-harvested');
  const statsPlanted = document.getElementById('stats-planted');
  const statsTasks = document.getElementById('stats-tasks');

  // Modal elements
  const veggieModal = document.getElementById('veggie-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalCloseConfirm = document.getElementById('btn-modal-close-confirm');
  const modalEmojiContainer = document.getElementById('modal-emoji-container');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalStatWater = document.getElementById('modal-stat-water');
  const modalStatCalories = document.getElementById('modal-stat-calories');
  const modalStatFiber = document.getElementById('modal-stat-fiber');
  const modalSunlight = document.getElementById('modal-sunlight');
  const modalTime = document.getElementById('modal-time');
  const modalWateringAdvice = document.getElementById('modal-watering-advice');
  const modalCompanionTip = document.getElementById('modal-companion-tip');

  // --- APP INITIALIZER ---
  function init() {
    renderSeedSelector();
    renderGardenGrid();
    renderCatalog();
    renderRecipeChecklist();
    renderTasks();
    updateGlobalCounters();

    // Start simulated grow ticker
    setInterval(simulateGrowthTick, 1000);
  }

  // --- RENDER SEED SELECTOR --- 
  function renderSeedSelector() {
    seedSelectorGrid.innerHTML = '';
    vegetables.forEach(veg => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `flex items-center gap-2 p-3 rounded-xl border transition-all text-left text-xs font-semibold ${
        selectedSeedId === veg.id 
          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
      }`;
      
      btn.innerHTML = `
        <span class="text-xl">${veg.emoji}</span>
        <div>
          <span class="block">${veg.name}</span>
          <span class="text-[10px] text-slate-400 font-normal">${veg.growDays}s grow</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        selectedSeedId = veg.id;
        activeSeedBadge.textContent = `${veg.emoji} ${veg.name}`;
        renderSeedSelector();
      });

      seedSelectorGrid.appendChild(btn);
    });
    
    // Update Active Badge Initially
    const activeVeg = vegetables.find(v => v.id === selectedSeedId);
    if (activeVeg) {
      activeSeedBadge.innerHTML = `<span class="inline-block mr-1">${activeVeg.emoji}</span> ${activeVeg.name}`;
    }
  }

  // --- RENDER GARDEN GRID ---
  function renderGardenGrid() {
    gardenGridContainer.innerHTML = '';
    gardenSlots.forEach(slot => {
      const card = document.createElement('div');
      card.className = `p-4 rounded-xl border flex flex-col justify-between items-center text-center transition-all bg-white relative cursor-pointer min-h-[140px] ${
        slot.ready ? 'ready-to-harvest border-emerald-400' : 'border-slate-200 hover:border-emerald-300'
      }`;

      // Click action depending on whether slot is empty, growing, or ready
      card.addEventListener('click', () => {
        handleGardenSlotClick(slot);
      });

      if (!slot.planted) {
        // Empty soil slot view
        card.innerHTML = `
          <div class="my-auto flex flex-col items-center">
            <span class="text-2xl opacity-60 filter grayscale hover:grayscale-0 transition-all">🟫</span>
            <span class="text-[10px] text-slate-400 mt-1 font-semibold">Sow Seed</span>
          </div>
          <div class="absolute bottom-2 left-2 right-2 text-[9px] text-slate-300">Empty Patch</div>
        `;
      } else {
        // Planted active view
        const veg = vegetables.find(v => v.id === slot.planted);
        const percent = Math.min(100, Math.round((slot.progress / veg.growDays) * 100));
        const isDry = !slot.watered;

        card.innerHTML = `
          <div class="flex flex-col items-center w-full">
            <span class="text-3xl animate-bounce">${slot.ready ? veg.emoji : '🌱'}</span>
            <span class="text-xs font-bold text-slate-800 mt-1">${veg.name}</span>
            <span class="text-[10px] text-slate-400">${slot.ready ? 'Ripe! Tap to reap' : `Growing ${percent}%`}</span>
          </div>

          <!-- Progress Bar or Harvest Button -->
          <div class="w-full mt-2">
            ${slot.ready 
              ? `<button class="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm uppercase tracking-wide">Harvest</button>`
              : `
                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full progress-fill" style="width: ${percent}%"></div>
                </div>
                <div class="flex justify-between items-center mt-1 text-[9px]">
                  <span class="${isDry ? 'text-amber-600 font-bold' : 'text-slate-400'}">${isDry ? '⚠️ Dry soil' : '💧 Hydrated'}</span>
                  <button class="water-single-btn text-[9px] text-sky-600 hover:underline font-semibold" data-id="${slot.id}">Water</button>
                </div>
              `}
          </div>
        `;

        // Bind individual watering button click safely
        const waterBtn = card.querySelector('.water-single-btn');
        if (waterBtn) {
          waterBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent planting brush on top of active crop
            slot.watered = true;
            renderGardenGrid();
          });
        }
      }

      gardenGridContainer.appendChild(card);
    });
  }

  // --- HANDLE GARDEN SLOT CLICK ---
  function handleGardenSlotClick(slot) {
    if (!slot.planted) {
      // Plant selected crop brush
      if (!selectedSeedId) {
        alert('Please choose a seed first from the selector.');
        return;
      }
      slot.planted = selectedSeedId;
      slot.progress = 0;
      slot.watered = true;
      slot.ready = false;
    } else {
      // If it is ready, harvest it!
      if (slot.ready) {
        const veg = vegetables.find(v => v.id === slot.planted);
        statsHarvestedCount += 1;
        
        // Flash custom dynamic celebration or log
        createToast(`🎉 Successfully harvested ripe ${veg.name}! (+1 score)`);
        
        // Reset slot
        slot.planted = null;
        slot.progress = 0;
        slot.watered = true;
        slot.ready = false;
      } else {
        // Just a nudge that it's growing
        const veg = vegetables.find(v => v.id === slot.planted);
        createToast(`⏳ This ${veg.name} is still developing. Ensure it stays watered!`);
      }
    }
    renderGardenGrid();
    updateGlobalCounters();
  }

  // --- SIMULATED REAL-TIME GROW TICK --- 
  function simulateGrowthTick() {
    let updated = false;
    gardenSlots.forEach(slot => {
      if (slot.planted && !slot.ready) {
        const veg = vegetables.find(v => v.id === slot.planted);
        
        // Crops grow if hydrated. If dry, growth rate is halved
        const growMultiplier = slot.watered ? 1.0 : 0.4;
        slot.progress += growMultiplier;

        // Chance to dry out the soil randomly each tick
        if (Math.random() < 0.15) {
          slot.watered = false;
        }

        if (slot.progress >= veg.growDays) {
          slot.ready = true;
        }
        updated = true;
      }
    });
    if (updated) {
      renderGardenGrid();
      updateGlobalCounters();
    }
  }

  // --- RENDER VEGETABLES CATALOG WIKI ---
  function renderCatalog() {
    catalogGrid.innerHTML = '';
    const searchVal = catalogSearchInput.value.toLowerCase().trim();

    const filtered = vegetables.filter(veg => {
      const matchesSearch = veg.name.toLowerCase().includes(searchVal) || veg.type.toLowerCase().includes(searchVal);
      const matchesCategory = activeCategoryFilter === 'all' || veg.type === activeCategoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="col-span-full text-center py-8 text-slate-400 text-xs">
          No catalog matches found. Try another search terms!
        </div>
      `;
      return;
    }

    filtered.forEach(veg => {
      const card = document.createElement('div');
      card.className = `p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white transition-all shadow-xs flex justify-between items-start gap-3 hover:shadow-sm`;
      
      card.innerHTML = `
        <div class="flex gap-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${veg.color.split(' ')[0]} border ${veg.color.split(' ')[2]}">
            ${veg.emoji}
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              ${veg.name}
              <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1.5 py-0.5 bg-slate-100 rounded">
                ${veg.type}
              </span>
            </h3>
            <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${veg.wateringTips}</p>
            <span class="text-[10px] text-emerald-700 font-medium block mt-1.5">💡 Companion: ${veg.name === 'Carrot' ? 'Rosemary & Chives' : 'Basil / Marigold'}</span>
          </div>
        </div>
        <button class="btn-view-details text-xs bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-200 shrink-0 transition-all" data-id="${veg.id}">
          Details
        </button>
      `;

      // Event details
      card.querySelector('.btn-view-details').addEventListener('click', () => {
        openVeggieModal(veg);
      });

      catalogGrid.appendChild(card);
    });
  }

  // --- MODAL ACTION FUNCTIONS ---
  function openVeggieModal(veg) {
    modalEmojiContainer.innerHTML = veg.emoji;
    modalTitle.textContent = veg.name;
    modalCategory.textContent = veg.type.toUpperCase();
    modalStatWater.textContent = veg.water;
    modalStatCalories.textContent = veg.calories;
    modalStatFiber.textContent = veg.fiber;
    modalSunlight.textContent = veg.sunlight;
    modalTime.textContent = veg.growDays;
    modalWateringAdvice.textContent = veg.wateringTips;
    modalCompanionTip.textContent = veg.companion;

    veggieModal.classList.remove('hidden');
  }

  function closeModal() {
    veggieModal.classList.add('hidden');
  }

  btnCloseModal.addEventListener('click', closeModal);
  btnModalCloseConfirm.addEventListener('click', closeModal);
  veggieModal.addEventListener('click', (e) => {
    if (e.target === veggieModal) closeModal();
  });

  // --- RENDER RECIPE INGREDIENTS CHECKLIST ---
  function renderRecipeChecklist() {
    recipeChecklistContainer.innerHTML = '';
    vegetables.forEach(veg => {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-all border border-slate-200 text-xs text-slate-700';
      
      label.innerHTML = `
        <input type="checkbox" value="${veg.id}" class="recipe-checkbox rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
        <span class="text-sm">${veg.emoji}</span>
        <span class="font-medium">${veg.name}</span>
      `;

      recipeChecklistContainer.appendChild(label);
    });
  }

  // --- GENERATE Dynamic Recipe ideas based on checkboxes ---
  btnSuggestRecipes.addEventListener('click', () => {
    const checkedCheckboxes = document.querySelectorAll('.recipe-checkbox:checked');
    const selectedIds = Array.from(checkedCheckboxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
      recipeResultsBox.classList.remove('hidden');
      recipeTitle.textContent = 'Simple Herb Water & Broth';
      recipeDesc.textContent = 'Select one or more garden vegetables above to craft a culinary masterpiece filled with wholesome dietary fibers!';
      return;
    }

    const matchedNames = selectedIds.map(id => {
      const v = vegetables.find(veg => veg.id === id);
      return v ? v.name : '';
    });

    recipeResultsBox.classList.remove('hidden');
    
    if (selectedIds.length === 1) {
      const singleName = matchedNames[0];
      recipeTitle.textContent = `Roasted Garden ${singleName}`;
      recipeDesc.textContent = `Lightly toss sliced ${singleName} with extra virgin olive oil, pink salt, coarse pepper, and rosemary. Roast at 400°F (200°C) until tender and caramelized.`;
    } else if (selectedIds.length === 2) {
      recipeTitle.textContent = `${matchedNames[0]} & ${matchedNames[1]} Duo Medley`;
      recipeDesc.textContent = `Sauté premium chopped ${matchedNames[0]} alongside robust ${matchedNames[1]} in grass-fed butter or coconut oil. Garnish with sesame seeds, freshly chopped green onions, and lemon juice.`;
    } else {
      recipeTitle.textContent = 'Ultimate Veggie-Gro Harvest Soup';
      recipeDesc.textContent = `Boil a flavorful stock and toss in diced ${matchedNames.slice(0, -1).join(', ')}, and ${matchedNames[matchedNames.length - 1]}. Simmer with garlic, bay leaf, and cracked black peppercorn for 25 mins. Rich in plant vitamins!`;
    }
  });

  // --- RENDER TASKS LOG ---
  function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `flex justify-between items-center p-3 rounded-xl border text-xs transition-all ${ 
        task.completed 
          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
      }`;

      li.innerHTML = `
        <div class="flex items-center gap-3 flex-1 cursor-pointer" id="task-toggle-${task.id}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500" />
          <span class="font-medium">${task.text}</span>
        </div>
        <button class="text-rose-500 hover:text-rose-700 font-bold px-2" id="task-del-${task.id}">✕</button>
      `;

      // Bind Toggle Complete
      li.querySelector(`#task-toggle-${task.id}`).addEventListener('click', () => {
        task.completed = !task.completed;
        renderTasks();
        updateGlobalCounters();
      });

      // Bind Delete
      li.querySelector(`#task-del-${task.id}`).addEventListener('click', (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
        updateGlobalCounters();
      });

      todoList.appendChild(li);
    });
  }

  // --- ADD TASK --- 
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    tasks.push(newTask);
    todoInput.value = '';
    renderTasks();
    updateGlobalCounters();
    createToast(`📋 Task Added: "${text}"`);
  });

  // --- CLEAR COMPLETED TASKS ---
  btnClearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
    updateGlobalCounters();
  });

  // --- GLOBAL COUNTERS & STATS ---
  function updateGlobalCounters() {
    statsHarvested.textContent = statsHarvestedCount;
    
    const plantedCount = gardenSlots.filter(s => s.planted !== null).length;
    statsPlanted.textContent = plantedCount;
    
    const activeTasks = tasks.filter(t => !t.completed).length;
    statsTasks.textContent = activeTasks;
  }

  // --- WATER ALL GARDEN CROPS ---
  btnWaterAll.addEventListener('click', () => {
    gardenSlots.forEach(slot => {
      if (slot.planted) {
        slot.watered = true;
      }
    });
    renderGardenGrid();
    createToast('🌊 Garden watered! All active vegetables are hydrated.');
  });

  // --- CLEAR/RESET GARDEN ---
  btnClearGarden.addEventListener('click', () => {
    if (confirm('Are you sure you want to pull out all sowed vegetables and clear the plot?')) {
      gardenSlots.forEach(slot => {
        slot.planted = null;
        slot.progress = 0;
        slot.watered = true;
        slot.ready = false;
      });
      renderGardenGrid();
      updateGlobalCounters();
      createToast('🧹 Garden cleared and prepared for fresh compost.');
    }
  });

  // --- CATALOG TABS & FILTER HANDLERS ---
  catalogTabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.catalog-tab-btn');
    if (!btn) return;

    // Remove active style from all
    document.querySelectorAll('.catalog-tab-btn').forEach(b => {
      b.className = 'catalog-tab-btn text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs px-3 py-1.5 rounded-lg transition-all font-medium';
    });

    // Set active
    btn.className = 'catalog-tab-btn active-tab';
    activeCategoryFilter = btn.dataset.category;
    renderCatalog();
  });

  catalogSearchInput.addEventListener('input', () => {
    renderCatalog();
  });

  // --- HELPER TOAST SYSTEM ---
  function createToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs py-3 px-4 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-slide-up';
    toast.innerHTML = `
      <span>🌿</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // RUN EVERYTHING
  init();
});