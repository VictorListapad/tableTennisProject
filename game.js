function singlePlayer() {
  // Frame rate
  const fps = 60;

  // Canvas
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");

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
  const player1 = new Component(0, canvas.height / 2 - 50, 10, 100, "blue");

  // Create computer object
  const computer = new Component(
    canvas.width - 10,
    canvas.height / 2 - 50,
    10,
    100,
    "red"
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
  function pickDifficulty() {
    let difficulty = document.getElementsByName("difficulty");
    for (let i = 0; i < difficulty.length; i++) {
      if (difficulty[i].checked) {
        return difficulty[i].value;
      }
    }
  }

  // Render everything onto the canvas
  function render() {
    drawRectangle(field);
    drawRectangle(player1);
    drawRectangle(computer);
    drawNet();
    drawBall(ball);
    drawText(player1.score, canvas.width / 4, canvas.height / 5, "blue");
    drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "red");
  }

  canvas.addEventListener("mousemove", movePaddle);
  function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();
    player1.y = event.clientY - rect.top - player1.height / 2;
    if (player1.y <= 0) {
      player1.y = 0;
    }
    if (player1.y + player1.height >= canvas.height) {
      player1.y = canvas.height - player1.height;
    }
  }

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
      b.right > p.left &&
      b.bottom > p.top &&
      b.left < p.right &&
      b.top < p.bottom
    );
  }
  // reset ball
  function resetBall() {
    ball.velocityX = 5;
    ball.velocityY = 5;
    ball.speed = 5;
    ball.color = "white";
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
    // let difficultyLevel = 0.08;
    let difficultyLevel = pickDifficulty();
    console.log(difficultyLevel);
    computer.y +=
      (ball.y - (computer.y + computer.height / 2)) * difficultyLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }
    let player = ball.x < canvas.width / 2 ? player1 : computer;
    // if (player === player1) {
    //   ball.color = "blue";
    // } else {
    //   ball.color = "red";
    // }
    if (collision(ball, player)) {
      // ball.velocityX = -ball.velocityX;
      let collidePoint = ball.y - (player.y + player.height / 2);
      // normalization
      collidePoint = collidePoint / (player.height / 2);
      // calculate angle
      let angleRad = (collidePoint * Math.PI) / 4;
      // direction of the ball when hit
      let direction = ball.x < canvas.width / 2 ? 1 : -1;
      if (direction === 1) {
        ball.color = "blue";
      } else {
        ball.color = "red";
      }
      // change vel X and Y
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      ball.speed += 0.2;
    }

    // update score
    if (ball.x < -100) {
      // computer scores
      computer.score++;
      resetBall();
      // player scores
    } else if (ball.x > canvas.width + 100) {
      player1.score++;
      resetBall();
    }
  }

  // game function
  function game() {
    render();
    updateField();
    if (checkGameOver()) {
      clearInterval(interval);
    }
  }
  function checkGameOver() {
    if (player1.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText("Player Wins!", 250, 150, "blue");
      return true;
    } else if (computer.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText("Computer Wins :(", 200, 150, "red");
      return true;
    }
    return false;
  }
  globalThis.interval = setInterval(game, 1000 / fps);
}

function multiplayer() {
  // Frame rate
  const fps = 60;

  // Canvas
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");

  // Components for walls, paddles, net and field
  class Component {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.speedY = 80;
      this.score = 0;
    }
  }

  // Create player 1 object
  const player1 = new Component(0, canvas.height / 2 - 50, 10, 100, "blue");

  // Create computer object
  const player2 = new Component(
    canvas.width - 10,
    canvas.height / 2 - 50,
    10,
    100,
    "red"
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

  // Render everything onto the canvas
  function render() {
    drawRectangle(field);
    drawRectangle(player1);
    drawRectangle(player2);
    drawNet();
    drawBall(ball);
    drawText(player1.score, canvas.width / 4, canvas.height / 5, "blue");
    drawText(player2.score, (3 * canvas.width) / 4, canvas.height / 5, "red");
  }

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        player2.y -= player2.speedY;
        if (player2.y <= 0) {
          player2.y = 0;
        }
        break;
      case "ArrowDown":
        player2.y += player2.speedY;
        if (player2.y + player2.height >= canvas.height) {
          player2.y = canvas.height - player2.height;
        }
        break;
      case "w":
        player1.y -= player1.speedY;
        if (player1.y <= 0) {
          player1.y = 0;
        }

        break;
      case "s":
        player1.y += player1.speedY;
        if (player1.y + player1.height >= canvas.height) {
          player1.y = canvas.height - player1.height;
        }
        break;
    }
  });

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
      b.right > p.left &&
      b.bottom > p.top &&
      b.left < p.right &&
      b.top < p.bottom
    );
  }
  // reset ball
  function resetBall() {
    ball.velocityX = 5;
    ball.velocityY = 5;
    ball.speed = 5;
    ball.color = "white";
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
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }
    let player = ball.x < canvas.width / 2 ? player1 : player2;
    if (collision(ball, player)) {
      // ball.velocityX = -ball.velocityX;
      let collidePoint = ball.y - (player.y + player.height / 2);
      // normalization
      collidePoint = collidePoint / (player.height / 2);
      // calculate angle
      let angleRad = (collidePoint * Math.PI) / 4;
      // direction of the ball when hit
      let direction = ball.x < canvas.width / 2 ? 1 : -1;
      if (direction === 1) {
        ball.color = "blue";
      } else {
        ball.color = "red";
      }
      // change vel X and Y
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      ball.speed += 0.2;
    }

    // update score
    if (ball.x < -100) {
      // player 2 scores
      player2.score++;
      resetBall();
      // player 1 scores
    } else if (ball.x > canvas.width + 100) {
      player1.score++;
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
    if (player1.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText(
        "Player 1 Wins!",
        canvas.width / 3 + 20,
        canvas.height / 3,
        "blue"
      );
      return true;
    } else if (player2.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText(
        "Player 2 Wins!",
        canvas.width / 3 + 20,
        canvas.height / 3,
        "red"
      );
      return true;
    }
    return false;
  }
  globalThis.interval = setInterval(game, 1000 / fps);
}

function aivsai() {
  const fps = 60;

  // Canvas
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");

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
  const computer1 = new Component(0, canvas.height / 2 - 50, 10, 100, "blue");

  // Create computer object
  const computer2 = new Component(
    canvas.width - 10,
    canvas.height / 2 - 50,
    10,
    100,
    "red"
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

  // Render everything onto the canvas
  function render() {
    drawRectangle(field);
    drawRectangle(computer1);
    drawRectangle(computer2);
    drawNet();
    drawBall(ball);
    drawText(computer1.score, canvas.width / 4, canvas.height / 5, "blue");
    drawText(computer2.score, (3 * canvas.width) / 4, canvas.height / 5, "red");
  }

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
      b.right > p.left &&
      b.bottom > p.top &&
      b.left < p.right &&
      b.top < p.bottom
    );
  }
  // reset ball
  function resetBall() {
    ball.velocityX = 5;
    ball.velocityY = 5;
    ball.speed = 5;
    ball.color = "white";
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
    // computer AIs
    let difficultyLevel = 0.09;
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
      if (direction === 1) {
        ball.color = "blue";
      } else {
        ball.color = "red";
      }
      // change vel X and Y
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      ball.speed += 0.5;
    }

    // update score
    if (ball.x < -100) {
      // computer 1 scores
      computer2.score++;
      resetBall();
      // computer 2 scores
    } else if (ball.x > canvas.width + 100) {
      computer1.score++;
      resetBall();
    }
  }

  // game function
  function game() {
    render();
    updateField();
    if (checkGameOver()) {
      clearInterval(interval);
    }
  }
  function checkGameOver() {
    if (computer1.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText("Computer 1 Wins!", canvas.width / 4, canvas.height / 4, "blue");
      return true;
    } else if (computer2.score === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText("Computer 2 Wins!", canvas.width / 4, canvas.height / 4, "red");
      return true;
    }
    return false;
  }
  globalThis.interval = setInterval(game, 1000 / fps);
}
const aibtn = document.getElementById("aiBtn");
const mp = document.getElementById("multiBtn");
const sp = document.getElementById("singleBtn");
const mainMenu = document.getElementById("mainMenu");
const diffLvl = document.getElementById("diffBtns");

aibtn.addEventListener("click", () => {
  aivsai();
  sp.style.visibility = "hidden";
  diffLvl.style.visibility = "hidden";
  mp.style.visibility = "hidden";
  aibtn.style.visibility = "hidden";
});

mp.addEventListener("click", () => {
  multiplayer();
  aibtn.style.visibility = "hidden";
  mp.style.visibility = "hidden";
  sp.style.visibility = "hidden";
  diffLvl.style.visibility = "hidden";
});

sp.addEventListener("click", () => {
  singlePlayer();
  aibtn.style.visibility = "hidden";
  mp.style.visibility = "hidden";
  sp.style.visibility = "hidden";
  diffLvl.style.visibility = "hidden";
});

mainMenu.addEventListener("click", () => {
  clearInterval(interval);
  diffLvl.style.visibility = "visible";
  aibtn.style.visibility = "visible";
  mp.style.visibility = "visible";
  sp.style.visibility = "visible";
});
