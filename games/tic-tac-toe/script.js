document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const scoreXText = document.getElementById('score-x');
    const scoreOText = document.getElementById('score-o');

    let currentPlayer = 'X'; // Human is X
    let aiPlayer = 'O';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer !== 'X') {
            return;
        }

        makeMove(clickedCellIndex, 'X');
        
        if (gameActive) {
            statusText.innerText = "AI is thinking...";
            setTimeout(() => {
                const aiMoveIndex = getBestMove(gameState);
                makeMove(aiMoveIndex, 'O');
            }, 500);
        }
    };

    const makeMove = (index, player) => {
        gameState[index] = player;
        const cell = cells[index];
        cell.innerText = player;
        cell.classList.add(player.toLowerCase());
        
        if (checkWin(gameState, player)) {
            endGame(player);
        } else if (!gameState.includes("")) {
            endGame('draw');
        } else {
            currentPlayer = player === 'X' ? 'O' : 'X';
            updateStatus();
        }
    };

    const updateStatus = () => {
        statusText.innerText = currentPlayer === 'X' ? "Your Turn" : "AI's Turn";
        statusText.style.color = currentPlayer === 'X' ? "var(--neon-cyan)" : "var(--neon-pink)";
    };

    const checkWin = (board, player) => {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    };

    const endGame = (result) => {
        gameActive = false;
        if (result === 'draw') {
            statusText.innerText = "It's a Draw!";
            statusText.style.color = "var(--neon-yellow)";
        } else {
            statusText.innerText = result === 'X' ? "You Win!" : "AI Wins!";
            statusText.style.color = result === 'X' ? "var(--neon-green)" : "var(--neon-pink)";
            scores[result]++;
            scoreXText.innerText = scores.X;
            scoreOText.innerText = scores.O;
            
            // Find winning pattern to highlight
            const pattern = winConditions.find(condition => condition.every(index => gameState[index] === result));
            pattern.forEach(i => cells[i].classList.add('winning'));
        }
    };

    // --- Minimax AI Logic ---

    const getBestMove = (board) => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = aiPlayer;
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const scoresMap = {
        O: 10,
        X: -10,
        draw: 0
    };

    const minimax = (board, depth, isMaximizing) => {
        if (checkWin(board, aiPlayer)) return scoresMap.O - depth;
        if (checkWin(board, 'X')) return scoresMap.X + depth;
        if (!board.includes("")) return scoresMap.draw;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = aiPlayer;
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const restartGame = () => {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.innerText = "Your Turn";
        statusText.style.color = "var(--neon-cyan)";
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x', 'o', 'winning');
        });
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', restartGame);
});
