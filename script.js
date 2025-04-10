// script.js - Triple Triad FFVIII Style

const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const status = document.getElementById('status');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let currentPlayer = 1;
let moves = 0;

const cardsP1 = [
  { name: 'Ifrit', up: 5, down: 2, left: 3, right: 6 },
  { name: 'Shiva', up: 7, down: 3, left: 1, right: 4 },
  { name: 'Quezacotl', up: 6, down: 4, left: 2, right: 5 },
  { name: 'Siren', up: 3, down: 6, left: 4, right: 2 },
  { name: 'Brothers', up: 4, down: 5, left: 6, right: 1 }
];

const cardsP2 = [
  { name: 'Diablos', up: 4, down: 5, left: 3, right: 6 },
  { name: 'Carbuncle', up: 2, down: 7, left: 5, right: 1 },
  { name: 'Leviathan', up: 3, down: 6, left: 1, right: 4 },
  { name: 'Bahamut', up: 6, down: 2, left: 4, right: 7 },
  { name: 'Doomtrain', up: 5, down: 1, left: 7, right: 2 }
];

function createCard(card, player) {
  const div = document.createElement('div');
  div.className = `card ${player === 1 ? 'blu' : 'rosso'}`;
  div.draggable = true;
  div.dataset.player = player;
  div.dataset.up = card.up;
  div.dataset.down = card.down;
  div.dataset.left = card.left;
  div.dataset.right = card.right;
  div.dataset.name = card.name;
  div.innerHTML = `
    <div class="card-frame">
      <div class="card-top">${card.up}</div>
      <div class="card-middle">
        <div class="card-left">${card.left}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-right">${card.right}</div>
      </div>
      <div class="card-bottom">${card.down}</div>
    </div>`;
  div.addEventListener('dragstart', dragStart);
  return div;
}

function init() {
  board.innerHTML = '';
  hand1.innerHTML = '';
  hand2.innerHTML = '';
  moves = 0;
  currentPlayer = 1;
  score1.textContent = 0;
  score2.textContent = 0;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
    board.appendChild(cell);
  }

  cardsP1.forEach(card => hand1.appendChild(createCard(card, 1)));
  cardsP2.forEach(card => hand2.appendChild(createCard(card, 2)));

  updateStatus();
}

function dragStart(e) {
  const card = e.target;
  if (parseInt(card.dataset.player) !== currentPlayer) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', JSON.stringify({
    up: card.dataset.up,
    down: card.dataset.down,
    left: card.dataset.left,
    right: card.dataset.right,
    name: card.dataset.name,
    player: card.dataset.player
  }));
  e.dataTransfer.setData('card-id', card.outerHTML);
  e.target.classList.add('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const cell = e.target.closest('.cell');
  if (!cell || cell.children.length > 0) return;

  const data = JSON.parse(e.dataTransfer.getData('text'));
  const cardEl = createCard(data, data.player);
  cardEl.draggable = false;
  cardEl.classList.add('placed');
  cell.appendChild(cardEl);

  // Remove from hand
  const originalCard = document.querySelector(`.hand .card[data-name='${data.name}'][data-player='${data.player}']`);
  if (originalCard) originalCard.remove();

  checkCapture(cell, cardEl);

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  moves++;

  updateScores();
  updateStatus();

  if (moves === 9) {
    checkWinner();
  }
}

function updateScores() {
  const allCards = document.querySelectorAll('.placed');
  let p1 = 0;
  let p2 = 0;
  allCards.forEach(card => {
    if (parseInt(card.dataset.player) === 1) p1++;
    else p2++;
  });
  score1.textContent = p1;
  score2.textContent = p2;
}

function updateStatus() {
  status.textContent = `Turno del Giocatore ${currentPlayer}`;
}

function checkWinner() {
  const p1 = parseInt(score1.textContent);
  const p2 = parseInt(score2.textContent);
  if (p1 > p2) {
    status.textContent = '🎉 Vittoria del Giocatore 1!';
    playSound('win');
  } else if (p2 > p1) {
    status.textContent = '🎉 Vittoria del Giocatore 2!';
    playSound('win');
  } else {
    status.textContent = '🤝 Pareggio!';
    playSound('draw');
  }
}

function checkCapture(cell, card) {
  const index = Array.from(board.children).indexOf(cell);
  const directions = [
    { dx: -1, dy: 0, side: 'left', opposite: 'right' },
    { dx: 1, dy: 0, side: 'right', opposite: 'left' },
    { dx: 0, dy: -1, side: 'up', opposite: 'down' },
    { dx: 0, dy: 1, side: 'down', opposite: 'up' }
  ];

  const row = Math.floor(index / 3);
  const col = index % 3;

  directions.forEach(dir => {
    const newRow = row + dir.dy;
    const newCol = col + dir.dx;
    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      const adjacentIndex = newRow * 3 + newCol;
      const adjacentCell = board.children[adjacentIndex];
      const otherCard = adjacentCell.querySelector('.placed');

      if (otherCard && otherCard.dataset.player !== card.dataset.player) {
        const attacker = parseInt(card.dataset[dir.side]);
        const defender = parseInt(otherCard.dataset[dir.opposite]);
        if (attacker > defender) {
          otherCard.dataset.player = card.dataset.player;
          otherCard.classList.remove('rosso', 'blu');
          otherCard.classList.add(card.dataset.player == 1 ? 'blu' : 'rosso', 'flash');
          playSound('capture');
          updateScores();
        }
      }
    }
  });
}

function playSound(type) {
  let src = '';
  switch (type) {
    case 'win': src = 'https://www.myinstants.com/media/sounds/victory-ff.mp3'; break;
    case 'capture': src = 'https://www.myinstants.com/media/sounds/pop.mp3'; break;
    case 'draw': src = 'https://www.myinstants.com/media/sounds/mario-coin.mp3'; break;
  }
  if (src) {
    const audio = new Audio(src);
    audio.play();
  }
}

init();
