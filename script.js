const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 1;
let scores = { 1: 5, 2: 5 }; // Ogni giocatore inizia con 5 carte
let moves = 0;
let gameOver = false;

const cards = [
  { name: 'Ifrit', image: 'ifrit.png', power: 5 },
  { name: 'Shiva', image: 'shiva.png', power: 4 },
  { name: 'Quistis', image: 'quistis.png', power: 6 },
  { name: 'Zell', image: 'zell.png', power: 3 },
  { name: 'Selphie', image: 'selphie.png', power: 2 },
  { name: 'Seifer', image: 'seifer.png', power: 7 },
  { name: 'Squall', image: 'squall.png', power: 8 },
  { name: 'Rinoa', image: 'rinoa.png', power: 6 },
  { name: 'Edea', image: 'edea.png', power: 5 },
  { name: 'Irvine', image: 'irvine.png', power: 3 },
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

  if (player === 1) cardElement.classList.add('player1');
  else if (player === 2) cardElement.classList.add('player2');

  return cardElement;
}

function dragStart(event) {
  const cardElement = event.target.closest('.card');
  if (!cardElement) return;
  if (parseInt(cardElement.getAttribute('data-player')) !== currentPlayer) return event.preventDefault();

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

  // Confronta le carte adiacenti
  compareCards(cell, card);

  const hand = currentPlayer === 1 ? hand1 : hand2;
  const cards = [...hand.children];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].getAttribute('data-card') === JSON.stringify(card)) {
      cards[i].remove();
      break;
    }
  }

  updateScore();
  moves++;
  if (moves >= 9) {
    endGame();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }
  updateStatus();
}


function compareCards(cell, card) {
  const adjacentCells = getAdjacentCells(cell);
  adjacentCells.forEach(adjCell => {
    if (adjCell.hasChildNodes()) {
      const adjCardElement = adjCell.querySelector('.card');
      const adjCardData = JSON.parse(adjCardElement.getAttribute('data-card'));

      // Verifica se la carta posizionata vince
      if (card.power > adjCardData.power) {
        // La carta corrente vince sulla carta adiacente
        if (currentPlayer === 1) {
          scores[1]++;
          scores[2]--;
        } else {
          scores[2]++;
          scores[1]--;
        }
        adjCardElement.classList.add('win');
      }
    }
  });
}

function getAdjacentCells(cell) {
  const index = parseInt(cell.dataset.index);
  const adjCells = [];

  const row = Math.floor(index / 3);
  const col = index % 3;

  // Top
  if (row > 0) adjCells.push(board.children[index - 3]);
  // Bottom
  if (row < 2) adjCells.push(board.children[index + 3]);
  // Left
  if (col > 0) adjCells.push(board.children[index - 1]);
  // Right
  if (col < 2) adjCells.push(board.children[index + 1]);

  return adjCells;
}

function updateScore() {
  const player1Cards = document.querySelectorAll('.player1').length;
  const player2Cards = document.querySelectorAll('.player2').length;
  scores[1] = player1Cards;
  scores[2] = player2Cards;
}

function updateStatus() {
  score1.textContent = `Giocatore 1: ${scores[1]}`;
  score2.textContent = `Giocatore 2: ${scores[2]}`;
}

function endGame() {
  gameOver = true;
  let message = 'Pareggio!';
  if (scores[1] > scores[2]) message = 'Giocatore 1 vince!';
  if (scores[2] > scores[1]) message = 'Giocatore 2 vince!';
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
