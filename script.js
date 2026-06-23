document.addEventListener('DOMContentLoaded', () => {
  // -- TAB STATE SYSTEM --
  const tabs = ['regex', 'json', 'contrast', 'text'];
  const navButtons = {
    regex: document.getElementById('nav-regex'),
    json: document.getElementById('nav-json'),
    contrast: document.getElementById('nav-contrast'),
    text: document.getElementById('nav-text')
  };
  const panes = {
    regex: document.getElementById('pane-regex'),
    json: document.getElementById('pane-json'),
    contrast: document.getElementById('pane-contrast'),
    text: document.getElementById('pane-text')
  };

  function switchTab(activeTabKey) {
    tabs.forEach(tabKey => {
      if (tabKey === activeTabKey) {
        navButtons[tabKey].classList.add('active');
        navButtons[tabKey].classList.add('bg-indigo-500/15', 'border-indigo-500/40', 'text-white');
        navButtons[tabKey].classList.remove('text-slate-400', 'hover:bg-slate-900/60');
        panes[tabKey].classList.remove('hidden');
      } else {
        navButtons[tabKey].classList.remove('active');
        navButtons[tabKey].classList.remove('bg-indigo-500/15', 'border-indigo-500/40', 'text-white');
        navButtons[tabKey].classList.add('text-slate-400', 'hover:bg-slate-900/60');
        panes[tabKey].classList.add('hidden');
      }
    });
    showToast(`Switched to ${activeTabKey.toUpperCase()} Sandbox`, 'info');
  }

  Object.keys(navButtons).forEach(key => {
    navButtons[key].addEventListener('click', () => switchTab(key));
  });

  // -- TOAST ALERT SYSTEM --
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `flex items-center space-x-2.5 px-4 py-3 rounded-xl border text-sm shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto select-none`;
    
    const colorMap = {
      success: 'bg-slate-900/95 border-emerald-500/40 text-emerald-400 shadow-emerald-950/20',
      error: 'bg-slate-900/95 border-rose-500/40 text-rose-400 shadow-rose-950/20',
      info: 'bg-slate-900/95 border-indigo-500/40 text-indigo-400 shadow-indigo-950/20'
    };
    
    toast.className += ' ' + colorMap[type];
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-rose-400' : 'bg-indigo-400'}"></span>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Reflow trigger
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  // Active Session Counter Incrementor
  setInterval(() => {
    const counter = document.getElementById('session-counter');
    if (counter) {
      const current = parseInt(counter.textContent.replace(/,/g, ''), 10);
      counter.textContent = (current + Math.floor(Math.random() * 3) - 1).toLocaleString();
    }
  }, 4000);

  document.getElementById('btn-quick-toast').addEventListener('click', () => {
    showToast('Everything is functional and client-side safe!', 'success');
  });


  // ===================================
  // 1. REGEX PLAYGROUND LOGIC
  // ===================================
  const regexPatternInput = document.getElementById('regex-pattern');
  const regexFlagsInput = document.getElementById('regex-flags');
  const regexInput = document.getElementById('regex-input');
  const regexOutputPreview = document.getElementById('regex-output-preview');
  const regexStats = document.getElementById('regex-stats');
  const regexPresets = document.getElementById('regex-presets');
  const regexGroupsLog = document.getElementById('regex-groups-log');
  const btnRegexSample = document.getElementById('btn-regex-sample');

  const PRESETS = {
    email: { pattern: '([A-Za-z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})', flags: 'g', text: "Say hello to test@example.com and dev_user-99@sandbox.io for immediate validation! Optional email info@sub.domain.org" },
    phone: { pattern: '\\(?(\\d{3})\\)?[-.\\s]?(\\d{3})[-.\\s]?(\\d{4})', flags: 'g', text: "Call us at (555) 019-2834 or dial 123-456-7890 for setup configurations." },
    date: { pattern: '\\b(\\d{4})-(\\d{2})-(\\d{2})\\b', flags: 'g', text: "Database records logged on 2024-11-20 and 2023-01-15 with backups on 2019-12-31." },
    hex: { pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', flags: 'g', text: "Palette hex ranges include #1e1b4b, #c7d2fe, #ff007f and standard #fff output markers." }
  };

  function evaluateRegex() {
    const pattern = regexPatternInput.value;
    const flags = regexFlagsInput.value;
    const text = regexInput.value;

    if (!pattern) {
      regexOutputPreview.innerHTML = `<span class="text-slate-500 italic">Type in an expression...</span>`;
      regexStats.textContent = '';
      regexGroupsLog.innerHTML = `<p class="text-slate-500 italic">No capture matches retrieved yet.</p>`;
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const isGlobal = flags.includes('g');
      
      // Simple highlight approach using String replacement
      // To prevent infinite loops with empty regex matches:
      let matchTest = regex.test(text);
      regex.lastIndex = 0; // reset test

      if (!matchTest) {
        regexOutputPreview.textContent = text || ' '; 
        regexStats.textContent = '0 matches';
        regexGroupsLog.innerHTML = `<p class="text-slate-500 italic">No matches found in string.</p>`;
        return;
      }

      let matchCount = 0;
      let groupsHtml = '';
      let highlightedText = '';

      if (isGlobal) {
        let lastIdx = 0;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          matchCount++;
          
          // Segment preceding current match
          highlightedText += escapeHtml(text.slice(lastIdx, match.index));
          highlightedText += `<span class="regex-highlight">${escapeHtml(match[0])}</span>`;
          lastIdx = regex.lastIndex;

          // Track matched groups
          if (match.length > 1) {
            groupsHtml += `<div class="py-1 flex items-center gap-1.5">
              <span class="regex-group-badge">Match #${matchCount}</span>
              <span>${match.slice(1).map((g, idx) => `g${idx+1}: "${escapeHtml(g || '')}"`).join(', ')}</span>
            </div>`;
          }
        }
        highlightedText += escapeHtml(text.slice(lastIdx));
      } else {
        const match = text.match(regex);
        if (match) {
          matchCount = 1;
          const index = match.index;
          highlightedText = escapeHtml(text.slice(0, index)) + 
                            `<span class="regex-highlight">${escapeHtml(match[0])}</span>` + 
                            escapeHtml(text.slice(index + match[0].length));

          if (match.length > 1) {
            groupsHtml += `<div class="py-1 flex items-center gap-1.5">
              <span class="regex-group-badge">Match #1</span>
              <span>${match.slice(1).map((g, idx) => `g${idx+1}: "${escapeHtml(g || '')}"`).join(', ')}</span>
            </div>`;
          }
        }
      }

      regexOutputPreview.innerHTML = highlightedText;
      regexStats.textContent = `${matchCount} match${matchCount === 1 ? '' : 'es'}`;
      regexGroupsLog.innerHTML = groupsHtml || `<p class="text-slate-500 italic">Matches found but no capturing groups declared.</p>`;
      
    } catch (err) {
      regexStats.textContent = 'Invalid RegExp';
      regexOutputPreview.innerHTML = `<span class="text-rose-400 font-bold">RegEx Error:</span> <span class="text-rose-300">${escapeHtml(err.message)}</span>`;
      regexGroupsLog.innerHTML = `<p class="text-rose-400">Fix your active pattern configurations.</p>`;
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  regexPresets.addEventListener('change', (e) => {
    const preset = PRESETS[e.target.value];
    if (preset) {
      regexPatternInput.value = preset.pattern;
      regexFlagsInput.value = preset.flags;
      regexInput.value = preset.text;
      evaluateRegex();
      showToast(`Loaded "${e.target.value.toUpperCase()}" Preset pattern`, 'success');
    }
  });

  btnRegexSample.addEventListener('click', () => {
    regexPatternInput.value = '(\\b\\w+test\\w*\\b)';
    regexFlagsInput.value = 'gi';
    regexInput.value = 'Hello world! This is a test workspace with testing actions. Real-time test-runs are completely supported here.';
    regexPresets.value = '';
    evaluateRegex();
    showToast('Loaded standard Sandbox test mock data.', 'info');
  });

  regexPatternInput.addEventListener('input', evaluateRegex);
  regexFlagsInput.addEventListener('input', evaluateRegex);
  regexInput.addEventListener('input', evaluateRegex);

  // Init with default data
  regexPatternInput.value = '([A-Za-z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})';
  regexInput.value = 'Reach us at testing-team@sandbox.io or admin-office@mail.org for diagnostic logs!';
  evaluateRegex();


  // ===================================
  // 2. JSON FORMATTER & VALIDATOR
  // ===================================
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const btnJsonBeautify = document.getElementById('btn-json-beautify');
  const btnJsonMinify = document.getElementById('btn-json-minify');
  const btnJsonSample = document.getElementById('btn-json-sample');
  const btnJsonCopy = document.getElementById('btn-json-copy');
  const jsonValidationStatus = document.getElementById('json-validation-status');
  const jsonLines = document.getElementById('json-output-lines');

  const dirtySampleJson = '{"appName":"OmniTest","features":["regex","json","contrast","text"],"activeSession":true,"metrics":{"totalRequests":9840,"pingMs":4.55},"errorCount":0,"message":"this was unformatted payload"}';

  function updateJsonLinesCount(text) {
    const lines = text ? text.split('\n').length : 0;
    jsonLines.textContent = `${lines} line${lines === 1 ? '' : 's'}`;
  }

  btnJsonBeautify.addEventListener('click', () => {
    const rawVal = jsonInput.value.trim();
    if (!rawVal) {
      showToast('Please insert raw JSON payload first', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(rawVal);
      const formatted = JSON.stringify(parsed, null, 2);
      jsonOutput.textContent = formatted;
      jsonOutput.className = "flex-1 min-h-[250px] bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm overflow-auto text-emerald-400 select-text leading-relaxed";
      
      jsonValidationStatus.textContent = "Valid JSON";
      jsonValidationStatus.className = "text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/50";
      updateJsonLinesCount(formatted);
      showToast('Formatted JSON successfully!', 'success');
    } catch (err) {
      jsonOutput.textContent = `Syntax Error: ${err.message}`;
      jsonOutput.className = "flex-1 min-h-[250px] bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm overflow-auto text-rose-400 select-text leading-relaxed";
      
      jsonValidationStatus.textContent = "Invalid Syntax";
      jsonValidationStatus.className = "text-xs font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-800/50";
      showToast('JSON validation failed', 'error');
    }
  });

  btnJsonMinify.addEventListener('click', () => {
    const rawVal = jsonInput.value.trim();
    if (!rawVal) {
      showToast('Please insert raw JSON payload first', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(rawVal);
      const minified = JSON.stringify(parsed);
      jsonOutput.textContent = minified;
      jsonOutput.className = "flex-1 min-h-[250px] bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm overflow-auto text-emerald-400 select-text leading-relaxed";
      
      jsonValidationStatus.textContent = "Valid JSON Minified";
      jsonValidationStatus.className = "text-xs font-semibold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded-md border border-teal-800/50";
      updateJsonLinesCount(minified);
      showToast('Minified JSON payload!', 'success');
    } catch (err) {
      jsonOutput.textContent = `Syntax Error during minification: ${err.message}`;
      jsonOutput.className = "flex-1 min-h-[250px] bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm overflow-auto text-rose-400 select-text leading-relaxed";
      
      jsonValidationStatus.textContent = "Invalid Syntax";
      jsonValidationStatus.className = "text-xs font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-800/50";
      showToast('JSON validation failed', 'error');
    }
  });

  btnJsonSample.addEventListener('click', () => {
    jsonInput.value = dirtySampleJson;
    showToast('Loaded testing dirty JSON sample', 'info');
  });

  btnJsonCopy.addEventListener('click', () => {
    const textToCopy = jsonOutput.textContent;
    if (!textToCopy) {
      showToast('Nothing to copy', 'error');
      return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Copied JSON to Clipboard!', 'success');
    });
  });


  // ===================================
  // 3. COLOR CONTRAST LOGIC (WCAG AA/AAA)
  // ===================================
  const bgPicker = document.getElementById('contrast-bg-picker');
  const bgHexInput = document.getElementById('contrast-bg-hex');
  const fgPicker = document.getElementById('contrast-fg-picker');
  const fgHexInput = document.getElementById('contrast-fg-hex');
  
  const previewBox = document.getElementById('contrast-preview-box');
  const previewTitle = document.getElementById('contrast-preview-title');
  const previewDesc = document.getElementById('contrast-preview-desc');

  const ratioResult = document.getElementById('contrast-ratio-result');
  const badgeNormalAA = document.getElementById('badge-normal-aa');
  const textNormalAA = document.getElementById('text-normal-aa');
  const badgeLargeAAA = document.getElementById('badge-large-aaa');
  const textLargeAAA = document.getElementById('text-large-aaa');

  // RGB conversion utilities
  function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Formula to evaluate relative luminance 
  function getLuminance(r, g, b) {
    let a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function calculateContrast() {
    const bgHex = bgHexInput.value;
    const fgHex = fgHexInput.value;

    const bgRgb = hexToRgb(bgHex);
    const fgRgb = hexToRgb(fgHex);

    if (!bgRgb || !fgRgb) {
      ratioResult.textContent = "Error";
      return;
    }

    // Update preview colors
    previewBox.style.backgroundColor = bgHex;
    previewBox.style.borderColor = fgHex + '44'; // slightly transparent border
    previewTitle.style.color = fgHex;
    previewDesc.style.color = fgHex;

    const l1 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const l2 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);

    // Contrast calculation
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const formattedRatio = ratio.toFixed(2);
    ratioResult.textContent = `${formattedRatio}:1`;

    // WCAG validation thresholds
    // AA Normal text requires >= 4.5
    if (ratio >= 4.5) {
      badgeNormalAA.className = "w-3 h-3 rounded-full bg-emerald-500 shadow shadow-emerald-500/50";
      textNormalAA.textContent = "Pass (AA)";
      textNormalAA.className = "text-xs font-semibold text-emerald-400";
    } else {
      badgeNormalAA.className = "w-3 h-3 rounded-full bg-rose-500 shadow shadow-rose-500/50";
      textNormalAA.textContent = "Fail";
      textNormalAA.className = "text-xs font-semibold text-rose-400";
    }

    // AAA Large text / High-Contrast requires >= 7.0
    if (ratio >= 7.0) {
      badgeLargeAAA.className = "w-3 h-3 rounded-full bg-emerald-500 shadow shadow-emerald-500/50";
      textLargeAAA.textContent = "Pass (AAA)";
      textLargeAAA.className = "text-xs font-semibold text-emerald-400";
    } else {
      badgeLargeAAA.className = "w-3 h-3 rounded-full bg-rose-500 shadow shadow-rose-500/50";
      textLargeAAA.textContent = "Fail";
      textLargeAAA.className = "text-xs font-semibold text-rose-400";
    }
  }

  // Sync helper
  function syncBg(val) {
    bgPicker.value = val;
    bgHexInput.value = val;
    calculateContrast();
  }
  function syncFg(val) {
    fgPicker.value = val;
    fgHexInput.value = val;
    calculateContrast();
  }

  bgPicker.addEventListener('input', (e) => syncBg(e.target.value));
  bgHexInput.addEventListener('input', (e) => syncBg(e.target.value));
  fgPicker.addEventListener('input', (e) => syncFg(e.target.value));
  fgHexInput.addEventListener('input', (e) => syncFg(e.target.value));

  // Swatches interaction
  document.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bg = btn.getAttribute('data-bg');
      const fg = btn.getAttribute('data-fg');
      syncBg(bg);
      syncFg(fg);
      showToast('Applied test swatches!', 'info');
    });
  });

  // Trigger initial color calculations
  calculateContrast();


  // ===================================
  // 4. TEXT UTILITIES & HASH GENERATOR
  // ===================================
  const utilsInput = document.getElementById('utils-input');
  const utilsOutputField = document.getElementById('utils-output-field');
  const btnUtilsUpper = document.getElementById('btn-utils-upper');
  const btnUtilsLower = document.getElementById('btn-utils-lower');
  const btnUtilsB64Enc = document.getElementById('btn-utils-base64-enc');
  const btnUtilsB64Dec = document.getElementById('btn-utils-base64-dec');
  const btnUtilsCopy = document.getElementById('btn-utils-copy');
  
  const metricChars = document.getElementById('util-metric-chars');
  const metricWords = document.getElementById('util-metric-words');
  const metricLines = document.getElementById('util-metric-lines');
  const metricBytes = document.getElementById('util-metric-bytes');
  const hashOutput = document.getElementById('util-hash-output');

  // Generate SHA-256 with native WebCrypto API
  async function updateHashValue(text) {
    if (!text) {
      hashOutput.textContent = "Input text above to calculate hash signature...";
      return;
    }
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      hashOutput.textContent = hashHex;
    } catch (e) {
      hashOutput.textContent = "Unable to compute hash on this device";
    }
  }

  function evaluateMetrics() {
    const val = utilsInput.value;
    metricChars.textContent = val.length;
    
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    metricWords.textContent = words;

    const lines = val ? val.split('\n').length : 0;
    metricLines.textContent = lines;

    const bytes = new Blob([val]).size;
    metricBytes.textContent = `${bytes} B`;

    updateHashValue(val);
  }

  // Upper Case Mutator
  btnUtilsUpper.addEventListener('click', () => {
    const transformed = utilsInput.value.toUpperCase();
    utilsOutputField.value = transformed;
    showToast('Transformed text to UPPERCASE', 'success');
  });

  // Lower Case Mutator
  btnUtilsLower.addEventListener('click', () => {
    const transformed = utilsInput.value.toLowerCase();
    utilsOutputField.value = transformed;
    showToast('Transformed text to lowercase', 'success');
  });

  // Base64 Encode
  btnUtilsB64Enc.addEventListener('click', () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(utilsInput.value)));
      utilsOutputField.value = encoded;
      showToast('Encoded input to Base64', 'success');
    } catch (e) {
      showToast('Invalid string characters for Base64 encoding', 'error');
    }
  });

  // Base64 Decode
  btnUtilsB64Dec.addEventListener('click', () => {
    try {
      const decoded = decodeURIComponent(escape(atob(utilsInput.value)));
      utilsOutputField.value = decoded;
      showToast('Decoded Base64 string successfully', 'success');
    } catch (e) {
      showToast('String is not valid Base64 encoded data', 'error');
    }
  });

  // Copy button
  btnUtilsCopy.addEventListener('click', () => {
    const content = utilsOutputField.value;
    if (!content) {
      showToast('Nothing to copy from result', 'error');
      return;
    }
    navigator.clipboard.writeText(content).then(() => {
      showToast('Copied utility output!', 'success');
    });
  });

  utilsInput.addEventListener('input', evaluateMetrics);
  
  // Initial text utility runs
  evaluateMetrics();
});