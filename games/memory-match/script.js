document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const resetBtn = document.getElementById('reset-btn');
    const winOverlay = document.getElementById('win-overlay');
    const finalStats = document.getElementById('final-stats');
    const playAgainBtn = document.getElementById('play-again');

    const icons = [
        'heart', 'zap', 'star', 'moon', 'sun', 
        'cloud', 'ghost', 'umbrella', 'gem', 'flame'
    ];
    
    let cards = [];
    let flippedCards = [];
    let matchedCount = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval = null;
    let isLocked = false;

    const initGame = () => {
        // Create pairs and shuffle
        const gameIcons = [...icons, ...icons];
        gameIcons.sort(() => Math.random() - 0.5);

        grid.innerHTML = '';
        cards = [];
        
        gameIcons.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-front"><i data-lucide="help-circle"></i></div>
                <div class="card-back"><i data-lucide="${icon}"></i></div>
            `;
            
            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
            cards.push(card);
        });

        lucide.createIcons();
        resetStats();
    };

    const flipCard = (card) => {
        if (isLocked || card === flippedCards[0] || card.classList.contains('matched')) return;

        startTimer();
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesElement.innerText = moves;
            checkMatch();
        }
    };

    const checkMatch = () => {
        isLocked = true;
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.icon === card2.dataset.icon;

        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCount += 2;
            flippedCards = [];
            isLocked = false;
            
            if (matchedCount === cards.length) {
                winGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                isLocked = false;
            }, 1000);
        }
    };

    const startTimer = () => {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timer++;
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            timerElement.innerText = `${minutes}:${seconds}`;
        }, 1000);
    };

    const winGame = () => {
        clearInterval(timerInterval);
        setTimeout(() => {
            winOverlay.classList.remove('hidden');
            finalStats.innerText = `Moves: ${moves} | Time: ${timerElement.innerText}`;
        }, 600);
    };

    const resetStats = () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timer = 0;
        moves = 0;
        matchedCount = 0;
        flippedCards = [];
        isLocked = false;
        movesElement.innerText = '0';
        timerElement.innerText = '00:00';
        winOverlay.classList.add('hidden');
    };

    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    initGame();
});
