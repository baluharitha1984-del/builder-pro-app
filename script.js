document.addEventListener('DOMContentLoaded', () => {
  // State definition
  let sentenceTokens = [];
  let currentSelectedRole = 'subject'; // default grammar role dot
  let sourceWordIndex = null;
  let targetWordIndex = null;
  let appliedDots = {}; // key: wordIndex, value: role ('subject', 'verb', 'object', 'modifier')
  let activeArrows = []; // array of objects: { id, from: index, to: index, color: string }

  // Color mappings
  const roleColors = {
    'subject': '#6366f1',  // indigo
    'verb': '#10b981',     // emerald
    'object': '#f59e0b',   // amber
    'modifier': '#d946ef'  // fuchsia
  };

  const roleMarkers = {
    'subject': 'url(#arrowhead-blue)',
    'verb': 'url(#arrowhead-emerald)',
    'object': 'url(#arrowhead-amber)',
    'modifier': 'url(#arrowhead-pink)'
  };

  // DOM references
  const inputSentence = document.getElementById('custom-sentence-input');
  const btnProcessSentence = document.getElementById('btn-process-sentence');
  const btnResetApp = document.getElementById('btn-reset-app');
  const wordsWrapper = document.getElementById('sentence-words-wrapper');
  const canvasEmptyState = document.getElementById('canvas-empty-state');
  
  const arrowSourceBadge = document.getElementById('arrow-source-badge');
  const arrowTargetBadge = document.getElementById('arrow-target-badge');
  const btnCreateArrow = document.getElementById('btn-create-arrow');
  const btnClearSelection = document.getElementById('btn-clear-selection');
  const btnClearDots = document.getElementById('btn-clear-dots');
  const btnClearArrows = document.getElementById('btn-clear-arrows');
  
  const statDotsCount = document.getElementById('stat-dots-count');
  const statArrowsCount = document.getElementById('stat-arrows-count');
  const coherenceAnalysisText = document.getElementById('coherence-analysis-text');
  const arrowSvgLayer = document.getElementById('arrow-svg-layer');
  const arrowsGroup = document.getElementById('arrows-group');

  // Preset Loaders triggers
  const preset1 = document.getElementById('preset-1');
  const preset2 = document.getElementById('preset-2');
  const preset3 = document.getElementById('preset-3');

  // Role Selector Interaction
  const roleButtons = document.querySelectorAll('.role-dot-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      roleButtons.forEach(b => b.classList.remove('active-picker', 'border-indigo-500', 'border-purple-500'));
      roleButtons.forEach(b => b.classList.add('border-slate-700'));
      
      const role = btn.getAttribute('data-role');
      currentSelectedRole = role;
      btn.classList.add('active-picker');
      btn.classList.remove('border-slate-700');
      btn.classList.add('border-indigo-500');
    });
  });
  // set initial active state style for subject
  document.querySelector('[data-role="subject"]').classList.add('active-picker');

  // Parse Custom Sentence into active word array
  function processText(text) {
    if (!text || text.trim() === "") return;
    
    // simple split retaining punctuation
    const rawWords = text.trim().split(/\s+/);
    sentenceTokens = rawWords.map((word, i) => {
      return {
        id: i,
        text: word
      };
    });

    // Clear canvas annotations but save space
    appliedDots = {};
    activeArrows = [];
    sourceWordIndex = null;
    targetWordIndex = null;

    renderWords();
    updateSelectionUI();
    recalculateArrows();
    triggerAIFeedback();
  }

  // Generate interactive word elements in canvas
  function renderWords() {
    wordsWrapper.innerHTML = '';
    if (sentenceTokens.length === 0) {
      canvasEmptyState.classList.remove('hidden');
      return;
    }
    canvasEmptyState.classList.add('hidden');

    sentenceTokens.forEach((token) => {
      const wordBox = document.createElement('div');
      wordBox.id = `word-${token.id}`;
      wordBox.className = `word-token relative flex flex-col items-center px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl cursor-pointer select-none text-sm font-semibold transition-all`;
      
      // Word label
      const wordSpan = document.createElement('span');
      wordSpan.innerText = token.text;
      wordSpan.className = 'text-white font-mono tracking-tight';
      wordBox.appendChild(wordSpan);

      // Dynamic grammatical dot placeholder container (bottom)
      const dotContainer = document.createElement('div');
      dotContainer.className = 'h-3 flex items-center justify-center mt-1.5 gap-1';
      
      // If an annotation exists for this index
      if (appliedDots[token.id]) {
        const role = appliedDots[token.id];
        const colorClass = role === 'subject' ? 'bg-indigo-500' 
                           : role === 'verb' ? 'bg-emerald-500'
                           : role === 'object' ? 'bg-amber-500'
                           : 'bg-fuchsia-500';
        
        const dot = document.createElement('span');
        dot.className = `w-3.5 h-3.5 rounded-full ${colorClass} inline-block animate-scaleUp shadow-md`;
        dot.title = `Syntactic Role: ${role.toUpperCase()}`;
        dotContainer.appendChild(dot);
      } else {
        // Empty gray indicator dot when hovered
        const previewDot = document.createElement('span');
        previewDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-600/40 opacity-0 group-hover:opacity-100 transition-opacity';
        dotContainer.appendChild(previewDot);
      }
      wordBox.appendChild(dotContainer);

      // Word Index indicator label (tiny top offset)
      const indexTag = document.createElement('span');
      indexTag.className = 'absolute -top-2.5 text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800';
      indexTag.innerText = `#${token.id + 1}`;
      wordBox.appendChild(indexTag);

      // Setup Click listeners for painting dots & marking arrow ends
      wordBox.addEventListener('click', (e) => {
        // Check modifier keys for arrows
        if (e.shiftKey) {
          // Set source
          sourceWordIndex = token.id;
          updateSelectionUI();
        } else if (e.altKey || e.ctrlKey || e.metaKey) {
          // Set target
          targetWordIndex = token.id;
          updateSelectionUI();
        } else {
          // Regular Click toggles/paints standard DOT role
          if (appliedDots[token.id] === currentSelectedRole) {
            delete appliedDots[token.id]; // toggle off
          } else {
            appliedDots[token.id] = currentSelectedRole; // apply color
          }
          renderWords();
          recalculateArrows();
          updateStats();
          triggerAIFeedback();
        }
      });

      wordsWrapper.appendChild(wordBox);
    });

    updateStats();
  }

  // Update selection tags in annotation sidebar
  function updateSelectionUI() {
    if (sourceWordIndex !== null && sentenceTokens[sourceWordIndex]) {
      arrowSourceBadge.innerText = `[#${sourceWordIndex + 1}] "${sentenceTokens[sourceWordIndex].text.replace(/[^a-zA-Z]/g, '')}"`;
      arrowSourceBadge.className = "text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 text-xs";
    } else {
      arrowSourceBadge.innerText = '[None]';
      arrowSourceBadge.className = "text-slate-400 font-mono font-bold bg-slate-500/10 px-2 py-0.5 rounded border border-slate-700 text-xs";
    }

    if (targetWordIndex !== null && sentenceTokens[targetWordIndex]) {
      arrowTargetBadge.innerText = `[#${targetWordIndex + 1}] "${sentenceTokens[targetWordIndex].text.replace(/[^a-zA-Z]/g, '')}"`;
      arrowTargetBadge.className = "text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs";
    } else {
      arrowTargetBadge.innerText = '[None]';
      arrowTargetBadge.className = "text-slate-400 font-mono font-bold bg-slate-500/10 px-2 py-0.5 rounded border border-slate-700 text-xs";
    }

    // Update token highlight classes
    document.querySelectorAll('.word-token').forEach((box, idx) => {
      box.classList.remove('selected-source', 'selected-target');
      if (idx === sourceWordIndex) {
        box.classList.add('selected-source');
      }
      if (idx === targetWordIndex) {
        box.classList.add('selected-target');
      }
    });

    // Enable/Disable generate arrow button
    if (sourceWordIndex !== null && targetWordIndex !== null && sourceWordIndex !== targetWordIndex) {
      btnCreateArrow.removeAttribute('disabled');
    } else {
      btnCreateArrow.setAttribute('disabled', 'true');
    }
  }

  // Create Arrow handler click
  btnCreateArrow.addEventListener('click', () => {
    if (sourceWordIndex !== null && targetWordIndex !== null && sourceWordIndex !== targetWordIndex) {
      // Determine color theme based on source dot role, default purple
      const sourceRole = appliedDots[sourceWordIndex] || 'default';
      const arrowColor = roleColors[sourceRole] || '#a855f7';
      const markerId = roleMarkers[sourceRole] || 'url(#arrowhead-default)';
      
      // Check duplicate
      const exists = activeArrows.some(arrow => arrow.from === sourceWordIndex && arrow.to === targetWordIndex);
      if (!exists) {
        activeArrows.push({
          id: Date.now() + Math.random().toString(36).substr(2, 5),
          from: sourceWordIndex,
          to: targetWordIndex,
          color: arrowColor,
          marker: markerId
        });
      }

      // Reset selections
      sourceWordIndex = null;
      targetWordIndex = null;
      
      updateSelectionUI();
      recalculateArrows();
      updateStats();
      triggerAIFeedback();
    }
  });

  // Clear single selection endpoints
  btnClearSelection.addEventListener('click', () => {
    sourceWordIndex = null;
    targetWordIndex = null;
    updateSelectionUI();
  });

  // Clear Dots
  btnClearDots.addEventListener('click', () => {
    appliedDots = {};
    renderWords();
    triggerAIFeedback();
  });

  // Clear Arrows
  btnClearArrows.addEventListener('click', () => {
    activeArrows = [];
    recalculateArrows();
    updateStats();
    triggerAIFeedback();
  });

  // Recalculate and draw SVG arrows linking active tokens
  function recalculateArrows() {
    // Empty existing paths
    arrowsGroup.innerHTML = '';
    
    if (activeArrows.length === 0) return;

    const containerRect = wordsWrapper.getBoundingClientRect();

    activeArrows.forEach((arrow) => {
      const elFrom = document.getElementById(`word-${arrow.from}`);
      const elTo = document.getElementById(`word-${arrow.to}`);

      if (!elFrom || !elTo) return; // boundary safety

      const rectFrom = elFrom.getBoundingClientRect();
      const rectTo = elTo.getBoundingClientRect();

      // Center of word capsules vertically, anchor points
      const startX = rectFrom.left - containerRect.left + rectFrom.width / 2;
      const startY = rectFrom.top - containerRect.top;
      
      const endX = rectTo.left - containerRect.left + rectTo.width / 2;
      const endY = rectTo.top - containerRect.top;

      // Calculate bezier curves arching upward relative to token distance
      const distanceX = Math.abs(endX - startX);
      const archHeight = Math.min(100, Math.max(35, distanceX * 0.45));
      
      // Control points for pretty curved path
      const cpStartX = startX;
      const cpStartY = startY - archHeight;
      const cpEndX = endX;
      const cpEndY = endY - archHeight;

      const pathD = `M ${startX} ${startY} C ${cpStartX} ${cpStartY}, ${cpEndX} ${cpEndY}, ${endX} ${endY}`;

      // Draw actual SVG path link
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", pathD);
      pathEl.setAttribute("stroke", arrow.color);
      pathEl.setAttribute("stroke-width", "2.5");
      pathEl.setAttribute("fill", "none");
      pathEl.setAttribute("class", "arrow-line");
      pathEl.setAttribute("marker-end", arrow.marker);
      pathEl.setAttribute("opacity", "0.85");

      // Interactive click to delete arrow
      pathEl.setAttribute("cursor", "pointer");
      pathEl.style.pointerEvents = "auto";
      pathEl.addEventListener('mouseenter', () => {
        pathEl.setAttribute("stroke-width", "4");
        pathEl.setAttribute("opacity", "1");
      });
      pathEl.addEventListener('mouseleave', () => {
        pathEl.setAttribute("stroke-width", "2.5");
        pathEl.setAttribute("opacity", "0.85");
      });
      pathEl.addEventListener('click', (e) => {
        e.stopPropagation();
        activeArrows = activeArrows.filter(a => a.id !== arrow.id);
        recalculateArrows();
        updateStats();
        triggerAIFeedback();
      });

      arrowsGroup.appendChild(pathEl);
    });
  }

  // Update stats summary counter
  function updateStats() {
    const dotKeys = Object.keys(appliedDots);
    statDotsCount.innerText = `${dotKeys.length} Dot${dotKeys.length === 1 ? '' : 's'} Applied`;
    statArrowsCount.innerText = `${activeArrows.length} Arrow${activeArrows.length === 1 ? '' : 's'} Active`;
  }

  // Analyze context structure & output useful descriptive English feedback details
  function triggerAIFeedback() {
    const dotsCount = Object.keys(appliedDots).length;
    const arrowsCount = activeArrows.length;
    const fullSentenceStr = sentenceTokens.map(t => t.text).join(' ');

    if (sentenceTokens.length === 0) {
      coherenceAnalysisText.innerText = "Load a sentence presets or write custom text to trigger structural syntactic parsing.";
      return;
    }

    let critique = `Analyzed text: "${fullSentenceStr}". `;
    
    if (dotsCount === 0 && arrowsCount === 0) {
      critique += "Assign grammar DOT roles to distinguish subjects and objects, then hold Shift/Alt-Click to draw cohesive transition ARROWS.";
    } else {
      critique += `Canvas contains ${dotsCount} custom word nodes and ${arrowsCount} flow direction markers. `;
      
      // Provide actual guidance comments based on loaded words
      if (fullSentenceStr.toLowerCase().includes("although")) {
        critique += "Excellent! Notice how 'Although' sets up a concessive subordinate clause. An arrow from 'Although' or 'rained' to the main action 'enjoyed' illustrates clause modifier hierarchy perfectly.";
      } else if (fullSentenceStr.toLowerCase().includes("fox")) {
        critique += "Simple declarative construction. Try highlighting 'fox' with an Indigo Subject Dot and 'jumps' with an Emerald Verb Dot to outline the sentence core.";
      } else if (arrowsCount > 2) {
        critique += "The high density of transition arrows maps out complex nested linkages. Be sure that each arrow connects clear modifier components to their syntactic targets to check for dangling modifiers.";
      } else {
        critique += "Keep mapping the sentence elements. Try linking modifying adjectives to their respective nouns to check for modifier alignment and logical balance.";
      }
    }

    coherenceAnalysisText.innerText = critique;
  }

  // Handle live window resize mapping adjustment
  window.addEventListener('resize', () => {
    // Debounce recalculating layout coordinates
    recalculateArrows();
  });

  // Button triggers custom generation of input text
  btnProcessSentence.addEventListener('click', () => {
    processText(inputSentence.value);
  });

  // Clean reset to original state
  btnResetApp.addEventListener('click', () => {
    inputSentence.value = "The visual architect crafted the sentence, and the active reader followed the flow.";
    processText(inputSentence.value);
  });

  // Preset Load Event Handlers
  preset1.addEventListener('click', () => {
    inputSentence.value = "The quick brown fox jumps over the lazy dog.";
    processText(inputSentence.value);
    
    // Pre-apply dots
    appliedDots = { 3: 'subject', 4: 'verb', 9: 'object' };
    // Pre-apply arrows
    activeArrows = [
      { id: 'p1_1', from: 3, to: 4, color: roleColors.subject, marker: roleMarkers.subject },
      { id: 'p1_2', from: 1, to: 3, color: roleColors.modifier, marker: roleMarkers.modifier }
    ];
    renderWords();
    recalculateArrows();
    updateStats();
    triggerAIFeedback();
  });

  preset2.addEventListener('click', () => {
    inputSentence.value = "Although it rained heavily, we enjoyed the long walk.";
    processText(inputSentence.value);
    
    // Pre-apply dots
    appliedDots = { 0: 'modifier', 3: 'verb', 5: 'subject', 6: 'verb', 9: 'object' };
    // Pre-apply arrows
    activeArrows = [
      { id: 'p2_1', from: 0, to: 6, color: roleColors.modifier, marker: roleMarkers.modifier },
      { id: 'p2_2', from: 3, to: 0, color: roleColors.verb, marker: roleMarkers.verb }
    ];
    renderWords();
    recalculateArrows();
    updateStats();
    triggerAIFeedback();
  });

  preset3.addEventListener('click', () => {
    inputSentence.value = "Writing requires clarity, and editing demands discipline.";
    processText(inputSentence.value);
    
    // Pre-apply dots
    appliedDots = { 0: 'subject', 1: 'verb', 2: 'object', 5: 'subject', 6: 'verb', 7: 'object' };
    // Pre-apply arrows
    activeArrows = [
      { id: 'p3_1', from: 0, to: 5, color: roleColors.subject, marker: roleMarkers.subject },
      { id: 'p3_2', from: 2, to: 7, color: roleColors.object, marker: roleMarkers.object }
    ];
    renderWords();
    recalculateArrows();
    updateStats();
    triggerAIFeedback();
  });

  // Initial Boot
  processText(inputSentence.value);
  // Pre-load layout calculation once page fully paints
  setTimeout(recalculateArrows, 200);
});