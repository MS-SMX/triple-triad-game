<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Triple Triad - Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #222;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    h1 {
      margin-bottom: 1rem;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 100px);
      grid-template-rows: repeat(3, 100px);
      gap: 5px;
    }
    .cell {
      width: 100px;
      height: 100px;
      background: #444;
      border: 2px solid #888;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      user-select: none;
    }
    .cell.player1 { background-color: #3355ff; }
    .cell.player2 { background-color: #ff5555; }
  </style>
</head>
<body>
  <h1>Triple Triad - Demo</h1>
  <div class="board" id="board"></div>
  <p id="status">Turno: Giocatore 1</p>

  <script>
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
  </script>
</body>
</html>

function inviaStatistiche(giocatore, punteggio) {
  var url = "https://script.google.com/macros/s/AKfycbwZvn65sS12eF8wViSmywDqfQNEiYZu1xiCKNCMtN59hWrLhbdA9Yy8HIb2-MhhWyC22w/exec"; // Sostituisci con l'URL copiato
  var dati = {
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
  .then(response => console.log("Dati inviati con successo"))
  .catch(error => console.error("Errore nell'invio dei dati", error));
}
