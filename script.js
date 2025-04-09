// script.js
const board = document.getElementById("board");
const hand1 = document.getElementById("hand1");
const hand2 = document.getElementById("hand2");
const status = document.getElementById("status");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

let currentPlayer = 1;
let mosseTotali = 0;

const carteGiocatore1 = [
  { nome: "Ifrit", valori: { n: 5, e: 7, s: 2, o: 1 }, colore: "blu" },
  { nome: "Shiva", valori: { n: 4, e: 5, s: 6, o: 2 }, colore: "blu" },
  { nome: "Quetzal", valori: { n: 6, e: 3, s: 7, o: 2 }, colore: "blu" }
];

const carteGiocatore2 = [
  { nome: "Bomb", valori: { n: 2, e: 3, s: 6, o: 7 }, colore: "rosso" },
  { nome: "T-Rex", valori: { n: 7, e: 5, s: 3, o: 4 }, colore: "rosso" },
  { nome: "Tonberry", valori: { n: 4, e: 6, s: 2, o: 5 }, colore: "rosso" }
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
    <div class="top">${carta.valori.n}</div>
    <div class="middle">
      <span>${carta.valori.o}</span>
      <span>${carta.nome}</span>
      <span>${carta.valori.e}</span>
    </div>
    <div class="bottom">${carta.valori.s}</div>
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

    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

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
      aggiornaPunteggi();

      const tutteCarte = fromPlayer === 1 ? hand1.querySelectorAll('.card') : hand2.querySelectorAll('.card');
      if (fromPlayer === 1) {
        hand1.removeChild(tutteCarte[cardIndex]);
      } else {
        hand2.removeChild(tutteCarte[cardIndex]);
      }

      mosseTotali++;
      if (mosseTotali >= 9) {
        aggiornaPunteggi();
        setTimeout(() => {
          const messaggio = "Partita terminata! " + determinaVincitore();
          status.textContent = messaggio;
          inviaStatistiche();
        }, 100);
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
  const cards = document.querySelectorAll(".board .card");
  cards.forEach(c => {
    const colore = c.classList.contains("blu") ? 1 : 2;
    colore === 1 ? p1++ : p2++;
  });
  score1.textContent = p1;
  score2.textContent = p2;
}

function determinaVincitore() {
  const s1 = parseInt(score1.textContent);
  const s2 = parseInt(score2.textContent);
  if (s1 > s2) return "Vince Giocatore 1!";
  if (s2 > s1) return "Vince Giocatore 2!";
  return "Pareggio!";
}

function inviaStatistiche() {
  const vincitore = determinaVincitore();
  const url = "https://script.google.com/macros/s/AKfycbyUJJZHmtdJ54q1-4GVRMazfzeZZcx9ylt8ZSCQtQD369qLXLxycos8ON9IegPvQ1OqZw/exec"; // <- sostituisci con il tuo URL
  const dati = {
    giocatore: vincitore,
    punteggio: `${score1.textContent}-${score2.textContent}`
  };

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dati)
  }).then(() => console.log("Statistiche inviate."));
}

function avviaGioco() {
  carteGiocatore1.forEach((c, i) => hand1.appendChild(creaCarta(c, i, 1)));
  carteGiocatore2.forEach((c, i) => hand2.appendChild(creaCarta(c, i, 2)));
  creaGriglia();
  aggiornaPunteggi();
}

avviaGioco();
