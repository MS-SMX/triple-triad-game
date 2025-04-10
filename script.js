/* === script.js === */
const cards = {
  ifrit: { name: "Ifrit", img: "img/ifrit.png", top: 8, right: 6, bottom: 2, left: 9 },
  shiva: { name: "Shiva", img: "img/shiva.png", top: 4, right: 9, bottom: 6, left: 2 },
};

let currentPlayer = 1;
let score = { 1: 0, 2: 0 };
let board = Array(9).fill(null);

const createCard = (cardId, player) => {
  const cardData = cards[cardId];
  const card = document.createElement("div");
  card.className = `card player${player}`;
  card.setAttribute("draggable", true);
  card.dataset.cardId = cardId;
  card.dataset.player = player;

  ["top", "right", "bottom", "left"].forEach(pos => {
    const span = document.createElement("span");
    span.className = `value ${pos}`;
    span.textContent = cardData[pos];
    card.appendChild(span);
  });

  const img = document.createElement("img");
  img.src = cardData.img;
  card.appendChild(img);

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ cardId, player }));
  });

  return card;
};

const updateScore = () => {
  score = { 1: 0, 2: 0 };
  board.forEach(cell => {
    if (cell && cell.player) score[cell.player]++;
  });
  document.getElementById("score-player1").textContent = `Player 1: ${score[1]}`;
  document.getElementById("score-player2").textContent = `Player 2: ${score[2]}`;

  const filled = board.filter(Boolean).length;
  if (filled === 9) {
    const result = score[1] > score[2] ? "Player 1 vince!" : score[1] < score[2] ? "Player 2 vince!" : "Pareggio!";
    document.getElementById("winner").textContent = result;
  }
};

const getIndexOffsets = (i) => [
  [-3, "top", "bottom"],
  [+1, "right", "left"],
  [+3, "bottom", "top"],
  [-1, "left", "right"]
];

const applyFlip = (index, data) => {
  const attacker = cards[data.cardId];
  getIndexOffsets(index).forEach(([offset, atkSide, defSide]) => {
    const neighborIndex = index + offset;
    if (neighborIndex < 0 || neighborIndex >= 9 || !board[neighborIndex]) return;
    const defender = cards[board[neighborIndex].cardId];
    if (board[neighborIndex].player !== data.player && attacker[atkSide] > defender[defSide]) {
      board[neighborIndex].player = data.player;
      board[neighborIndex].element.className = `card player${data.player}`;
    }
  });
};

const init = () => {
  const hand1 = document.getElementById("player1-hand");
  const hand2 = document.getElementById("player2-hand");
  const grid = document.getElementById("board");

  ["ifrit", "shiva"].forEach(id => {
    hand1.appendChild(createCard(id, 1));
    hand2.appendChild(createCard(id, 2));
  });

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "card";
    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      if (cell.hasChildNodes()) return;
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (parseInt(data.player) !== currentPlayer) return;

      const card = createCard(data.cardId, data.player);
      cell.appendChild(card);
      board[i] = { ...data, element: card };

      const playedCard = document.querySelector(`.hand .card[data-card-id='${data.cardId}'][data-player='${data.player}']`);
      if (playedCard) playedCard.remove();

      applyFlip(i, data);
      updateScore();
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    });
    grid.appendChild(cell);
  }
  updateScore();
};

window.onload = init;
