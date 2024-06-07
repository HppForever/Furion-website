const MiniGame_button = document.createElement('div');

MiniGame_button.className = 'MiniGame_Button';
MiniGame_button.style.cssText = 'position: fixed; bottom: 0.625em; right: 0.625em;';
MiniGame_button.innerHTML = `
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#GameModal">🎮 Мини-игра</button>
`;

const MiniGame_modal = document.createElement('div');
MiniGame_modal.className = 'modal fade dark-bg';
MiniGame_modal.id = 'GameModal';
MiniGame_modal.tabIndex = -1;
MiniGame_modal.setAttribute('aria-labelledby', 'MiniGame_ID');
MiniGame_modal.setAttribute('aria-hidden', 'true');
MiniGame_modal.innerHTML = `
<div class="modal-dialog">
<div class="modal-content bg-dark">
    <div class="modal-header">
        <h5 class="modal-title" id="MiniGame_ID">🎮 Мини-игра</h5>
        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Закрыть"></button>
    </div>
    <div>
        <button id="PlayButton" class="btn btn-primary" onclick="play()">Играть</button>
        <p style="text-align: center;">Управление: <-, -> или A, D</p>
        <Canvas id="Canvas" width="350" height="200"></Canvas><br><br>
    </div>
</div>
</div>
`;

document.body.appendChild(MiniGame_button);
document.body.appendChild(MiniGame_modal);

'use strict';

const PlayButton = document.querySelector("#PlayButton");

// Set up the Canvas variables
const Canvas = document.getElementById("Canvas");
const ctx = Canvas.getContext("2d");
const CanvasWidth = Canvas.width;
const CanvasHeight = Canvas.height;

// Build the paddle + variables
const paddle_width= 50;
const paddle_height = 10;
let paddleX;
let leftPressed = false;
let rightPressed = false;
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;

// Particle variables
const particles = [];
const numParticles = 50;

// Build the ball + variables
const ball_size = 10;
let x;
let y;
let dx;
let dy;

let score;
let level;

function drawBall() {
    ctx.beginPath();
    ctx.rect(x, y, ball_size, ball_size);
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() 
{
    ctx.beginPath();
    ctx.rect(paddleX, CanvasHeight - 20, paddle_width, paddle_height);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(`Счет: ${score}`, 8, 20)
}

function drawLevel() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(`Уровень: ${level}`, 8, 40);
}

function drawGameOver () {
    ctx.font = "24px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText("ИГРА ОКОНЧЕНА", (CanvasWidth - 100)/2, CanvasHeight/2, 100);
}

// Keep track of which key is pressed
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = true;
        leftPressed = false;
    }

    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        rightPressed = false;
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = false;
    }

    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        leftPressed = false;
    }
}

function touchHandler(e) {
    console.log("touch");
    if (e.touches) {
        const relativeX = e.touches[0].pageX - Canvas.offsetLeft;
        if (relativeX > 0 && relativeX < Canvas.width) {
            paddleX = relativeX - paddle_width/2;
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);

// Initialize particles
for (let i = 0; i < numParticles; i++) {
    particles.push({
        x: Math.random() * CanvasWidth,
        y: Math.random() * CanvasHeight,
        speed: Math.random() + 1
    });
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();

        particle.y += particle.speed;

        // Reset particle position if it goes off screen
        if (particle.y > CanvasHeight) {
            particle.y = 0;
            particle.x = Math.random() * CanvasWidth;
        }
    });
}


// clear Canvas
// update position of ball and paddle
function draw() {
    ctx.clearRect(0,0,CanvasWidth, CanvasHeight);
    drawParticles();
    drawBall();
    drawPaddle();
    drawScore();
    drawLevel();

    // If ball is at right or left edge reverse x direciton
    if (x+dx < 0 || x+dx > CanvasWidth - ball_size) {
        dx = -dx;
    }

    // If ball is at top edge reverse y direction
    if (y+dy < 0) {
        dy = -dy;
    }
    
    // If ball hits paddle reverse y direction
    // If ball hits bottom edge end
    else if (y+dy > CanvasHeight-3*ball_size ) {
        if (x > paddleX-ball_size && x < paddleX + paddle_width + ball_size) {
            dy = -dy;
            score++;
            if (score%5 === 0) {
                level += 1;
                dy += 0.5*Math.sign(dy);
                dx += 0.5*Math.sign(dx);
            }
        }

        else {
            drawGameOver();
            PlayButton.disabled = false;
            return;
        }
    }

    // Update paddle position
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, CanvasWidth - paddle_width);
    }
    if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
    
    // Update ball position
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function play() 
{
    PlayButton.innerText = "Рестарт";
    PlayButton.disabled = true;
    x = Math.random()*CanvasWidth;
    y = Math.random()*CanvasHeight/3;
    dx = 3;
    dy = 3;
    paddleX = (CanvasWidth - paddle_width) / 2;
    score = 0;
    level = 1;

    draw();
}