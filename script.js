// Inizializzazione delle variabili
let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];
let currentPlayer = 1;  // 1 per Player 1, 2 per Player 2
let placedCards = 0;
let player1Score = 0;
let player2Score = 0;

// Funzione per creare una carta (con i valori della carta)
function createCardElement(cardName, player) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.card = JSON.stringify({ name: cardName, player });
  card.style.backgroundImage = `url('img/${cardName}.png')`;
  card.setAttribute("draggable", true);

  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);

  return card;
}

// Funzione per gestire l'evento dragstart
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.dataset.card);
}

// Funzione per gestire l'evento dragend
function dragEnd(e) {
  e.target.classList.remove("dragging");
}

// Funzione per verificare la posizione valida sulla board
function isValidPosition(x, y) {
  return x >= 0 && x < 3 && y >= 0 && y < 3;
}

// Funzione per aggiungere una carta nella posizione
function placeCard(cardName, cell) {
  const x = Math.floor(cell / 3);
  const y = cell % 3;
  const card = createCardElement(cardName, currentPlayer);

  // Verifica Same e Plus
  checkSame(card, x, y);
  checkPlus(card, x, y);
  checkCombo(card, x, y); // Aggiungi il controllo Combo

  board[x][y] = card;
  placedCards++;

  // Aggiornamento punteggio
  updateScore();
  checkWinner();

  // Cambia il turno
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateActivePlayer();
}

// Funzione per verificare Same
function checkSame(card, x, y) {
  const directions = [
    { dx: 0, dy: -1 }, // sopra
    { dx: 1, dy: 0 },  // destra
    { dx: 0, dy: 1 },  // sotto
    { dx: -1, dy: 0 }   // sinistra
  ];

  directions.forEach(direction => {
    const nx = x + direction.dx;
    const ny = y + direction.dy;
    if (isValidPosition(nx, ny) && board[nx][ny] !== null) {
      const neighborCard = board[nx][ny];
      if (card[direction.dy === 0 ? (direction.dx === 1 ? 'right' : 'left') : (direction.dy === 1 ? 'bottom' : 'top')] === neighborCard[direction.dy === 0 ? (direction.dx === 1 ? 'left' : 'right') : (direction.dy === 1 ? 'top' : 'bottom')]) {
        board[nx][ny] = card;
        updateBoard();
      }
    }
  });
}

// Funzione per verificare Plus
function checkPlus(card, x, y) {
  const directions = [
    { dx: 0, dy: -1 }, // sopra
    { dx: 1, dy: 0 },  // destra
    { dx: 0, dy: 1 },  // sotto
    { dx: -1, dy: 0 }   // sinistra
  ];

  directions.forEach(direction => {
    const nx = x + direction.dx;
    const ny = y + direction.dy;
    if (isValidPosition(nx, ny) && board[nx][ny] !== null) {
      const neighborCard = board[nx][ny];
      const cardValue = card[direction.dy === 0 ? (direction.dx === 1 ? 'right' : 'left') : (direction.dy === 1 ? 'bottom' : 'top')];
      const neighborValue = neighborCard[direction.dy === 0 ? (direction.dx === 1 ? 'left' : 'right') : (direction.dy === 1 ? 'top' : 'bottom')];

      if (cardValue + neighborValue === 10) {
        board[nx][ny] = card;
        updateBoard();
      }
    }
  });
}

// Funzione per verificare Combo
function checkCombo(card, x, y) {
  const directions = [
    { dx: 0, dy: -1 }, // sopra
    { dx: 1, dy: 0 },  // destra
    { dx: 0, dy: 1 },  // sotto
    { dx: -1, dy: 0 }   // sinistra
  ];

  directions.forEach(direction => {
    const nx = x + direction.dx;
    const ny = y + direction.dy;
    if (isValidPosition(nx, ny) && board[nx][ny] !== null) {
      const neighborCard = board[nx][ny];

      // Verifica se la carta adiacente può essere acquisita tramite Same
      if (card[direction.dy === 0 ? (direction.dx === 1 ? 'right' : 'left') : (direction.dy === 1 ? 'bottom' : 'top')] === neighborCard[direction.dy === 0 ? (direction.dx === 1 ? 'left' : 'right') : (direction.dy === 1 ? 'top' : 'bottom')]) {
        board[nx][ny] = card;
        updateBoard();
        checkCombo(card, nx, ny); // Riprova a controllare se ci sono combo aggiuntive
      }

      // Verifica se la carta adiacente può essere acquisita tramite Plus
      const cardValue = card[direction.dy === 0 ? (direction.dx === 1 ? 'right' : 'left') : (direction.dy === 1 ? 'bottom' : 'top')];
      const neighborValue = neighborCard[direction.dy === 0 ? (direction.dx === 1 ? 'left' : 'right') : (direction.dy === 1 ? 'top' : 'bottom')];
      if (cardValue + neighborValue === 10) {
        board[nx][ny] = card;
        updateBoard();
        checkCombo(card, nx, ny); // Riprova a controllare se ci sono combo aggiuntive
      }
    }
  });
}

// Funzione per aggiornare il punteggio
function updateScore() {
  let player1Score = 0;
  let player2Score = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== null) {
        if (board[i][j].player === 1) player1Score++;
        else player2Score++;
      }
    }
  }

  document.getElementById("player1Score").textContent = `Player 1: ${player1Score}`;
  document.getElementById("player2Score").textContent = `Player 2: ${player2Score}`;
}

// Funzione per determinare se c'è un vincitore
function checkWinner() {
  if (placedCards === 9) {
    let player1Score = 0;
    let player2Score = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] !== null) {
          if (board[i][j].player === 1) player1Score++;
          else player2Score++;
        }
      }
    }

    if (player1Score > player2Score) {
      alert("Player 1 wins!");
    } else if (player2Score > player1Score) {
      alert("Player 2 wins!");
    } else {
      alert("It's a tie!");
    }
  }
}

// Funzione per aggiornare l'indicatore del giocatore attivo
function updateActivePlayer() {
  const playerIndicator = document.getElementById("playerIndicator");
  playerIndicator.textContent = `Player ${currentPlayer}'s turn`;
}
