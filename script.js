let currentPlayer = 1;  // Iniziamo con il giocatore 1
let player1Cards = [];
let player2Cards = [];
let placedCards = 0;
let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Eseguiamo l'inizializzazione del gioco
function initializeGame() {
  setupHands();
  updateActivePlayer();
  setupEventListeners();
}

// Crea le mani per entrambi i giocatori
function setupHands() {
  // Esempio di carte per i giocatori
  player1Cards = ["seifer", "squall", "rinoa", "quistis", "zell"];
  player2Cards = ["selphie", "irvine", "kiros", "ward", "laguna"];
  shuffleCards(player1Cards);
  shuffleCards(player2Cards);

  renderHands();
}

// Mischia le carte
function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

// Rendi visibili le mani dei giocatori
function renderHands() {
  const player1Hand = document.getElementById("player1Hand");
  const player2Hand = document.getElementById("player2Hand");
  player1Hand.innerHTML = '';
  player2Hand.innerHTML = '';

  player1Cards.forEach(cardName => {
    const card = createCardElement(cardName, 1);
    player1Hand.appendChild(card);
  });

  player2Cards.forEach(cardName => {
    const card = createCardElement(cardName, 2);
    player2Hand.appendChild(card);
  });
}

// Crea una carta HTML
function createCardElement(cardName, player) {
  const card = document.createElement("div");
  card.classList.add("card", `player${player}`);
  card.setAttribute("data-card", cardName);

  const img = document.createElement("img");
  img.src = `images/${cardName}.png`;
  card.appendChild(img);

  card.draggable = true;
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);

  return card;
}

// Imposta l'ascolto degli eventi di drag
function setupEventListeners() {
  const cells = document.querySelectorAll("#gameBoard .cell");
  cells.forEach(cell => {
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("drop", dropCard);
  });
}

// Gestisce il drag delle carte
function dragStart(event) {
  event.dataTransfer.setData("card", event.target.dataset.card);
}

function dragEnd(event) {
  event.target.classList.remove("flip");
}

// Gestisce il drop della carta
function dragOver(event) {
  event.preventDefault();
}

function dropCard(event) {
  event.preventDefault();

  const cardName = event.dataTransfer.getData("card");
  const cell = event.target;

  if (!cell.classList.contains("cell") || cell.classList.contains("occupied")) return;

  cell.classList.add("occupied");
  placeCard(cardName, cell);
}

// Posiziona la carta sulla cella
function placeCard(cardName, cell) {
  const card = createCardElement(cardName, currentPlayer);
  card.classList.add("flip");
  cell.appendChild(card);

  // Aggiorna il punteggio
  updateScore();
  checkWinner();

  placedCards++;
  if (placedCards >= 9) {
    alert("Partita finita!");
  }

  // Cambia turno
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateActivePlayer();
}

// Cambia il giocatore attivo
function updateActivePlayer() {
  const player1Hand = document.getElementById("player1Hand");
  const player2Hand = document.getElementById("player2Hand");
  
  if (currentPlayer === 1) {
    player1Hand.classList.add("active");
    player2Hand.classList.remove("active");
  } else {
    player2Hand.classList.add("active");
    player1Hand.classList.remove("active");
  }
}

// Aggiorna il punteggio (metodo semplificato per il momento)
function updateScore() {
  const player1Score = document.getElementById("player1Score");
  const player2Score = document.getElementById("player2Score");

  // Punteggio fittizio basato sul numero di carte piazzate
  player1Score.innerText = `Player 1 Score: ${Math.floor(Math.random() * 5)}`;
  player2Score.innerText = `Player 2 Score: ${Math.floor(Math.random() * 5)}`;
}

// Verifica se c'è un vincitore
function checkWinner() {
  if (placedCards === 9) {
    alert("La partita è finita!");
    // Qui dovresti aggiungere la logica per determinare il vincitore
  }
}

// Inizializza il gioco
initializeGame();
