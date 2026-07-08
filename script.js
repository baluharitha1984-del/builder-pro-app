document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const fileUpload = document.getElementById('file-upload');
  const btnSamplePortrait = document.getElementById('btn-sample-portrait');
  const btnSampleLandscape = document.getElementById('btn-sample-landscape');
  const btnSampleStill = document.getElementById('btn-sample-still');
  
  const canvasOriginal = document.getElementById('canvas-original');
  const canvasSketch = document.getElementById('canvas-sketch');
  const sketchLayerWrapper = document.getElementById('sketch-layer-wrapper');
  const rangeSplit = document.getElementById('range-split');
  const splitDivider = document.getElementById('split-divider');
  
  // Sliders
  const sliderBlur = document.getElementById('slider-blur');
  const sliderIntensity = document.getElementById('slider-intensity');
  const sliderContrast = document.getElementById('slider-contrast');
  const sliderBrightness = document.getElementById('slider-brightness');
  
  const valBlur = document.getElementById('val-blur');
  const valIntensity = document.getElementById('val-intensity');
  const valContrast = document.getElementById('val-contrast');
  const valBrightness = document.getElementById('val-brightness');
  
  // Style buttons
  const presetClassic = document.getElementById('preset-classic');
  const presetCharcoal = document.getElementById('preset-charcoal');
  const presetColor = document.getElementById('preset-color');
  const presetSepia = document.getElementById('preset-sepia');
  
  // Actions
  const btnResetSliders = document.getElementById('btn-reset-sliders');
  const btnDownload = document.getElementById('btn-download');
  const btnClearLogs = document.getElementById('btn-clear-logs');
  const viewModeSplit = document.getElementById('view-mode-split');
  const viewModeFull = document.getElementById('view-mode-full');
  
  // Extra Indicators
  const statusText = document.getElementById('status-text');
  const resIndicator = document.getElementById('res-indicator');
  const activityLogs = document.getElementById('activity-logs');
  const processingSpinner = document.getElementById('processing-spinner');
  
  // State Variables
  let originalImg = new Image();
  let isLoaded = false;
  let sketchMode = 'classic'; // 'classic' | 'charcoal' | 'color' | 'sepia'
  let currentViewMode = 'split'; // 'split' | 'full'
  
  // --- Sample Canvas Creators (100% CORS Proof Synthetic Images) ---
  function createSamplePortraits() {
    // Create pre-rendered beautiful canvas portraits/landscapes for instant quick try
    const setupSample = (id, type) => {
      const c = document.getElementById(id);
      if (!c) return;
      c.width = 160;
      c.height = 100;
      const ctx = c.getContext('2d');
      
      if (type === 'portrait') {
        // Draw beautiful abstract portrait shape
        ctx.fillStyle = '#1e1e38';
        ctx.fillRect(0,0,160,100);
        // Background glow
        const gradient = ctx.createRadialGradient(80, 50, 10, 80, 50, 60);
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#1e1e38');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,160,100);
        // Face
        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(80, 42, 22, 0, Math.PI * 2);
        ctx.fill();
        // Neck
        ctx.fillStyle = '#fdba74';
        ctx.fillRect(75, 58, 10, 15);
        // Hair / Cap
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(80, 36, 24, Math.PI, 0);
        ctx.fill();
        // Clothes
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(40, 100);
        ctx.quadraticCurveTo(80, 65, 120, 100);
        ctx.fill();
      } else if (type === 'landscape') {
        // Draw mountain range sunset
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0,0,160,100);
        // Sun glow
        const gradient = ctx.createRadialGradient(110, 50, 5, 110, 50, 50);
        gradient.addColorStop(0, '#fbbf24');
        gradient.addColorStop(0.5, '#f97316');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,160,100);
        // Mountain 1
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-10, 100);
        ctx.lineTo(50, 40);
        ctx.lineTo(110, 100);
        ctx.fill();
        // Mountain 2
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(40, 100);
        ctx.lineTo(110, 30);
        ctx.lineTo(180, 100);
        ctx.fill();
      } else if (type === 'still') {
        // Geometric still-life shapes
        ctx.fillStyle = '#111827';
        ctx.fillRect(0,0,160,100);
        // Floor table
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 70, 160, 30);
        // Sphere
        const rad = ctx.createRadialGradient(55, 45, 2, 60, 50, 18);
        rad.addColorStop(0, '#f87171');
        rad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(60, 50, 18, 0, Math.PI * 2);
        ctx.fill();
        // Pyramid
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(90, 70);
        ctx.lineTo(110, 35);
        ctx.lineTo(130, 70);
        ctx.fill();
      }
    };
    setupSample('canvas-sample-portrait', 'portrait');
    setupSample('canvas-sample-landscape', 'landscape');
    setupSample('canvas-sample-still', 'still');
  }

  // Generates custom High-res canvas versions of presets when selected
  function generateSampleImageToWork(type) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 720;
    tempCanvas.height = 540;
    const ctx = tempCanvas.getContext('2d');
    
    if (type === 'portrait') {
      // Full scale rendering of stylized modern art vector
      ctx.fillStyle = '#1e1e38';
      ctx.fillRect(0,0,720,540);
      let grad = ctx.createRadialGradient(360, 270, 50, 360, 270, 400);
      grad.addColorStop(0, '#4f46e5');
      grad.addColorStop(0.5, '#3b82f6');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,720,540);
      
      // Face shade shadow shadow
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(365, 245, 120, 0, Math.PI * 2);
      ctx.fill();
      // Main face
      ctx.fillStyle = '#ffe4e6';
      ctx.beginPath();
      ctx.arc(360, 240, 120, 0, Math.PI * 2);
      ctx.fill();
      // Cheeks rosy
      ctx.fillStyle = '#fecdd3';
      ctx.beginPath();
      ctx.arc(290, 260, 20, 0, Math.PI * 2);
      ctx.arc(430, 260, 20, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(310, 220, 12, 0, Math.PI * 2);
      ctx.arc(410, 220, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(313, 217, 4, 0, Math.PI * 2);
      ctx.arc(413, 217, 4, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(360, 280, 25, 0, Math.PI);
      ctx.stroke();
      // Hair Cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(360, 190, 130, Math.PI, 0);
      ctx.fill();
      // Neck
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(330, 320, 60, 70);
      // Red sweater
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(180, 540);
      ctx.quadraticCurveTo(360, 360, 540, 540);
      ctx.fill();
    } else if (type === 'landscape') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0,0,720,540);
      // Sky sunset gradient
      let sky = ctx.createLinearGradient(0, 0, 0, 300);
      sky.addColorStop(0, '#f43f5e');
      sky.addColorStop(0.4, '#f97316');
      sky.addColorStop(0.8, '#eab308');
      sky.addColorStop(1, '#0f172a');
      ctx.fillStyle = sky;
      ctx.fillRect(0,0,720,350);
      
      // Radiant glowing sun
      let sun = ctx.createRadialGradient(360, 280, 10, 360, 280, 120);
      sun.addColorStop(0, '#ffffff');
      sun.addColorStop(0.3, '#fef08a');
      sun.addColorStop(0.7, '#f97316');
      sun.addColorStop(1, 'transparent');
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(360, 280, 120, 0, Math.PI*2);
      ctx.fill();
      
      // Mountain Peaks
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(-50, 350);
      ctx.lineTo(200, 140);
      ctx.lineTo(450, 350);
      ctx.fill();
      
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(250, 350);
      ctx.lineTo(520, 100);
      ctx.lineTo(800, 350);
      ctx.fill();
      
      // Lake reflect
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 350, 720, 190);
      // Draw soft lines in lake
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      for (let i = 370; i < 520; i += 25) {
        ctx.beginPath();
        ctx.moveTo(280 - (i-350)*1.5, i);
        ctx.lineTo(440 + (i-350)*1.5, i);
        ctx.stroke();
      }
    } else {
      // Abstract geometric still
      ctx.fillStyle = '#111827';
      ctx.fillRect(0,0,720,540);
      
      // Table top
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.moveTo(0, 400);
      ctx.lineTo(720, 360);
      ctx.lineTo(720, 540);
      ctx.lineTo(0, 540);
      ctx.fill();
      
      // Sphere
      let ball = ctx.createRadialGradient(250, 270, 5, 270, 290, 90);
      ball.addColorStop(0, '#f87171');
      ball.addColorStop(0.5, '#ef4444');
      ball.addColorStop(1, '#450a0a');
      ctx.fillStyle = ball;
      ctx.beginPath();
      ctx.arc(280, 300, 90, 0, Math.PI * 2);
      ctx.fill();
      
      // Tall Cube shape
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(430, 360);
      ctx.lineTo(510, 320);
      ctx.lineTo(510, 160);
      ctx.lineTo(430, 200);
      ctx.fill();
      
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(510, 320);
      ctx.lineTo(590, 350);
      ctx.lineTo(590, 190);
      ctx.lineTo(510, 160);
      ctx.fill();
      
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(430, 200);
      ctx.lineTo(510, 160);
      ctx.lineTo(590, 190);
      ctx.lineTo(510, 230);
      ctx.fill();
    }
    
    // Load this into image state dynamically
    originalImg.onload = () => {
      setupCanvases();
    };
    originalImg.src = tempCanvas.toDataURL();
  }

  // --- Console Log Helper ---
  function addLog(msg, type = 'info') {
    const div = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    if (type === 'error') {
      div.className = 'text-rose-400 font-semibold';
      div.innerText = `[${time}] ❌ ${msg}`;
    } else if (type === 'success') {
      div.className = 'text-emerald-400 font-semibold';
      div.innerText = `[${time}] ✓ ${msg}`;
    } else if (type === 'preset') {
      div.className = 'text-amber-400';
      div.innerText = `[${time}] ⚡ ${msg}`;
    } else {
      div.className = 'text-slate-300';
      div.innerText = `[${time}] ${msg}`;
    }
    activityLogs.appendChild(div);
    activityLogs.scrollTop = activityLogs.scrollHeight;
  }

  // --- Initialize canvas layouts and sizes ---
  function setupCanvases() {
    isLoaded = true;
    
    // Adjust canvas layout to match standard size ratios
    const w = originalImg.width;
    const h = originalImg.height;
    
    canvasOriginal.width = w;
    canvasOriginal.height = h;
    canvasSketch.width = w;
    canvasSketch.height = h;
    
    // Draw original on standard base canvas
    const ctxOrig = canvasOriginal.getContext('2d');
    ctxOrig.drawImage(originalImg, 0, 0);
    
    resIndicator.innerText = `${w} x ${h}px`;
    addLog(`Image parsed and loaded into studio viewport (${w}x${h}px).`);
    
    // Run sketch render loop
    triggerRender();
  }

  // --- Core Fast Image Processing Algorithm ---
  // Performs high performance monochrome convert -> negate -> fast blur -> dodge blend -> adjustment
  function processPencilSketch() {
    const w = canvasOriginal.width;
    const h = canvasOriginal.height;
    
    const ctxOrig = canvasOriginal.getContext('2d');
    const ctxSketch = canvasSketch.getContext('2d');
    
    // Read original pixels safely
    const imgData = ctxOrig.getImageData(0, 0, w, h);
    const pixels = imgData.data;
    const len = pixels.length;
    
    // Get state options
    const blurRad = parseInt(sliderBlur.value, 10);
    const lineIntensity = parseInt(sliderIntensity.value, 10) / 100;
    const contrast = parseInt(sliderContrast.value, 10);
    const brightness = parseInt(sliderBrightness.value, 10);
    
    // Phase 1: Standardized grayscale mapping
    const gray = new Uint8ClampedArray(len / 4);
    for (let i = 0; i < len; i += 4) {
      // Luminosity formula (human perception weighting)
      gray[i/4] = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
    }
    
    // Phase 2: Invert grayscale values
    const inverted = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      inverted[i] = 255 - gray[i];
    }
    
    // Phase 3: Box Blur (Inverted layer blur)
    const blurred = boxBlur(inverted, w, h, blurRad);
    
    // Phase 4: Color Dodge blend formula -> Result = (Gray * 255) / (255 - Blurred)
    const dodge = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      let b = blurred[i];
      let g = gray[i];
      let val = 255;
      if (b < 255) {
        val = (g * 255) / (255 - b);
      }
      // Blend with line intensity to harden details
      if (lineIntensity > 0) {
        val = val * (1 - lineIntensity) + g * lineIntensity;
      }
      dodge[i] = val < 0 ? 0 : (val > 255 ? 255 : val);
    }
    
    // Phase 5: Final output compilation based on Style Choice
    const outImgData = ctxSketch.createImageData(w, h);
    const outPixels = outImgData.data;
    
    // Contrast Factor mapping formula
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < len; i += 4) {
      let idx = i / 4;
      let finalG = dodge[idx];
      
      // Contrast and Brightness correction
      let val = factor * (finalG - 128) + 128 + brightness;
      val = Math.max(0, Math.min(255, val));
      
      if (sketchMode === 'color') {
        // Colored sketch mode: Blend original pixel colors with the sketch line shading value
        let r = pixels[i];
        let g = pixels[i+1];
        let b = pixels[i+2];
        
        // Blending using multiply mode
        outPixels[i] = (r * val) / 240;
        outPixels[i+1] = (g * val) / 240;
        outPixels[i+2] = (b * val) / 240;
        outPixels[i+3] = 255;
      } else if (sketchMode === 'sepia') {
        // Vintage sepia coloring
        outPixels[i] = Math.min(255, val * 0.95);
        outPixels[i+1] = Math.min(255, val * 0.85);
        outPixels[i+2] = Math.min(255, val * 0.68);
        outPixels[i+3] = 255;
      } else if (sketchMode === 'charcoal') {
        // Deep dark charcoal style
        let charVal = val < 140 ? val * 0.7 : val;
        outPixels[i] = charVal;
        outPixels[i+1] = charVal;
        outPixels[i+2] = charVal;
        outPixels[i+3] = 255;
      } else {
        // Classic slate/pencil gray style
        outPixels[i] = val;
        outPixels[i+1] = val;
        outPixels[i+2] = val;
        outPixels[i+3] = 255;
      }
    }
    
    // Put generated pixels back onto Sketch Canvas
    ctxSketch.putImageData(outImgData, 0, 0);
  }

  // Fast Box Blur implementation for 1D Array
  function boxBlur(src, w, h, radius) {
    if (radius < 1) radius = 1;
    const dst = new Uint8ClampedArray(src.length);
    const temp = new Uint8ClampedArray(src.length);

    // Pass 1: Horizontal Blur
    for (let y = 0; y < h; y++) {
      let rowOffset = y * w;
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          let nx = x + k;
          if (nx >= 0 && nx < w) {
            sum += src[rowOffset + nx];
            count++;
          }
        }
        temp[rowOffset + x] = sum / count;
      }
    }

    // Pass 2: Vertical Blur
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          let ny = y + k;
          if (ny >= 0 && ny < h) {
            sum += temp[ny * w + x];
            count++;
          }
        }
        dst[y * w + x] = sum / count;
      }
    }
    
    return dst;
  }

  // Debounced Render with Performance Profiling
  let renderTimer = null;
  function triggerRender() {
    if (!isLoaded) return;
    
    // Activate loading overlay visually
    processingSpinner.classList.remove('opacity-0');
    statusText.innerText = "Processing...";
    
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      const startTime = performance.now();
      try {
        processPencilSketch();
        updateSplitMask();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(1);
        
        statusText.innerText = `Sketch updated in ${duration}ms`;
        addLog(`Sketch re-drawn. Detail Rad: ${sliderBlur.value}px | Contrast: ${sliderContrast.value} | Speed: ${duration}ms.`, 'success');
      } catch (err) {
        addLog(`Failed to draw sketch: ${err.message}`, 'error');
      }
      processingSpinner.classList.add('opacity-0');
    }, 45);
  }

  // --- Update Split Comparison Mask Width ---
  function updateSplitMask() {
    const percentage = rangeSplit.value;
    
    if (currentViewMode === 'full') {
      // Full sketch view
      sketchLayerWrapper.style.clipPath = 'none';
      splitDivider.style.display = 'none';
    } else {
      // Split view mode
      sketchLayerWrapper.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      splitDivider.style.display = 'flex';
      splitDivider.style.left = `${percentage}%`;
    }
  }

  // --- Event Listeners: Image Upload Handling ---
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    addLog(`Reading file upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize large images automatically to keep viewport rendering ultra fast
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          addLog(`Large dimension. Auto-resized preview canvas to optimal ${w}x${h}px.`);
        }
        
        // Draw resized image onto dynamic canvas first
        const resizeCanvas = document.createElement('canvas');
        resizeCanvas.width = w;
        resizeCanvas.height = h;
        resizeCanvas.getContext('2d').drawImage(img, 0, 0, w, h);
        
        originalImg.onload = () => {
          setupCanvases();
        };
        originalImg.src = resizeCanvas.toDataURL();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Drag and drop handler
  const dropzone = document.querySelector('label[for="file-upload"]');
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('border-indigo-500', 'bg-slate-900');
    }, false);
  });
  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-indigo-500', 'bg-slate-900');
    }, false);
  });
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      fileUpload.files = files;
      fileUpload.dispatchEvent(new Event('change'));
    }
  });

  // --- Slider Event Listeners ---
  sliderBlur.addEventListener('input', () => {
    valBlur.innerText = `${sliderBlur.value}px`;
    triggerRender();
  });
  sliderIntensity.addEventListener('input', () => {
    valIntensity.innerText = `${sliderIntensity.value}%`;
    triggerRender();
  });
  sliderContrast.addEventListener('input', () => {
    valContrast.innerText = sliderContrast.value;
    triggerRender();
  });
  sliderBrightness.addEventListener('input', () => {
    valBrightness.innerText = sliderBrightness.value;
    triggerRender();
  });
  
  // Compare Split View range slider update
  rangeSplit.addEventListener('input', () => {
    updateSplitMask();
  });

  // --- Preset Preset Style buttons ---
  function clearActivePresets() {
    const btns = [presetClassic, presetCharcoal, presetColor, presetSepia];
    btns.forEach(b => {
      b.classList.remove('bg-indigo-500/10', 'text-indigo-300', 'border-indigo-500/30', 'border-indigo-500/50');
      b.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
    });
  }
  
  function setActivePreset(btn, modeName) {
    clearActivePresets();
    btn.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700');
    btn.classList.add('bg-indigo-500/10', 'text-indigo-300', 'border-indigo-500/50');
    sketchMode = modeName;
    addLog(`Changed preset style to: [${modeName.toUpperCase()}]`, 'preset');
    triggerRender();
  }

  presetClassic.addEventListener('click', () => {
    sliderBlur.value = 4;
    sliderIntensity.value = 50;
    sliderContrast.value = 10;
    sliderBrightness.value = 15;
    
    valBlur.innerText = "4px";
    valIntensity.innerText = "50%";
    valContrast.innerText = "10";
    valBrightness.innerText = "15";
    
    setActivePreset(presetClassic, 'classic');
  });
  
  presetCharcoal.addEventListener('click', () => {
    sliderBlur.value = 7;
    sliderIntensity.value = 65;
    sliderContrast.value = 35;
    sliderBrightness.value = -10;
    
    valBlur.innerText = "7px";
    valIntensity.innerText = "65%";
    valContrast.innerText = "35";
    valBrightness.innerText = "-10";
    
    setActivePreset(presetCharcoal, 'charcoal');
  });

  presetColor.addEventListener('click', () => {
    sliderBlur.value = 3;
    sliderIntensity.value = 40;
    sliderContrast.value = 15;
    sliderBrightness.value = 25;
    
    valBlur.innerText = "3px";
    valIntensity.innerText = "40%";
    valContrast.innerText = "15";
    valBrightness.innerText = "25";
    
    setActivePreset(presetColor, 'color');
  });

  presetSepia.addEventListener('click', () => {
    sliderBlur.value = 5;
    sliderIntensity.value = 50;
    sliderContrast.value = 12;
    sliderBrightness.value = 10;
    
    valBlur.innerText = "5px";
    valIntensity.innerText = "50%";
    valContrast.innerText = "12";
    valBrightness.innerText = "10";
    
    setActivePreset(presetSepia, 'sepia');
  });

  // --- View mode toggles ---
  viewModeSplit.addEventListener('click', () => {
    currentViewMode = 'split';
    viewModeSplit.classList.add('bg-indigo-500', 'text-white');
    viewModeSplit.classList.remove('hover:bg-slate-800', 'text-slate-300');
    viewModeFull.classList.remove('bg-indigo-500', 'text-white');
    viewModeFull.classList.add('hover:bg-slate-800', 'text-slate-300');
    updateSplitMask();
    addLog('Compare Split View active.');
  });

  viewModeFull.addEventListener('click', () => {
    currentViewMode = 'full';
    viewModeFull.classList.add('bg-indigo-500', 'text-white');
    viewModeFull.classList.remove('hover:bg-slate-800', 'text-slate-300');
    viewModeSplit.classList.remove('bg-indigo-500', 'text-white');
    viewModeSplit.classList.add('hover:bg-slate-800', 'text-slate-300');
    updateSplitMask();
    addLog('Full Pencil Sketch View active.');
  });

  // --- Reset All Sliders Button ---
  btnResetSliders.addEventListener('click', () => {
    sliderBlur.value = 4;
    sliderIntensity.value = 50;
    sliderContrast.value = 10;
    sliderBrightness.value = 15;
    
    valBlur.innerText = "4px";
    valIntensity.innerText = "50%";
    valContrast.innerText = "10";
    valBrightness.innerText = "15";
    
    addLog('Sliders restored to default classic values.');
    triggerRender();
  });

  // --- Sample Selectors ---
  btnSamplePortrait.addEventListener('click', () => generateSampleImageToWork('portrait'));
  btnSampleLandscape.addEventListener('click', () => generateSampleImageToWork('landscape'));
  btnSampleStill.addEventListener('click', () => generateSampleImageToWork('still'));

  // --- Clear console logs ---
  btnClearLogs.addEventListener('click', () => {
    activityLogs.innerHTML = '';
    addLog('System log cleared.');
  });

  // --- Download Final Rendered Sketch Canvas ---
  btnDownload.addEventListener('click', () => {
    if (!isLoaded) {
      addLog('Nothing to download yet! Upload or pick a sample photo.', 'error');
      return;
    }
    try {
      const link = document.createElement('a');
      link.download = `Sketchify_Sketch_${Date.now()}.png`;
      link.href = canvasSketch.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addLog('Sketch download initiated successfully!', 'success');
    } catch (e) {
      addLog(`Failed download: ${e.message}`, 'error');
    }
  });

  // Initialize on boot
  createSamplePortraits();
  // Load first sample as default view immediately
  generateSampleImageToWork('portrait');
});