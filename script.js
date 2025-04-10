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
    cardElement.setAttribute('data-card', JSON.stringify(card)); // Impostiamo i dati della carta
    
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
    // Passiamo i dati della carta come JSON durante il drag
    const cardData = event.target.dataset.card;
    event.dataTransfer.setData('text/plain', cardData); // Salviamo la carta come stringa JSON
}

// Quando termina il drag
function dragEnd(event) {
    // Eventuale logica dopo il drag
}

// Prevenire l'azione di default quando si trascina sopra la cella
function dragOver(event) {
    event.preventDefault();
}

// Quando la carta viene rilasciata sulla cella
function drop(event) {
    event.preventDefault();
    
    // Recuperiamo i dati della carta
    const cardData = event.dataTransfer.getData('text/plain');
    
    if (cardData) {  // Se ci sono dati validi
        const card = JSON.parse(cardData);  // Parso i dati JSON per ottenere la carta

        const cell = event.target;
        if (!cell.hasChildNodes()) { // Se la cella non è già occupata
            // Impostiamo la cella come occupata dalla carta
            cell.style.backgroundColor = "#444"; // Cambiamo colore della cella per segnalarla come occupata
            const cardElement = createCard(card);
            cell.appendChild(cardElement); // Aggiungiamo la carta alla cella

            moves++;
            currentPlayer = currentPlayer === 1 ? 2 : 1; // Alterniamo il turno tra i giocatori
            updateStatus();
        }
    } else {
        console.error("Nessun dato valido per la carta.");
    }
}

// Aggiorniamo lo stato del punteggio
function updateStatus() {
    score1.textContent = `Giocatore
