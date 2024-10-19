// Обновляем создание кнопки мини-игры, добавляя контейнер и крестик
const MiniGame_button = document.createElement('div');
MiniGame_button.className = 'MiniGame_Button';
MiniGame_button.style.cssText = 'position: fixed; bottom: 0.625em; right: 0.625em; z-index: 1400;';
MiniGame_button.innerHTML = `
    <div class="game-button-container">
        <button type="button" class="close-game-button" aria-label="Закрыть">×</button>
        <button type="button" class="game-button" data-bs-toggle="modal" data-bs-target="#GameModal">
            <span class="game-icon">🎮</span>
            <span class="button-text">Mini-game</span>
        </button>
    </div>
`;

// Добавляем обработчик для крестика
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.close-game-button');
    const gameButtonContainer = document.querySelector('.game-button-container');

    closeButton.addEventListener('click', () => {
        gameButtonContainer.style.opacity = '0';
        setTimeout(() => {
            MiniGame_button.remove();
        }, 300);
    });
});

// Создаем модальное окно
const MiniGame_modal = document.createElement('div');
MiniGame_modal.className = 'modal fade';
MiniGame_modal.id = 'GameModal';
MiniGame_modal.tabIndex = -1;
MiniGame_modal.setAttribute('aria-labelledby', 'MiniGame_ID');
MiniGame_modal.setAttribute('aria-hidden', 'true');
MiniGame_modal.innerHTML = `
    <div class="modal-dialog modal-lg">
        <div class="modal-content game-modal">
            <div class="modal-header">
                <h5 class="modal-title" id="MiniGame_ID">
                    <span class="game-icon">🎮</span> Space Ping Pong
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div class="game-container">
                    <div class="game-stats">
                        <div class="stat-item">
                            <span class="stat-label">Level:</span>
                            <span id="currentLevel">1</span>
                        </div>
                    </div>
                    <canvas id="gameCanvas" width="700" height="300"></canvas>
                    <div class="controls-info">
                        <p>Controls: ← → or A D or mouse</p>
                    </div>
                    <button id="PlayButton" class="play-button">
                        <span class="button-text">Play</span>
                        <span class="button-icon">▶️</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

document.body.appendChild(MiniGame_button);
document.body.appendChild(MiniGame_modal);

// Основной игровой код

'use strict';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Настройки игры
        this.paddle = {
            width: 100,
            height: 15,
            x: this.width / 2 - 50,
            speed: 8,
            color: '#00ff88'
        };
        
        this.ball = {
            size: 12,
            x: this.width / 2,
            y: this.height / 2,
            initialSpeed: 5,
            speed: 5,
            dx: 5,
            dy: -5,
            color: '#ff3366'
        };
        
        this.particles = [];
        this.stars = this.createStars(100);
        this.score = 0;
        this.level = 1;
        this.highScore = localStorage.getItem('highScore') || 0;
        
        this.gameLoop = null;
        this.isGameOver = false;
        
        // Управление
        this.keys = {
            left: false,
            right: false
        };
        
        this.setupEventListeners();
    }
    
    createStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
        return stars;
    }
    
    createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 3,
                color: color,
                alpha: 1
            });
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            this.paddle.x = Math.max(0, Math.min(x - this.paddle.width / 2, this.width - this.paddle.width));
        });
    }
    
    update() {
        // Обновление звезд
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    
        // Обновление частиц
        this.particles = this.particles.filter(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.alpha -= 0.02;
            return particle.alpha > 0;
        });
    
        // Обновление платформы
        if (this.keys.left) this.paddle.x = Math.max(0, this.paddle.x - this.paddle.speed);
        if (this.keys.right) this.paddle.x = Math.min(this.width - this.paddle.width, this.paddle.x + this.paddle.speed);
        
        // Обновление мяча
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
    
        // Столкновение со стенами
        if (this.ball.x + this.ball.size > this.width || this.ball.x - this.ball.size < 0) {
            this.ball.dx = -this.ball.dx;
            this.createParticles(this.ball.x, this.ball.y, 10, '#ffffff');
        }
    
        if (this.ball.y - this.ball.size < 0) {
            this.ball.dy = -this.ball.dy;
            this.createParticles(this.ball.x, this.ball.y, 10, '#ffffff');
        }
    
        // Новая логика столкновения с платформой
        if (this.ball.y + this.ball.size > this.height - this.paddle.height) {
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
                // Проверяем, не отскочил ли мяч от платформы на предыдущем обновлении
                if (this.ball.dy > 0) { // Только если мяч идет вниз
                    this.ball.dy = -this.ball.dy;
                    this.score++;
        
                    // Увеличение уровня
                    if (this.score % 5 === 0) {
                        this.level++;
                        this.ball.speed *= 1.1;
                        this.ball.dx = this.ball.dx > 0 ? this.ball.speed : -this.ball.speed;
                        this.ball.dy = this.ball.dy > 0 ? this.ball.speed : -this.ball.speed;
                        this.createParticles(this.ball.x, this.ball.y, 20, '#00ff88');
                        document.getElementById('currentLevel').textContent = this.level;
                    }
    
                    this.createParticles(this.ball.x, this.ball.y, 15, '#ff3366');
                }
            } else if (this.ball.y > this.height) {
                this.gameOver();
            }
        }
    }
    
    draw() {
        // Очистка канваса
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Отрисовка звезд
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 2})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Отрисовка частиц
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Отрисовка платформы
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.fillRect(this.paddle.x, this.height - this.paddle.height, this.paddle.width, this.paddle.height);
        
        // Отрисовка мяча
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Отрисовка счета
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px "Press Start 2P", cursive';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        
        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.font = '48px "Press Start 2P", cursive';
            this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
            
            this.ctx.font = '24px "Press Start 2P", cursive';
            this.ctx.fillText(`Final score: ${this.score}`, this.width / 2, this.height / 2 + 50);
        }
    }

    gameOver() {
        this.isGameOver = true;
        cancelAnimationFrame(this.gameLoop);
        
        document.getElementById('PlayButton').disabled = false;
    }
    
    start() {
        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.particles = [];
        
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.speed = this.ball.initialSpeed;
        this.ball.dx = this.ball.speed;
        this.ball.dy = -this.ball.speed;
        
        this.paddle.x = this.width / 2 - this.paddle.width / 2;
        
        document.getElementById('PlayButton').disabled = true;
        document.getElementById('currentLevel').textContent = this.level;
        
        const animate = () => {
            this.update();
            this.draw();
            if (!this.isGameOver) {
                this.gameLoop = requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// Инициализация игры
const game = new Game();
document.getElementById('PlayButton').addEventListener('click', () => game.start());