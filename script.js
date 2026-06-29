// Retro Snake Interaction Code

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridCount = 20;
const gridSize = canvas.width / gridCount;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 1;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snake_high_score') || 0;
let gameInterval = null;
let gameSpeed = 110;
let isGameActive = false;

const highScoreEl = document.getElementById('high-score');
if (highScoreEl) highScoreEl.innerText = highScore;

function startGame() {
  snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
  ];
  dx = 1;
  dy = 0;
  score = 0;
  const currentScoreEl = document.getElementById('current-score');
  if (currentScoreEl) currentScoreEl.innerText = score;
  const gameOverlayEl = document.getElementById('game-overlay');
  if (gameOverlayEl) gameOverlayEl.style.display = 'none';
  
  generateFood();
  if (gameInterval) clearInterval(gameInterval);
  isGameActive = true;
  gameInterval = setInterval(gameStep, gameSpeed);
  console.log("Snake Game Started!");
}

function generateFood() {
  food.x = Math.floor(Math.random() * gridCount);
  food.y = Math.floor(Math.random() * gridCount);
  
  // Make sure food is not on snake
  for (let part of snake) {
    if (part.x === food.x && part.y === food.y) {
      generateFood();
      break;
    }
  }
}

function gameStep() {
  // Move snake
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  // Wall collision check
  if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
    gameOver();
    return;
  }
  
  // Self collision check
  for (let part of snake) {
    if (part.x === head.x && part.y === head.y) {
      gameOver();
      return;
    }
  }
  
  snake.unshift(head);
  
  // Food dynamic eating
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    const currentScoreEl = document.getElementById('current-score');
    if (currentScoreEl) currentScoreEl.innerText = score;
    generateFood();
  } else {
    snake.pop();
  }
  
  draw();
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#05010b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid Lines
  ctx.strokeStyle = '#120524';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
  
  // Draw Snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#d946ef' : '#a855f7';
    ctx.shadowBlur = index === 0 ? 8 : 4;
    ctx.shadowColor = '#d946ef';
    ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
  });
  
  // Draw Food
  ctx.fillStyle = '#10b981';
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#10b981';
  ctx.beginPath();
  ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0; // reset
}

function changeDirection(dir) {
  if (!isGameActive) return;
  if (dir === 'UP' && dy !== 1) { dx = 0; dy = -1; }
  if (dir === 'DOWN' && dy !== -1) { dx = 0; dy = 1; }
  if (dir === 'LEFT' && dx !== 1) { dx = -1; dy = 0; }
  if (dir === 'RIGHT' && dx !== -1) { dx = 1; dy = 0; }
}

// Arrow Keys support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') changeDirection('UP');
  if (e.key === 'ArrowDown') changeDirection('DOWN');
  if (e.key === 'ArrowLeft') changeDirection('LEFT');
  if (e.key === 'ArrowRight') changeDirection('RIGHT');
});

function gameOver() {
  clearInterval(gameInterval);
  isGameActive = false;
  
  console.log("Game Over! Score: " + score);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snake_high_score', highScore);
    const highScoreEl = document.getElementById('high-score');
    if (highScoreEl) highScoreEl.innerText = highScore;
  }
  
  const overlayTextEl = document.getElementById('overlay-text');
  if (overlayTextEl) overlayTextEl.innerText = 'GAME OVER
SCORE: ' + score;
  const btnStartEl = document.getElementById('btn-start');
  if (btnStartEl) btnStartEl.innerText = 'RESTART';
  const gameOverlayEl = document.getElementById('game-overlay');
  if (gameOverlayEl) gameOverlayEl.style.display = 'flex';
}

// Init draw
draw();