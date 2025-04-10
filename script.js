// script.js corretto - Triple Triad FFVIII

const board = document.getElementById("board");
const hand1 = document.getElementById("hand1");
const hand2 = document.getElementById("hand2");
const status = document.getElementById("status");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

let currentPlayer = 1;
let mosseTotali = 0;

const carteGiocatore1 = [
  { nome: "Ifrit", valori: { n: 9, e: 8, s: 6, o: 2 }, colore: "blu" },
  { nome: "Shiva", valori: { n: 6, e: 4, s: 9, o: 2 }, colore: "blu" },
  { nome: "Quetzal", valori: { n: 7, e: 6, s: 3, o: 8 }, colore: "blu" },
  { nome: "Squall", valori: { n: 5, e: 9, s: 7, o: 4 }, colore: "blu" },
  { nome: "Zell", valori: { n: 3, e: 5, s: 4, o: 8 }, colore: "blu" }
];

const carteGiocatore2 = [
  { nome: "Bomb", valori: { n: 2, e: 6, s: 7, o: 5 }, colore: "rosso" },
  { nome: "T-Rexaur", valori: { n: 8, e: 7, s: 4, o: 6 }, colore: "rosso" },
  { nome: "Tonberry", valori: { n: 5, e: 9, s: 2, o: 7 }, colore: "rosso" },
  { nome: "Elnoyle", valori: { n: 6, e: 6, s: 5, o: 7 }, colore: "rosso" },
  { nome: "Funguar", valori: { n: 4, e: 3, s: 6, o: 8 }, colore: "rosso" }
];

function creaCarta(carta, index, player) {
  const div = document.createElement("div");
  div.className = `card ${carta.colore}`;
  div.draggable = true;
  div.dataset.index = index;
  div.dataset.player = player;
  div.dataset.nome = carta.nome;
  div.dataset.valori = JSON.stringify(carta.valori);

  div.innerHTML = `
    <div class="card-frame">
      <div class="card-top">${carta.valori.n}</div>
      <div class="card-middle">
        <div class="card-left">${carta.valori.o}</div>
        <div class="card-name">${carta.nome}</div>
        <div class="card-right">${carta.valori.e}</div>
      </div>
      <div class="card-bottom">${carta.valori.s}</div>
    </div>
  `;

  div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(carta));
    e.dataTransfer.setData("from-player", player);
    e.dataTransfer.setData("card-index", index);
  });

  return div;
}

function creaGriglia() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      if (cell.children.length > 0) return;

      const datiCarta = JSON.parse(e.dataTransfer.getData("text/plain"));
      const fromPlayer = parseInt(e.dataTransfer.getData("from-player"));
      const cardIndex = parseInt(e.dataTransfer.getData("card-index"));

      if (fromPlayer !== currentPlayer) return;

      const carta = creaCarta(datiCarta, cardIndex, fromPlayer);
      carta.draggable = false;
      cell.appendChild(carta);

      aggiornaConquiste(cell, datiCarta);

      if (fromPlayer === 1) {
        const carte = hand1.querySelectorAll('.card');
        hand1.removeChild(carte[cardIndex]);
      } else {
        const carte = hand2.querySelectorAll('.card');
        hand2.removeChild(carte[cardIndex]);
      }

      mosseTotali++;
      aggiornaPunteggi();

      if (mosseTotali >= 9) {
        const messaggio = "Partita terminata! " + determinaVincitore();
        status.textContent = messaggio;
        return;
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      status.textContent = `Turno: Giocatore ${currentPlayer}`;
    });

    board.appendChild(cell);
  }
}

function aggiornaConquiste(cell, carta) {
  const i = parseInt(cell.dataset.index);
  const adiacenti = {
    n: i - 3,
    e: i % 3 < 2 ? i + 1 : -1,
    s: i + 3,
    o: i % 3 > 0 ? i - 1 : -1
  };

  for (const dir in adiacenti) {
    const idx = adiacenti[dir];
    if (idx < 0 || idx > 8) continue;

    const adiacente = board.children[idx];
    if (adiacente.children.length === 0) continue;

    const cartaNemica = adiacente.children[0];
    const valoriNemico = JSON.parse(cartaNemica.dataset.valori);

    const latoOpposto = { n: "s", e: "o", s: "n", o: "e" }[dir];
    if (carta.valori[dir] > valoriNemico[latoOpposto]) {
      cartaNemica.classList.remove("rosso", "blu");
      cartaNemica.classList.add(carta.colore);
      cartaNemica.dataset.player = currentPlayer;
    }
  }
}

function aggiornaPunteggi() {
  let p1 = 0, p2 = 0;
  const cards = document.querySelectorAll(".cell .card");
  cards.forEach(c => {
    if (c.classList.contains("blu")) p1++;
    else if (c.classList.contains("rosso")) p2++;
  });
  score1.textContent = p1;
  score2.textContent = p2;
}

function determinaVincitore() {
  const s1 = parseInt(score1.textContent);
  const s2 = parseInt(score2.textContent);
  if (s1 > s2) return "Vince il Giocatore 1!";
  if (s2 > s1) return "Vince il Giocatore 2!";
  return "Pareggio!";
}

function avviaGioco() {
  carteGiocatore1.forEach((c, i) => hand1.appendChild(creaCarta(c, i, 1)));
  carteGiocatore2.forEach((c, i) => hand2.appendChild(creaCarta(c, i, 2)));
  creaGriglia();
  aggiornaPunteggi();
  status.textContent = "Turno: Giocatore 1";
}

avviaGioco();
