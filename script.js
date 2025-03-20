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
    console.log("Can't place a marker here"); // TEST - remove later
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

  return { startGame, placeMarker };
})();

// TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS

// const player1 = Player("Guy", "X");
// const player2 = Player("Taz", "O");

// GameController.startGame(player1, player2);

// // בודקים את המצב ההתחלתי של הלוח
// console.log(Gameboard.getBoard()); // מצפה ללוח ריק

// GameController.placeMarker(0); // Guy
// console.log(Gameboard.getBoard()); // מצפה ל-X במקום 0

// GameController.placeMarker(1); // Taz
// console.log(Gameboard.getBoard()); // מצפה ל-O במקום 1

// GameController.placeMarker(2); // Guy
// GameController.placeMarker(4); // Taz
// GameController.placeMarker(3); // Guy
// GameController.placeMarker(5); // Taz
// GameController.placeMarker(6); // Guy - אמור לנצח!
// console.log(Gameboard.getBoard());

// TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS TESTS

// handle the display/DOM logic.
// Write a function that will render the contents of the gameboard array to the webpage.
// const displayController = (() => {
//   const resultDisplay = document.getElementById("resultDisplay");
//   const startGameBtn = document.getElementById("startGameBtn");
//   function renderBoard() {
//     const container = document.createElement("div");
//     container.classList.add("container");

//     const gameboard = document.createElement("div");
//     gameboard.classList.add("gameboard");

//     for (let i = 0; i < 9; i++) {
//       const cell = document.createElement("div");
//       cell.classList.add("cell");
//       cell.id = i;
//       cell.addEventListener("click", handleCellClick);
//       gameboard.appendChild(cell);
//     }

//     container.appendChild(gameboard);
//     document.body.appendChild(container);
//   }

//   return { resultDisplay, renderBoard };
// })();
