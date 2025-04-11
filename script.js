let player1Hand = [];
let player2Hand = [];
let board = [];
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

const player1HandDiv = document.getElementById('player1-hand');
const player2HandDiv = document.getElementById('player2-hand');
const gameBoardDiv = document.getElementById('game-board');
const turnDisplay = document.getElementById('turn-display');
const scorePlayer1 = document.getElementById('score-player1');
const scorePlayer2 = document.getElementById('score-player2');
const resetButton = document.getElementById('reset-button');

// Predefinire le carte
const cards = [
    { id: 1, name: "Squall", values: [5, 4, 3, 2] },
    { id: 2, name: "Seifer", values: [3, 5, 1, 4] },
    { id: 3, name: "Rinoa", values: [4, 4, 4, 4] },
    { id: 4, name: "Quistis", values: [2, 3, 5, 3] },
    { id: 5, name: "Zell", values: [1, 2, 3, 5] },
    { id: 6, name: "Irvine", values: [3, 3, 2, 4] },
    { id: 7, name: "Selphie", values: [4, 1, 2, 4] },
    { id: 8, name: "Laguna", values: [5, 2, 3, 2] },
    { id: 9, name: "Kiros", values: [4, 2, 3, 3] }
];

// Inizializzare la partita
function startGame() {
    player1Hand = [...cards].slice(0, 5);
    player2Hand = [...cards].slice(5, 10);
    board = Array(9).fill(null);
    updateBoard();
    updateHands();
    updateTurnDisplay();
    player1Score = 0;
    player2Score = 0;
    updateScores();
}

function updateHands() {
    player1HandDiv.innerHTML = '';
    player2HandDiv.innerHTML = '';
    
    player1Hand.forEach(card => {
        const cardDiv = createCardElement(card, 1);
        player1HandDiv.appendChild(cardDiv);
    });

    player2Hand.forEach(card => {
        const cardDiv = createCardElement(card, 2);
        player2HandDiv.appendChild(cardDiv);
    });
}

function createCardElement(card, player) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.setAttribute('draggable', true);
    cardDiv.setAttribute('data-id', card.id);
    cardDiv.setAttribute('data-player', player);
    cardDiv.setAttribute('data-values', JSON.stringify(card.values));
    cardDiv.innerHTML = `${card.name}`;
    
    cardDiv.style.backgroundImage = `url('images/${card.name.toLowerCase()}.png')`;
    
    cardDiv.addEventListener('dragstart', dragStart);
    cardDiv.addEventListener('dragend', dragEnd);
    return cardDiv;
}

function updateBoard() {
    gameBoardDiv.innerHTML = '';
    board.forEach((card, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.setAttribute('data-index', index);
        if (card) {
            const cardDiv = createCardElement(card, card.player);
            cellDiv.appendChild(cardDiv);
        }
        gameBoardDiv.appendChild(cellDiv);
    });
}

function updateTurnDisplay() {
    turnDisplay.textContent = `It's Player ${currentPlayer}'s turn`;
}

function updateScores() {
    scorePlayer1.textContent = player1Score;
    scorePlayer2.textContent = player2Score;
}

function dragStart(e) {
    e.dataTransfer.setData('card-id', e.target.getAttribute('data-id'));
}

function dragEnd() {
    const cardId = event.target.getAttribute('data-id');
    // Logic for dropping the card on the board
}

resetButton.addEventListener('click', startGame);

startGame();
