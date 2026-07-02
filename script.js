document.addEventListener('DOMContentLoaded', () => {
  // State Management
  const state = {
    activeImageSrc: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hue: 0,
      sepia: 0
    },
    watermark: {
      enabled: true,
      text: '© PIXELFORGE STUDIO',
      position: 'bottom-right',
      color: '#ffffff'
    },
    transform: {
      rotation: 0, // 0, 90, 180, 270
      flipH: false
    },
    gallerySnapshots: []
  };

  // Core DOM Nodes
  const mainCanvas = document.getElementById('mainCanvas');
  const ctx = mainCanvas.getContext('2d');
  const canvasLoader = document.getElementById('canvasLoader');
  const canvasDimensionsInfo = document.getElementById('canvasDimensionsInfo');
  const diagFiltersCount = document.getElementById('diagFiltersCount');
  const operationLogsWrapper = document.getElementById('operationLogsWrapper');

  // Sliders & Controls
  const filterBrightness = document.getElementById('filterBrightness');
  const filterContrast = document.getElementById('filterContrast');
  const filterSaturation = document.getElementById('filterSaturation');
  const filterBlur = document.getElementById('filterBlur');
  const filterHue = document.getElementById('filterHue');
  const filterSepia = document.getElementById('filterSepia');

  const valBrightness = document.getElementById('valBrightness');
  const valContrast = document.getElementById('valContrast');
  const valSaturation = document.getElementById('valSaturation');
  const valBlur = document.getElementById('valBlur');
  const valHue = document.getElementById('valHue');
  const valSepia = document.getElementById('valSepia');

  // Watermark Elements
  const watermarkToggle = document.getElementById('watermarkToggle');
  const watermarkControls = document.getElementById('watermarkControls');
  const watermarkText = document.getElementById('watermarkText');
  const watermarkPos = document.getElementById('watermarkPos');
  const watermarkColor = document.getElementById('watermarkColor');
  const watermarkColorText = document.getElementById('watermarkColorText');

  // Image Loader object
  let activeImg = new Image();
  activeImg.crossOrigin = 'anonymous'; // Support external links safely

  // Logging utility
  function appendLog(message) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const logElement = document.createElement('div');
    logElement.className = 'text-[11px] font-mono text-slate-400 border-l-2 border-indigo-500/30 pl-2 py-0.5 animate-card';
    logElement.textContent = `[${timestamp}] ${message}`;
    operationLogsWrapper.insertBefore(logElement, operationLogsWrapper.firstChild);
  }

  // Initialize controls visually with state
  function syncControlSliders() {
    filterBrightness.value = state.filters.brightness;
    valBrightness.textContent = `${state.filters.brightness}%`;

    filterContrast.value = state.filters.contrast;
    valContrast.textContent = `${state.filters.contrast}%`;

    filterSaturation.value = state.filters.saturation;
    valSaturation.textContent = `${state.filters.saturation}%`;

    filterBlur.value = state.filters.blur;
    valBlur.textContent = `${state.filters.blur}px`;

    filterHue.value = state.filters.hue;
    valHue.textContent = `${state.filters.hue}°`;

    filterSepia.value = state.filters.sepia;
    valSepia.textContent = `${state.filters.sepia}%`;

    watermarkToggle.checked = state.watermark.enabled;
    watermarkText.value = state.watermark.text;
    watermarkPos.value = state.watermark.position;
    watermarkColor.value = state.watermark.color;
    watermarkColorText.value = state.watermark.color.toUpperCase();

    // Diagnostic count update
    let activeCount = 0;
    if (state.filters.brightness !== 100) activeCount++;
    if (state.filters.contrast !== 100) activeCount++;
    if (state.filters.saturation !== 100) activeCount++;
    if (state.filters.blur !== 0) activeCount++;
    if (state.filters.hue !== 0) activeCount++;
    if (state.filters.sepia !== 0) activeCount++;
    diagFiltersCount.textContent = `${activeCount} active adjustments`;
  }

  // Master render canvas handler
  function renderCanvas() {
    if (!activeImg.complete) return;

    canvasLoader.classList.remove('hidden');

    const startTime = performance.now();

    // Target sizing logic - constraint base size to make real-time interaction snappy
    const maxDimension = 1200;
    let width = activeImg.naturalWidth || 800;
    let height = activeImg.naturalHeight || 600;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    // Handle 90/270 rotation dimension swapping
    const isRotated90 = (state.transform.rotation / 90) % 2 !== 0;
    const canvasWidth = isRotated90 ? height : width;
    const canvasHeight = isRotated90 ? width : height;

    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasHeight;
    canvasDimensionsInfo.textContent = `${canvasWidth} x ${canvasHeight} PX`;

    // Clear and translate context context
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    // 1. Move origin to center of canvas to rotate
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // 2. Flip horizontal if set
    if (state.transform.flipH) {
      ctx.scale(-1, 1);
    }

    // 3. Rotate
    ctx.rotate((state.transform.rotation * Math.PI) / 180);

    // 4. Draw Image applying CSS filters
    const filtersString = `
      brightness(${state.filters.brightness}%)
      contrast(${state.filters.contrast}%)
      saturate(${state.filters.saturation}%)
      blur(${state.filters.blur}px)
      hue-rotate(${state.filters.hue}deg)
      sepia(${state.filters.sepia}%)
    `;
    ctx.filter = filtersString;

    // Draw the source back down aligned with the centered origin
    ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);
    ctx.restore();

    // 5. Draw Watermark static overlay
    if (state.watermark.enabled && state.watermark.text.trim() !== '') {
      ctx.save();
      // Setup styling
      const fontSize = Math.max(14, Math.round(canvasWidth / 35));
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.fillStyle = state.watermark.color;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const padding = 24;
      const textWidth = ctx.measureText(state.watermark.text).width;
      let x = canvasWidth - textWidth - padding;
      let y = canvasHeight - padding;

      switch (state.watermark.position) {
        case 'top-left':
          x = padding;
          y = padding + fontSize;
          break;
        case 'top-right':
          x = canvasWidth - textWidth - padding;
          y = padding + fontSize;
          break;
        case 'bottom-left':
          x = padding;
          y = canvasHeight - padding;
          break;
        case 'center':
          x = (canvasWidth - textWidth) / 2;
          y = canvasHeight / 2 + fontSize / 3;
          break;
        case 'bottom-right':
        default:
          x = canvasWidth - textWidth - padding;
          y = canvasHeight - padding;
          break;
      }

      ctx.fillText(state.watermark.text, x, y);
      ctx.restore();
    }

    // Finished
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(1);
    document.getElementById('diagSpeed').textContent = `~${duration}ms (GPU Canvas)`;
    
    canvasLoader.classList.add('hidden');
  }

  // Handle image load triggers
  function loadImageSource(src) {
    canvasLoader.classList.remove('hidden');
    activeImg.src = src;
    state.activeImageSrc = src;
  }

  activeImg.onload = () => {
    appendLog('Successfully loaded assets onto standard 2D view.');
    renderCanvas();
  };

  activeImg.onerror = () => {
    appendLog('Failed to retrieve external sample image via CORS. Reverting to custom generated pattern.');
    // Revert to generated Canvas Pattern to ensure beautiful fallback with zero external dependencies
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 600;
    fallbackCanvas.height = 400;
    const fctx = fallbackCanvas.getContext('2d');
    const grad = fctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(0.5, '#ec4899');
    grad.addColorStop(1, '#14b8a6');
    fctx.fillStyle = grad;
    fctx.fillRect(0, 0, 600, 400);
    fctx.fillStyle = '#ffffff';
    fctx.font = '24px bold sans-serif';
    fctx.fillText('PixelForge Sandbox Graphics', 40, 200);
    
    activeImg.src = fallbackCanvas.toDataURL();
  };

  // Handle File Upload
  document.getElementById('imageUploader').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        loadImageSource(readerEvent.target.result);
        document.getElementById('diagSourceType').textContent = 'User Custom Upload';
        appendLog(`Uploaded customized image frame: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  });

  // Switch Starter Samples
  document.querySelectorAll('.sample-img-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sample-img-btn').forEach(b => b.classList.remove('border-indigo-500'));
      btn.classList.add('border-indigo-500');
      const src = btn.getAttribute('data-src');
      loadImageSource(src);
      document.getElementById('diagSourceType').textContent = 'Curated Stock Asset';
      appendLog('Switched starter canvas focus');
    });
  });

  // Live Preset Button Handlers
  function clearPresetsStyling() {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('preset-active'));
  }

  document.getElementById('presetNormal').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetNormal').classList.add('preset-active');
    state.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, sepia: 0 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Clear Classic');
  });

  document.getElementById('presetCyber').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetCyber').classList.add('preset-active');
    state.filters = { brightness: 110, contrast: 140, saturation: 180, blur: 0, hue: 120, sepia: 0 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Cyber Synth (Saturated & Hue shifted)');
  });

  document.getElementById('presetMono').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetMono').classList.add('preset-active');
    state.filters = { brightness: 100, contrast: 150, saturation: 0, blur: 0, hue: 0, sepia: 0 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Noir Charcoal (High Contrast Monochromatic)');
  });

  document.getElementById('presetVintage').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetVintage').classList.add('preset-active');
    state.filters = { brightness: 90, contrast: 90, saturation: 70, blur: 0, hue: 0, sepia: 80 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Retro Sepia (Aged film stock simulation)');
  });

  document.getElementById('presetSunset').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetSunset').classList.add('preset-active');
    state.filters = { brightness: 110, contrast: 110, saturation: 160, blur: 0, hue: 15, sepia: 20 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Warm Sunset Glow');
  });

  document.getElementById('presetCool').addEventListener('click', () => {
    clearPresetsStyling();
    document.getElementById('presetCool').classList.add('preset-active');
    state.filters = { brightness: 100, contrast: 105, saturation: 90, blur: 0, hue: 200, sepia: 5 };
    syncControlSliders();
    renderCanvas();
    appendLog('Applied Preset: Arctic Ice (Cold temperature simulation)');
  });

  // Real-time Sliders Bindings
  const handleSliderUpdate = () => {
    state.filters.brightness = parseInt(filterBrightness.value);
    state.filters.contrast = parseInt(filterContrast.value);
    state.filters.saturation = parseInt(filterSaturation.value);
    state.filters.blur = parseInt(filterBlur.value);
    state.filters.hue = parseInt(filterHue.value);
    state.filters.sepia = parseInt(filterSepia.value);
    
    syncControlSliders();
    renderCanvas();
  };

  filterBrightness.addEventListener('input', handleSliderUpdate);
  filterContrast.addEventListener('input', handleSliderUpdate);
  filterSaturation.addEventListener('input', handleSliderUpdate);
  filterBlur.addEventListener('input', handleSliderUpdate);
  filterHue.addEventListener('input', handleSliderUpdate);
  filterSepia.addEventListener('input', handleSliderUpdate);

  // Reset Button triggers
  document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    state.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, sepia: 0 };
    syncControlSliders();
    renderCanvas();
    appendLog('Reset all image tuning slider nodes to baseline standard.');
  });

  document.getElementById('resetAllBtn').addEventListener('click', () => {
    state.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, sepia: 0 };
    state.transform = { rotation: 0, flipH: false };
    state.watermark = { enabled: true, text: '© PIXELFORGE STUDIO', position: 'bottom-right', color: '#ffffff' };
    clearPresetsStyling();
    syncControlSliders();
    renderCanvas();
    appendLog('Reinitialized complete system state variables.');
  });

  // Watermark state changes
  watermarkToggle.addEventListener('change', (e) => {
    state.watermark.enabled = e.target.checked;
    watermarkControls.style.opacity = e.target.checked ? '1' : '0.4';
    renderCanvas();
    appendLog(`Watermark Layer visibility: ${state.watermark.enabled ? 'ON' : 'OFF'}`);
  });

  watermarkText.addEventListener('input', (e) => {
    state.watermark.text = e.target.value;
    renderCanvas();
  });

  watermarkPos.addEventListener('change', (e) => {
    state.watermark.position = e.target.value;
    renderCanvas();
    appendLog(`Moved watermark placement to: ${e.target.value}`);
  });

  watermarkColor.addEventListener('input', (e) => {
    state.watermark.color = e.target.value;
    watermarkColorText.value = e.target.value.toUpperCase();
    renderCanvas();
  });

  watermarkColorText.addEventListener('input', (e) => {
    if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
      state.watermark.color = e.target.value;
      watermarkColor.value = e.target.value;
      renderCanvas();
    }
  });

  // Transform Tools
  document.getElementById('btnRotateCCW').addEventListener('click', () => {
    state.transform.rotation = (state.transform.rotation - 90 + 360) % 360;
    renderCanvas();
    appendLog(`Rotated canvas layout 90° CCW. Current rotation is: ${state.transform.rotation}°`);
  });

  document.getElementById('btnRotateCW').addEventListener('click', () => {
    state.transform.rotation = (state.transform.rotation + 90) % 360;
    renderCanvas();
    appendLog(`Rotated canvas layout 90° CW. Current rotation is: ${state.transform.rotation}°`);
  });

  document.getElementById('btnFlipH').addEventListener('click', () => {
    state.transform.flipH = !state.transform.flipH;
    renderCanvas();
    appendLog(`Flipped canvas image context horizontally: ${state.transform.flipH}`);
  });

  document.getElementById('fitCanvasBtn').addEventListener('click', () => {
    state.transform = { rotation: 0, flipH: false };
    renderCanvas();
    appendLog('Rebuilt master workspace dimensions & matrices.');
  });

  // Log Clearer
  document.getElementById('btnClearLogs').addEventListener('click', () => {
    operationLogsWrapper.innerHTML = '';
    appendLog('Session logging trail cleared.');
  });

  // Export Output to system PNG file
  document.getElementById('btnDownloadPNG').addEventListener('click', () => {
    try {
      const link = document.createElement('a');
      link.download = `pixel-forge-render-${Date.now()}.png`;
      link.href = mainCanvas.toDataURL('image/png');
      link.click();
      appendLog('Transformed canvas elements successfully exported into portable physical file PNG format.');
    } catch (err) {
      appendLog('Failed to auto download file due to sandbox security restraints. Try using Save Snapshot.');
    }
  });

  // Save to Interactive Session Gallery Grid below
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmptyState = document.getElementById('galleryEmptyState');

  function renderGallery() {
    // Clear previous dynamic snapshots but keep basic components
    const existingCards = galleryGrid.querySelectorAll('.snapshot-card');
    existingCards.forEach(card => card.remove());

    if (state.gallerySnapshots.length === 0) {
      galleryEmptyState.classList.remove('hidden');
    } else {
      galleryEmptyState.classList.add('hidden');

      state.gallerySnapshots.forEach((snapshot, index) => {
        const card = document.createElement('div');
        card.className = 'snapshot-card relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-card';
        card.innerHTML = `
          <div class="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden relative">
            <img src="${snapshot.dataUrl}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="Rendered Image">
            <!-- Delete floating action btn -->
            <button class="delete-snapshot-btn absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" data-index="${index}" title="Delete Snapshot">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <div class="p-3">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">${snapshot.preset}</span>
              <span class="text-[9px] text-slate-500 font-mono">${snapshot.time}</span>
            </div>
            <p class="text-xs text-slate-300 truncate mt-1" title="${snapshot.watermark || 'No watermark'}">${snapshot.watermark ? snapshot.watermark : 'No watermark text'}</p>
          </div>
        `;
        
        // Append event handlers to child nodes
        card.querySelector('.delete-snapshot-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-index'));
          state.gallerySnapshots.splice(idx, 1);
          renderGallery();
          appendLog('Snapshot successfully removed from the temporary creative library.');
        });

        galleryGrid.appendChild(card);
      });
    }
  }

  document.getElementById('btnSaveToGallery').addEventListener('click', () => {
    // Grab snapshot data from canvas state
    const dataUrl = mainCanvas.toDataURL('image/jpeg', 0.85);
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Find active applied preset visual title
    let currentPresetName = 'Custom';
    const activePresetBtn = document.querySelector('.preset-btn.preset-active');
    if (activePresetBtn) {
      currentPresetName = activePresetBtn.textContent.split(' ')[1] || 'Tuned';
    }

    state.gallerySnapshots.push({
      dataUrl: dataUrl,
      preset: currentPresetName,
      time: formattedTime,
      watermark: state.watermark.enabled ? state.watermark.text : ''
    });

    renderGallery();
    appendLog(`Captured snapshot of output & saved to dynamic grid gallery below [${currentPresetName}].`);
  });

  // Clear All Snapshots
  document.getElementById('clearGalleryBtn').addEventListener('click', () => {
    state.gallerySnapshots = [];
    renderGallery();
    appendLog('Cleared all recorded sandbox visual snapshots.');
  });

  // Initial Boot loader
  loadImageSource(state.activeImageSrc);
  syncControlSliders();
});