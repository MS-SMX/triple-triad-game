const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 1;
let moves = 0;
let player1Score = 0;
let player2Score = 0;

const cards = [
    { name: "Ifrit", image: "ifrit.png", stats: [2, 4, 3, 1] },
    { name: "Shiva", image: "shiva.png", stats: [3, 1, 2, 4] },
    { name: "Quezacotl", image: "quezacotl.png", stats: [4, 2, 3, 1] },
    { name: "Bahamut", image: "bahamut.png", stats: [5, 1, 4, 3] },
    { name: "Titan", image: "titan.png", stats: [2, 5, 4, 3] },
    { name: "Leviathan", image: "leviathan.png", stats: [3, 4, 2, 5] },
    { name: "Diablos", image: "diablos.png", stats: [4, 3, 5, 2] },
    { name: "Siren", image: "siren.png", stats: [3, 3, 4, 4] },
    { name: "Cactuar", image: "cactuar.png", stats: [1, 5, 1, 5] },
    { name: "Tonberry", image: "tonberry.png", stats: [3, 2, 4, 4] }
];

function shuffleDeck(deck) {
    return [...deck].sort(() => Math.random() - 0.5);
}

function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.setAttribute('draggable', true);

    const cardJson = JSON.stringify(card);
    cardElement.setAttribute('data-card', cardJson);

    const img = document.createElement('img');
    img.src = `img/${card.image}`;
    img.alt = card.name;

    cardElement.appendChild(img);
    cardElement.addEventListener('dragstart', dragStart);

    return cardElement;
}

function dragStart(event) {
    const cardData = event.target.getAttribute('data-card');
    if (cardData) {
        event.dataTransfer.setData('application/json', cardData);
    } else {
        console.warn("Carta trascinata senza data-card valido.");
    }
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const cardData = event.dataTransfer.getData('application/json');

    if (!cardData) {
        console.error("Nessun dato valido ricevuto nel drop.");
        return;
    }

    try {
        const card = JSON.parse(cardData);
        const cell = event.target.closest('.cell');

        if (!cell || cell.hasChildNodes()) return;

        const cardElement = createCard(card);
        cardElement.setAttribute('draggable', false);
        cardElement.classList.add(`player${currentPlayer}`);
        cell.appendChild(cardElement);
        cell.classList.add(`occupied`, `player${currentPlayer}`);

        // Rimuovi la carta dalla mano
        const allCards = document.querySelectorAll(`.hand .card`);
        allCards.forEach(c => {
            if (c.getAttribute('data-card') === JSON.stringify(card)) {
                c.remove();
            }
        });

        moves++;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();

        if (moves >= 9) checkGameEnd();
    } catch (e) {
        console.error("Errore nel parsing JSON:", e);
    }
}

function updateStatus() {
    score1.textContent = `Giocatore 1: ${player1Score}`;
    score2.textContent = `Giocatore 2: ${player2Score}`;
}

function checkGameEnd() {
    let player1Count = document.querySelectorAll('.player1').length;
    let player2Count = document.querySelectorAll('.player2').length;

    let result = '';
    if (player1Count > player2Count) {
        result = 'Giocatore 1 vince!';
        player1Score++;
    } else if (player2Count > player1Count) {
        result = 'Giocatore 2 vince!';
        player2Score++;
    } else {
        result = 'Pareggio!';
    }

    updateStatus();
    setTimeout(() => alert(`Partita terminata!\n${result}`), 100);
}

function init() {
    board.innerHTML = '';
    hand1.innerHTML = '';
    hand2.innerHTML = '';
    moves = 0;
    currentPlayer = 1;

    const deck = shuffleDeck(cards);
    const player1Hand = deck.slice(0, 5);
    const player2Hand = deck.slice(5, 10);

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', drop);
        board.appendChild(cell);
    }

    player1Hand.forEach(card => {
        hand1.appendChild(createCard(card));
    });

    player2Hand.forEach(card => {
        hand2.appendChild(createCard(card));
    });

    updateStatus();
}

resetButton.addEventListener('click', init);

init();
