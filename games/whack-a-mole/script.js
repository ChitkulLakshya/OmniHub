document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const moles = document.querySelectorAll('.mole');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const gameOverOverlay = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    let lastHole;
    let timeUp = false;
    let score = 0;
    let countdown;
    let timeLeft = 30;

    const randomTime = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    };

    const randomHole = (holes) => {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) return randomHole(holes);
        lastHole = hole;
        return hole;
    };

    const peep = () => {
        const time = randomTime(500, 1000);
        const hole = randomHole(holes);
        const mole = hole.querySelector('.mole');
        mole.classList.add('up');
        
        setTimeout(() => {
            mole.classList.remove('up');
            if (!timeUp) peep();
        }, time);
    };

    const startGame = () => {
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = 0;
        timerElement.textContent = '30s';
        timeUp = false;
        gameOverOverlay.classList.add('hidden');
        
        peep();
        startTimer();
        
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
    };

    const startTimer = () => {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timeUp = true;
                endGame();
            }
        }, 1000);
    };

    const endGame = () => {
        gameOverOverlay.classList.remove('hidden');
        finalScoreElement.textContent = `Score: ${score}`;
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
    };

    const whack = (e) => {
        if (!e.isTrusted) return; // Cheater detection
        score++;
        e.target.classList.remove('up');
        scoreElement.textContent = score;
    };

    moles.forEach(mole => mole.addEventListener('click', whack));
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});
