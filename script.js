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
    { name: "Siren", image: "siren.png", stats: [3, 3, 4, 4] }
];

// Funzione per mescolare il mazzo di carte
function shuffleDeck(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

// Creazione delle carte
function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.setAttribute('draggable', true);
    cardElement.setAttribute('data-card', JSON.stringify(card));
    
    const img = document.createElement('img');
    img.src = `img/${card.image}`;
    img.alt = card.name;
    
    cardElement.appendChild(img);

    cardElement.addEventListener('dragstart', dragStart);
    cardElement.addEventListener('dragend', dragEnd);

    return cardElement;
}

// Quando inizia il drag
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.card);
}

// Quando termina il drag
function dragEnd(event) {
    // Qui possiamo mettere un controllo se la carta è stata effettivamente giocata, per esempio, rimuovendo la carta dalla mano
}

// Prevenire l'azione di default quando si trascina sopra la cella
function dragOver(event) {
    event.preventDefault();
}

// Quando la carta viene rilasciata sulla cella
function drop(event) {
    event.preventDefault();
    const cardData = JSON.parse(event.dataTransfer.getData('text/plain'));
    const cell = event.target;

    // Impostiamo la cella come occupata dalla carta
    cell.style.backgroundColor = "#444"; // Cambiamo colore della cella per segnalarla come occupata
    cell.appendChild(createCard(cardData));

    moves++;
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Alterniamo il turno tra i giocatori
    updateStatus();
}

// Aggiorniamo lo stato del punteggio
function updateStatus() {
    score1.textContent = `Giocatore 1: ${player1Score}`;
    score2.textContent = `Giocatore 2: ${player2Score}`;
}

// Inizializzazione del gioco
function init() {
    board.innerHTML = '';
    hand1.innerHTML = '';
    hand2.innerHTML = '';
    moves = 0;
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    score1.textContent = 0;
    score2.textContent = 0;

    // Creiamo il tabellone
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', drop);
        board.appendChild(cell);
    }

    const shuffledDeck = shuffleDeck(cards);
    const player1Hand = shuffledDeck.slice(0, 5);
    const player2Hand = shuffledDeck.slice(5, 10);

    // Creiamo le carte per il Giocatore 1
    player1Hand.forEach(card => hand1.appendChild(createCard(card)));
    // Creiamo le carte per il Giocatore 2
    player2Hand.forEach(card => hand2.appendChild(createCard(card)));

    updateStatus();
}

// Ricominciare la partita
resetButton.addEventListener('click', init);

// Avvia il gioco all'inizio
init();
