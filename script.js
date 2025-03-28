// Gameboard Data Array IIFE
const dialog = document.querySelector("dialog");
dialog.showModal();
const Gameboard = (() => {
  // create js state of board--> empty array
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  // function to get the gameboard state...
  const getBoard = () => gameboard;

  const placeMarker = (index, marker) => {
    // marks only if empty
    if (gameboard[index] === "") {
      gameboard[index] = marker;
      return true;
    }
    return false;
  };
  const resetBoard = () => {
    gameboard.fill("");
  };
  return { getBoard, placeMarker, resetBoard };
})();

// Game Controller IIFE
const GameController = (() => {
  function Player(name, marker) {
    return { name, marker };
  }

  // Vars initialization
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;
  let gameOver = false; // <-- Move gameOver here

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    currentPlayer = player1;
    Gameboard.resetBoard();
    displayController.updateTurnIndicator(currentPlayer);
  };

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayController.updateTurnIndicator(currentPlayer);
  };

  const placeMarker = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      //Every move check for a winner
      if (checkWinner()) {
        return;
      }

      switchTurn();
    }
  };

  const checkDraw = () => {
    const board = Gameboard.getBoard();
    if (!board.includes("")) {
      // If there are no empty spaces left, it's a draw
      alert("It's a draw!");
      GameController.gameOver = true;
      return true;
    }
    return false; // No draw yet, continue the game
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();

    // Loop through each winning combination
    for (let [a, b, c] of winningCombinations) {
      // If all three positions in the combination match and are not empty
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        GameController.gameOver = true; // Game over if a winner is found
        console.log(`${GameController.getCurrentPlayer().name} wins!`);
        return true; // Winner found, exit early
      }
    }
    // If no winner, check for a draw
    checkDraw();
    return false; // No winner found
  };

  return {
    startGame,
    placeMarker,
    checkWinner,
    checkDraw,
    Player,
    getCurrentPlayer,
  };
})();

// handle the display/DOM logic.
// Write a function that will render the contents of the gameboard array to the webpage.
const displayController = (() => {
  const restartButton = document.getElementById("restart-button");
  const dialog = document.querySelector(".dialog");
  const confirmButton = document.getElementById("confirm-button");

  function startGame() {
    const player1Name = document.getElementById("player1-name").value;
    const player2Name = document.getElementById("player2-name").value;

    const player1 = GameController.Player(player1Name, "X");
    const player2 = GameController.Player(player2Name, "O");
    GameController.startGame(player1, player2);
    renderBoard(); // Initial render
    dialog.close();
  }

  confirmButton.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
  });

  function updateTurnIndicator(player) {
    document.getElementById(
      "turn-indicator"
    ).textContent = `${player.name}'s Turn`;
  }

  function renderBoard() {
    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.removeEventListener("click", handleCellClick); // Clean up old listeners

      if (!GameController.gameOver) {
        cell.addEventListener("click", handleCellClick); // Attach handleCellClick directly
      }
    });
  }

  function handleCellClick(event) {
    const index = event.target.id; // Get index from the clicked cell's ID

    if (GameController.gameOver) return;

    GameController.placeMarker(index); // Place marker
    if (GameController.checkWinner()) {
      GameController.gameOver = true;
      alert(`${GameController.getCurrentPlayer().name} wins!`);
    }
    renderBoard(); // Re-render the board
  }

  restartButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    GameController.gameOver = false;

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick); // Remove old listeners
    });

    renderBoard();
  });
  return { startGame, renderBoard, handleCellClick, updateTurnIndicator };
})();
