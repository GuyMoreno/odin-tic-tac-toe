// start
// IIFE
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false; // if occoupied don't leave marker.
  };
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMarker, resetBoard };
})();

function createPlayer(name, marker) {
  return { name, marker };
}

// GAMECONTROLLER IIFE

const GameController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let gameOver = false;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
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
        gameOver = true;
        return currentPlayer.name;
      }
    }

    if (!board.includes("")) {
      gameOver = true;
      return "Tie";
    }

    return null;
  };

  const playRound = (index) => {
    if (gameOver || !Gameboard.placeMarker(index, currentPlayer.marker)) return;

    const winner = checkWinner();
    if (winner) {
      console.log(winner === "Tie" ? "It's a tie!" : `${winner} wins!`);
      return;
    }

    switchTurn();
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
  };

  return { playRound, resetGame, getCurrentPlayer: () => currentPlayer };
})();
