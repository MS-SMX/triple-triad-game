const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let moves = 0;

const cards = [
  { name: 'Ifrit', image: 'ifrit.jpg' },
  { name: 'Shiva', image: 'shiva.jpg' },
  { name: 'Quistis', image: 'quistis.jpg' },
  { name: 'Zell', image: 'zell.jpg' },
  { name: 'Selphie', image: 'selphie.jpg' },
  { name: 'Seifer', image: 'seifer.jpg' },
  { name: 'Squall', image: 'squall.jpg' },
  { name: 'Rinoa', image: 'rinoa.jpg' },
  { name: 'Edea', image: 'edea.jpg' },
  { name: 'Irvine', image: 'irvine.jpg' },
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('dragover', e => e.preventDefault());
    cell.addEventListener('drop', drop);
    board.appendChild(cell);
  }
}

function createCard(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.setAttribute('draggable', true);
  cardElement.setAttribute('data-card', JSON.stringify(card));

  const img = document.createElement('img');
  img.src = `img/${card.image}`;
  img.alt = card.name;
  cardElement.appendChild(img);

  cardElement.addEventListener('dragstart', dragStart);
  return cardElement;
}

function dragStart(event) {
  const cardElement = event.target.closest('.card');
  if (!cardElement) return;
  const cardData = cardElement.getAttribute('data-card');
  if (cardData) {
    event.dataTransfer.setData('application/json', cardData);
  } else {
    console.warn('Carta trascinata senza data-card valido.');
  }
}

function drop(event) {
  event.preventDefault();
  const cardData = event.dataTransfer.getData('application/json');
  if (!cardData) return console.warn('Nessun dato valido ricevuto nel drop.');
  const cell = event.target.closest('.cell');
  if (!cell || cell.hasChildNodes()) return;

  const card = JSON.parse(cardData);
  const cardElement = createCard(card);
  cardElement.setAttribute('draggable', false);
  cardElement.classList.add(`player${currentPlayer}`);
  cardElement.removeEventListener('dragstart', dragStart);
  cell.appendChild(cardElement);
  cell.classList.add('occupied');

  const hand = currentPlayer === 1 ? hand1 : hand2;
  const handCards = [...hand.children];
  for (let c of handCards) {
    if (c.getAttribute('data-card') === JSON.stringify(card)) {
      c.remove();
      break;
    }
  }

  moves++;
  checkGameEnd();
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateStatus();
}

function updateStatus() {
  score1.textContent = `Giocatore 1: ${scores[1]}`;
  score2.textContent = `Giocatore 2: ${scores[2]}`;
}

function checkGameEnd() {
  if (moves >= 9) {
    const player1Count = document.querySelectorAll('.player1').length;
    const player2Count = document.querySelectorAll('.player2').length;
    let winner = 'Pareggio!';
    if (player1Count > player2Count) winner = 'Giocatore 1 vince!';
    if (player2Count > player1Count) winner = 'Giocatore 2 vince!';
    alert(winner);
  }
}

function resetGame() {
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  moves = 0;
  updateStatus();
  hand1.innerHTML = '';
  hand2.innerHTML = '';
  initBoard();
  const shuffled = shuffle([...cards]);
  const cards1 = shuffled.slice(0, 5);
  const cards2 = shuffled.slice(5, 10);

  cards1.forEach(card => hand1.appendChild(createCard(card)));
  cards2.forEach(card => hand2.appendChild(createCard(card)));
}

resetButton.addEventListener('click', resetGame);
resetGame();
