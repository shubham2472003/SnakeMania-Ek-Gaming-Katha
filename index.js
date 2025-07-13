// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let board = document.getElementById("board");
let scoreBox = document.getElementById("scoreBox");
let hiscoreBox = document.getElementById("hiscoreBox");

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // Collide with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  // Collide with wall
  return (
    snake[0].x <= 0 || snake[0].x >= 18 || snake[0].y <= 0 || snake[0].y >= 18
  );
}

function gameEngine() {
  // Collision check
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    alert("Game Over! Press any key to restart.");
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    musicSound.play();
  }

  // Eat food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score++;
    scoreBox.innerHTML = "Score: " + score;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    food = {
      x: Math.floor(2 + Math.random() * 15),
      y: Math.floor(2 + Math.random() * 15),
    };
  }

  // Move snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Render snake and food
  board.innerHTML = "";
  snakeArr.forEach((segment, i) => {
    const element = document.createElement("div");
    element.style.gridRowStart = segment.y;
    element.style.gridColumnStart = segment.x;
    element.classList.add(i === 0 ? "head" : "snake");
    board.appendChild(element);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Initialize
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
if (!hiscore) localStorage.setItem("hiscore", JSON.stringify(0));

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
      break;
  }
});
