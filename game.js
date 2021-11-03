// Frame rate
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
const player1 = new Component(0, canvas.height / 2 - 50, 10, 100, "white");

// Create computer object
const computer = new Component(
  canvas.width - 10,
  canvas.height / 2 - 50,
  10,
  100,
  "white"
);

// Create field object
const field = new Component(0, 0, canvas.width, canvas.height, "black");

// Create net
const net = new Component(canvas.width - 1, 0, 2, 10, "white");

function drawSquares(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

drawSquares(field);
drawSquares(player1);
drawSquares(computer);
