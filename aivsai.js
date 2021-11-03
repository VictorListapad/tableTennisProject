const fps = 60;

// Canvas
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
canvas.style.position = "absolute";
canvas.style.top = "25%";
canvas.style.left = "25%";
canvas.style.outline = "4px solid black";

// Components for walls, paddles, net and field
class Component {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedY = 5;
    this.score = 0;
  }
}

// Create player 1 object
const computer1 = new Component(0, canvas.height / 2 - 50, 10, 100, "white");

// Create computer object
const computer2 = new Component(
  canvas.width - 10,
  canvas.height / 2 - 50,
  10,
  100,
  "white"
);

// Create field object
const field = new Component(0, 0, canvas.width, canvas.height, "black");

// Create net
const net = new Component(canvas.width / 2 - 1, 0, 2, 10, "white");

// Create ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

// Draw ball function
function drawBall(obj) {
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draw rectangle function
function drawRectangle(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Draw Text function
function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "40px Monaco";
  ctx.fillText(text, x, y);
}

// Draw Net
function drawNet() {
  for (let i = 0; i < canvas.height; i += 15) {
    ctx.fillStyle = "white";
    ctx.fillRect(net.x, net.y + i, net.width, net.height);
  }
}
// function drawNet(obj) {
//   for (let i = 0; i < canvas.height; i += 15) {
//     drawRectangle(obj);
//     obj.y += 15;
//   }
// }

// Render everything onto the canvas
function render() {
  drawRectangle(field);
  drawRectangle(computer1);
  drawRectangle(computer2);
  drawBall(ball);
  drawNet();
  drawText(computer1.score, canvas.width / 4, canvas.height / 5, "white");
  drawText(computer2.score, (3 * canvas.width) / 4, canvas.height / 5, "white");
}

// canvas.addEventListener("mousemove", movePaddle);
// function movePaddle(event) {
//   let rect = canvas.getBoundingClientRect();
//   computer1.y = event.clientY - rect.top - computer1.height / 2;
// }

function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}
// reset ball
function resetBall() {
  ball.velocityX = 5;
  ball.velocityY = 5;
  ball.speed = 5;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  let direction = Math.floor(Math.random() * 2);
  if (direction === 0) {
    ball.velocityX = -ball.velocityX;
  }
}

// update field
function updateField() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  // computer AI
  let difficultyLevel = 0.5;
  computer1.y +=
    (ball.y - (computer1.y + computer1.height / 2)) * difficultyLevel;
  computer2.y +=
    (ball.y - (computer2.y + computer2.height / 2)) * difficultyLevel;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = ball.x < canvas.width / 2 ? computer1 : computer2;
  if (collision(ball, player)) {
    // ball.velocityX = -ball.velocityX;
    let collidePoint = ball.y - (player.y + player.height / 2);
    // normalization
    collidePoint = collidePoint / (player.height / 2);
    // calculate angle
    let angleRad = (collidePoint * Math.PI) / 4;
    // direction of the ball when hit
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    // change vel X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.5;
  }

  // update score
  if (ball.x < -100) {
    // player 2 win
    computer1.score++;
    resetBall();
  } else if (ball.x > canvas.width + 100) {
    computer2.score++;
    resetBall();
  }
}

// game function
function game() {
  render();
  updateField();
  let finish = checkGameOver();
  if (finish) {
    clearInterval(interval);
  }
}
function checkGameOver() {
  if (computer1.score === 10) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText(
      "Player 1 Won!",
      canvas.width / 3 + 20,
      canvas.height / 3,
      "white"
    );
    return true;
  } else if (computer2.score === 10) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText(
      "Player 2 Won!",
      canvas.width / 3 + 20,
      canvas.height / 3,
      "white"
    );
    return true;
  }
  return false;
}

globalThis.interval = setInterval(game, 1000 / fps);
