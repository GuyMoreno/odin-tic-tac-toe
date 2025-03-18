// UI Module - Handles all DOM manipulation
const UI = (() => {
  const turnDisplay = document.getElementById("turn-display");
  const cells = document.querySelectorAll(".cell");
  const startGameBtn = document.getElementById("start-game-btn");
  const nameInputs = document.getElementById("name-inputs");

  const updateTurnDisplay = (currentPlayer) => {
    turnDisplay.textContent = `${currentPlayer.name}'s turn (${currentPlayer.marker})`;
  };

  const updateBoard = (gameboard) => {
    cells.forEach((cell) => {
      const id = cell.id;
      cell.textContent = gameboard[id];
    });
  };

  const clearBoard = () => {
    cells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  const updateScore = (player1Score, player2Score) => {
    document.getElementById("playerScoreDisplay").textContent = player1Score;
    document.getElementById("computerScoreDisplay").textContent = player2Score;
  };

  return {
    updateTurnDisplay,
    updateBoard,
    clearBoard,
    updateScore,
    startGameBtn,
    nameInputs,
  };
})();

// Gameboard Module - Handles the game state and logic for placing markers
const Gameboard = (() => {
  let gameboard = Array(9).fill(""); // Initialize an empty gameboard

  const getGameboard = () => gameboard;

  const placeMarker = (index, marker) => {
    if (gameboard[index] === "") {
      gameboard[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    gameboard.fill(""); // Clear the board
  };

  return { getGameboard, placeMarker, resetBoard };
})();

// Player Factory - Creates a player object
function Player(name, marker) {
  return { name, marker };
}

// GameController Module - Manages game flow, turn logic, and win condition checks
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;
  let player1Score = 0;
  let player2Score = 0;
  let gameStarted = false; // Track if the game has started

  const setPlayers = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameStarted = true;
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (index) => {
    if (gameOver) {
      console.log("Game over! Please reset to play again.");
      return;
    }

    if (!Gameboard.placeMarker(index, currentPlayer.marker)) {
      console.log("Cell already occupied. Try again.");
      return;
    }

    const result = checkForWin();
    if (result) {
      gameOver = true;
      if (result === "Tie") {
        console.log("It's a tie!");
      } else {
        console.log(`${result} wins!`);
        if (result === player1.name) {
          player1Score++;
        } else {
          player2Score++;
        }
      }
      UI.updateScore(player1Score, player2Score); // Update score
      return;
    }

    switchTurn();
  };

  const checkForWin = () => {
    const board = Gameboard.getGameboard();
    const winner = checkWinner(board);
    if (winner) return winner;
    if (checkTie(board)) return "Tie";
    return null;
  };

  const checkWinner = (board) => {
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

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return currentPlayer.name;
      }
    }
    return null;
  };

  const checkTie = (board) => !board.includes(""); // Tie if no empty cells

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    UI.clearBoard();
    UI.updateTurnDisplay(currentPlayer);
  };

  return {
    setPlayers,
    playRound,
    resetGame,
    getCurrentPlayer: () => currentPlayer,
    gameStarted,
  };
})();

// Function to handle cell click events
function handleCellClick(event) {
  const index = parseInt(event.target.id, 10);
  GameController.playRound(index);

  const winner = GameController.getCurrentPlayer().name;
  if (winner) {
    console.log(`${winner} wins!`);
  }
  UI.updateBoard(Gameboard.getGameboard()); // Visual update
  UI.updateTurnDisplay(GameController.getCurrentPlayer()); // Display update
}

// Start Game Button event listener
UI.startGameBtn.addEventListener("click", () => {
  const player1Name = document.getElementById("player1-name").value.trim();
  const player2Name = document.getElementById("player2-name").value.trim();

  if (!player1Name || !player2Name) {
    alert("Please enter names for both players.");
    return;
  }

  // Set the players' names and start the game
  GameController.setPlayers(player1Name, player2Name);
  UI.updateTurnDisplay(GameController.getCurrentPlayer());
  UI.updateScore(0, 0); // Initialize score to 0

  // Hide the name input fields after the game starts
  UI.nameInputs.style.display = "none";
});

// Event listeners for cells and reset button
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

const resetButton = document.getElementById("reset-btn");
resetButton.addEventListener("click", () => {
  // Reset the game without showing the name inputs again
  if (!GameController.gameStarted) return; // Don't show inputs if game has not started
  GameController.resetGame();
  UI.clearBoard();
  UI.updateTurnDisplay(GameController.getCurrentPlayer());
  // Hide the name inputs after the game has started and reset
  UI.nameInputs.style.display = "none";
});

// Initialize the game display (before any game starts)
UI.updateTurnDisplay({ name: "Waiting for players...", marker: "" });
