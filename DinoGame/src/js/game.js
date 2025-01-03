const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('theme-toggle');

canvas.width = 800;
canvas.height = 400;

let player = new Player(50, canvas.height - 50, 30, 30, 'green');
let obstacles = [];
let gameRunning = true;
let score = 0;
let isDarkMode = false;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
});

function spawnObstacle() {
    const height = randomInt(20, 50);
    obstacles.push(new Obstacle(canvas.width, canvas.height - height, 20, height, 5, isDarkMode ? 'lightgray' : 'red'));
}

function detectCollision(player, obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}

function update() {
    if (!gameRunning) return;

    player.update();

    // Update obstacles
    obstacles.forEach(obstacle => obstacle.update());
    obstacles = obstacles.filter(obstacle => !obstacle.isOffScreen());

    // Collision detection
    for (let obstacle of obstacles) {
        if (detectCollision(player, obstacle)) {
            gameRunning = false;
        }
    }

    // Spawn new obstacles
    if (Math.random() < 0.02) {
        spawnObstacle();
    }

    // Update score
    score++;
}

function draw() {
    // Clear canvas with theme-aware background
    ctx.fillStyle = isDarkMode ? '#121212' : '#f4f4f4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.draw(ctx);

    obstacles.forEach(obstacle => obstacle.draw(ctx));

    // Draw score
    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (!gameRunning) {
        ctx.fillStyle = isDarkMode ? 'red' : 'darkred';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space') player.jump();
});

// Start game loop
gameLoop();
