// script.js con tutte le regole base + avanzate di Triple Triad

const board = document.getElementById("board");
const player1Hand = document.getElementById("player1-hand");
const player2Hand = document.getElementById("player2-hand");
const statusText = document.getElementById("game-status");
const player1Score = document.getElementById("player1-score");
const player2Score = document.getElementById("player2-score");

let turn = 1;
let boardState = Array(9).fill(null);
let cardsInPlay = 0;

const cards = [
  { name: "Seifer", img: "img/seifer.png", values: { top: 5, right: 3, bottom: 6, left: 2 } },
  { name: "Squall", img: "img/squall.png", values: { top: 6, right: 5, bottom: 3, left: 6 } },
  { name: "Zell", img: "img/zell.png", values: { top: 4, right: 4, bottom: 5, left: 5 } },
  { name: "Irvine", img: "img/irvine.png", values: { top: 3, right: 6, bottom: 2, left: 4 } },
  { name: "Quistis", img: "img/quistis.png", values: { top: 5, right: 4, bottom: 6, left: 3 } },
  { name: "Selphie", img: "img/selphie.png", values: { top: 3, right: 2, bottom: 4, left: 6 } },
  { name: "Rinoa", img: "img/rinoa.png", values: { top: 4, right: 5, bottom: 3, left: 4 } },
  { name: "Laguna", img: "img/laguna.png", values: { top: 6, right: 3, bottom: 2, left: 6 } },
  { name: "Edea", img: "img/edea.png", values: { top: 5, right: 6, bottom: 4, left: 2 } },
  { name: "Fujin", img: "img/fujin.png", values: { top: 4, right: 5, bottom: 6, left: 1 } }
];

function shuffleAndDeal() {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const p1 = shuffled.slice(0, 5);
  const p2 = shuffled.slice(5, 10);
  p1.forEach(card => createCard(card, player1Hand, 1));
  p2.forEach(card => createCard(card, player2Hand, 2));
}

function createCard(card, container, owner) {
  const div = document.createElement("div");
  div.className = "card";
  div.draggable = true;
  div.innerHTML = `<img src="${card.img}" draggable="false"><div class="values">
    <span class="top">${card.values.top}</span>
    <span class="right">${card.values.right}</span>
    <span class="bottom">${card.values.bottom}</span>
    <span class="left">${card.values.left}</span></div>`;
  div.dataset.card = JSON.stringify(card);
  div.dataset.owner = owner;

  div.addEventListener("dragstart", dragStart);
  container.appendChild(div);
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.card);
  e.dataTransfer.setData("text/owner", e.target.dataset.owner);
  setTimeout(() => e.target.classList.add("hide"), 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");
  const owner = parseInt(e.dataTransfer.getData("text/owner"));

  if ((turn % 2 === 1 && owner !== 1) || (turn % 2 === 0 && owner !== 2)) return;

  const card = JSON.parse(data);
  const cell = e.target.closest(".cell");
  const pos = parseInt(cell.dataset.position);

  if (!cell || boardState[pos]) return;

  const img = document.createElement("img");
  img.src = card.img;
  img.className = `player${owner}`;
  cell.appendChild(img);
  boardState[pos] = { ...card, owner };
  cardsInPlay++;

  const sourceHand = owner === 1 ? player1Hand : player2Hand;
  [...sourceHand.children].find(el => el.dataset.card === data)?.remove();

  checkFlips(pos, card, owner);
  updateScores();

  if (cardsInPlay === 9) return endGame();

  turn++;
  statusText.textContent = `Turno del Giocatore ${turn % 2 === 1 ? 1 : 2}`;
}

function checkFlips(pos, card, owner, chain = true) {
  const adjacent = [
    { pos: pos - 3, dir: "top", opp: "bottom" },
    { pos: pos + 3, dir: "bottom", opp: "top" },
    { pos: pos - 1, dir: "left", opp: "right" },
    { pos: pos + 1, dir: "right", opp: "left" },
  ];

  let flipped = [];
  adjacent.forEach(({ pos: adjPos, dir, opp }) => {
    if (adjPos < 0 || adjPos > 8 || !boardState[adjPos]) return;
    const adjCard = boardState[adjPos];
    if (adjCard.owner !== owner && card.values[dir] > adjCard.values[opp]) {
      boardState[adjPos].owner = owner;
      flipped.push(adjPos);
      const cell = board.querySelector(`.cell[data-position='${adjPos}']`);
      cell.firstChild.className = `player${owner}`;
    }
  });

  if (chain) {
    flipped.forEach(f => checkFlips(f, boardState[f], owner, false));
  }

  checkSamePlus(pos, card, owner);
}

function checkSamePlus(pos, card, owner) {
  const dirs = [
    { dx: -1, dy: 0, dir: "left", opp: "right" },
    { dx: 1, dy: 0, dir: "right", opp: "left" },
    { dx: 0, dy: -1, dir: "top", opp: "bottom" },
    { dx: 0, dy: 1, dir: "bottom", opp: "top" }
  ];

  const row = Math.floor(pos / 3);
  const col = pos % 3;
  let same = [], plus = [], total = {};

  dirs.forEach(({ dx, dy, dir, opp }) => {
    const r = row + dy, c = col + dx;
    if (r < 0 || r > 2 || c < 0 || c > 2) return;
    const adjPos = r * 3 + c;
    const adj = boardState[adjPos];
    if (!adj || adj.owner === owner) return;
    const val1 = card.values[dir];
    const val2 = adj.values[opp];
    total[adjPos] = val1 + val2;
    if (val1 === val2) same.push(adjPos);
  });

  if (same.length >= 2) {
    same.forEach(p => {
      boardState[p].owner = owner;
      const cell = board.querySelector(`.cell[data-position='${p}']`);
      cell.firstChild.className = `player${owner}`;
    });
  }

  const match = Object.entries(total).reduce((acc, [pos1, sum1]) => {
    for (let [pos2, sum2] of Object.entries(total)) {
      if (pos1 !== pos2 && sum1 === sum2) acc.push(parseInt(pos1), parseInt(pos2));
    }
    return acc;
  }, []);

  [...new Set(match)].forEach(p => {
    boardState[p].owner = owner;
    const cell = board.querySelector(`.cell[data-position='${p}']`);
    cell.firstChild.className = `player${owner}`;
  });
}

function updateScores() {
  const score = boardState.reduce((acc, card) => {
    if (!card) return acc;
    if (card.owner === 1) acc[0]++;
    else acc[1]++;
    return acc;
  }, [0, 0]);
  player1Score.textContent = `Giocatore 1: ${score[0]}`;
  player2Score.textContent = `Giocatore 2: ${score[1]}`;
}

function endGame() {
  const p1 = boardState.filter(c => c?.owner === 1).length;
  const p2 = boardState.filter(c => c?.owner === 2).length;
  if (p1 > p2) statusText.textContent = "Vittoria del Giocatore 1!";
  else if (p2 > p1) statusText.textContent = "Vittoria del Giocatore 2!";
  else statusText.textContent = "Pareggio!";
}

board.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("dragover", dragOver);
  cell.addEventListener("drop", drop);
});

shuffleAndDeal();
