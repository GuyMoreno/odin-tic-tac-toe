// Gameboard object using IIFE pattern
const gameBoard = (function () {
  // Create an empty board with 9 spots - array.
  let board = ["", "", "", "", "", "", "", "", ""]; // 9 cells

  // A function to return the curren board
  const getBoard = () => board;

  // Expose ONLY the getBoard func... Private vars...
  return { getBoard };
})();

console.log(gameBoard.getBoard());

// Create Player Factory Function
const playerFactory = (name, mark, turn) => {
  return { name, mark, turn };
};

const switchTurn = () => {
  player1.turn = !player1.turn;
  player2.turn = !player2.turn;
};

const winCombinations = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  //   columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  //   diagonals
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (gameBoard) => {
  for (let combination of winCombinations) {
    const [a, b, c] = combination; // Destructure

    if (
      // not empty?
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[b] === gameBoard[c]
    ) {
      return true;
    }
  }
  return false;
};

let currentPlayer = "X ";
