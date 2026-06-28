document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const teluguEditor = document.getElementById('telugu-editor');
  const phoneticInput = document.getElementById('phonetic-input');
  const conversionPreview = document.getElementById('conversion-preview');
  const autoConvertToggle = document.getElementById('toggle-auto-convert');
  const btnQuickConvert = document.getElementById('btn-quick-convert');
  
  const btnSpeak = document.getElementById('btn-speak');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');
  const btnClearCanvas = document.getElementById('btn-clear-canvas');
  
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontInc = document.getElementById('btn-font-inc');
  const fontSizeIndicator = document.getElementById('font-size-indicator');
  
  const statChars = document.getElementById('stat-chars');
  const statWords = document.getElementById('stat-words');
  
  const toastMessage = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');
  
  // Virtual Keyboard Tabs & Panes
  const tabVowels = document.getElementById('tab-vowels');
  const tabConsonants = document.getElementById('tab-consonants');
  const tabModifiers = document.getElementById('tab-modifiers');
  
  const paneVowels = document.getElementById('pane-vowels');
  const paneConsonants = document.getElementById('pane-consonants');
  const paneModifiers = document.getElementById('pane-modifiers');
  
  // Drafts elements
  const draftTitleInput = document.getElementById('draft-title');
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const draftsList = document.getElementById('drafts-list');

  // Font scale logic
  let currentFontSize = 18;
  
  // Rules mapping dictionary for phonetic typing conversion
  const teluguSyllableMap = {
    // vowels
    "amma": "అమ్మ",
    "nanna": "నాన్న",
    "anna": "అన్న",
    "akka": "అక్క",
    "tammudu": "తమ్ముడు",
    "chelli": "చెల్లి",
    "dhanyavadalu": "ధన్యవాదాలు",
    "swagatam": "స్వాగతం",
    "pranam": "ప్రాణం",
    "sneham": "స్నేహం",
    "prema": "ప్రేమ",
    "desham": "దేశం",
    "bhasha": "భాష",
    "bharat": "భారత్",
    "namaskaram": "నమస్కారం",
    "telugu": "తెలుగు",
    "shubhodayam": "శుభోదయం",
    "babu": "బాబు",
    "panulu": "పనులు",
    "prapancham": "ప్రపంచం",
    
    // simple phonetic replacement rules
    "aa": "ఆ",
    "ee": "ఈ",
    "oo": "ఊ",
    "ae": "ఏ",
    "ai": "ఐ",
    "au": "ఔ",
    "am": "అం",
    "aha": "అః",
    "a": "అ",
    "i": "ఇ",
    "u": "ఉ",
    "e": "ఎ",
    "o": "ఒ",
    "O": "ఓ",
    
    // consonants combinations
    "kha": "ఖ",
    "gha": "ఘ",
    "cha": "చ",
    "chh": "ఛ",
    "jha": "ఝ",
    "tha": "థ",
    "dha": "ధ",
    "pha": "ఫ",
    "bha": "భ",
    "sha": "శ",
    "shh": "ష",
    "ksh": "క్ష",
    "ka": "క",
    "ga": "గ",
    "ja": "జ",
    "Ta": "ట",
    "Tha": "ఠ",
    "Da": "డ",
    "Dha": "ఢ",
    "Na": "ణ",
    "ta": "త",
    "da": "ద",
    "na": "న",
    "pa": "ప",
    "ba": "బ",
    "ma": "మ",
    "ya": "య",
    "ra": "ర",
    "la": "ల",
    "va": "వ",
    "sa": "స",
    "ha": "హ",
    "La": "ళ",
    "Ra": "ఱ"
  };

  // Convert English phonetic letters to Telugu
  function convertPhonetic(inputText) {
    if (!inputText) return "";
    
    // Clean input and make it lowercase for flexible match
    let word = inputText.trim().toLowerCase();
    
    // Check if the exact typed word is in our dictionary
    if (teluguSyllableMap[word]) {
      return teluguSyllableMap[word];
    }
    
    // Perform segmented sub-replacements for basic phonetic representation
    let output = word;
    
    // Order of replacements matters (larger match sequences first)
    const sequence = [
      ["namaskaram", "నమస్కారం"],
      ["dhanyavadalu", "ధన్యవాదాలు"],
      ["swagatam", "స్వాగతం"],
      ["shubhodayam", "శుభోదయం"],
      ["amma", "అమ్మ"],
      ["nanna", "నాన్న"],
      ["prapancham", "ప్రపంచం"],
      ["telugu", "తెలుగు"],
      ["ksh", "క్ష"],
      ["shh", "ష"],
      ["chh", "ఛ"],
      ["kha", "ఖ"],
      ["gha", "ఘ"],
      ["jha", "ఝ"],
      ["tha", "థ"],
      ["dha", "ధ"],
      ["pha", "ఫ"],
      ["bha", "భ"],
      ["sha", "శ"],
      ["aa", "ఆ"],
      ["ee", "ఈ"],
      ["oo", "ఊ"],
      ["ae", "ఏ"],
      ["ai", "ఐ"],
      ["au", "ఔ"],
      ["am", "అం"],
      ["aha", "అః"],
      ["ka", "క"],
      ["ga", "గ"],
      ["cha", "చ"],
      ["ja", "జ"],
      ["ta", "త"],
      ["da", "ద"],
      ["na", "న"],
      ["pa", "ప"],
      ["ba", "బ"],
      ["ma", "మ"],
      ["ya", "య"],
      ["ra", "ర"],
      ["la", "ల"],
      ["va", "వ"],
      ["sa", "స"],
      ["ha", "హ"],
      ["la", "ళ"],
      ["a", "అ"],
      ["i", "ఇ"],
      ["u", "ఉ"],
      ["e", "ఎ"],
      ["o", "ఒ"],
      ["o", "ఓ"]
    ];

    for (let rule of sequence) {
      let regex = new RegExp(rule[0], 'g');
      output = output.replace(regex, rule[1]);
    }
    
    return output;
  }

  // Show preview of conversion while typing
  phoneticInput.addEventListener('input', () => {
    const text = phoneticInput.value;
    if (text) {
      const converted = convertPhonetic(text);
      conversionPreview.innerHTML = `Preview: <strong class="text-amber-400 text-sm">${converted}</strong> (Press Space to insert)`;
    } else {
      conversionPreview.textContent = "";
    }
  });

  // Handle Space/Enter in phonetic box to auto-insert
  phoneticInput.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && autoConvertToggle.checked) {
      const rawVal = phoneticInput.value;
      if (rawVal.trim()) {
        e.preventDefault();
        const converted = convertPhonetic(rawVal);
        insertTextIntoEditor(converted + (e.key === ' ' ? ' ' : ''));
        phoneticInput.value = '';
        conversionPreview.textContent = '';
        triggerToast('పదం జోడించబడింది! (Word added)');
      }
    }
  });

  // Manual convert button
  btnQuickConvert.addEventListener('click', () => {
    const rawVal = phoneticInput.value;
    if (rawVal.trim()) {
      const converted = convertPhonetic(rawVal);
      insertTextIntoEditor(converted);
      phoneticInput.value = '';
      conversionPreview.textContent = '';
      triggerToast('పదం జోడించబడింది! (Word added)');
    }
  });

  // Insert text at cursor point in editor
  function insertTextIntoEditor(text) {
    const startPos = teluguEditor.selectionStart;
    const endPos = teluguEditor.selectionEnd;
    const currentVal = teluguEditor.value;
    
    teluguEditor.value = currentVal.substring(0, startPos) + text + currentVal.substring(endPos, currentVal.length);
    
    // Relocate cursor
    const newPos = startPos + text.length;
    teluguEditor.focus();
    teluguEditor.setSelectionRange(newPos, newPos);
    
    updateStats();
  }

  // Interactive Virtual Keyboard Key triggers
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const charToInsert = btn.getAttribute('data-char');
      insertTextIntoEditor(charToInsert);
    });
  });

  // Click phonetic guide triggers
  document.querySelectorAll('.quick-insert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const charToInsert = btn.getAttribute('data-text');
      insertTextIntoEditor(charToInsert);
    });
  });

  // Click quick phrase triggers
  document.querySelectorAll('.quick-phrase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const phrase = btn.getAttribute('data-phrase');
      insertTextIntoEditor(phrase + ' ');
    });
  });

  // Keyboard sub-tabs switcher
  function switchTab(activeTab, activePane) {
    // reset tab designs
    [tabVowels, tabConsonants, tabModifiers].forEach(t => {
      t.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      t.classList.add('text-slate-400', 'font-medium', 'hover:text-slate-100');
    });
    // reset panels
    [paneVowels, paneConsonants, paneModifiers].forEach(p => p.classList.add('hidden'));

    // active target styling
    activeTab.classList.remove('text-slate-400', 'hover:text-slate-100', 'font-medium');
    activeTab.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
    activePane.classList.remove('hidden');
  }

  tabVowels.addEventListener('click', () => switchTab(tabVowels, paneVowels));
  tabConsonants.addEventListener('click', () => switchTab(tabConsonants, paneConsonants));
  tabModifiers.addEventListener('click', () => switchTab(tabModifiers, paneModifiers));

  // Font zoom controls
  btnFontInc.addEventListener('click', () => {
    if (currentFontSize < 40) {
      currentFontSize += 2;
      teluguEditor.style.fontSize = `${currentFontSize}px`;
      fontSizeIndicator.textContent = `${currentFontSize}px`;
    }
  });

  btnFontDec.addEventListener('click', () => {
    if (currentFontSize > 12) {
      currentFontSize -= 2;
      teluguEditor.style.fontSize = `${currentFontSize}px`;
      fontSizeIndicator.textContent = `${currentFontSize}px`;
    }
  });

  // Clear canvas action
  btnClearCanvas.addEventListener('click', () => {
    if (teluguEditor.value.trim() === '' || confirm('మీరు మొత్తం వచనాన్ని తొలగించాలనుకుంటున్నారా? (Clear entire canvas?)')) {
      teluguEditor.value = '';
      updateStats();
      triggerToast('క్యాలెండర్ శుభ్రం చేయబడింది! (Editor Cleared)');
    }
  });

  // Statistics calculation
  function updateStats() {
    const text = teluguEditor.value || '';
    statChars.textContent = text.length;
    
    // Simple word splitter
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    statWords.textContent = words.length;
  }
  teluguEditor.addEventListener('input', updateStats);

  // Action Toolbar: Copy Text
  btnCopy.addEventListener('click', () => {
    const textToCopy = teluguEditor.value;
    if (!textToCopy) {
      triggerToast('రాయడానికి ఏమీ లేదు! (Nothing to copy)', true);
      return;
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        triggerToast('క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది! (Copied!)');
      })
      .catch(() => {
        triggerToast('కాపీ చేయడం సాధ్యం కాలేదు (Failed to copy)', true);
      });
  });

  // Action Toolbar: Download as Document
  btnDownload.addEventListener('click', () => {
    const text = teluguEditor.value;
    if (!text.trim()) {
      triggerToast('డౌన్‌లోడ్ చేయడానికి వచనం లేదు! (Empty canvas)', true);
      return;
    }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `telugu_typing_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('ఫైల్ డౌన్‌లోడ్ చేయబడింది! (Saved file)');
  });

  // Action Toolbar: Speech Synthesizer (Telugu TTS)
  btnSpeak.addEventListener('click', () => {
    const text = teluguEditor.value;
    if (!text.trim()) {
      triggerToast('చదవడానికి ఏమీ లేదు! (Nothing to read)', true);
      return;
    }
    
    if ('speechSynthesis' in window) {
      // stop active speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'te-IN'; // Telugu (India) locale
      utterance.rate = 0.95; // Slightly slower pacing for better clarity
      
      utterance.onstart = () => {
        triggerToast('వచనాన్ని చదువుతోంది... (Reading text...)');
      };
      
      utterance.onerror = (err) => {
        console.error(err);
        triggerToast('మాట్లాడేటప్పుడు లోపం వచ్చింది (TTS Error)', true);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast('మీ బ్రౌజర్ ఆడియోను సపోర్ట్ చేయదు (Browser doesn\'t support Speech)', true);
    }
  });

  // Custom dynamic Notification Toast Helper
  let toastTimeout;
  function triggerToast(message, isError = false) {
    clearTimeout(toastTimeout);
    toastText.textContent = message;
    if (isError) {
      toastMessage.classList.add('text-rose-400');
      toastMessage.classList.remove('text-amber-400');
    } else {
      toastMessage.classList.add('text-amber-400');
      toastMessage.classList.remove('text-rose-400');
    }
    
    toastMessage.classList.remove('opacity-0');
    toastMessage.classList.add('opacity-100');
    
    toastTimeout = setTimeout(() => {
      toastMessage.classList.remove('opacity-100');
      toastMessage.classList.add('opacity-0');
    }, 3500);
  }

  // Storage Section: Drafts logic
  function getSavedDrafts() {
    const drafts = localStorage.getItem('telugu_editor_drafts');
    return drafts ? JSON.parse(drafts) : [];
  }

  function renderDrafts() {
    const drafts = getSavedDrafts();
    draftsList.innerHTML = '';
    
    if (drafts.length === 0) {
      draftsList.innerHTML = `
        <div class="text-center py-4 text-xs text-slate-500 italic">
          నిల్వ చేసిన డ్రాఫ్ట్‌లు లేవు (No saved drafts yet)
        </div>`;
      return;
    }
    
    drafts.forEach((draft, index) => {
      const div = document.createElement('div');
      div.className = "bg-slate-950 border border-slate-800 rounded-lg p-2 flex flex-col justify-between gap-1.5 hover:border-amber-500/30 transition duration-150 text-xs";
      div.innerHTML = `
        <div class="flex justify-between items-start">
          <span class="font-bold text-slate-200 truncate pr-2" title="${draft.title}">${draft.title}</span>
          <span class="text-[9px] text-slate-500 font-mono">${draft.time}</span>
        </div>
        <p class="text-[11px] text-slate-400 truncate">${draft.content}</p>
        <div class="flex items-center justify-end gap-1.5 mt-1">
          <button class="load-draft-btn px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[10px] font-semibold transition-all" data-index="${index}">
            Load
          </button>
          <button class="delete-draft-btn p-0.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all" data-index="${index}" title="Delete">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      `;
      draftsList.appendChild(div);
    });
    
    // Bind draft load and delete buttons
    document.querySelectorAll('.load-draft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-index');
        const selectedDraft = drafts[idx];
        if (selectedDraft) {
          teluguEditor.value = selectedDraft.content;
          updateStats();
          triggerToast(`Loaded "${selectedDraft.title}" successfully!`);
        }
      });
    });
    
    document.querySelectorAll('.delete-draft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const filtered = drafts.filter((_, i) => i !== idx);
        localStorage.setItem('telugu_editor_drafts', JSON.stringify(filtered));
        renderDrafts();
        triggerToast('డ్రాఫ్ట్ తొలగించబడింది! (Draft deleted)', true);
      });
    });
  }

  // Save draft button action
  btnSaveDraft.addEventListener('click', () => {
    const title = draftTitleInput.value.trim() || `Draft ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    const content = teluguEditor.value;
    
    if (!content.trim()) {
      triggerToast('సేవ్ చేయడానికి కంటెంట్ లేదు (Nothing to save)', true);
      return;
    }
    
    const drafts = getSavedDrafts();
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    drafts.unshift({
      title: title,
      content: content,
      time: dateStr
    });
    
    localStorage.setItem('telugu_editor_drafts', JSON.stringify(drafts));
    draftTitleInput.value = '';
    renderDrafts();
    triggerToast('డ్రాఫ్ట్ విజయవంతంగా సేవ్ చేయబడింది! (Draft Saved)');
  });

  // Initialize on load
  updateStats();
  renderDrafts();
});