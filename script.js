// script.js
const board = document.getElementById("board");
const status = document.getElementById("status");
let currentPlayer = 1;
let moves = 0;

function createCell(index) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = index;
  cell.addEventListener("click", () => {
    if (cell.classList.contains("player1") || cell.classList.contains("player2")) return;
    cell.textContent = currentPlayer === 1 ? "1" : "2";
    cell.classList.add(currentPlayer === 1 ? "player1" : "player2");
    moves++;
    if (moves >= 9) {
      status.textContent = "Partita terminata!";
      inviaStatistiche("Giocatore " + currentPlayer, Math.floor(Math.random() * 100));
      return;
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    status.textContent = `Turno: Giocatore ${currentPlayer}`;
  });
  return cell;
}

for (let i = 0; i < 9; i++) {
  board.appendChild(createCell(i));
}

function inviaStatistiche(giocatore, punteggio) {
  console.log("Invio statistiche...");
  const url = "https://script.google.com/macros/s/AKfycbw9zNvUeGrXmCzKtaNr_e4BA2HojtgaR39YGLPm230DUiLMhp18k2BlVm3IwkSub9TKlg/exec"; // <-- sostituisci con il tuo URL
  const dati = {
    giocatore: giocatore,
    punteggio: punteggio
  };

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dati)
  })
  .then(() => console.log("Statistiche inviate."))
  .catch(err => console.error("Errore invio statistiche:", err));
}
