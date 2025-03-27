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
    console.log(`${currentPlayer.name} starts the game!`);
  };

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    console.log(`${currentPlayer.name}'s turn!`);
    displayController.updateTurnIndicator(currentPlayer);
  };

  const placeMarker = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      console.log(`${currentPlayer.name} placed a marker at ${index}`);
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
      console.log("It's a draw!");
      return true;
    }
    return false;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // alert(`${currentPlayer.name} wins!`);
        gameOver = true;
        return true;
      }
    }
    checkDraw();

    return false;
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
  let gameOver = false;

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
      cell.removeEventListener("click", handleCellClick);
      if (!gameOver) {
        cell.addEventListener("click", () => handleCellClick(index));
      }
    });
  }

  function handleCellClick(index) {
    if (gameOver) return;

    GameController.placeMarker(index);
    if (GameController.checkWinner()) {
      gameOver = true; // Set gameOver to true if there's a winner
      alert(`${GameController.getCurrentPlayer().name} wins!`);
    }
    renderBoard();
  }

  restartButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    gameOver = false; // Reset gameOver to false when restarting the game
    renderBoard(); // Re-render the board when restarting the game
  });

  return { startGame, renderBoard, handleCellClick, updateTurnIndicator };
})();
