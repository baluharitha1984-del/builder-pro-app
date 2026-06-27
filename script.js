// Interactive Neon Clock Mechanics

function updateClock() {
  const now = new Date();
  
  // Hours
  let hours = now.getHours();
  const ampmStr = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  const hoursStr = String(hours).padStart(2, '0');
  
  // Minutes / Seconds
  const minutesStr = String(now.getMinutes()).padStart(2, '0');
  const secondsStr = String(now.getSeconds()).padStart(2, '0');
  
  // Update elements
  document.getElementById('hours').innerText = hoursStr;
  document.getElementById('minutes').innerText = minutesStr;
  document.getElementById('seconds').innerText = secondsStr;
  document.getElementById('ampm').innerText = ampmStr;
  
  // Format Date beautifully
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString(undefined, options);
  document.getElementById('date').innerText = dateStr;
}

// Run immediately & set interval
updateClock();
setInterval(updateClock, 1000);

// Interaction functions
let swirlPaused = false;
function toggleAnimation() {
  swirlPaused = !swirlPaused;
  const orbs = document.querySelectorAll('.glow-orb');
  orbs.forEach(orb => {
    orb.style.animationPlayState = swirlPaused ? 'paused' : 'running';
  });
  
  const title = document.querySelector('.header-title');
  title.innerText = swirlPaused ? "SWIRL PAUSED" : "LIVE NEON CLOCK";
}

function changeTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  console.log("Visual atmosphere set to: " + (isLight ? "Daylight Mode" : "Cosmic Dark Mode"));
}