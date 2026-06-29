/**
 * MyNotes Hub Engine - Pure Client Side Sandbox Interactivity
 */

(function () {
  // Default Starting Notes for instant showcase capability
  const INITIAL_NOTES = [
    {
      id: 'demo-1',
      title: 'Welcome to MyNotes Hub 🚀',
      content: 'This is a premium client-side note application. You can pin essential tasks, categorize everything with customizable tags, and change colors! Try editing this note or adding checklist items below.',
      type: 'text',
      checklist: [],
      tag: 'Ideas',
      color: 'indigo',
      pinned: true,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'demo-2',
      title: 'Project Launch Checklist 📦',
      content: '',
      type: 'checklist',
      checklist: [
        { id: 'item-1', text: 'Complete frontend responsive tests', completed: true },
        { id: 'item-2', text: 'Optimize state persistence', completed: true },
        { id: 'item-3', text: 'Generate beautiful colors metadata', completed: false },
        { id: 'item-4', text: 'Export project JSON schema backups', completed: false }
      ],
      tag: 'Work',
      color: 'emerald',
      pinned: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'demo-3',
      title: 'Smart Learning Resources',
      content: 'Read up on Tailwind custom animation strategies, client-side blob generation techniques, and DOM state handling methodologies.',
      type: 'text',
      checklist: [],
      tag: 'Study',
      color: 'purple',
      pinned: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Core States
  let notes = [];
  let currentFilterTag = 'All';
  let currentSearchQuery = '';
  let creatorNoteType = 'text'; // 'text' or 'checklist'
  let creatorChecklistItems = []; // Array of { id, text, completed }

  // Selected DOM nodes
  const noteSearchInput = document.getElementById('noteSearchInput');
  const btnExportData = document.getElementById('btnExportData');
  const importFileSelector = document.getElementById('importFileSelector');
  const btnResetData = document.getElementById('btnResetData');
  
  const sidebarBtnCreateNote = document.getElementById('sidebarBtnCreateNote');
  const tagFilterContainer = document.getElementById('tagFilterContainer');
  
  // Stats references
  const statTotalNotes = document.getElementById('statTotalNotes');
  const statPinnedNotes = document.getElementById('statPinnedNotes');
  const statChecklists = document.getElementById('statChecklists');
  const statCompletedTasks = document.getElementById('statCompletedTasks');
  
  // Form/Creator elements
  const noteCreatorSection = document.getElementById('noteCreatorSection');
  const creatorFormTitle = document.getElementById('creatorFormTitle');
  const btnCloseCreator = document.getElementById('btnCloseCreator');
  const btnTypeStandard = document.getElementById('btnTypeStandard');
  const btnTypeChecklist = document.getElementById('btnTypeChecklist');
  const formNoteId = document.getElementById('formNoteId');
  const noteTitleInput = document.getElementById('noteTitleInput');
  const textInputWrapper = document.getElementById('textInputWrapper');
  const noteContentInput = document.getElementById('noteContentInput');
  const checklistInputWrapper = document.getElementById('checklistInputWrapper');
  const checklistItemsContainer = document.getElementById('checklistItemsContainer');
  const newChecklistItemInput = document.getElementById('newChecklistItemInput');
  const btnAddChecklistItem = document.getElementById('btnAddChecklistItem');
  const noteTagSelect = document.getElementById('noteTagSelect');
  const noteColorInput = document.getElementById('noteColorInput');
  const notePinInput = document.getElementById('notePinInput');
  const btnDiscardNote = document.getElementById('btnDiscardNote');
  const btnSaveNote = document.getElementById('btnSaveNote');
  const btnEmptyStateCreate = document.getElementById('btnEmptyStateCreate');

  // Filter and dynamic container states
  const activeFilterBar = document.getElementById('activeFilterBar');
  const activeFilterLabel = document.getElementById('activeFilterLabel');
  const btnClearFilters = document.getElementById('btnClearFilters');
  const pinnedNotesHeader = document.getElementById('pinnedNotesHeader');
  const pinnedNotesContainer = document.getElementById('pinnedNotesContainer');
  const allNotesContainer = document.getElementById('allNotesContainer');
  const emptyStateView = document.getElementById('emptyStateView');

  // Color Maps for UI styles
  const colorMap = {
    indigo: { border: 'border-indigo-500/30', header: 'bg-indigo-950/40 text-indigo-400', accent: 'bg-indigo-500', glow: 'shadow-indigo-500/5', ring: 'focus:ring-indigo-500' },
    emerald: { border: 'border-emerald-500/30', header: 'bg-emerald-950/40 text-emerald-400', accent: 'bg-emerald-500', glow: 'shadow-emerald-500/5', ring: 'focus:ring-emerald-500' },
    amber: { border: 'border-amber-500/30', header: 'bg-amber-950/40 text-amber-400', accent: 'bg-amber-500', glow: 'shadow-amber-500/5', ring: 'focus:ring-amber-500' },
    rose: { border: 'border-rose-500/30', header: 'bg-rose-950/40 text-rose-400', accent: 'bg-rose-500', glow: 'shadow-rose-500/5', ring: 'focus:ring-rose-500' },
    purple: { border: 'border-purple-500/30', header: 'bg-purple-950/40 text-purple-400', accent: 'bg-purple-500', glow: 'shadow-purple-500/5', ring: 'focus:ring-purple-500' },
    slate: { border: 'border-slate-700', header: 'bg-slate-800/60 text-slate-300', accent: 'bg-slate-400', glow: 'shadow-slate-500/5', ring: 'focus:ring-slate-500' }
  };

  // Available tags
  const AVAILABLE_TAGS = ['All', 'Work', 'Personal', 'Ideas', 'To-do', 'Study', 'Finance'];

  // Initialize application and local storage
  function init() {
    const saved = localStorage.getItem('mynotes_hub_data');
    if (saved) {
      try {
        notes = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notes storage, fallback to defaults.', e);
        notes = [...INITIAL_NOTES];
      }
    } else {
      notes = [...INITIAL_NOTES];
      saveToLocalStorage();
    }

    setupEventListeners();
    renderTagFilters();
    renderColorSwatches();
    renderNotesGrid();
  }

  function saveToLocalStorage() {
    localStorage.setItem('mynotes_hub_data', JSON.stringify(notes));
  }

  // Set active class on active color swatch
  function renderColorSwatches() {
    const activeColor = noteColorInput.value || 'indigo';
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      const color = btn.getAttribute('data-color');
      if (color === activeColor) {
        btn.classList.add('active-swatch', 'ring-white/80');
      } else {
        btn.classList.remove('active-swatch', 'ring-white/80');
      }
    });
  }

  // Create Tag Buttons in sidebar
  function renderTagFilters() {
    tagFilterContainer.innerHTML = '';
    AVAILABLE_TAGS.forEach(tag => {
      const count = tag === 'All' 
        ? notes.length 
        : notes.filter(n => n.tag === tag).length;

      const btn = document.createElement('button');
      btn.className = `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${currentFilterTag === tag ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'}`;
      
      let tagIcon = '📝';
      if (tag === 'Work') tagIcon = '💼';
      else if (tag === 'Personal') tagIcon = '🏠';
      else if (tag === 'Ideas') tagIcon = '💡';
      else if (tag === 'To-do') tagIcon = '✅';
      else if (tag === 'Study') tagIcon = '📚';
      else if (tag === 'Finance') tagIcon = '💰';
      else if (tag === 'All') tagIcon = '✨';

      btn.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>${tagIcon}</span>
          <span>${tag}</span>
        </div>
        <span class="px-1.5 py-0.5 rounded-full bg-slate-950 text-[10px] text-slate-500 font-bold border border-slate-800">${count}</span>
      `;
      
      btn.addEventListener('click', () => {
        currentFilterTag = tag;
        renderTagFilters();
        renderNotesGrid();
      });

      tagFilterContainer.appendChild(btn);
    });
  }

  // Update stats summary dashboard
  function renderStats() {
    const total = notes.length;
    const pinned = notes.filter(n => n.pinned).length;
    const checklists = notes.filter(n => n.type === 'checklist').length;
    
    let completedTasks = 0;
    notes.forEach(n => {
      if (n.type === 'checklist' && n.checklist) {
        completedTasks += n.checklist.filter(c => c.completed).length;
      }
    });

    statTotalNotes.textContent = total;
    statPinnedNotes.textContent = pinned;
    statChecklists.textContent = checklists;
    statCompletedTasks.textContent = completedTasks;
  }

  // Main rendering engine for standard and pinned notes arrays
  function renderNotesGrid() {
    renderStats();

    // Filter notes
    let filtered = notes.filter(note => {
      const matchesTag = currentFilterTag === 'All' || note.tag === currentFilterTag;
      const matchesSearch = currentSearchQuery === '' 
        || (note.title && note.title.toLowerCase().includes(currentSearchQuery))
        || (note.content && note.content.toLowerCase().includes(currentSearchQuery));
      return matchesTag && matchesSearch;
    });

    // Render state configurations
    if (currentFilterTag !== 'All' || currentSearchQuery !== '') {
      activeFilterBar.classList.remove('hidden');
      activeFilterBar.classList.add('flex');
      activeFilterLabel.textContent = `"${currentFilterTag}" tag ${currentSearchQuery ? `with keyword: '${currentSearchQuery}'` : ''}`;
    } else {
      activeFilterBar.classList.add('hidden');
    }

    // Sort: newest created first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const pinnedNotes = filtered.filter(n => n.pinned);
    const standardNotes = filtered.filter(n => !n.pinned);

    // Check if empty state active
    if (filtered.length === 0) {
      pinnedNotesHeader.classList.add('hidden');
      pinnedNotesContainer.innerHTML = '';
      allNotesContainer.innerHTML = '';
      emptyStateView.classList.remove('hidden');
      return;
    } else {
      emptyStateView.classList.add('hidden');
    }

    // Handle Pinned Area
    if (pinnedNotes.length > 0) {
      pinnedNotesHeader.classList.remove('hidden');
      pinnedNotesContainer.innerHTML = '';
      pinnedNotes.forEach(note => {
        pinnedNotesContainer.appendChild(createNoteDOMElement(note));
      });
    } else {
      pinnedNotesHeader.classList.add('hidden');
      pinnedNotesContainer.innerHTML = '';
    }

    // Handle Standard Area
    allNotesContainer.innerHTML = '';
    if (standardNotes.length > 0) {
      standardNotes.forEach(note => {
        allNotesContainer.appendChild(createNoteDOMElement(note));
      });
    }
  }

  // Dynamic generator for beautiful single Note Card elements
  function createNoteDOMElement(note) {
    const card = document.createElement('div');
    const theme = colorMap[note.color] || colorMap.indigo;
    card.className = `note-card bg-slate-900 border ${theme.border} rounded-2xl overflow-hidden shadow-xl ${theme.glow} hover:shadow-lg flex flex-col justify-between`;
    
    // Formatting nice dates
    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build content dynamically depending on standard vs checklist type
    let contentHTML = '';
    if (note.type === 'checklist') {
      const items = note.checklist || [];
      if (items.length === 0) {
        contentHTML = `<p class="text-xs text-slate-500 italic">Empty list</p>`;
      } else {
        contentHTML = `<div class="space-y-1.5 mt-2 max-h-48 overflow-y-auto pr-1">`;
        items.forEach(item => {
          contentHTML += `
            <label class="flex items-start space-x-2.5 p-1 rounded hover:bg-slate-950/40 cursor-pointer text-xs">
              <input type="checkbox" data-note-id="${note.id}" data-item-id="${item.id}" class="task-check-toggle form-checkbox rounded text-${note.color}-500 bg-slate-950 border-slate-800 w-4 h-4 mt-0.5" ${item.completed ? 'checked' : ''} />
              <span class="${item.completed ? 'line-through text-slate-500' : 'text-slate-300'} select-none break-all">${escapeHTML(item.text)}</span>
            </label>
          `;
        });
        contentHTML += `</div>`;
      }
    } else {
      contentHTML = `<p class="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mt-1 break-words">${escapeHTML(note.content)}</p>`;
    }

    card.innerHTML = `
      <!-- Note Header / Actions -->
      <div class="p-4 sm:p-5 pb-3">
        <div class="flex items-start justify-between gap-2">
          <span class="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wide">${note.tag}</span>
          <div class="flex items-center space-x-1">
            <button type="button" data-id="${note.id}" title="Toggle Pin" class="btn-toggle-pin-note p-1 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-950 transition-colors">
              <svg class="w-4 h-4 ${note.pinned ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v1.172a2 2 0 01-.586 1.414l-2.414 2.414A3 3 0 0013 11.172V17l-2 2H9l1-2v-5.828a3 3 0 00-.828-2.172L5.586 6.586A2 2 0 015 5.172V5z"></path>
              </svg>
            </button>
            <button type="button" data-id="${note.id}" title="Edit Note" class="btn-edit-note p-1 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-950 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button type="button" data-id="${note.id}" title="Delete Note" class="btn-delete-note p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-950 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <h4 class="text-sm font-bold text-slate-100 mt-2 tracking-tight break-words">${escapeHTML(note.title || 'Untitled Note')}</h4>
        <div class="mt-2">
          ${contentHTML}
        </div>
      </div>

      <!-- Note Footer info -->
      <div class="px-4 py-2.5 sm:px-5 bg-slate-950/50 border-t border-slate-950/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span class="capitalize flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full ${theme.accent}"></span>
          ${note.type === 'checklist' ? 'Checklist' : 'Text Note'}
        </span>
        <span>${formattedDate}</span>
      </div>
    `;

    // Event binding inside rendered note DOM element
    card.querySelector('.btn-toggle-pin-note').addEventListener('click', () => togglePin(note.id));
    card.querySelector('.btn-edit-note').addEventListener('click', () => editNote(note.id));
    card.querySelector('.btn-delete-note').addEventListener('click', () => deleteNote(note.id));
    
    // Interactive checklist internal clicks
    card.querySelectorAll('.task-check-toggle').forEach(input => {
      input.addEventListener('change', (e) => {
        const noteId = e.target.getAttribute('data-note-id');
        const itemId = e.target.getAttribute('data-item-id');
        toggleChecklistItem(noteId, itemId, e.target.checked);
      });
    });

    return card;
  }

  // Utility to safe-escape HTML and prevent sandbox injection issues
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Pin handler
  function togglePin(id) {
    notes = notes.map(note => {
      if (note.id === id) {
        return { ...note, pinned: !note.pinned };
      }
      return note;
    });
    saveToLocalStorage();
    renderNotesGrid();
  }

  // Checklist completion toggler
  function toggleChecklistItem(noteId, itemId, isCompleted) {
    notes = notes.map(note => {
      if (note.id === noteId) {
        const updatedChecklist = note.checklist.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: isCompleted };
          }
          return item;
        });
        return { ...note, checklist: updatedChecklist };
      }
      return note;
    });
    saveToLocalStorage();
    renderNotesGrid();
  }

  // Setup event routing, state updates
  function setupEventListeners() {
    // Open creator empty
    sidebarBtnCreateNote.addEventListener('click', () => openCreatorForm());
    btnEmptyStateCreate.addEventListener('click', () => openCreatorForm());
    btnCloseCreator.addEventListener('click', () => closeCreatorForm());
    btnDiscardNote.addEventListener('click', () => closeCreatorForm());

    // Search Input dynamic filtration
    noteSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderNotesGrid();
    });

    // Preset Reset action
    btnResetData.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore original default notes? This clears custom current sessions.')) {
        notes = [...INITIAL_NOTES];
        saveToLocalStorage();
        renderTagFilters();
        renderNotesGrid();
      }
    });

    // Export offline sandbox configuration
    btnExportData.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MyNotesHub_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Import local sandbox session
    importFileSelector.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (Array.isArray(parsed)) {
            notes = parsed;
            saveToLocalStorage();
            renderTagFilters();
            renderNotesGrid();
            alert('Notes database backup imported successfully!');
          } else {
            alert('Invalid backup file format. Expected an array.');
          }
        } catch(err) {
          alert('Error parsing uploaded backup config.');
        }
      };
      reader.readAsText(file);
    });

    // Form Toggle types: Standard VS Checklist
    btnTypeStandard.addEventListener('click', () => setCreatorType('text'));
    btnTypeChecklist.addEventListener('click', () => setCreatorType('checklist'));

    // Color swatch click binding
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colorName = btn.getAttribute('data-color');
        noteColorInput.value = colorName;
        renderColorSwatches();
      });
    });

    // Add checklist items inside note creator
    btnAddChecklistItem.addEventListener('click', addChecklistItemFromForm);
    newChecklistItemInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addChecklistItemFromForm();
      }
    });

    // Save form action
    btnSaveNote.addEventListener('click', saveNoteFromForm);

    // Clear filter helper
    btnClearFilters.addEventListener('click', () => {
      currentFilterTag = 'All';
      currentSearchQuery = '';
      noteSearchInput.value = '';
      renderTagFilters();
      renderNotesGrid();
    });
  }

  // Opens composer
  function openCreatorForm(noteToEdit = null) {
    noteCreatorSection.classList.remove('hidden');
    noteCreatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    if (noteToEdit) {
      creatorFormTitle.textContent = "Edit Note Configuration";
      formNoteId.value = noteToEdit.id;
      noteTitleInput.value = noteToEdit.title || '';
      noteTagSelect.value = noteToEdit.tag || 'Ideas';
      noteColorInput.value = noteToEdit.color || 'indigo';
      notePinInput.checked = !!noteToEdit.pinned;
      
      setCreatorType(noteToEdit.type || 'text');
      
      if (noteToEdit.type === 'checklist') {
        creatorChecklistItems = [...(noteToEdit.checklist || [])];
        noteContentInput.value = '';
      } else {
        creatorChecklistItems = [];
        noteContentInput.value = noteToEdit.content || '';
      }
    } else {
      creatorFormTitle.textContent = "Compose Note";
      formNoteId.value = '';
      noteTitleInput.value = '';
      noteContentInput.value = '';
      noteTagSelect.value = 'Ideas';
      noteColorInput.value = 'indigo';
      notePinInput.checked = false;
      creatorChecklistItems = [];
      setCreatorType('text');
    }
    
    renderColorSwatches();
    renderCreatorChecklistItems();
  }

  function closeCreatorForm() {
    noteCreatorSection.classList.add('hidden');
    formNoteId.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    creatorChecklistItems = [];
  }

  // Handle Switch logic between text editor and interactive list builder
  function setCreatorType(type) {
    creatorNoteType = type;
    if (type === 'checklist') {
      btnTypeChecklist.className = "px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white shadow-sm";
      btnTypeStandard.className = "px-4 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all";
      textInputWrapper.className = "hidden";
      checklistInputWrapper.className = "block bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3";
    } else {
      btnTypeStandard.className = "px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white shadow-sm";
      btnTypeChecklist.className = "px-4 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all";
      textInputWrapper.className = "block";
      checklistInputWrapper.className = "hidden";
    }
  }

  // Checklist rendering within Creator Form
  function renderCreatorChecklistItems() {
    checklistItemsContainer.innerHTML = '';
    if (creatorChecklistItems.length === 0) {
      checklistItemsContainer.innerHTML = `<p class="text-[11px] text-slate-500 italic py-1">No check items added yet. Add below!</p>`;
      return;
    }

    creatorChecklistItems.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = "flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800";
      itemDiv.innerHTML = `
        <div class="flex items-center space-x-2 flex-1">
          <input type="checkbox" ${item.completed ? 'checked' : ''} class="creator-chk-toggle rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500 w-3.5 h-3.5" />
          <span class="text-xs text-slate-300 break-all ${item.completed ? 'line-through text-slate-500' : ''}">${escapeHTML(item.text)}</span>
        </div>
        <button type="button" class="creator-chk-delete text-slate-500 hover:text-rose-400 p-0.5 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      `;

      // Form item toggle completed status
      itemDiv.querySelector('.creator-chk-toggle').addEventListener('change', (e) => {
        creatorChecklistItems[index].completed = e.target.checked;
        renderCreatorChecklistItems();
      });

      // Form item delete
      itemDiv.querySelector('.creator-chk-delete').addEventListener('click', () => {
        creatorChecklistItems.splice(index, 1);
        renderCreatorChecklistItems();
      });

      checklistItemsContainer.appendChild(itemDiv);
    });
  }

  function addChecklistItemFromForm() {
    const text = newChecklistItemInput.value.trim();
    if (!text) return;
    creatorChecklistItems.push({
      id: 'it-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      text: text,
      completed: false
    });
    newChecklistItemInput.value = '';
    renderCreatorChecklistItems();
    newChecklistItemInput.focus();
  }

  // Save Note Action handler (Update or Create standard state)
  function saveNoteFromForm() {
    const title = noteTitleInput.value.trim() || 'Untitled Note';
    const content = noteContentInput.value.trim();
    const tag = noteTagSelect.value;
    const color = noteColorInput.value;
    const pinned = notePinInput.checked;
    const targetId = formNoteId.value;

    if (creatorNoteType === 'text' && !content && title === 'Untitled Note') {
      alert('Please fill out note text or set a custom title before saving.');
      return;
    }

    if (targetId) {
      // EDIT MODE
      notes = notes.map(note => {
        if (note.id === targetId) {
          return {
            ...note,
            title: title,
            content: creatorNoteType === 'text' ? content : '',
            type: creatorNoteType,
            checklist: creatorNoteType === 'checklist' ? creatorChecklistItems : [],
            tag: tag,
            color: color,
            pinned: pinned,
            lastModified: new Date().toISOString()
          };
        }
        return note;
      });
    } else {
      // NEW NOTE MODE
      const newNote = {
        id: 'note-' + Date.now(),
        title: title,
        content: creatorNoteType === 'text' ? content : '',
        type: creatorNoteType,
        checklist: creatorNoteType === 'checklist' ? creatorChecklistItems : [],
        tag: tag,
        color: color,
        pinned: pinned,
        createdAt: new Date().toISOString()
      };
      notes.push(newNote);
    }

    saveToLocalStorage();
    closeCreatorForm();
    renderTagFilters();
    renderNotesGrid();
  }

  // Edit form filler
  function editNote(id) {
    const noteToEdit = notes.find(n => n.id === id);
    if (noteToEdit) {
      openCreatorForm(noteToEdit);
    }
  }

  // Delete handler
  function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      notes = notes.filter(n => n.id !== id);
      saveToLocalStorage();
      renderTagFilters();
      renderNotesGrid();
    }
  }

  // Trigger launcher
  document.addEventListener('DOMContentLoaded', init);
})();