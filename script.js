document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let sourceImage = null;
  let sketchResultCanvas = null;
  let currentFormat = 'png'; // or 'jpeg'
  let sliderPercentage = 50;
  let isDraggingSlider = false;
  let showFullSketch = false;

  // Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const sampleBtns = document.querySelectorAll('.sample-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  
  // Adjustable Control Elements
  const rangeStroke = document.getElementById('range-stroke');
  const rangeContrast = document.getElementById('range-contrast');
  const rangeBrightness = document.getElementById('range-brightness');
  const rangeColorMix = document.getElementById('range-color-mix');
  const valStroke = document.getElementById('val-stroke');
  const valContrast = document.getElementById('val-contrast');
  const valBrightness = document.getElementById('val-brightness');
  const valColorMix = document.getElementById('val-color-mix');

  const selectTint = document.getElementById('select-tint');
  const selectTexture = document.getElementById('select-texture');

  // Preview Elements
  const workspaceEmptyState = document.getElementById('workspace-empty-state');
  const btnLoadQuick = document.getElementById('btn-load-quick');
  const originalPreviewImg = document.getElementById('original-preview-img');
  const originalContainer = document.getElementById('original-container');
  const previewContainer = document.getElementById('preview-container');
  const sliderHandle = document.getElementById('slider-handle');
  const statusBadge = document.getElementById('status-badge');
  const spinnerIcon = document.getElementById('spinner-icon');

  // Canvases
  const sourceCanvas = document.getElementById('source-canvas');
  const outputCanvas = document.getElementById('output-canvas');
  const ctxOutput = outputCanvas.getContext('2d');

  // Action Buttons
  const btnReset = document.getElementById('btn-reset');
  const btnCompareToggle = document.getElementById('btn-compare-toggle');
  const btnDownload = document.getElementById('btn-download');
  const btnFormatPng = document.getElementById('btn-format-png');
  const btnFormatJpg = document.getElementById('btn-format-jpg');

  // 1. Initial configuration setup
  const defaultSettings = {
    stroke: 5,
    contrast: 1.5,
    brightness: 0,
    colorMix: 0,
    tint: 'none',
    texture: 'none'
  };

  // Initialize controls
  function resetToDefaults() {
    rangeStroke.value = defaultSettings.stroke;
    rangeContrast.value = defaultSettings.contrast;
    rangeBrightness.value = defaultSettings.brightness;
    rangeColorMix.value = defaultSettings.colorMix;
    selectTint.value = defaultSettings.tint;
    selectTexture.value = defaultSettings.texture;
    
    updateSliderValueLabels();
    triggerRender();
  }

  function updateSliderValueLabels() {
    valStroke.textContent = `${rangeStroke.value}px`;
    valContrast.textContent = parseFloat(rangeContrast.value).toFixed(1);
    valBrightness.textContent = `${rangeBrightness.value > 0 ? '+' : ''}${rangeBrightness.value}%`;
    valColorMix.textContent = `${rangeColorMix.value}%`;
  }

  // 2. Drag & Drop & Upload triggers
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-indigo-500', 'bg-slate-900');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-indigo-500', 'bg-slate-900');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500', 'bg-slate-900');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImage(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  });

  btnLoadQuick.addEventListener('click', () => {
    // Load first sample
    loadSampleUrl(sampleBtns[0].getAttribute('data-url'));
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loadSampleUrl(btn.getAttribute('data-url'));
    });
  });

  // 3. Load Image Logic
  function loadSampleUrl(url) {
    showLoading(true);
    statusBadge.textContent = 'Fetching Sample...';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      setSourceImage(img);
    };
    img.onerror = function() {
      statusBadge.textContent = 'Failed to load sample image';
      showLoading(false);
    };
    img.src = url;
  }

  function loadImage(file) {
    showLoading(true);
    statusBadge.textContent = 'Reading File...';
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        setSourceImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setSourceImage(img) {
    sourceImage = img;
    
    // Populate Before image preview container
    originalPreviewImg.src = img.src;
    workspaceEmptyState.classList.add('hidden');
    
    // Resize source canvas
    // Constrain max dimensions to 900px for speed and real-time processing performance
    const maxDim = 900;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sCtx = sourceCanvas.getContext('2d');
    sCtx.drawImage(img, 0, 0, width, height);

    // Configure Output Canvas scale to match
    outputCanvas.width = width;
    outputCanvas.height = height;
    outputCanvas.style.aspectRatio = `${width} / ${height}`;

    showLoading(false);
    triggerRender();
  }

  // Show/Hide loader indicators
  function showLoading(isLoading) {
    if (isLoading) {
      spinnerIcon.classList.remove('hidden');
      statusBadge.textContent = 'Processing Sketch...';
    } else {
      spinnerIcon.classList.add('hidden');
      statusBadge.textContent = 'Done';
    }
  }

  // 4. Sketch Processing Algorithm
  let renderTimeout = null;
  function triggerRender() {
    if (!sourceImage) return;
    showLoading(true);
    
    // Debounce to keep slider dragging responsive
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
      renderSketch();
    }, 20); 
  }

  function renderSketch() {
    if (!sourceImage) return;
    
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    
    // Get clean input
    const sCtx = sourceCanvas.getContext('2d');
    const srcData = sCtx.getImageData(0, 0, width, height);
    const pixels = srcData.data;
    const totalPixels = width * height;
    
    // Extract control parameters
    const strokeWidth = parseInt(rangeStroke.value);
    const contrastVal = parseFloat(rangeContrast.value);
    const brightnessVal = parseInt(rangeBrightness.value);
    const colorMixVal = parseInt(rangeColorMix.value) / 100;
    const tintMode = selectTint.value;
    const textureMode = selectTexture.value;

    // Buffer variables
    const gray = new Uint8ClampedArray(totalPixels);
    const blurred = new Uint8ClampedArray(totalPixels);

    // Step 1: Grayscale Conversion
    for (let i = 0; i < totalPixels; i++) {
      const r = pixels[i * 4];
      const g = pixels[i * 4 + 1];
      const b = pixels[i * 4 + 2];
      // Standard human eye response weights
      gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Step 2: Box Blur on Grayscale for line width estimation
    // We perform a horizontal pass then a vertical pass to achieve fast multi-pixel blurring
    boxBlur(gray, blurred, width, height, strokeWidth);

    // Step 3: Color Dodge Blend inverted blurred pass over the grayscale pass
    const sketchGray = new Uint8ClampedArray(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
      const base = gray[i];
      // Invert the blurred pixel
      const blend = 255 - blurred[i];
      
      // Color Dodge Blend Formula: (Base / (255 - Blend)) * 255
      let dodge = 255;
      if (blend < 255) {
        dodge = (base * 255) / (255 - blend);
        if (dodge > 255) dodge = 255;
      }
      
      // Contrast enhancement: push midtones / shadows deeper
      let val = dodge;
      if (contrastVal !== 1.0) {
        val = ((val / 255 - 0.5) * contrastVal + 0.5) * 255;
        if (val < 0) val = 0;
        if (val > 255) val = 255;
      }

      // Brightness adjustments
      if (brightnessVal !== 0) {
        val += (brightnessVal * 2.55);
        if (val < 0) val = 0;
        if (val > 255) val = 255;
      }

      sketchGray[i] = val;
    }

    // Step 4: Write result image back, supporting optional color mixing and color tinting
    const outData = ctxOutput.createImageData(width, height);
    const outPixels = outData.data;

    // Configure custom tints
    let rTint = 1, gTint = 1, bTint = 1;
    if (tintMode === 'sepia') {
      rTint = 1.0; gTint = 0.88; bTint = 0.72;
    } else if (tintMode === 'blueprint') {
      rTint = 0.15; gTint = 0.35; bTint = 0.85;
    } else if (tintMode === 'green') {
      rTint = 0.35; gTint = 0.65; bTint = 0.45;
    } else if (tintMode === 'sangine') {
      rTint = 0.82; gTint = 0.36; bTint = 0.28;
    }

    for (let i = 0; i < totalPixels; i++) {
      const skVal = sketchGray[i];
      
      // Grayscale Sketch base color with tint multipliers
      let rSketch = skVal * rTint;
      let gSketch = skVal * gTint;
      let bSketch = skVal * bTint;

      // Clamp values
      if (rSketch > 255) rSketch = 255;
      if (gSketch > 255) gSketch = 255;
      if (bSketch > 255) bSketch = 255;

      if (colorMixVal > 0) {
        // Mix original pixel colors underneath with opacity control
        const rOrig = pixels[i * 4];
        const gOrig = pixels[i * 4 + 1];
        const bOrig = pixels[i * 4 + 2];

        // Formula blends base pencil dark areas with colored highlights
        // Multiplicative/linear combination looks gorgeous
        const mixR = (skVal / 255) * rOrig;
        const mixG = (skVal / 255) * gOrig;
        const mixB = (skVal / 255) * bOrig;

        outPixels[i * 4] = rSketch * (1 - colorMixVal) + mixR * colorMixVal;
        outPixels[i * 4 + 1] = gSketch * (1 - colorMixVal) + mixG * colorMixVal;
        outPixels[i * 4 + 2] = bSketch * (1 - colorMixVal) + mixB * colorMixVal;
      } else {
        outPixels[i * 4] = rSketch;
        outPixels[i * 4 + 1] = gSketch;
        outPixels[i * 4 + 2] = bSketch;
      }
      outPixels[i * 4 + 3] = 255; // Alpha channel
    }

    ctxOutput.putImageData(outData, 0, 0);

    // Step 5: Texture Overlay Rendering onto Output Canvas if active
    if (textureMode !== 'none') {
      ctxOutput.save();
      if (textureMode === 'parchment') {
        ctxOutput.globalCompositeOperation = 'multiply';
        ctxOutput.fillStyle = 'rgba(235, 218, 185, 0.45)';
        ctxOutput.fillRect(0, 0, width, height);
      } else if (textureMode === 'noise') {
        // Procedural noise drawing
        ctxOutput.globalCompositeOperation = 'multiply';
        for (let j = 0; j < 4000; j++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctxOutput.fillStyle = `rgba(0, 0, 0, ${0.03 + Math.random() * 0.05})`;
          ctxOutput.fillRect(rx, ry, 1, 1);
        }
      } else if (textureMode === 'canvas') {
        // Draw soft woven structure
        ctxOutput.globalCompositeOperation = 'overlay';
        ctxOutput.strokeStyle = 'rgba(0, 0, 0, 0.06)';
        ctxOutput.lineWidth = 0.5;
        for (let x = 0; x < width; x += 5) {
          ctxOutput.beginPath();
          ctxOutput.moveTo(x, 0);
          ctxOutput.lineTo(x, height);
          ctxOutput.stroke();
        }
        for (let y = 0; y < height; y += 5) {
          ctxOutput.beginPath();
          ctxOutput.moveTo(0, y);
          ctxOutput.lineTo(width, y);
          ctxOutput.stroke();
        }
      }
      ctxOutput.restore();
    }

    showLoading(false);
  }

  // Fast Box Blur implementation
  function boxBlur(src, dest, w, h, radius) {
    if (radius < 1) radius = 1;
    // Simple horizontal blur & vertical blur cascade
    boxBlurH(src, dest, w, h, radius);
    boxBlurV(dest, src, w, h, radius);
    // Re-transfer back to dest safely
    for (let i = 0; i < w * h; i++) {
      dest[i] = src[i];
    }
  }

  function boxBlurH(s, d, w, h, r) {
    const arr = 1 / (r + r + 1);
    for (let i = 0; i < h; i++) {
      let ti = i * w;
      let li = ti;
      let ri = ti + r;
      let fv = s[ti];
      let lv = s[ti + w - 1];
      let val = (r + 1) * fv;
      
      for (let j = 0; j < r; j++) val += s[ti + j];
      for (let j = 0; j <= r; j++) {
        val += s[ri++] - fv;
        d[ti++] = val * arr;
      }
      for (let j = r + 1; j < w - r; j++) {
        val += s[ri++] - s[li++];
        d[ti++] = val * arr;
      }
      for (let j = w - r; j < w; j++) {
        val += lv - s[li++];
        d[ti++] = val * arr;
      }
    }
  }

  function boxBlurV(s, d, w, h, r) {
    const arr = 1 / (r + r + 1);
    for (let i = 0; i < w; i++) {
      let ti = i;
      let li = ti;
      let ri = ti + r * w;
      let fv = s[ti];
      let lv = s[ti + (h - 1) * w];
      let val = (r + 1) * fv;
      
      for (let j = 0; j < r; j++) val += s[ti + j * w];
      for (let j = 0; j <= r; j++) {
        val += s[ri] - fv;
        d[ti] = val * arr;
        ri += w;
        ti += w;
      }
      for (let j = r + 1; j < h - r; j++) {
        val += s[ri] - s[li];
        d[ti] = val * arr;
        li += w;
        ri += w;
        ti += w;
      }
      for (let j = h - r; j < h; j++) {
        val += lv - s[li];
        d[ti] = val * arr;
        li += w;
        ti += w;
      }
    }
  }

  // 5. Comparison Split-Screen Control Logic
  function updateSplitView() {
    if (showFullSketch) {
      originalContainer.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
      sliderHandle.style.left = '0%';
      return;
    }
    
    // Map percentages
    originalContainer.style.clipPath = `polygon(0 0, ${sliderPercentage}% 0, ${sliderPercentage}% 100%, 0 100%)`;
    sliderHandle.style.left = `${sliderPercentage}%`;
  }

  // Mouse and Touch slide listeners on preview-container
  function handleSliderMove(e) {
    if (!isDraggingSlider) return;
    
    const rect = previewContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let offsetX = clientX - rect.left;
    
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    
    sliderPercentage = (offsetX / rect.width) * 100;
    showFullSketch = false;
    updateSplitView();
  }

  // Slider interactive listeners
  sliderHandle.addEventListener('mousedown', (e) => {
    isDraggingSlider = true;
    e.preventDefault();
  });

  sliderHandle.addEventListener('touchstart', (e) => {
    isDraggingSlider = true;
  });

  window.addEventListener('mouseup', () => isDraggingSlider = false);
  window.addEventListener('touchend', () => isDraggingSlider = false);
  
  previewContainer.addEventListener('mousemove', handleSliderMove);
  previewContainer.addEventListener('touchmove', handleSliderMove, { passive: true });

  btnCompareToggle.addEventListener('click', () => {
    showFullSketch = !showFullSketch;
    if (showFullSketch) {
      btnCompareToggle.classList.add('bg-indigo-600', 'text-white');
    } else {
      btnCompareToggle.classList.remove('bg-indigo-600', 'text-white');
      sliderPercentage = 50;
    }
    updateSplitView();
  });

  // Preset Handler
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset visual indicator
      presetBtns.forEach(b => b.classList.remove('border-indigo-500', 'bg-slate-800'));
      btn.classList.add('border-indigo-500', 'bg-slate-800');

      const style = btn.getAttribute('data-preset');
      if (style === 'classic') {
        rangeStroke.value = 5;
        rangeContrast.value = 1.5;
        rangeBrightness.value = 5;
        rangeColorMix.value = 0;
        selectTint.value = 'none';
        selectTexture.value = 'none';
      } else if (style === 'charcoal') {
        rangeStroke.value = 12;
        rangeContrast.value = 2.4;
        rangeBrightness.value = -10;
        rangeColorMix.value = 5;
        selectTint.value = 'none';
        selectTexture.value = 'noise';
      } else if (style === 'blueprint') {
        rangeStroke.value = 3;
        rangeContrast.value = 1.8;
        rangeBrightness.value = 10;
        rangeColorMix.value = 0;
        selectTint.value = 'blueprint';
        selectTexture.value = 'canvas';
      } else if (style === 'colored') {
        rangeStroke.value = 6;
        rangeContrast.value = 1.3;
        rangeBrightness.value = 15;
        rangeColorMix.value = 55;
        selectTint.value = 'none';
        selectTexture.value = 'none';
      }
      updateSliderValueLabels();
      triggerRender();
    });
  });

  // Form Format Toggles
  btnFormatPng.addEventListener('click', () => {
    currentFormat = 'png';
    btnFormatPng.className = 'format-toggle px-3 py-1 rounded-md text-xs font-bold bg-indigo-500 text-white transition-all';
    btnFormatJpg.className = 'format-toggle px-3 py-1 rounded-md text-xs font-bold text-slate-400 hover:text-slate-200 transition-all';
  });

  btnFormatJpg.addEventListener('click', () => {
    currentFormat = 'jpeg';
    btnFormatJpg.className = 'format-toggle px-3 py-1 rounded-md text-xs font-bold bg-indigo-500 text-white transition-all';
    btnFormatPng.className = 'format-toggle px-3 py-1 rounded-md text-xs font-bold text-slate-400 hover:text-slate-200 transition-all';
  });

  // Real-time Slider Change Event Listeners
  [rangeStroke, rangeContrast, rangeBrightness, rangeColorMix, selectTint, selectTexture].forEach(el => {
    el.addEventListener('input', () => {
      updateSliderValueLabels();
      triggerRender();
    });
  });

  // Reset Button
  btnReset.addEventListener('click', resetToDefaults);

  // Download generated canvas
  btnDownload.addEventListener('click', () => {
    if (!sourceImage) return;
    
    const imageType = currentFormat === 'png' ? 'image/png' : 'image/jpeg';
    const fileExtension = currentFormat === 'png' ? 'png' : 'jpg';
    
    // Create transient anchor to force download
    const downloadAnchor = document.createElement('a');
    downloadAnchor.download = `sketchify-drawing.${fileExtension}`;
    downloadAnchor.href = outputCanvas.toDataURL(imageType, 0.95);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  });

  // Default initialization
  resetToDefaults();
  
  // Load first sample as default view if none supplied yet
  loadSampleUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85');
});