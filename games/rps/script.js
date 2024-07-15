document.addEventListener('DOMContentLoaded', () => {
    const choiceButtons = document.querySelectorAll('.choice-btn');
    const playerSlot = document.getElementById('player-slot').querySelector('.choice-display');
    const aiSlot = document.getElementById('ai-slot').querySelector('.choice-display');
    const resultMsg = document.getElementById('result');
    const playerScoreEl = document.getElementById('player-score');
    const aiScoreEl = document.getElementById('ai-score');

    let playerScore = 0;
    let aiScore = 0;

    const choices = ['rock', 'paper', 'scissors'];
    const icons = {
        rock: 'mountain',
        paper: 'file-text',
        scissors: 'scissors',
        'help-circle': 'help-circle'
    };

    const getAiChoice = () => {
        return choices[Math.floor(Math.random() * choices.length)];
    };

    const getWinner = (player, ai) => {
        if (player === ai) return 'draw';
        if (
            (player === 'rock' && ai === 'scissors') ||
            (player === 'paper' && ai === 'rock') ||
            (player === 'scissors' && ai === 'paper')
        ) {
            return 'player';
        }
        return 'ai';
    };

    const updateUI = (playerChoice, aiChoice, winner) => {
        // Update slots
        playerSlot.innerHTML = `<i data-lucide="${icons[playerChoice]}"></i>`;
        aiSlot.innerHTML = `<i data-lucide="${icons[aiChoice]}"></i>`;
        lucide.createIcons();

        // Remove previous glows
        playerSlot.classList.remove('winner-glow');
        aiSlot.classList.remove('winner-glow');

        // Update message and scores
        resultMsg.classList.remove('win-color', 'lose-color', 'draw-color');

        if (winner === 'player') {
            playerScore++;
            playerScoreEl.textContent = playerScore;
            resultMsg.textContent = "YOU WIN!";
            resultMsg.classList.add('win-color');
            playerSlot.classList.add('winner-glow');
        } else if (winner === 'ai') {
            aiScore++;
            aiScoreEl.textContent = aiScore;
            resultMsg.textContent = "MACHINE WINS!";
            resultMsg.classList.add('lose-color');
            aiSlot.classList.add('winner-glow');
        } else {
            resultMsg.textContent = "IT'S A DRAW!";
            resultMsg.classList.add('draw-color');
        }
    };

    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const playerChoice = btn.dataset.choice;
            const aiChoice = getAiChoice();
            const winner = getWinner(playerChoice, aiChoice);
            updateUI(playerChoice, aiChoice, winner);
        });
    });
});
