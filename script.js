const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
const rows = canvasSize / box;
const cols = canvasSize / box;

const snakeImg = new Image();
snakeImg.src = 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/09ee7828b305acaac68aaf45e3a75952f15071a8_image.png';

const facts = [
  "I'm PianoMan0 — a full-stack developer with 5 years of experience!",
  "Besides programming, I play the piano (hence the name!)",
  "My main languages are HTML, CSS, Javascript, Python, Java, PHP, and Scratch.",
  "I'm a member of Hack Club, a community of teen developers!",
  "This website was built for a Hack Club event called Gamefolio!",
];

let snake, direction, apple, gameLoop, score, isDead;

function initGame() {
  snake = [
    {x: 8, y: 10},
    {x: 7, y: 10},
    {x: 6, y: 10}
  ];
  direction = {x: 1, y: 0};
  placeApple();
  score = 0;
  isDead = false;
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('scoreDisplay').textContent = 'Score: 0';
  canvas.focus();
}

// Place apple at random position not on snake
function placeApple() {
  let valid;
  do {
    apple = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
    valid = !snake.some(segment => segment.x === apple.x && segment.y === apple.y);
  } while (!valid);
}

// Draw everything
function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw apple
  ctx.fillStyle = "#f44336";
  ctx.beginPath();
  ctx.arc(
    apple.x * box + box / 2, 
    apple.y * box + box / 2, 
    box / 2.5, 
    0, 2 * Math.PI
  );
  ctx.fill();

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    // Use my pfp for each segment
    ctx.drawImage(
      snakeImg,
      snake[i].x * box,
      snake[i].y * box,
      box, box
    );
  }
}

function update() {
  if (isDead) return;

  // New head
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Check wall collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= cols || head.y >= rows
  ) {
    endGame();
    return;
  }

  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Eat apple
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  isDead = true;
  clearInterval(gameLoop);

  // Show random fact about me!!
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById('fact').textContent = fact;
  document.getElementById('gameOver').classList.remove('hidden');
}

document.addEventListener('keydown', function(e) {
  if (isDead) return;
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (direction.y !== 1) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (direction.y !== -1) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (direction.x !== 1) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (direction.x !== -1) direction = {x: 1, y: 0};
      break;
  }
});

function restartGame() {
  initGame();
  draw();
  gameLoop = setInterval(update, 120);
}

// Wait for snake image to load before starting
snakeImg.onload = () => {
  restartGame();
};

window.restartGame = restartGame;