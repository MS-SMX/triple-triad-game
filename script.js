const board = document.getElementById('board');
const hand1 = document.getElementById('player1-hand');
const hand2 = document.getElementById('player2-hand');
const scoreP1 = document.getElementById('score-player1');
const scoreP2 = document.getElementById('score-player2');
const turnIndicator = document.getElementById('turn-indicator');
const winnerMessage = document.getElementById('winner-message');

let currentPlayer = 1;
let player1Cards = [];
let player2Cards = [];
let boardState = Array(9).fill(null);

const allCards = [
  // formato: immagine, top, right, bottom, left
  { img: 'img/ifrit.png', values: [9, 8, 6, 2] },
  { img: 'img/shiva.png', values: [5, 7, 3, 4] },
  { img: 'img/quistis.png', values: [4, 5, 9, 6] },
  { img: 'img/seifer.png', values: [6, 6, 7, 3] },
  { img: 'img/squall.png', values: [10, 5, 2, 9] },
  { img: 'img/zell.png', values: [4, 4, 6, 5] },
  { img: 'img/laguna.png', values: [3, 8, 4, 4] },
  { img: 'img/selphie.png', values: [7, 3, 6, 6] },
  { img: 'img/edea.png', values: [8, 7, 5, 7] },
  { img: 'img/raijin.png', values: [6, 4, 8, 3] },
];

function createCard(card, owner, index) {
  const div = document.createElement('div');
  div.className = 'card';
  div.style.backgroundImage = `url(${card.img})`;
  div.draggable = true;
  div.dataset.owner = owner;
  div.dataset.index = index;
  div.dataset.values = JSON.stringify(card.values);

  const [t, r, b, l] = card.values;
  div.innerHTML = `
    <div class="card-values top">${t}</div>
    <div class="card-values right">${r}</div>
    <div class="card-values bottom">${b}</div>
    <div class="card-values left">${l}</div>
  `;

  div.addEventListener('dragstart', dragStart);
  div.addEventListener('dragend', dragEnd);

  return div;
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', JSON.stringify({
    index: e.target.dataset.index,
    owner: e.target.dataset.owner,
    values: e.target.dataset.values,
  }));
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (e.target.classList.contains('card')) return;

  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const values = JSON.parse(data.values);

  const cellIndex = [...board.children].indexOf(e.target);
  if (boardState[cellIndex]) return;

  const placedCard = createCard({ img: `img/blank.png`, values }, `player${currentPlayer}`, data.index);
  placedCard.classList.add(`player${currentPlayer}`);
  placedCard.removeAttribute('draggable');
  e.target.appendChild(placedCard);

  boardState[cellIndex] = { values, owner: currentPlayer };

  // Rimuovi carta dalla mano
  const hand = currentPlayer === 1 ? hand1 : hand2;
  const cardToRemove = hand.querySelector(`[data-index="${data.index}"]`);
  if (cardToRemove) cardToRemove.remove();

  checkAdjacent(cellIndex, values);
  updateScore();
  nextTurn();
}

function checkAdjacent(index, values) {
  const neighbors = [
    { i: index - 3, side: 0, opp: 2 }, // top
    { i: index + 1, side: 1, opp: 3 }, // right
    { i: index + 3, side: 2, opp: 0 }, // bottom
    { i: index - 1, side: 3, opp: 1 }, // left
  ];

  for (let n of neighbors) {
    if (n.i < 0 || n.i > 8 || !boardState[n.i]) continue;
    if (boardState[n.i].owner !== currentPlayer) {
      const oppValues = boardState[n.i].values;
      if (values[n.side] > oppValues[n.opp]) {
        boardState[n.i].owner = currentPlayer;
        board.children[n.i].firstChild.className = `card player${currentPlayer}`;
      }
    }
  }
}

function updateScore() {
  let p1 = 0, p2 = 0;
  boardState.forEach(c => {
    if (!c) return;
    if (c.owner === 1) p1++;
    else if (c.owner === 2) p2++;
  });
  scoreP1.textContent = p1;
  scoreP2.textContent = p2;

  if (p1 + p2 === 9) {
    if (p1 > p2) winnerMessage.textContent = 'Vince il Giocatore 1!';
    else if (p2 > p1) winnerMessage.textContent = 'Vince il Giocatore 2!';
    else winnerMessage.textContent = 'Pareggio!';
  }
}

function nextTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnIndicator.textContent = `Turno: Giocatore ${currentPlayer}`;
}

function init() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'card-slot';
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
    board.appendChild(cell);
  }

  // Carte per ogni giocatore
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  player1Cards = shuffled.slice(0, 5);
  player2Cards = shuffled.slice(5, 10);

  player1Cards.forEach((c, i) => hand1.appendChild(createCard(c, 1, i)));
  player2Cards.forEach((c, i) => hand2.appendChild(createCard(c, 2, i)));
}

window.addEventListener('DOMContentLoaded', init);
