document.addEventListener("DOMContentLoaded", () => {
  // State management variables
  let originalImage = new Image();
  let unmodifiedImageState = new Image(); // Saved original with no edits for comparisons
  let isImageLoaded = false;
  let currentFileName = "sample-portrait.jpg";

  // Control States
  let state = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
    rotation: 0, // Degrees: 0, 90, 180, 270
    flipH: false,
    flipV: false
  };

  // UI Element bindings
  const mainCanvas = document.getElementById("mainCanvas");
  const ctx = mainCanvas.getContext("2d");
  const loaderSpinner = document.getElementById("loaderSpinner");

  // Sliders
  const rangeBrightness = document.getElementById("rangeBrightness");
  const rangeContrast = document.getElementById("rangeContrast");
  const rangeSaturation = document.getElementById("rangeSaturation");
  const rangeBlur = document.getElementById("rangeBlur");
  const rangeHue = document.getElementById("rangeHue");
  const rangeSepia = document.getElementById("rangeSepia");
  const rangeGrayscale = document.getElementById("rangeGrayscale");
  const rangeInvert = document.getElementById("rangeInvert");

  // Slider value text indicators
  const valBrightness = document.getElementById("valBrightness");
  const valContrast = document.getElementById("valContrast");
  const valSaturation = document.getElementById("valSaturation");
  const valBlur = document.getElementById("valBlur");
  const valHue = document.getElementById("valHue");
  const valSepia = document.getElementById("valSepia");
  const valGrayscale = document.getElementById("valGrayscale");
  const valInvert = document.getElementById("valInvert");

  // Action elements
  const photoLoaderInput = document.getElementById("photoLoaderInput");
  const btnTriggerUpload = document.getElementById("btnTriggerUpload");
  const btnResetAll = document.getElementById("btnResetAll");
  const btnResetAdjustments = document.getElementById("btnResetAdjustments");
  const btnRotateLeft = document.getElementById("btnRotateLeft");
  const btnRotateRight = document.getElementById("btnRotateRight");
  const btnFlipH = document.getElementById("btnFlipH");
  const btnFlipV = document.getElementById("btnFlipV");
  const btnDownload = document.getElementById("btnDownload");
  const exportFormat = document.getElementById("exportFormat");
  const exportQuality = document.getElementById("exportQuality");
  const dragOverOverlay = document.getElementById("dragOverOverlay");

  // Compare Mode Toggle
  const btnCompare = document.getElementById("btnCompare");

  // Metadata bindings
  const metaName = document.getElementById("metaName");
  const metaResolution = document.getElementById("metaResolution");
  const metaSize = document.getElementById("metaSize");

  // Tab Control panels
  const tabBtnAdjust = document.getElementById("tabBtnAdjust");
  const tabBtnFilters = document.getElementById("tabBtnFilters");
  const tabBtnTransform = document.getElementById("tabBtnTransform");
  const tabContentAdjust = document.getElementById("tabContentAdjust");
  const tabContentFilters = document.getElementById("tabContentFilters");
  const tabContentTransform = document.getElementById("tabContentTransform");

  // Sample Image URLs (CORS Enabled with Unsplash)
  const SAMPLES = {
    portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    landscape: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    neon: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85"
  };

  // Setup event listeners for tab switching
  tabBtnAdjust.addEventListener("click", () => switchTab("adjust"));
  tabBtnFilters.addEventListener("click", () => switchTab("filters"));
  tabBtnTransform.addEventListener("click", () => switchTab("transform"));

  function switchTab(tabName) {
    [tabBtnAdjust, tabBtnFilters, tabBtnTransform].forEach(b => {
      b.classList.remove("text-indigo-400", "bg-zinc-900", "border", "border-zinc-800");
      b.classList.add("text-zinc-400");
    });
    [tabContentAdjust, tabContentFilters, tabContentTransform].forEach(pane => pane.classList.add("hidden"));

    if (tabName === "adjust") {
      tabBtnAdjust.classList.add("text-indigo-400", "bg-zinc-900", "border", "border-zinc-800");
      tabBtnAdjust.classList.remove("text-zinc-400");
      tabContentAdjust.classList.remove("hidden");
    } else if (tabName === "filters") {
      tabBtnFilters.classList.add("text-indigo-400", "bg-zinc-900", "border", "border-zinc-800");
      tabBtnFilters.classList.remove("text-zinc-400");
      tabContentFilters.classList.remove("hidden");
    } else if (tabName === "transform") {
      tabBtnTransform.classList.add("text-indigo-400", "bg-zinc-900", "border", "border-zinc-800");
      tabBtnTransform.classList.remove("text-zinc-400");
      tabContentTransform.classList.remove("hidden");
    }
  }

  // Initialize sample portrait image
  loadImageFromUrl(SAMPLES.portrait, "sample-portrait.jpg");

  // Click Sample listeners
  document.getElementById("btnSamplePortrait").addEventListener("click", (e) => {
    setActiveSampleButton(e.target);
    loadImageFromUrl(SAMPLES.portrait, "sample-portrait.jpg");
  });
  document.getElementById("btnSampleLandscape").addEventListener("click", (e) => {
    setActiveSampleButton(e.target);
    loadImageFromUrl(SAMPLES.landscape, "sample-landscape.jpg");
  });
  document.getElementById("btnSampleNeon").addEventListener("click", (e) => {
    setActiveSampleButton(e.target);
    loadImageFromUrl(SAMPLES.neon, "sample-neon.jpg");
  });

  function setActiveSampleButton(targetButton) {
    const sampleButtons = [document.getElementById("btnSamplePortrait"), document.getElementById("btnSampleLandscape"), document.getElementById("btnSampleNeon")];
    sampleButtons.forEach(btn => {
      btn.classList.remove("bg-zinc-700", "text-white", "shadow-sm");
      btn.classList.add("text-zinc-400", "hover:bg-zinc-700/50");
    });
    targetButton.classList.add("bg-zinc-700", "text-white", "shadow-sm");
    targetButton.classList.remove("text-zinc-400", "hover:bg-zinc-700/50");
  }

  // Trigger hidden local file upload input
  btnTriggerUpload.addEventListener("click", () => photoLoaderInput.click());
  photoLoaderInput.addEventListener("change", handleFileSelect);

  // Direct Drag and Drop implementation on the window workspace
  window.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragOverOverlay.classList.remove("hidden");
    dragOverOverlay.classList.add("flex", "opacity-100");
  });

  dragOverOverlay.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dragOverOverlay.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragOverOverlay.classList.add("hidden");
  });

  window.addEventListener("drop", (e) => {
    e.preventDefault();
    dragOverOverlay.classList.add("hidden");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        processImageFile(droppedFile);
      } else {
        showToast("Unsupported file format. Please upload an image.");
      }
    }
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  }

  function processImageFile(file) {
    currentFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImageFromUrl(e.target.result, file.name);
      metaSize.textContent = formatBytes(file.size);
    };
    reader.readAsDataURL(file);
  }

  function loadImageFromUrl(url, fileName) {
    loaderSpinner.classList.remove("hidden");
    loaderSpinner.classList.add("flex");
    
    originalImage = new Image();
    originalImage.crossOrigin = "anonymous";
    originalImage.src = url;
    
    originalImage.onload = () => {
      isImageLoaded = true;
      metaName.textContent = fileName;
      metaResolution.textContent = `${originalImage.naturalWidth} x ${originalImage.naturalHeight}`;
      if (url.startsWith("https://")) {
        metaSize.textContent = "Remote API Stream";
      }

      // Setup separate unaltered image for immediate on-demand slider comparison
      unmodifiedImageState = new Image();
      unmodifiedImageState.crossOrigin = "anonymous";
      unmodifiedImageState.src = url;

      resetStateValues();
      applyFiltersAndRender();
      
      loaderSpinner.classList.remove("flex");
      loaderSpinner.classList.add("hidden");
      showToast("Photo Loaded Successfully!");
    };

    originalImage.onerror = () => {
      loaderSpinner.classList.add("hidden");
      showToast("Failed to render image. Try uploading a local photo!");
    };
  }

  // Core Image Rendering Engine
  function applyFiltersAndRender(useOriginalSource = false) {
    if (!isImageLoaded) return;

    const imageSource = useOriginalSource ? unmodifiedImageState : originalImage;
    const isSwappedDimensions = (state.rotation / 90) % 2 !== 0;
    
    // Calculate target boundaries keeping original aspect ratio
    const canvasWidth = isSwappedDimensions ? imageSource.naturalHeight : imageSource.naturalWidth;
    const canvasHeight = isSwappedDimensions ? imageSource.naturalWidth : imageSource.naturalHeight;

    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasHeight;

    // Clear canvas canvas frame
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    // Translate to center point to apply rotations/flips seamlessly
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Handle rotations
    if (state.rotation !== 0) {
      ctx.rotate((state.rotation * Math.PI) / 180);
    }

    // Handle dynamic scale values representing mirroring
    const scaleX = state.flipH ? -1 : 1;
    const scaleY = state.flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // Build composite high precision context CSS filters block
    if (!useOriginalSource) {
      ctx.filter = `
        brightness(${state.brightness}%)
        contrast(${state.contrast}%)
        saturate(${state.saturation}%)
        blur(${state.blur}px)
        hue-rotate(${state.hue}deg)
        sepia(${state.sepia}%)
        grayscale(${state.grayscale}%)
        invert(${state.invert}%)
      `;
    } else {
      ctx.filter = "none";
    }

    // Draw the image onto offset canvas coordinates centered around standard (0,0)
    ctx.drawImage(
      imageSource,
      -imageSource.naturalWidth / 2,
      -imageSource.naturalHeight / 2,
      imageSource.naturalWidth,
      imageSource.naturalHeight
    );

    ctx.restore();
  }

  // Dynamic Slider Listeners syncing state variables dynamically
  function bindSlider(slider, stateKey, unit, valueBadge) {
    slider.addEventListener("input", (e) => {
      state[stateKey] = Number(e.target.value);
      valueBadge.textContent = `${state[stateKey]}${unit}`;
      applyFiltersAndRender();
    });
  }

  bindSlider(rangeBrightness, "brightness", "%", valBrightness);
  bindSlider(rangeContrast, "contrast", "%", valContrast);
  bindSlider(rangeSaturation, "saturation", "%", valSaturation);
  bindSlider(rangeBlur, "blur", "px", valBlur);
  bindSlider(rangeHue, "hue", "°", valHue);
  bindSlider(rangeSepia, "sepia", "%", valSepia);
  bindSlider(rangeGrayscale, "grayscale", "%", valGrayscale);
  bindSlider(rangeInvert, "invert", "%", valInvert);

  // Transform Event listeners
  btnRotateLeft.addEventListener("click", () => {
    state.rotation = (state.rotation - 90 + 360) % 360;
    applyFiltersAndRender();
    showToast("Rotated Left");
  });

  btnRotateRight.addEventListener("click", () => {
    state.rotation = (state.rotation + 90) % 360;
    applyFiltersAndRender();
    showToast("Rotated Right");
  });

  btnFlipH.addEventListener("click", () => {
    state.flipH = !state.flipH;
    applyFiltersAndRender();
    showToast("Mirrored Horizontally");
  });

  btnFlipV.addEventListener("click", () => {
    state.flipV = !state.flipV;
    applyFiltersAndRender();
    showToast("Mirrored Vertically");
  });

  // Preset Filters Collection implementation
  const presetButtons = {
    filterOriginal: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, sepia: 0, grayscale: 0, invert: 0 },
    filterRetro: { brightness: 110, contrast: 90, saturation: 85, blur: 0, hue: 0, sepia: 40, grayscale: 0, invert: 0 },
    filterCyber: { brightness: 105, contrast: 140, saturation: 160, blur: 0, hue: 310, sepia: 0, grayscale: 0, invert: 0 },
    filterNoir: { brightness: 100, contrast: 160, saturation: 0, blur: 0, hue: 0, sepia: 10, grayscale: 100, invert: 0 },
    filterCool: { brightness: 95, contrast: 105, saturation: 110, blur: 0, hue: 190, sepia: 0, grayscale: 0, invert: 0 },
    filterGold: { brightness: 105, contrast: 115, saturation: 130, blur: 0, hue: 35, sepia: 25, grayscale: 0, invert: 0 }
  };

  Object.keys(presetButtons).forEach(id => {
    document.getElementById(id).addEventListener("click", (e) => {
      // Reset active states visual
      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("border-indigo-500", "bg-zinc-950");
        btn.classList.add("border-transparent", "bg-zinc-800/50");
      });

      // Highlight selected
      const currentTarget = e.currentTarget;
      currentTarget.classList.add("border-indigo-500", "bg-zinc-950");
      currentTarget.classList.remove("border-transparent", "bg-zinc-800/50");

      // Apply filter values to current state
      const values = presetButtons[id];
      state.brightness = values.brightness;
      state.contrast = values.contrast;
      state.saturation = values.saturation;
      state.blur = values.blur;
      state.hue = values.hue;
      state.sepia = values.sepia;
      state.grayscale = values.grayscale;
      state.invert = values.invert;

      // Sync to slider controls visually
      syncSlidersToState();
      applyFiltersAndRender();
      showToast(`Filter applied!`);
    });
  });

  // Sync state values back to control values
  function syncSlidersToState() {
    rangeBrightness.value = state.brightness; valBrightness.textContent = `${state.brightness}%`;
    rangeContrast.value = state.contrast; valContrast.textContent = `${state.contrast}%`;
    rangeSaturation.value = state.saturation; valSaturation.textContent = `${state.saturation}%`;
    rangeBlur.value = state.blur; valBlur.textContent = `${state.blur}px`;
    rangeHue.value = state.hue; valHue.textContent = `${state.hue}°`;
    rangeSepia.value = state.sepia; valSepia.textContent = `${state.sepia}%`;
    rangeGrayscale.value = state.grayscale; valGrayscale.textContent = `${state.grayscale}%`;
    rangeInvert.value = state.invert; valInvert.textContent = `${state.invert}%`;
  }

  // Reset state to initial
  function resetStateValues() {
    state = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      rotation: 0,
      flipH: false,
      flipV: false
    };
    syncSlidersToState();
    
    // Reset dynamic styles
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("border-indigo-500", "bg-zinc-950");
      btn.classList.add("border-transparent", "bg-zinc-800/50");
    });
    document.getElementById("filterOriginal").classList.add("border-indigo-500", "bg-zinc-950");
  }

  btnResetAll.addEventListener("click", () => {
    resetStateValues();
    applyFiltersAndRender();
    showToast("All parameters and transforms reset");
  });

  btnResetAdjustments.addEventListener("click", () => {
    state.brightness = 100;
    state.contrast = 100;
    state.saturation = 100;
    state.blur = 0;
    state.hue = 0;
    state.sepia = 0;
    state.grayscale = 0;
    state.invert = 0;
    syncSlidersToState();
    applyFiltersAndRender();
    showToast("Sliders adjusted to baseline");
  });

  // Interactive On-Demand Original Comparison Handler (Mouse down or Touch hold)
  btnCompare.addEventListener("mousedown", startCompare);
  btnCompare.addEventListener("mouseup", stopCompare);
  btnCompare.addEventListener("mouseleave", stopCompare);

  btnCompare.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startCompare();
  });
  btnCompare.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopCompare();
  });

  function startCompare() {
    if (!isImageLoaded) return;
    applyFiltersAndRender(true);
  }

  function stopCompare() {
    if (!isImageLoaded) return;
    applyFiltersAndRender(false);
  }

  // Quality control constraints slider feedback helper
  exportQuality.addEventListener("input", (e) => {
    showToast(`Target JPG quality level set to: ${e.target.value}%`);
  });

  // Trigger image creation download sequence
  btnDownload.addEventListener("click", () => {
    if (!isImageLoaded) {
      showToast("Please upload or choose a sample image first");
      return;
    }

    try {
      const selectedFormat = exportFormat.value;
      const qualityLevel = Number(exportQuality.value) / 100;
      const dataUrl = mainCanvas.toDataURL(selectedFormat, qualityLevel);
      
      const ext = selectedFormat.split("/")[1];
      const outputFileName = currentFileName.replace(/\.[^/.]+$/, "") + `_lumix.${ext}`;

      const link = document.createElement("a");
      link.download = outputFileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast("Masterpiece downloaded! Check your downloads fold.");
    } catch (e) {
      console.error(e);
      showToast("Failed to save modified image. Local origin limitations.");
    }
  });

  // Dynamic responsive utility functions
  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  // Notification toast helper
  function showToast(message) {
    const toast = document.getElementById("notificationToast");
    const toastMsg = document.getElementById("toastMessage");
    toastMsg.textContent = message;
    
    // Reset animation/opacity
    toast.classList.remove("opacity-0", "translate-y-12", "pointer-events-none");
    toast.classList.add("opacity-100", "translate-y-0");
    
    // Disappear after set duration
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-12", "pointer-events-none");
    }, 4000);
  }
});