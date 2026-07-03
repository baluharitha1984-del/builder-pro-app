// Sagas Interactive Engine - Orchestrates immersive Story Builder & Web Speech Narrator

// --- PRESET STORIES LIBRARY DATA --- 
const DEFAULT_MANUSCRIPTS = [
  {
    id: "saga-pre-1",
    title: "Chronicles of Arcana Gate",
    genre: "fantasy",
    hero: "Aethelgard",
    companion: "Ember the Pixie",
    hook: "For centuries, the cosmic key had remained locked deep within the obsidian chambers of the Elder Citadel. You stand before the final gateway, feeling the vibration of pure space-time magic humming against your fingertips.",
    choices: {
      optionA: "Attempt to decode the ancient locks using the mechanical forge key.",
      outcomeA: "You insert the metallic key. Sparking runes explode into light, illuminating ancient text. Ember screams a warning, but the gates grind open, offering a path deep into a shimmering glowing sanctuary of lost relics!",
      optionB: "Channel raw elemental magic directly into the gate seal.",
      outcomeB: "You summon mystical cosmic fires from your palms. The gate violently reacts, short-circuiting and teleporting both of you onto a crumbling levitating island high in the purple skies of the nether empire!"
    },
    companionMorale: "Ready for Adventure"
  },
  {
    id: "saga-pre-2",
    title: "Project Overdrive: Neo-Tokyo",
    genre: "cyberpunk",
    hero: "Vince Dax",
    companion: "K3-LA the AI Holo",
    hook: "Rain lashes down on the neon-streaked asphalt of sector 9. You hold the encryption drive containing the corporate secrets of Arasaka-Neo. Sirens squeal in the dark alleyway behind you.",
    choices: {
      optionA: "Flee into the atmospheric rooftop ventilation shafts.",
      outcomeA: "Leaping onto the fire escape, you scale the metal ladders as rain pours down. K3-LA intercepts their scanning drones, guiding you smoothly into a black-market hacker collective den.",
      optionB: "Dive deep into the wet sub-level neon sewers.",
      outcomeB: "You slide into the dark water tunnels beneath the street. The signal drops, but you bypass all security nets, emerging directly inside the private laboratory of a rogue cyber-surgeon!"
    },
    companionMorale: "Hyper-Charged"
  },
  {
    id: "saga-pre-3",
    title: "The Event Horizon Shift",
    genre: "scifi",
    hero: "Commander Tyran",
    companion: "T.A.R.S Copilot",
    hook: "Your spaceship is being caught in the gravitational tidal wave of a newborn singularity. The alarms flash blood-red, lighting up the cold metal cockpit. The main generator hyper-core is failing.",
    choices: {
      optionA: "Initiate emergency hyper-drive warp jump straight into the wormhole.",
      outcomeA: "The engines roar as space-time stretches like glass. You wake up centuries later in a galaxy untouched by time, surrounded by crystalline stars and peaceful giant floating structures.",
      optionB: "Eject the main fuel core to push back from the pull.",
      outcomeB: "The violent explosion propels your vessel backwards, spinning out of control. When the lights return to normal, you find yourselves docked seamlessly inside an ancient alien megacity."
    },
    companionMorale: "Slightly Panicked"
  },
  {
    id: "saga-pre-4",
    title: "The Whispering Woods of Eldon",
    genre: "horror",
    hero: "Kaelen the Ranger",
    companion: "Lupa the Shadow-Wolf",
    hook: "The fog is too thick. You've strayed past the boundaries of the ward stone. A rhythmic clicking noise echoes from the tall, gnarled ancient oaks above you. Lupa growls, hackles raised.",
    choices: {
      optionA: "Strike a torch to illuminate the high canopy.",
      outcomeA: "The torchburst flares! Terrified pale, multi-eyed specters scuttle backwards up the tree limbs. In the light, you spot an old stone sanctuary chapel buried in the brambles ahead.",
      optionB: "Crouch low and let Lupa sniff out a hidden game trail.",
      outcomeB: "Moving silently through the undergrowth, you bypass the dark watchers entirely. You find a fast-flowing silver river that leads out of the cursed mist into safe lands."
    },
    companionMorale: "Guarded & Growling"
  }
];

// --- RANDOM DICTIONARY FOR THE FATE SPINNER (INSPIRATION DICE) --- 
const FATE_TITLES = [
  "Curse of the Sunken Spire", "Hyper-drive Odyssey", "The Obsidian Contract", "Shadows over Neo-Grid", 
  "The Alchemist's Paradox", "Whispers of the Outer Rim", "The Glass Tomb", "Crypt of the Code-Breaker"
];
const FATE_HEROES = ["Sora the Ronin", "Dr. Evelyn Vance", "Zael the Elven Runesmith", "Deckard the Netrunner", "Lyra of the Waste"];
const FATE_COMPANIONS = ["M1-K3 Drone", "Ignis the Fire Drake", "Echo the Rogue Synth", "Brother Thomas", "Nix the Rogue Alchemist"];
const FATE_HOOKS = [
  "A strange signal has been pulsing from the ancient subterranean temple beneath your base. It repeats the exact timestamp of your birth.",
  "The hover-train has been hijacked by cybernetic bandits. You are trapped in the cargo deck with a fragile crate glowing with heavy radioactive heat.",
  "The star-map before you flickers and goes dark. A massive shadow sweeps across the outer windows, blocking out the light of the binary solar system.",
  "You wake up with no memory on a floating cloud ship. The captain hands you a gold-inlaid compass pointing directly down towards the dangerous fog land."
];
const FATE_CHOICES = [
  {
    optionA: "Hack the mainframe terminal to disable the safety overrides.",
    outcomeA: "Sparks cascade from the consoles as the firewall crumbles. You gain full system override control, revealing secret layout schematics!",
    optionB: "Reroute auxiliary power to the heavy propulsion thrusters.",
    outcomeB: "A deep hum vibrates through the deck plates as the ship surges forward, breaking free of the blockade!"
  },
  {
    optionA: "Confront the mysterious cloaked stranger directly.",
    outcomeA: "The stranger pulls back their hood, revealing an old mentor thought long dead, clutching an active ancient holocron.",
    optionB: "Sneak around the shadows of the support pillars to flank them.",
    outcomeB: "You slip behind them silently. From this advantage, you spot a secret tripwire connected to a security explosive."
  }
];

// --- STATE MANAGEMENT --- 
let appState = {
  manuscripts: [],
  activeStory: null,
  readingTheme: "midnight",
  textScale: 100, // percentage
  speechSynthesisActive: false,
  speechUtterance: null,
  speechSynthEngine: window.speechSynthesis || null,
  selectedVoiceName: ""
};

// --- DOM REFERENCES --- 
const btnRollInspiration = document.getElementById("btn-roll-inspiration");
const inputTitle = document.getElementById("story-title-input");
const inputHero = document.getElementById("story-hero-input");
const inputCompanion = document.getElementById("story-companion-input");
const inputHook = document.getElementById("story-hook-input");
const inputBranchAText = document.getElementById("branch-a-text");
const inputBranchAOutcome = document.getElementById("branch-a-outcome");
const inputBranchBText = document.getElementById("branch-b-text");
const inputBranchBOutcome = document.getElementById("branch-b-outcome");

const genreGrid = document.getElementById("genre-grid");
const btnCompileStory = document.getElementById("btn-compile-story");
const libraryList = document.getElementById("library-list");
const libraryCounter = document.getElementById("library-counter");

const readingDesk = document.getElementById("reading-desk");
const viewportStoryTitle = document.getElementById("viewport-story-title");
const viewportStoryBody = document.getElementById("viewport-story-body");
const viewportChoicesContainer = document.getElementById("viewport-choices-container");
const storyBadgeGenre = document.getElementById("story-badge-genre");
const storyReadTime = document.getElementById("story-read-time");
const companionMoraleBadge = document.getElementById("badge-companion-morale");

const btnTtsToggle = document.getElementById("btn-tts-toggle");
const ttsIcon = document.getElementById("tts-icon");
const ttsVoiceSelect = document.getElementById("tts-voice-select");

const btnZoomIn = document.getElementById("btn-zoom-in");
const btnZoomOut = document.getElementById("btn-zoom-out");
const btnRestartStory = document.getElementById("btn-restart-story");
const btnOpenNotes = document.getElementById("btn-open-notes");
const btnCloseNotes = document.getElementById("btn-close-notes");
const drawerNotes = document.getElementById("drawer-notes");
const textareaUserNotes = document.getElementById("textarea-user-notes");
const themePills = document.getElementById("theme-pills");

const tourModal = document.getElementById("tour-modal");
const btnQuickTour = document.getElementById("btn-quick-tour");
const btnCloseTour = document.getElementById("btn-close-tour");
const btnDismissTour = document.getElementById("btn-dismiss-tour");
const btnToggleCreativeMode = document.getElementById("btn-toggle-creative-mode");
const panelCreator = document.getElementById("panel-creator");
const fileImportLibrary = document.getElementById("file-import-library");
const btnExportLibrary = document.getElementById("btn-export-library");

const ambientSoundText = document.getElementById("ambient-genre-soundtext");
const soundBarsContainer = document.getElementById("sound-bars");
const btnToggleSoundAmbient = document.getElementById("btn-toggle-sound-ambient");
const toastContainer = document.getElementById("toast-container");

let selectedGenre = "fantasy"; // global state for selected button
let isPulseActive = true;

// --- INTIALIZATION --- 
window.addEventListener("DOMContentLoaded", () => {
  initLibrary();
  populateTtsVoices();
  triggerToast("Sagas Engine loaded successfully! Ready to read.", "info");

  // Check if speech synthesis is supported
  if (appState.speechSynthEngine) {
    appState.speechSynthEngine.onvoiceschanged = () => {
      populateTtsVoices();
    };
  }

  // Load user notes from localStorage if exists
  const storedNotes = localStorage.getItem("sagas_user_notes");
  if (storedNotes) {
    textareaUserNotes.value = storedNotes;
  }
});

// --- TOAST NOTIFICATIONS ---
function triggerToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-animate pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold shadow-xl transition duration-300 bg-slate-900 ${ 
    type === "success" ? "border-emerald-500/50 text-emerald-300" : 
    type === "info" ? "border-violet-500/50 text-violet-300" : "border-amber-500/50 text-amber-300"
  }`;
  
  toast.innerHTML = `
    <span>${type === 'success' ? '✨' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- LOCAL STORAGE & MANUSCRIPT BUILDER ---
function initLibrary() {
  const localData = localStorage.getItem("sagas_manuscripts");
  if (localData) {
    try {
      appState.manuscripts = JSON.parse(localData);
    } catch(e) {
      appState.manuscripts = [...DEFAULT_MANUSCRIPTS];
    }
  } else {
    appState.manuscripts = [...DEFAULT_MANUSCRIPTS];
    localStorage.setItem("sagas_manuscripts", JSON.stringify(appState.manuscripts));
  }

  renderLibraryList();
  // Default load first item to Reading Desk
  if (appState.manuscripts.length > 0) {
    loadStoryIntoDesk(appState.manuscripts[0].id);
  }
}

function renderLibraryList() {
  libraryList.innerHTML = "";
  appState.manuscripts.forEach((m) => {
    const genreIcons = {
      fantasy: "🔮",
      scifi: "🚀",
      cyberpunk: "⚡",
      mystery: "🕵️",
      horror: "💀",
      custom: "✨"
    };
    const icon = genreIcons[m.genre] || "✨";
    const isCurrent = appState.activeStory && appState.activeStory.id === m.id;

    const item = document.createElement("div");
    item.className = `p-3 rounded-xl border transition-all duration-200 flex justify-between items-center group cursor-pointer ${
      isCurrent ? "bg-violet-950/40 border-violet-500/80" : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900"
    }`;

    item.innerHTML = `
      <div class="flex-1 min-w-0 pr-2" onclick="loadStoryIntoDesk('${m.id}')">
        <p class="text-xs font-bold ${isCurrent ? "text-violet-300" : "text-slate-200"} truncate">${m.title}</p>
        <p class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
          <span>${icon} ${m.genre.toUpperCase()}</span> • <span>Companion: ${m.companion}</span>
        </p>
      </div>
      <div class="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="p-1 text-slate-400 hover:text-rose-400 transition" onclick="deleteStory('${m.id}', event)" title="Discard manuscript">
          🗑️
        </button>
      </div>
    `;
    libraryList.appendChild(item);
  });

  libraryCounter.innerText = `${appState.manuscripts.length} Ready`;
  const statsCount = document.getElementById("stats-stories-count");
  if (statsCount) {
    statsCount.innerText = `Active Stories: ${appState.manuscripts.length}`;
  }
}

// --- LOAD MANUSCRIPT TO READER SANCTUARY ---
window.loadStoryIntoDesk = function(id) {
  const found = appState.manuscripts.find(x => x.id === id);
  if (!found) return;

  // Stop narration if active
  stopNarration();

  appState.activeStory = found;
  renderLibraryList();

  // Update Badge & UI
  storyBadgeGenre.innerText = found.genre.toUpperCase();
  
  // Decorate badge according to genre
  const colorMap = {
    fantasy: "bg-violet-900 text-violet-200 border-violet-700/60",
    scifi: "bg-sky-900 text-sky-200 border-sky-700/60",
    cyberpunk: "bg-amber-950 text-amber-400 border-amber-800/60",
    mystery: "bg-zinc-800 text-zinc-200 border-zinc-700/60",
    horror: "bg-rose-950 text-rose-300 border-rose-900/60",
    custom: "bg-purple-900 text-purple-200 border-purple-700/60"
  };
  storyBadgeGenre.className = `px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colorMap[found.genre] || ""}`;

  // Update Ambient sounds label
  const soundMap = {
    fantasy: "Ambient: Celestial Winds & Lute Strings",
    scifi: "Ambient: Deep Space Engine Hum",
    cyberpunk: "Ambient: Retro Synth Loop & Rainfall",
    mystery: "Ambient: Quiet Clock Ticking & Noir Jazz",
    horror: "Ambient: Crypt Whispers & Wind Howl",
    custom: "Ambient: Ethereal Void Frequencies"
  };
  ambientSoundText.innerText = `${soundMap[found.genre]} ${isPulseActive ? '(Active)' : '(Paused)'}`;

  // Populate text
  viewportStoryTitle.innerText = found.title;
  
  // Split Hook into clean paragraphs
  const hookParagraphs = found.hook.split('\n').filter(p => p.trim() !== "");
  let bodyHTML = "";
  hookParagraphs.forEach(p => {
    bodyHTML += `<p class="mb-3">${escapeHTML(p)}</p>`;
  });
  viewportStoryBody.innerHTML = bodyHTML;
  
  // Read time calculator
  const wordCount = found.hook.split(' ').length;
  const minRead = Math.max(1, Math.ceil(wordCount / 130));
  storyReadTime.innerText = `📖 ${minRead} min read • ${wordCount} words`;

  // Set Companion state
  companionMoraleBadge.innerText = found.companionMorale || "Trusting";
  companionMoraleBadge.className = `px-2 py-0.5 rounded font-semibold border ${
    found.companionMorale === "Guarded & Growling" || found.companionMorale === "Slightly Panicked" 
    ? "bg-rose-950 text-rose-400 border-rose-900/60" 
    : "bg-emerald-950 text-emerald-400 border-emerald-800/60"
  }`;

  // Load Interactive Decision buttons
  renderChoices(found);

  // Scroll to desk top
  document.getElementById("story-viewport").scrollTop = 0;
  triggerToast(`Loaded "${found.title}" into the Desk`, "success");
};

function renderChoices(story) {
  viewportChoicesContainer.innerHTML = "";

  if (!story.choices) return;

  // Option A Card
  if (story.choices.optionA) {
    const btnA = document.createElement("button");
    btnA.className = "choice-card-btn text-left p-4 rounded-xl border border-violet-500/20 hover:border-violet-500/80 bg-violet-950/20 hover:bg-violet-950/40 text-violet-200 text-sm font-medium transition duration-300 group flex items-start gap-3";
    btnA.innerHTML = `
      <span class="px-2 py-0.5 rounded bg-violet-900/40 text-violet-300 font-mono text-xs mt-0.5 group-hover:bg-violet-700">A</span>
      <span>${escapeHTML(story.choices.optionA)}</span>
    `;
    btnA.onclick = () => triggerOutcome(story, "A");
    viewportChoicesContainer.appendChild(btnA);
  }

  // Option B Card
  if (story.choices.optionB) {
    const btnB = document.createElement("button");
    btnB.className = "choice-card-btn text-left p-4 rounded-xl border border-fuchsia-500/20 hover:border-fuchsia-500/80 bg-fuchsia-950/20 hover:bg-fuchsia-950/40 text-fuchsia-200 text-sm font-medium transition duration-300 group flex items-start gap-3";
    btnB.innerHTML = `
      <span class="px-2 py-0.5 rounded bg-fuchsia-900/40 text-fuchsia-300 font-mono text-xs mt-0.5 group-hover:bg-fuchsia-700">B</span>
      <span>${escapeHTML(story.choices.optionB)}</span>
    `;
    btnB.onclick = () => triggerOutcome(story, "B");
    viewportChoicesContainer.appendChild(btnB);
  }
}

// --- OUTCOME TRIGGERS & PATH FORWARD ---
function triggerOutcome(story, choiceType) {
  stopNarration();

  // Add visual separation inside text viewport
  const divider = document.createElement("div");
  divider.className = "py-4 flex items-center justify-center gap-2 max-w-2xl mx-auto";
  divider.innerHTML = `
    <div class="flex-1 h-[1px] bg-gradient-to-r from-transparent to-violet-500"></div>
    <span class="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Choice ${choiceType} Chosen</span>
    <div class="flex-1 h-[1px] bg-gradient-to-l from-transparent to-violet-500"></div>
  `;
  viewportStoryBody.appendChild(divider);

  // Generate Outcome block
  const outcomeText = choiceType === "A" ? story.choices.outcomeA : story.choices.outcomeB;
  const p = document.createElement("p");
  p.className = "mb-3 font-semibold text-slate-100 italic transition-all duration-300 scale-[0.99] border-l-2 border-violet-500 pl-3 py-1";
  p.innerText = outcomeText || "Your path has reached the edge of recorded legend. What happens next is up to your imagination...";
  viewportStoryBody.appendChild(p);

  // Disable/Remove current choices and add 'Back to Start' button state
  viewportChoicesContainer.innerHTML = `
    <button onclick="resetCurrentPath()" class="w-full sm:col-span-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition text-xs text-center">
      🔄 You have forged a path. Click to restart chapter decisions.
    </button>
  `;

  // Scroll bottom smoothly
  setTimeout(() => {
    const viewPort = document.getElementById("story-viewport");
    viewPort.scrollTop = viewPort.scrollHeight;
  }, 50);

  triggerToast(`Your companion ${story.companion} reacted to Choice ${choiceType}!`, "info");
}

window.resetCurrentPath = function() {
  if (appState.activeStory) {
    loadStoryIntoDesk(appState.activeStory.id);
  }
};

window.deleteStory = function(id, event) {
  event.stopPropagation();
  
  // Prevent deleting absolutely everything if possible
  if (appState.manuscripts.length <= 1) {
    triggerToast("You must retain at least one manuscript in your library!", "warning");
    return;
  }

  const confirmation = confirm("Are you sure you want to discard this story manuscript?");
  if (!confirmation) return;

  appState.manuscripts = appState.manuscripts.filter(x => x.id !== id);
  localStorage.setItem("sagas_manuscripts", JSON.stringify(appState.manuscripts));
  
  triggerToast("Manuscript discarded", "warning");

  if (appState.activeStory && appState.activeStory.id === id) {
    loadStoryIntoDesk(appState.manuscripts[0].id);
  } else {
    renderLibraryList();
  }
};

// --- DIALLING RANDOM DESTINY (FATE SPINNER) ---
btnRollInspiration.addEventListener("click", () => {
  // Trigger temporary dice roll spin animation
  const diceBtn = btnRollInspiration.querySelector("span");
  diceBtn.classList.add("dice-spinning");
  setTimeout(() => diceBtn.classList.remove("dice-spinning"), 650);

  // Select random elements
  const randTitle = FATE_TITLES[Math.floor(Math.random() * FATE_TITLES.length)];
  const randHero = FATE_HEROES[Math.floor(Math.random() * FATE_HEROES.length)];
  const randCompanion = FATE_COMPANIONS[Math.floor(Math.random() * FATE_COMPANIONS.length)];
  const randHook = FATE_HOOKS[Math.floor(Math.random() * FATE_HOOKS.length)];
  const randGenreArr = ["fantasy", "scifi", "cyberpunk", "mystery", "horror"];
  const randGenre = randGenreArr[Math.floor(Math.random() * randGenreArr.length)];
  const randChoiceSet = FATE_CHOICES[Math.floor(Math.random() * FATE_CHOICES.length)];

  // Populate Form Fields
  inputTitle.value = randTitle;
  inputHero.value = randHero;
  inputCompanion.value = randCompanion;
  inputHook.value = randHook;
  
  inputBranchAText.value = randChoiceSet.optionA;
  inputBranchAOutcome.value = randChoiceSet.outcomeA;
  inputBranchBText.value = randChoiceSet.optionB;
  inputBranchBOutcome.value = randChoiceSet.outcomeB;

  // Match Genre button click
  setGenre(randGenre);

  triggerToast("Fate rolled! Check the Story Forge fields.", "info");
});

// --- GENRE SELECTION IN FORGE --- 
function setGenre(genreName) {
  selectedGenre = genreName;
  const buttons = genreGrid.querySelectorAll("button");
  buttons.forEach(btn => {
    const btnGenre = btn.getAttribute("data-genre");
    if (btnGenre === genreName) {
      btn.className = "genre-btn py-2 px-3 text-xs font-semibold rounded-lg bg-violet-600/30 border-2 border-violet-500 text-violet-200 shadow-md shadow-violet-500/10 transition duration-200";
    } else {
      btn.className = "genre-btn py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800/80 border-2 border-transparent hover:border-slate-700 text-slate-400 hover:text-slate-200 transition duration-200";
    }
  });
}

// Add click listeners to all genre grid buttons
genreGrid.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    const genre = btn.getAttribute("data-genre");
    setGenre(genre);
  });
});

// --- FORGE NEW STORY FORM SUBMIT ---
btnCompileStory.addEventListener("click", () => {
  const title = inputTitle.value.trim() || "An Untitled Sagas Chapter";
  const hero = inputHero.value.trim() || "The Silent Protagonist";
  const companion = inputCompanion.value.trim() || "A Mysterious Spirit";
  const hook = inputHook.value.trim() || "Silence covers the space. Suddenly a crack of bright turquoise magic splits the room open.";
  
  const choiceAText = inputBranchAText.value.trim() || "Enter the swirling blue rift.";
  const choiceAOutcome = inputBranchAOutcome.value.trim() || "You are pulled through! You feel light, and suddenly touch down safely in the clouds.";
  const choiceBText = inputBranchBText.value.trim() || "Back away slowly into safety.";
  const choiceBOutcome = inputBranchBOutcome.value.trim() || "You run out into the night, keeping your secrets safe from cosmic interference.";

  // Check for duplication
  const isDuplicate = appState.manuscripts.some(m => m.title.toLowerCase() === title.toLowerCase());
  if (isDuplicate) {
    if (!confirm("A story with this title already exists. Do you want to forge another anyway?")) {
      return;
    }
  }

  const newManuscript = {
    id: "saga-user-" + Date.now(),
    title: title,
    genre: selectedGenre,
    hero: hero,
    companion: companion,
    hook: hook,
    choices: {
      optionA: choiceAText,
      outcomeA: choiceAOutcome,
      optionB: choiceBText,
      outcomeB: choiceBOutcome
    },
    companionMorale: "Enthusiastic & Loaded"
  };

  // Add to state list
  appState.manuscripts.unshift(newManuscript);
  localStorage.setItem("sagas_manuscripts", JSON.stringify(appState.manuscripts));

  // Re-render and load
  renderLibraryList();
  loadStoryIntoDesk(newManuscript.id);

  // Flash reading desk briefly
  readingDesk.classList.add("ring-2", "ring-violet-500");
  setTimeout(() => readingDesk.classList.remove("ring-2", "ring-violet-500"), 1000);

  triggerToast(`Forged new custom ${selectedGenre.toUpperCase()} saga!`, "success");
});

// --- THEME SWAPPING ENGINE --- 
themePills.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const selectedTheme = button.getAttribute("data-theme");
  appState.readingTheme = selectedTheme;

  // Clear existing active theme pill class styling
  themePills.querySelectorAll(".theme-pill").forEach(btn => {
    btn.classList.remove("border-violet-500", "text-violet-400", "border-emerald-500", "text-emerald-400");
    // reset basics
    btn.style.borderColor = "transparent";
  });

  // Outline the active button
  button.style.borderColor = "currentColor";

  // Apply actual styles to the Desk container
  readingDesk.className = readingDesk.className.replace(/theme-\w+/g, "");
  readingDesk.classList.add(`theme-${selectedTheme}`);

  triggerToast(`Sanctuary set to: ${selectedTheme.toUpperCase()}`, "info");
});

// --- TEXT RESIZER ---
btnZoomIn.addEventListener("click", () => {
  if (appState.textScale < 140) {
    appState.textScale += 10;
    viewportStoryBody.style.fontSize = `${appState.textScale}%`;
    triggerToast(`Text zoom: ${appState.textScale}%`, "info");
  }
});

btnZoomOut.addEventListener("click", () => {
  if (appState.textScale > 80) {
    appState.textScale -= 10;
    viewportStoryBody.style.fontSize = `${appState.textScale}%`;
    triggerToast(`Text zoom: ${appState.textScale}%`, "info");
  }
});

// --- USER NOTE-PAD DOCKING ---
btnOpenNotes.addEventListener("click", () => {
  drawerNotes.classList.toggle("hidden");
  if (!drawerNotes.classList.contains("hidden")) {
    textareaUserNotes.focus();
  }
});

btnCloseNotes.addEventListener("click", () => {
  drawerNotes.classList.add("hidden");
});

textareaUserNotes.addEventListener("input", () => {
  localStorage.setItem("sagas_user_notes", textareaUserNotes.value);
});

// --- READ ALOUD (WEB SPEECH SYNTHESIS) NARRATOR ---
function populateTtsVoices() {
  if (!appState.speechSynthEngine) return;
  const voices = appState.speechSynthEngine.getVoices();
  
  // Keep default options first
  ttsVoiceSelect.innerHTML = "<option value=''>Default Voice</option>";
  
  voices.forEach(voice => {
    // Filters standard English or high-quality voices for neat reading
    if (voice.lang.includes("en") || voice.lang.includes("EN")) {
      const opt = document.createElement("option");
      opt.value = voice.name;
      opt.innerText = `${voice.name.replace(/Microsoft|Google|Apple/g, '').slice(0, 15)} (${voice.lang})`;
      ttsVoiceSelect.appendChild(opt);
    }
  });
}

btnTtsToggle.addEventListener("click", () => {
  if (!appState.speechSynthEngine) {
    triggerToast("Web Speech synthesis is not supported on your current browser environment.", "warning");
    return;
  }

  if (appState.speechSynthesisActive) {
    stopNarration();
    triggerToast("Narration muted", "info");
  } else {
    startNarration();
  }
});

function startNarration() {
  if (!appState.speechSynthEngine) return;

  // Stop any active queue
  appState.speechSynthEngine.cancel();

  // Collect all text from current state viewport
  const rawStoryText = viewportStoryBody.innerText;
  if (!rawStoryText) {
    triggerToast("No narrative text found to read!", "warning");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(rawStoryText);
  
  // Try to bind voice
  const selectedVoiceName = ttsVoiceSelect.value;
  if (selectedVoiceName) {
    const voices = appState.speechSynthEngine.getVoices();
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) utterance.voice = voiceObj;
  }

  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    appState.speechSynthesisActive = true;
    ttsIcon.innerText = "🛑";
    btnTtsToggle.querySelector("span:last-child").innerText = "Stop Reader";
    // Animate sound waves actively
    triggerVisualSoundBars(true);
    triggerToast("Voice synthesis reading initialized...", "success");
  };

  utterance.onend = () => {
    resetTtsUI();
  };

  utterance.onerror = () => {
    resetTtsUI();
  };

  appState.speechUtterance = utterance;
  appState.speechSynthEngine.speak(utterance);
}

function stopNarration() {
  if (appState.speechSynthEngine) {
    appState.speechSynthEngine.cancel();
  }
  resetTtsUI();
}

function resetTtsUI() {
  appState.speechSynthesisActive = false;
  ttsIcon.innerText = "🔊";
  const textSpan = btnTtsToggle.querySelector("span:last-child");
  if (textSpan) {
    textSpan.innerText = "Read Narrative";
  }
  triggerVisualSoundBars(false);
}

function triggerVisualSoundBars(active) {
  const bars = soundBarsContainer.querySelectorAll("span");
  bars.forEach((bar, idx) => {
    if (active) {
      bar.style.animationName = "bounce";
      bar.className = `bg-violet-400 w-0.5 h-${(idx + 1) * 2} animate-bounce`;
    } else {
      bar.style.animationName = "none";
      bar.className = "bg-slate-700 w-0.5 h-2";
    }
  });
}

// --- AMBIENT SOUND PULSER SIMULATION --- 
btnToggleSoundAmbient.addEventListener("click", () => {
  isPulseActive = !isPulseActive;
  if (appState.activeStory) {
    const soundMap = {
      fantasy: "Ambient: Celestial Winds & Lute Strings",
      scifi: "Ambient: Deep Space Engine Hum",
      cyberpunk: "Ambient: Retro Synth Loop & Rainfall",
      mystery: "Ambient: Quiet Clock Ticking & Noir Jazz",
      horror: "Ambient: Crypt Whispers & Wind Howl",
      custom: "Ambient: Ethereal Void Frequencies"
    };
    ambientSoundText.innerText = `${soundMap[appState.activeStory.genre]} ${isPulseActive ? '(Active)' : '(Paused)'}`;
  }

  if (isPulseActive) {
    triggerToast("Visual ambient frequencies enabled.", "success");
    triggerVisualSoundBars(true);
    setTimeout(() => {
      if (!appState.speechSynthesisActive) {
        triggerVisualSoundBars(false);
      }
    }, 2000);
  } else {
    triggerToast("Ambient sound visualizer paused.", "info");
  }
});

// --- COMPILING RESET PATH ---
btnRestartStory.addEventListener("click", () => {
  resetCurrentPath();
});

// --- MULTI-STEP TOUR GUIDE MODAL ---
btnQuickTour.addEventListener("click", () => {
  tourModal.classList.remove("hidden");
});

btnCloseTour.addEventListener("click", () => {
  tourModal.classList.add("hidden");
});

btnDismissTour.addEventListener("click", () => {
  tourModal.classList.add("hidden");
  triggerToast("Explore the sandbox at your leisure!", "success");
});

// --- TOGGLE CREATIVE MANUSCRIPT MODE PANEL ---
btnToggleCreativeMode.addEventListener("click", () => {
  panelCreator.scrollIntoView({ behavior: "smooth" });
  // highlight flash
  panelCreator.classList.add("ring-2", "ring-violet-500/60");
  setTimeout(() => panelCreator.classList.remove("ring-2", "ring-violet-500/60"), 1500);
  triggerToast("Scrolled to Story Forge! Ready to write.", "info");
});

// --- MANUSCRIPT JSON EXPORT ---
btnExportLibrary.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.manuscripts, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sagas_library_export_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  triggerToast("Manuscripts library JSON file downloaded!", "success");
});

// --- MANUSCRIPT JSON IMPORT ---
fileImportLibrary.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported)) {
        appState.manuscripts = [...imported, ...appState.manuscripts];
        localStorage.setItem("sagas_manuscripts", JSON.stringify(appState.manuscripts));
        renderLibraryList();
        if (appState.manuscripts.length > 0) {
          loadStoryIntoDesk(appState.manuscripts[0].id);
        }
        triggerToast("Imported manuscripts successfully nested!", "success");
      } else {
        triggerToast("Invalid backup file schema: Expected a valid JSON array.", "warning");
      }
    } catch(err) {
      triggerToast("Error reading manuscript backup format!", "warning");
    }
  };
  reader.readAsText(file);
});

// Helper to escape HTML and prevent malicious injection tags
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}