document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const finalScoreElement = document.getElementById('final-score');
    const startBtn = document.getElementById('start-btn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snake-high-score') || 0;
    let gameLoop = null;
    let isPaused = true;
    let speed = 100;

    highScoreElement.innerText = highScore;

    const drawGame = () => {
        update();
        if (checkGameOver()) {
            endGame();
            return;
        }
        clearCanvas();
        drawFood();
        drawSnake();
    };

    const update = () => {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.innerText = score;
            spawnFood();
            increaseSpeed();
        } else {
            snake.pop();
        }
    };

    const clearCanvas = () => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Subtle grid lines
        ctx.strokeStyle = '#111';
        for(let i = 0; i < canvas.width; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
    };

    const drawSnake = () => {
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#39ff14' : 'rgba(57, 255, 20, 0.4)';
            
            // Draw segment with rounded corners
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            const size = gridSize - 2;
            
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size, size, 4);
            ctx.fill();

            if (isHead) {
                // Add glow to head
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#39ff14';
                ctx.fillRect(x + 1, y + 1, size, size);
                ctx.shadowBlur = 0;
            }
        });
    };

    const drawFood = () => {
        ctx.fillStyle = '#ff00e5';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff00e5';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 3,
            0, Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const spawnFood = () => {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Don't spawn food on snake body
        if (snake.some(s => s.x === food.x && s.y === food.y)) {
            spawnFood();
        }
    };

    const checkGameOver = () => {
        const head = snake[0];
        if (dx === 0 && dy === 0) return false;

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) return true;
        }

        return false;
    };

    const increaseSpeed = () => {
        if (speed > 50) {
            clearInterval(gameLoop);
            speed -= 1;
            gameLoop = setInterval(drawGame, speed);
        }
    };

    const endGame = () => {
        clearInterval(gameLoop);
        isPaused = true;
        overlay.classList.remove('hidden');
        overlayTitle.innerText = "GAME OVER";
        finalScoreElement.innerText = `Final Score: ${score}`;
        startBtn.innerText = "Try Again";

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snake-high-score', highScore);
            highScoreElement.innerText = highScore;
        }
    };

    const startGame = () => {
        snake = [{ x: 10, y: 10 }];
        food = { x: 5, y: 5 };
        dx = 0; dy = 0;
        score = 0;
        speed = 100;
        scoreElement.innerText = '0';
        overlay.classList.add('hidden');
        isPaused = false;
        
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, speed);
    };

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if ((key === 'arrowup' || key === 'w') && dy === 0) { dx = 0; dy = -1; }
        if ((key === 'arrowdown' || key === 's') && dy === 0) { dx = 0; dy = 1; }
        if ((key === 'arrowleft' || key === 'a') && dx === 0) { dx = -1; dy = 0; }
        if ((key === 'arrowright' || key === 'd') && dx === 0) { dx = 1; dy = 0; }
    });

    startBtn.addEventListener('click', startGame);

    // Initialize display
    clearCanvas();
    drawFood();
    drawSnake();
});
