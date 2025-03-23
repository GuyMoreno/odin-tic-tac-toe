// Gameboard IIFE
const Gameboard = (() => {
  // Initialize an empty gameboard
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => gameboard;
  const emptyString = "";

  const placeMarker = (index, marker) => {
    if (gameboard[index] === emptyString) {
      gameboard[index] = marker;
      return true;
    }
    // console.log("Can't place a marker here"); // TEST - remove later
    return false;
  };

  const resetBoard = () => {
    // Clear the board
    gameboard.fill(emptyString);
  };

  return { getBoard, placeMarker, resetBoard };
})();

// Player Factory - Creates a player object
function Player(name, marker) {
  return { name, marker };
}

// Game Controller IIFE
const GameController = (() => {
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

    console.log(`${currentPlayer.name} starts the game!`);
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    console.log(`${currentPlayer.name}'s turn!`);
  };

  const placeMarker = (index) => {
    // If available spot?
    // Call placeMarker funct from Gameboard
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      console.log(`${currentPlayer.name} placed a marker at ${index}`);
      //Every move check for a winner
      if (checkWinner()) {
        // If returns true
        return;
      }

      // Move to next player
      switchTurn();
    }
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();

    for (let combination of winningCombinations) {
      const [a, b, c] = combination; // Destructuring
      // innzializng new vars a, b, c
      // giving them first the values 0, 1, 2 from winningCombs...
      // pulling values from board array to new a,b,c vars

      // Check if all three cells have the same marker and are not empty
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log(`${currentPlayer.name} wins!`);
        alert(`${currentPlayer.name} wins!`);
        displayController.freezeCells();
        displayController.setGameOver(true);
        return true;
      }
    }

    // Check for a draw
    if (!board.includes("")) {
      console.log("It's a draw!");
      return true;
    }

    return false;
  };

  return { startGame, placeMarker, checkWinner };
})();

// handle the display/DOM logic.
// Write a function that will render the contents of the gameboard array to the webpage.
const displayController = (() => {
  const startGameBtn = document.getElementById("start-button");
  const resetButton = document.getElementById("reset-button");
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");

  let gameOver = false;

  startGameBtn.addEventListener("click", startGame);

  function setGameOver(status) {
    gameOver = status;
  }

  function startGame() {
    const player1Name = document.getElementById("player1-name").value;
    const player2Name = document.getElementById("player2-name").value;

    if (!player1Name || !player2Name) {
      alert("Please enter names for both players!");
      return;
    }

    const player1 = Player(player1Name, "X");
    const player2 = Player(player2Name, "O");

    GameController.startGame(player1, player2);

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    gameOver = false;
    renderBoard();
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
    renderBoard();
  }

  resetButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    renderBoard();

    gameScreen.style.display = "none";
    startScreen.style.display = "block";

    gameOver = false;
  });

  function freezeCells() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick); // מסירה את האזנה לאירועי "click"
    });
  }
  return { startGame, freezeCells, renderBoard };
})();
