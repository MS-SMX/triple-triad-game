// script.js - Triple Triad FFVIII Style

const board = document.getElementById('board');
const hand1 = document.getElementById('hand1');
const hand2 = document.getElementById('hand2');
const status = document.getElementById('status');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const bgMusic = document.getElementById('bg-music');

let currentPlayer = 1;
let moves = 0;
let player1Score = 0;
let player2Score = 0;

const allCards = [
  { name: 'Ifrit', up: 5, down: 2, left: 3, right: 6, img: 'img/ifrit.png' },
  { name: 'Shiva', up: 7, down: 3, left: 1, right: 4, img: 'img/shiva.png' },
  { name: 'Quezacotl', up: 6, down: 4, left: 2, right: 5, img: 'img/quezacotl.png' },
  { name: 'Siren', up: 3, down: 6, left: 4, right: 2, img: 'img/siren.png' },
  { name: 'Brothers', up: 4, down: 5, left: 6, right: 1, img: 'img/brothers.png' },
  { name: 'Diablos', up: 4, down: 5, left: 3, right: 6, img: 'img/diablos.png' },
  { name: 'Carbuncle', up: 2, down: 7, left: 5, right: 1, img: 'img/carbuncle.png' },
  { name: 'Leviathan', up: 3, down: 6, left: 1, right: 4, img: 'img/leviathan.png' },
  { name: 'Bahamut', up: 6, down: 2, left: 4, right: 7, img: 'img/bahamut.png' },
  { name: 'Doomtrain', up: 5, down: 1, left: 7, right: 2, img: 'img/doomtrain.png' }
];

function shuffleDeck(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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
        <img class="card-img" src="${card.img}" alt="${card.name}" />
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
  player1Score = 0;
  player2Score = 0;
  score1.textContent = 0;
  score2.textContent = 0;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
    board.appendChild(cell);
  }

  const deck = shuffleDeck(allCards);
  const p1Hand = deck.slice(0, 5);
  const p2Hand = deck.slice(5, 10);

  p1Hand.forEach(card => hand1.appendChild(createCard(card, 1)));
  p2Hand.forEach(card => hand2.appendChild(createCard(card, 2)));

  updateStatus();
  bgMusic.play();
}

// Event handlers and game logic functions

init();
