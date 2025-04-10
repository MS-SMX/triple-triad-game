/* === script.js === */
const cards = {
  ifrit: { name: "Ifrit", img: "img/ifrit.png", top: 8, right: 6, bottom: 2, left: 9 },
  shiva: { name: "Shiva", img: "img/shiva.png", top: 4, right: 9, bottom: 6, left: 2 },
};

let currentPlayer = 1;
let score = { 1: 0, 2: 0 };

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
  document.getElementById("score-player1").textContent = `Player 1: ${score[1]}`;
  document.getElementById("score-player2").textContent = `Player 2: ${score[2]}`;
};

const init = () => {
  const hand1 = document.getElementById("player1-hand");
  const hand2 = document.getElementById("player2-hand");
  const board = document.getElementById("board");

  hand1.appendChild(createCard("ifrit", 1));
  hand1.appendChild(createCard("shiva", 1));
  hand2.appendChild(createCard("shiva", 2));
  hand2.appendChild(createCard("ifrit", 2));

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "card";
    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      if (cell.hasChildNodes()) return;
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const card = createCard(data.cardId, data.player);
      cell.appendChild(card);
      document.querySelector(`.hand .card[data-card-id='${data.cardId}'][data-player='${data.player}']`).remove();
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updateScore();
    });
    board.appendChild(cell);
  }

  updateScore();
};

window.onload = init;
