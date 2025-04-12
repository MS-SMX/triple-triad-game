// Aggiorniamo il sistema delle carte con tutte le regole principali di Triple Triad

const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 1;
let scores = { 1: 5, 2: 5 };
let moves = 0;
let gameOver = false;

const cards = [
  { name: 'Ifrit',   image: 'ifrit.png',   top: 6, right: 7, bottom: 2, left: 3 },
  { name: 'Shiva',   image: 'shiva.png',   top: 4, right: 2, bottom: 5, left: 7 },
  { name: 'Quistis', image: 'quistis.png', top: 5, right: 6, bottom: 6, left: 2 },
  { name: 'Zell',    image: 'zell.png',    top: 3, right: 5, bottom: 2, left: 4 },
  { name: 'Selphie', image: 'selphie.png', top: 2, right: 4, bottom: 5, left: 6 },
  { name: 'Seifer',  image: 'seifer.png',  top: 7, right: 6, bottom: 4, left: 5 },
  { name: 'Squall',  image: 'squall.png',  top: 8, right: 6, bottom: 7, left: 5 },
  { name: 'Rinoa',   image: 'rinoa.png',   top: 6, right: 7, bottom: 4, left: 3 },
  { name: 'Edea',    image: 'edea.png',    top: 5, right: 8, bottom: 3, left: 4 },
  { name: 'Irvine',  image: 'irvine.png',  top: 3, right: 4, bottom: 4, left: 5 },
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('dragover', e => e.preventDefault());
    cell.addEventListener('drop', drop);
    board.appendChild(cell);
  }
}

function createCard(card, player) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.setAttribute('draggable', true);
  cardElement.setAttribute('data-card', JSON.stringify(card));
  cardElement.setAttribute('data-player', player);

  const img = document.createElement('img');
  img.src = `img/${card.image}`;
  img.alt = card.name;
  cardElement.appendChild(img);

  cardElement.addEventListener('dragstart', dragStart);

  cardElement.classList.add(player === 1 ? 'player1' : 'player2');

  return cardElement;
}

function dragStart(event) {
  const cardElement = event.target.closest('.card');
  if (!cardElement || parseInt(cardElement.getAttribute('data-player')) !== currentPlayer) return event.preventDefault();
  const cardData = cardElement.getAttribute('data-card');
  event.dataTransfer.setData('application/json', cardData);
  event.dataTransfer.setData('text/plain', cardElement.outerHTML);
}

function drop(event) {
  event.preventDefault();
  if (gameOver) return;
  const cell = event.target.closest('.cell');
  if (!cell || cell.hasChildNodes()) return;
  const cardData = event.dataTransfer.getData('application/json');
  const card = JSON.parse(cardData);

  const cardElement = createCard(card, currentPlayer);
  cardElement.setAttribute('draggable', false);
  cell.appendChild(cardElement);
  cell.classList.add('occupied');

  const hand = currentPlayer === 1 ? hand1 : hand2;
  const cards = [...hand.children];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].getAttribute('data-card') === JSON.stringify(card)) {
      cards[i].remove();
      break;
    }
  }

  compareCards(cell, card);

  updateScore();
  moves++;
  if (moves >= 9) endGame();
  else currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateStatus();
}

function compareCards(cell, card) {
  const index = parseInt(cell.dataset.index);
  const adjacent = getAdjacentCells(cell);
  const toFlip = [];

  const directions = {
    top: index - 3,
    bottom: index + 3,
    left: index - 1,
    right: index + 1,
  };

  const same = [], plus = [], checked = [];

  adjacent.forEach(adj => {
    const adjIndex = parseInt(adj.dataset.index);
    const adjCardElement = adj.querySelector('.card');
    const adjCard = JSON.parse(adjCardElement.getAttribute('data-card'));
    const adjPlayer = parseInt(adjCardElement.getAttribute('data-player'));

    let direction, playedSide, opponentSide;
    if (adjIndex === directions.top) {
      direction = 'top';
      playedSide = card.top;
      opponentSide = adjCard.bottom;
    } else if (adjIndex === directions.bottom) {
      direction = 'bottom';
      playedSide = card.bottom;
      opponentSide = adjCard.top;
    } else if (adjIndex === directions.left) {
      direction = 'left';
      playedSide = card.left;
      opponentSide = adjCard.right;
    } else if (adjIndex === directions.right) {
      direction = 'right';
      playedSide = card.right;
      opponentSide = adjCard.left;
    }

    if (adjPlayer !== currentPlayer) {
      if (playedSide > opponentSide) toFlip.push(adjCardElement);
      if (playedSide === opponentSide) same.push(adjCardElement);
      plus.push({ element: adjCardElement, value: playedSide + opponentSide });
    }
  });

  // Same rule
  if (same.length >= 2) toFlip.push(...same);

  // Plus rule
  const valueMap = new Map();
  plus.forEach(p => {
    const count = valueMap.get(p.value) || [];
    count.push(p.element);
    valueMap.set(p.value, count);
  });
  for (let [val, elems] of valueMap.entries()) {
    if (elems.length >= 2) toFlip.push(...elems);
  }

  // Flip conquered cards
  const flipped = [];
  toFlip.forEach(cardEl => {
    const prevPlayer = parseInt(cardEl.getAttribute('data-player'));
    cardEl.setAttribute('data-player', currentPlayer);
    cardEl.classList.remove('player1', 'player2');
    cardEl.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
    scores[currentPlayer]++;
    scores[prevPlayer]--;
    flipped.push(cardEl);
  });

  // Combo (ricorsivo)
  flipped.forEach(cardEl => {
    const cell = cardEl.parentElement;
    const card = JSON.parse(cardEl.getAttribute('data-card'));
    compareCards(cell, card);
  });

  updateScore();
}

function getAdjacentCells(cell) {
  const index = parseInt(cell.dataset.index);
  const adjCells = [];
  const row = Math.floor(index / 3);
  const col = index % 3;
  if (row > 0) adjCells.push(board.children[index - 3]);
  if (row < 2) adjCells.push(board.children[index + 3]);
  if (col > 0) adjCells.push(board.children[index - 1]);
  if (col < 2) adjCells.push(board.children[index + 1]);
  return adjCells.filter(cell => cell.hasChildNodes());
}

function updateScore() {
  score1.textContent = `Giocatore 1: ${scores[1]}`;
  score2.textContent = `Giocatore 2: ${scores[2]}`;
}

function updateStatus() {
  updateScore();
}

function endGame() {
  gameOver = true;
  let message = 'Pareggio!';
  if (scores[1] > scores[2]) message = 'Giocatore 1 vince!';
  else if (scores[2] > scores[1]) message = 'Giocatore 2 vince!';
  alert(message);
}

function resetGame() {
  currentPlayer = 1;
  scores = { 1: 5, 2: 5 };
  moves = 0;
  gameOver = false;
  updateStatus();
  hand1.innerHTML = '';
  hand2.innerHTML = '';
  initBoard();
  const shuffled = shuffle([...cards]);
  const cards1 = shuffled.slice(0, 5);
  const cards2 = shuffled.slice(5, 10);
  cards1.forEach(card => hand1.appendChild(createCard(card, 1)));
  cards2.forEach(card => hand2.appendChild(createCard(card, 2)));
}

resetButton.addEventListener('click', resetGame);
resetGame();
