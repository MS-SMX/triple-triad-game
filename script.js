const board = document.getElementById("board");
const player1Hand = document.getElementById("player1-hand");
const player2Hand = document.getElementById("player2-hand");
const status = document.getElementById("game-status");
const p1ScoreEl = document.getElementById("player1-score");
const p2ScoreEl = document.getElementById("player2-score");

let currentPlayer = 1;
let boardState = Array(9).fill(null);
let scores = { 1: 0, 2: 0 };

const cards = [
  { id: "seifer", player: 1, values: [4, 2, 5, 3], img: "img/seifer.png" },
  { id: "zell", player: 1, values: [3, 3, 2, 5], img: "img/zell.png" },
  { id: "irvine", player: 1, values: [2, 5, 3, 4], img: "img/irvine.png" },
  { id: "selphie", player: 1, values: [5, 2, 3, 1], img: "img/selphie.png" },
  { id: "squall", player: 1, values: [5, 5, 5, 5], img: "img/squall.png" },
  { id: "quistis", player: 2, values: [4, 4, 2, 5], img: "img/quistis.png" },
  { id: "laguna", player: 2, values: [3, 5, 4, 2], img: "img/laguna.png" },
  { id: "edea", player: 2, values: [5, 3, 1, 4], img: "img/edea.png" },
  { id: "raijin", player: 2, values: [2, 4, 3, 5], img: "img/raijin.png" },
  { id: "fujin", player: 2, values: [5, 2, 4, 1], img: "img/fujin.png" }
];

function renderHands() {
  [player1Hand, player2Hand].forEach(hand => hand.innerHTML = "");
  cards.forEach(card => {
    if (card) {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.draggable = true;
      cardEl.dataset.id = card.id;
      cardEl.innerHTML = `<img src="${card.img}" alt="${card.id}" />`;
      cardEl.addEventListener("dragstart", dragStart);
      (card.player === 1 ? player1Hand : player2Hand).appendChild(cardEl);
    }
  });
}

function dragStart(e) {
  const cardId = e.target.dataset.id;
  if (cardId) {
    e.dataTransfer.setData("text/plain", cardId);
  }
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const cardId = e.dataTransfer.getData("text/plain");
  const card = cards.find(c => c.id === cardId);
  const index = parseInt(e.target.dataset.position);
  if (!card || boardState[index] !== null || card.player !== currentPlayer) return;

  const cardEl = document.querySelector(`[data-id="${cardId}"]`);
  if (cardEl) cardEl.remove();

  e.target.innerHTML = `<img src="${card.img}" alt="${card.id}" />`;
  boardState[index] = card;
  checkFlips(index, card);

  updateScore();
  if (boardState.every(cell => cell !== null)) {
    endGame();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    status.textContent = `Turno del Giocatore ${currentPlayer}`;
  }
}

function updateScore() {
  scores = { 1: 0, 2: 0 };
  boardState.forEach(cell => {
    if (cell) scores[cell.player]++;
  });
  p1ScoreEl.textContent = `Giocatore 1: ${scores[1]}`;
  p2ScoreEl.textContent = `Giocatore 2: ${scores[2]}`;
}

function checkFlips(pos, card) {
  const directions = [
    [-1, 3, 1], [1, 1, 3], [-3, 0, 2], [3, 2, 0]
  ];
  directions.forEach(([offset, ownSide, oppSide]) => {
    const neighborPos = pos + offset;
    if (neighborPos >= 0 && neighborPos < 9 && boardState[neighborPos]) {
      const neighbor = boardState[neighborPos];
      if (neighbor.player !== card.player && card.values[ownSide] > neighbor.values[oppSide]) {
        neighbor.player = card.player;
        const cell = board.querySelector(`[data-position="${neighborPos}"]`);
        if (cell) {
          cell.querySelector("img").style.filter = card.player === 1 ? "hue-rotate(0deg)" : "hue-rotate(180deg)";
        }
      }
    }
  });
}

function endGame() {
  if (scores[1] > scores[2]) {
    status.textContent = "Giocatore 1 ha vinto!";
  } else if (scores[2] > scores[1]) {
    status.textContent = "Giocatore 2 ha vinto!";
  } else {
    status.textContent = "Pareggio!";
  }
}

function initBoard() {
  board.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("drop", drop);
  });
  status.textContent = `Turno del Giocatore ${currentPlayer}`;
}

renderHands();
initBoard();
