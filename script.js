(function () {
  // --- STATE --- 
  let tables = [];
  let activeTableId = null;
  let sortColumnId = null;
  let sortDirection = 'asc'; // 'asc' or 'desc'
  let searchQuery = '';
  let currentEditingRowId = null;

  // --- DEFAULT PRESET TEMPLATES ---
  const PRESET_TEMPLATES = {
    empty: {
      name: 'Custom Ledger',
      description: 'Your own custom grid with manual properties.',
      columns: [
        { id: 'col1', name: 'Title', type: 'text' },
        { id: 'col2', name: 'Quantity', type: 'number' },
        { id: 'col3', name: 'Status', type: 'status', options: ['To Do', 'Doing', 'Done'] }
      ],
      rows: [
        { id: 'row1', col1: 'Launch Feature A', col2: 12, col3: 'Doing' },
        { id: 'row2', col1: 'Refactor Auth DB', col2: 1, col3: 'To Do' }
      ]
    },
    project: {
      name: '🚀 Project Tracker',
      description: 'Milestones, operational priorities, schedules, and budgeting metrics.',
      columns: [
        { id: 'p1', name: 'Task Name', type: 'text' },
        { id: 'p2', name: 'Status', type: 'status', options: ['Backlog', 'Blocked', 'In Progress', 'Done'] },
        { id: 'p3', name: 'Priority', type: 'status', options: ['Low', 'Medium', 'High'] },
        { id: 'p4', name: 'Due Date', type: 'date' },
        { id: 'p5', name: 'Budget ($)', type: 'number' }
      ],
      rows: [
        { id: 'pr1', p1: 'Migrate server to AWS', p2: 'In Progress', p3: 'High', p4: '2025-10-12', p5: 3500 },
        { id: 'pr2', p1: 'Design system asset creation', p2: 'Done', p3: 'Medium', p4: '2025-05-18', p5: 1200 },
        { id: 'pr3', p1: 'Draft Q3 investor deck', p2: 'Backlog', p3: 'High', p4: '2025-08-30', p5: 500 },
        { id: 'pr4', p1: 'Conduct user survey tests', p2: 'Blocked', p3: 'Low', p4: '2025-04-01', p5: 850 }
      ]
    },
    inventory: {
      name: '📦 Product Inventory',
      description: 'Warehouse tracking with stock status limits and raw wholesale valuation.',
      columns: [
        { id: 'i1', name: 'Item Sku', type: 'text' },
        { id: 'i2', name: 'Category', type: 'text' },
        { id: 'i3', name: 'Stock Quantity', type: 'number' },
        { id: 'i4', name: 'Price/Unit', type: 'number' },
        { id: 'i5', name: 'Availablity', type: 'status', options: ['In Stock', 'Reorder soon', 'Discontinued'] }
      ],
      rows: [
        { id: 'inv1', i1: 'Quantum Laptop 15', i2: 'Electronics', i3: 140, i4: 1199, i5: 'In Stock' },
        { id: 'inv2', i1: 'Haptic Gaming Desk', i2: 'Furniture', i3: 8, i4: 499, i5: 'Reorder soon' },
        { id: 'inv3', i1: 'Type-C Smart Dock', i2: 'Accessories', i3: 650, i4: 89, i5: 'In Stock' },
        { id: 'inv4', i1: 'Vintage Stereo Deck', i2: 'Audio', i3: 0, i4: 250, i5: 'Discontinued' }
      ]
    },
    crm: {
      name: '👥 Leads & CRM',
      description: 'Sales deal pipeline, communication logs, and targeted close rates.',
      columns: [
        { id: 'c1', name: 'Contact Name', type: 'text' },
        { id: 'c2', name: 'Company', type: 'text' },
        { id: 'c3', name: 'Deal Valuation', type: 'number' },
        { id: 'c4', name: 'Phase Stage', type: 'status', options: ['Lead Discovery', 'Nurturing', 'Negotiation', 'Won', 'Lost'] },
        { id: 'c5', name: 'Last Met Date', type: 'date' }
      ],
      rows: [
        { id: 'crm1', c1: 'Alice Hawthorne', c2: 'Acme Corp', c3: 45000, c4: 'Negotiation', c5: '2025-02-14' },
        { id: 'crm2', c1: 'Bernard Sterling', c2: 'Symmetric Inc', c3: 125000, c4: 'Won', c5: '2025-01-28' },
        { id: 'crm3', c1: 'Catherine Zhao', c2: 'Apex Labs', c3: 8500, c4: 'Lead Discovery', c5: '2025-03-01' },
        { id: 'crm4', c1: 'Darnell Vance', c2: 'Vance Group', c3: 32000, c4: 'Lost', c5: '2025-01-05' }
      ]
    }
  };

  // --- LOCALSTORAGE & INITIAL STATE LOAD ---
  function loadState() {
    const saved = localStorage.getItem('tablify_database_v1');
    if (saved) {
      try {
        tables = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored tables state. Loading default values.', e);
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
    if (tables.length > 0) {
      activeTableId = tables[0].id;
    }
  }

  function saveState() {
    localStorage.setItem('tablify_database_v1', JSON.stringify(tables));
    updateSidebarStats();
  }

  function loadDefaults() {
    tables = [
      {
        id: 't-proj',
        name: PRESET_TEMPLATES.project.name,
        description: PRESET_TEMPLATES.project.description,
        columns: PRESET_TEMPLATES.project.columns,
        rows: PRESET_TEMPLATES.project.rows
      },
      {
        id: 't-inv',
        name: PRESET_TEMPLATES.inventory.name,
        description: PRESET_TEMPLATES.inventory.description,
        columns: PRESET_TEMPLATES.inventory.columns,
        rows: PRESET_TEMPLATES.inventory.rows
      },
      {
        id: 't-crm',
        name: PRESET_TEMPLATES.crm.name,
        description: PRESET_TEMPLATES.crm.description,
        columns: PRESET_TEMPLATES.crm.columns,
        rows: PRESET_TEMPLATES.crm.rows
      }
    ];
  }

  // --- ELEMENT SELECTORS ---
  const sidebarTablesList = document.getElementById('sidebar-tables-list');
  const activeTableTitle = document.getElementById('active-table-title');
  const activeTableDesc = document.getElementById('active-table-desc');
  const activeTableBadge = document.getElementById('active-table-badge');
  const sidebarTotalTables = document.getElementById('sidebar-total-tables');
  const sidebarTotalRows = document.getElementById('sidebar-total-rows');
  
  const tableHeaderRow = document.getElementById('table-header-row');
  const tableBody = document.getElementById('table-body');
  const emptyState = document.getElementById('empty-state');
  
  const inputSearch = document.getElementById('input-search');
  const selectedRowsCount = document.getElementById('selected-rows-count');
  const summaryStatsBox = document.getElementById('summary-stats-box');

  const btnOpenCreateTableModal = document.getElementById('btn-open-create-table-modal');
  const modalNewTable = document.getElementById('modal-new-table');
  const formCreateTable = document.getElementById('form-create-table');
  
  const btnOpenColumnModal = document.getElementById('btn-open-column-modal');
  const modalNewColumn = document.getElementById('modal-new-column');
  const formCreateColumn = document.getElementById('form-create-column');
  const inputColType = document.getElementById('input-col-type');
  const statusOptionsGroup = document.getElementById('status-options-group');

  const modalEditRow = document.getElementById('modal-edit-row');
  const formEditRow = document.getElementById('form-edit-row');
  const editRowFieldsContainer = document.getElementById('edit-row-fields-container');

  const btnAddRowDirect = document.getElementById('btn-add-row-direct');
  const btnEmptyAddRow = document.getElementById('btn-empty-add-row');
  const btnDeleteTable = document.getElementById('btn-delete-table');
  
  const btnExportDropdown = document.getElementById('btn-export-dropdown');
  const exportDropdownMenu = document.getElementById('export-dropdown-menu');
  const btnExportCSV = document.getElementById('btn-export-csv');
  const btnExportJSON = document.getElementById('btn-export-json');

  // --- APP CONTROLS & RENDER LOGIC ---

  function getActiveTable() {
    return tables.find(t => t.id === activeTableId) || null;
  }

  function renderApp() {
    renderSidebar();
    const table = getActiveTable();
    if (!table) {
      activeTableTitle.textContent = "No active workspace";
      activeTableDesc.textContent = "Create a new table from the left workspace sidebar to begin computing.";
      activeTableBadge.classList.add('hidden');
      tableHeaderRow.innerHTML = "";
      tableBody.innerHTML = "";
      emptyState.classList.remove('hidden');
      summaryStatsBox.innerHTML = "";
      selectedRowsCount.textContent = "0 rows";
      return;
    }

    activeTableBadge.classList.remove('hidden');
    activeTableTitle.textContent = table.name;
    activeTableDesc.textContent = table.description || "No description provided.";
    
    renderTableHeader(table);
    renderTableBody(table);
    renderStats(table);
    updateSidebarStats();
  }

  function renderSidebar() {
    sidebarTablesList.innerHTML = "";
    tables.forEach(table => {
      const isActive = table.id === activeTableId;
      const li = document.createElement('li');
      
      li.innerHTML = `
        <button class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'}">
          <span class="flex items-center gap-2.5 truncate">
            <span class="text-base group-hover:scale-110 transition-transform">${table.name.slice(0, 2).includes(' ') || /\p{Emoji}/u.test(table.name) ? table.name.split(' ')[0] : '📋'}</span>
            <span class="truncate">${table.name.slice(0, 2).includes(' ') || /\p{Emoji}/u.test(table.name) ? table.name.split(' ').slice(1).join(' ') : table.name}</span>
          </span>
          <span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-950/40 text-slate-500 group-hover:text-slate-300 transition-colors font-mono">
            ${table.rows.length}
          </span>
        </button>
      `;
      
      li.querySelector('button').addEventListener('click', () => {
        activeTableId = table.id;
        sortColumnId = null;
        searchQuery = '';
        inputSearch.value = '';
        renderApp();
      });
      
      sidebarTablesList.appendChild(li);
    });
  }

  function renderTableHeader(table) {
    tableHeaderRow.innerHTML = "";
    
    // Append empty spacer for row actions
    const actionTh = document.createElement('th');
    actionTh.className = "py-4 px-4 w-12 text-center text-xs font-semibold text-slate-400 tracking-wider bg-slate-900/40 border-b border-slate-800";
    actionTh.textContent = "#";
    tableHeaderRow.appendChild(actionTh);

    // Render defined columns
    table.columns.forEach(col => {
      const th = document.createElement('th');
      th.className = "py-4 px-5 text-xs font-semibold text-slate-300 uppercase tracking-wider bg-slate-900/40 border-b border-slate-800 hover:bg-slate-800/60 cursor-pointer transition-colors relative group";
      
      let iconType = "📝";
      if (col.type === 'number') iconType = "🔢";
      if (col.type === 'status') iconType = "🏷️";
      if (col.type === 'date') iconType = "📅";

      let sortArrow = "";
      if (sortColumnId === col.id) {
        sortArrow = sortDirection === 'asc' ? ' ▴' : ' ▾';
      }

      th.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-1.5 truncate">
            <span class="text-[10px] opacity-60">${iconType}</span>
            <span class="truncate">${col.name}</span>
            <span class="text-indigo-400 font-bold">${sortArrow}</span>
          </span>
          <button class="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-1 rounded transition-opacity btn-delete-col-trigger" data-col-id="${col.id}" title="Remove Column">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `;
      
      // Sort listener
      th.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-col-trigger')) return; 
        if (sortColumnId === col.id) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortColumnId = col.id;
          sortDirection = 'asc';
        }
        renderTableBody(table);
      });

      tableHeaderRow.appendChild(th);
    });

    // Action trigger inside headers
    tableHeaderRow.querySelectorAll('.btn-delete-col-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const colId = btn.getAttribute('data-col-id');
        if (confirm("Are you sure you want to delete this column and all its row data?")) {
          table.columns = table.columns.filter(c => c.id !== colId);
          // clean up row elements values
          table.rows.forEach(r => {
            delete r[colId];
          });
          saveState();
          renderApp();
        }
      });
    });
  }

  function renderTableBody(table) {
    tableBody.innerHTML = "";
    
    let processedRows = [...table.rows];

    // 1. Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      processedRows = processedRows.filter(row => {
        return table.columns.some(col => {
          const val = String(row[col.id] || '').toLowerCase();
          return val.includes(q);
        });
      });
    }

    // 2. Sort Logic
    if (sortColumnId) {
      const colObj = table.columns.find(c => c.id === sortColumnId);
      const type = colObj ? colObj.type : 'text';
      
      processedRows.sort((a, b) => {
        let valA = a[sortColumnId];
        let valB = b[sortColumnId];

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (type === 'number') {
          return sortDirection === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        } else {
          return sortDirection === 'asc' 
            ? String(valA).localeCompare(String(valB)) 
            : String(valB).localeCompare(String(valA));
        }
      });
    }

    // UI Empty State Toggle
    if (processedRows.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    selectedRowsCount.textContent = `${processedRows.length} of ${table.rows.length} records`;

    // 3. Render rows
    processedRows.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-850/40 transition-colors group/row";
      
      // Primary ID or numeric row action
      let rowHTML = `
        <td class="py-3.5 px-4 text-center text-xs text-slate-500 font-mono border-b border-slate-850 bg-slate-900/10">
          <div class="flex items-center justify-center gap-2">
            <span class="group-hover/row:hidden">${index + 1}</span>
            <!-- Row Actions Quick Control -->
            <div class="hidden group-hover/row:flex items-center justify-center gap-1.5">
              <button class="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-all btn-edit-row-trigger" data-row-id="${row.id}" title="Edit row">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button class="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all btn-delete-row-trigger" data-row-id="${row.id}" title="Delete row">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </td>
      `;

      // Generate fields
      table.columns.forEach(col => {
        const value = row[col.id] !== undefined ? row[col.id] : '';
        let renderedValue = value;

        // Type special styling
        if (col.type === 'status') {
          if (value === '') {
            renderedValue = `<span class="text-xs text-slate-600">-</span>`;
          } else {
            // Dynamically assign badge colors based on text value
            let colorClass = "badge-purple";
            const vLower = String(value).toLowerCase();
            if (vLower.includes('done') || vLower.includes('complete') || vLower.includes('won') || vLower.includes('in stock')) {
              colorClass = "badge-emerald";
            } else if (vLower.includes('progress') || vLower.includes('doing') || vLower.includes('nurtur') || vLower.includes('reorder')) {
              colorClass = "badge-amber";
            } else if (vLower.includes('blocked') || vLower.includes('lost') || vLower.includes('discontinued') || vLower.includes('high')) {
              colorClass = "badge-rose";
            }
            renderedValue = `<span class="badge-item ${colorClass}">${value}</span>`;
          }
        } else if (col.type === 'number') {
          if (value !== '') {
            // Format as locale number or standard integer representation
            const isPrice = col.name.toLowerCase().includes('$') || col.name.toLowerCase().includes('price') || col.name.toLowerCase().includes('budget') || col.name.toLowerCase().includes('value');
            renderedValue = isPrice ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString();
          } else {
            renderedValue = `<span class="text-xs text-slate-600">0</span>`;
          }
        } else if (col.type === 'date') {
          renderedValue = value ? `<span class="text-slate-300 font-mono">${value}</span>` : `<span class="text-xs text-slate-600">-</span>`;
        }

        rowHTML += `
          <td class="py-3.5 px-5 text-slate-300 font-medium border-b border-slate-850/70 select-text cell-editable" data-row-id="${row.id}" data-col-id="${col.id}">
            ${renderedValue}
          </td>
        `;
      });

      tr.innerHTML = rowHTML;
      tableBody.appendChild(tr);
    });

    // Attach Inline cell double-click action or simple click to edit
    tableBody.querySelectorAll('.cell-editable').forEach(td => {
      td.addEventListener('dblclick', () => {
        const rowId = td.getAttribute('data-row-id');
        openEditRowModal(rowId);
      });
    });

    // Attach actions
    tableBody.querySelectorAll('.btn-edit-row-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const rowId = btn.getAttribute('data-row-id');
        openEditRowModal(rowId);
      });
    });

    tableBody.querySelectorAll('.btn-delete-row-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const rowId = btn.getAttribute('data-row-id');
        if (confirm("Are you sure you want to delete this record row?")) {
          table.rows = table.rows.filter(r => r.id !== rowId);
          saveState();
          renderApp();
        }
      });
    });
  }

  function renderStats(table) {
    summaryStatsBox.innerHTML = "";
    
    // Look for numeric columns to run auto statistics
    const numCols = table.columns.filter(c => c.type === 'number');
    const statusCols = table.columns.filter(c => c.type === 'status');
    
    if (numCols.length === 0 && statusCols.length === 0) {
      summaryStatsBox.innerHTML = `<span class="text-slate-500">No summary metrics available.</span>`;
      return;
    }

    // Calculate sums or averages
    numCols.forEach(col => {
      const nonZeroVals = table.rows.map(r => Number(r[col.id])).filter(v => !isNaN(v) && v !== 0);
      if (nonZeroVals.length > 0) {
        const sum = nonZeroVals.reduce((acc, curr) => acc + curr, 0);
        const avg = Math.round(sum / nonZeroVals.length);
        
        const statItem = document.createElement('div');
        statItem.className = "flex items-center gap-4 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800";
        statItem.innerHTML = `
          <div>
            <span class="text-slate-500 uppercase font-semibold text-[9px] tracking-wider block">${col.name} SUM</span>
            <span class="text-white font-bold text-xs">${sum.toLocaleString()}</span>
          </div>
          <div class="border-l border-slate-800 pl-3">
            <span class="text-slate-500 uppercase font-semibold text-[9px] tracking-wider block">AVG</span>
            <span class="text-indigo-400 font-bold text-xs">${avg.toLocaleString()}</span>
          </div>
        `;
        summaryStatsBox.appendChild(statItem);
      }
    });

    // Calculate status aggregates (breakdown of statuses)
    statusCols.slice(0, 1).forEach(col => {
      const counts = {};
      table.rows.forEach(r => {
        const val = r[col.id] || 'N/A';
        counts[val] = (counts[val] || 0) + 1;
      });

      const statusDiv = document.createElement('div');
      statusDiv.className = "flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800";
      
      let breakdownHtml = `<span class="text-slate-500 uppercase font-semibold text-[9px] tracking-wider block mr-2">${col.name}:</span>`;
      Object.keys(counts).forEach(key => {
        breakdownHtml += `<span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">${key} <strong>(${counts[key]})</strong></span>`;
      });
      
      statusDiv.innerHTML = breakdownHtml;
      summaryStatsBox.appendChild(statusDiv);
    });
  }

  function updateSidebarStats() {
    sidebarTotalTables.textContent = tables.length;
    let total = 0;
    tables.forEach(t => {
      total += t.rows.length;
    });
    sidebarTotalRows.textContent = total;
  }

  // --- MODAL TRIGGERS & UTILS ---

  function openModal(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  // Initialize generic modal closers
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.fixed');
      if (modal) closeModal(modal);
    });
  });

  // Show/Hide Custom Status Fields on option select
  inputColType.addEventListener('change', () => {
    if (inputColType.value === 'status') {
      statusOptionsGroup.classList.remove('hidden');
    } else {
      statusOptionsGroup.classList.add('hidden');
    }
  });

  // Open Create Table Modal
  btnOpenCreateTableModal.addEventListener('click', () => {
    formCreateTable.reset();
    openModal(modalNewTable);
  });

  // Form Create Table submission
  formCreateTable.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-table-name').value.trim();
    const desc = document.getElementById('input-table-desc').value.trim();
    const preset = document.getElementById('input-table-preset').value;

    const newTableId = 't-' + Date.now();
    let schema = {
      id: newTableId,
      name: name,
      description: desc,
      columns: [],
      rows: []
    };

    if (preset && PRESET_TEMPLATES[preset]) {
      schema.columns = JSON.parse(JSON.stringify(PRESET_TEMPLATES[preset].columns));
      schema.rows = JSON.parse(JSON.stringify(PRESET_TEMPLATES[preset].rows)).map(row => {
        row.id = 'row-' + Math.random().toString(36).substr(2, 9);
        return row;
      });
    } else {
      // default text input col
      schema.columns = [
        { id: 'col-' + Math.random().toString(36).substr(2, 9), name: 'Name', type: 'text' }
      ];
    }

    tables.push(schema);
    activeTableId = newTableId;
    saveState();
    closeModal(modalNewTable);
    renderApp();
  });

  // Open Column Modal
  btnOpenColumnModal.addEventListener('click', () => {
    formCreateColumn.reset();
    statusOptionsGroup.classList.add('hidden');
    openModal(modalNewColumn);
  });

  // Create Column Action
  formCreateColumn.addEventListener('submit', (e) => {
    e.preventDefault();
    const table = getActiveTable();
    if (!table) return;

    const colName = document.getElementById('input-col-name').value.trim();
    const colType = document.getElementById('input-col-type').value;
    const optionsString = document.getElementById('input-col-options').value.trim();

    let finalOptions = [];
    if (colType === 'status' && optionsString) {
      finalOptions = optionsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else if (colType === 'status') {
      finalOptions = ['To Do', 'In Progress', 'Done']; // fallback defaults
    }

    const newColId = 'col-' + Math.random().toString(36).substr(2, 9);
    
    table.columns.push({
      id: newColId,
      name: colName,
      type: colType,
      options: finalOptions.length ? finalOptions : undefined
    });

    saveState();
    closeModal(modalNewColumn);
    renderApp();
  });

  // Edit row details sidebar / modal
  function openEditRowModal(rowId) {
    const table = getActiveTable();
    if (!table) return;

    const row = table.rows.find(r => r.id === rowId);
    if (!row) return;

    currentEditingRowId = rowId;
    editRowFieldsContainer.innerHTML = "";

    table.columns.forEach(col => {
      const div = document.createElement('div');
      div.className = "p-1 bg-slate-950/20 border-b border-slate-800/40 pb-3";
      
      const currentValue = row[col.id] !== undefined ? row[col.id] : '';

      let inputElementHTML = ``;
      if (col.type === 'number') {
        inputElementHTML = `<input type="number" name="${col.id}" value="${currentValue}" class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500" />`;
      } else if (col.type === 'date') {
        inputElementHTML = `<input type="date" name="${col.id}" value="${currentValue}" class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500" />`;
      } else if (col.type === 'status') {
        const opts = col.options || ['To Do', 'In Progress', 'Done'];
        let optionsMarkup = opts.map(o => `<option value="${o}" ${o === currentValue ? 'selected' : ''}>${o}</option>`).join('');
        inputElementHTML = `
          <select name="${col.id}" class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500">
            <option value="">-- Select Status --</option>
            ${optionsMarkup}
          </select>
        `;
      } else {
        inputElementHTML = `<input type="text" name="${col.id}" value="${currentValue}" class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500" />`;
      }

      div.innerHTML = `
        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">${col.name}</label>
        ${inputElementHTML}
      `;
      editRowFieldsContainer.appendChild(div);
    });

    openModal(modalEditRow);
  }

  // Submit row adjustments
  formEditRow.addEventListener('submit', (e) => {
    e.preventDefault();
    const table = getActiveTable();
    if (!table || !currentEditingRowId) return;

    const row = table.rows.find(r => r.id === currentEditingRowId);
    if (!row) return;

    // Harvest form properties
    const formData = new FormData(formEditRow);
    table.columns.forEach(col => {
      const val = formData.get(col.id);
      if (col.type === 'number') {
        row[col.id] = val !== '' ? Number(val) : '';
      } else {
        row[col.id] = val;
      }
    });

    saveState();
    closeModal(modalEditRow);
    renderApp();
  });

  // Add Row direct action button
  function insertBlankRow() {
    const table = getActiveTable();
    if (!table) return;

    const newRowId = 'row-' + Math.random().toString(36).substr(2, 9);
    const newRow = { id: newRowId };
    
    // Populate with empty columns
    table.columns.forEach(col => {
      if (col.type === 'number') {
        newRow[col.id] = '';
      } else if (col.type === 'status' && col.options && col.options.length > 0) {
        newRow[col.id] = col.options[0]; // pick first status option as fallback
      } else {
        newRow[col.id] = '';
      }
    });

    table.rows.push(newRow);
    saveState();
    renderApp();
    
    // Automatically launch edit drawer for the brand new row to let users edit seamlessly
    openEditRowModal(newRowId);
  }

  btnAddRowDirect.addEventListener('click', insertBlankRow);
  btnEmptyAddRow.addEventListener('click', insertBlankRow);

  // Delete entire active table database workspace
  btnDeleteTable.addEventListener('click', () => {
    const table = getActiveTable();
    if (!table) return;

    if (confirm(`⚠️ Are you absolutely sure you want to delete the entire "${table.name}" workspace? This actions clears all fields, configurations and row metrics permanently.`)) {
      tables = tables.filter(t => t.id !== activeTableId);
      activeTableId = tables.length > 0 ? tables[0].id : null;
      saveState();
      renderApp();
    }
  });

  // Export Dropdown Trigger toggle
  btnExportDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    exportDropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    exportDropdownMenu.classList.add('hidden');
  });

  // Export to CSV Function
  btnExportCSV.addEventListener('click', () => {
    const table = getActiveTable();
    if (!table) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header columns
    const headerRow = table.columns.map(c => `"${c.name.replace(/"/g, '""')}"`).join(",");
    csvContent += headerRow + "\r\n";

    // Row details
    table.rows.forEach(r => {
      const rowCells = table.columns.map(col => {
        const val = r[col.id] !== undefined ? String(r[col.id]) : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvContent += rowCells.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${table.name.replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Export to JSON file function
  btnExportJSON.addEventListener('click', () => {
    const table = getActiveTable();
    if (!table) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(table, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${table.name.replace(/\s+/g, '_')}_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Search query inputs
  inputSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    const table = getActiveTable();
    if (table) {
      renderTableBody(table);
    }
  });

  // --- LOAD INITIAL APPLICATION RUN ---
  loadState();
  renderApp();
})();