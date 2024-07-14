import { Ship, Player, Gameboard } from "./gamelogic.js";

export function DOMLogic() {
  const user = new Player("Player1");
  const computer = new Player("Computer");

  const mainContainer = document.querySelector("#main-container");
  const headerContainer = document.createElement("div");
  headerContainer.setAttribute("id", "header");
  const header = document.createElement("h1");
  header.textContent = "battleship";

  function renderHTML() {
    const boardsContainer = document.createElement("div");
    boardsContainer.setAttribute("id", "boards");

    const player1Board = document.createElement("div");
    const computerBoard = document.createElement("div");

    player1Board.setAttribute("id", "player-board");
    computerBoard.setAttribute("id", "computer-board");

    // Create the board squares for user
    for (let i = 0; i < user.board.board.length; i++) {
      for (let j = 0; j < user.board.board.length; j++) {
        const boardSquare = document.createElement("div");
        boardSquare.setAttribute("class", "board-square");

        if (user.board.board[i][j] instanceof Ship) {
          boardSquare.classList.add("ship");
        }
        player1Board.appendChild(boardSquare);
      }
    }

    // Create the board squares for computer
    for (let i = 0; i < computer.board.board.length; i++) {
      for (let j = 0; j < computer.board.board.length; j++) {
        const boardSquare = document.createElement("div");
        boardSquare.setAttribute("class", "board-square");

        //Delete eventually to hide computer ships
        if (computer.board.board[i][j] instanceof Ship) {
          boardSquare.classList.add("comp-ship");
        }

        boardSquare.addEventListener("click", () => {
          computer.board.receiveAttack(i, j);

          if (computer.board.board[i][j] === "Miss") {
            boardSquare.classList.add("miss");
            boardSquare.textContent = "•";
          } else if (computer.board.board[i][j] === "Hit") {
            boardSquare.classList.add("hit");
            boardSquare.textContent = "x";
          }
        });

        computerBoard.appendChild(boardSquare);
      }
    }

    headerContainer.appendChild(header);
    boardsContainer.appendChild(player1Board);
    boardsContainer.appendChild(computerBoard);

    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(boardsContainer);
  }

  function startGame() {
    //Create user board with predetermined values for now
    user.board.placeShips(user.board.ships[0], 0, 0, "horizontal");
    user.board.placeShips(user.board.ships[1], 2, 3, "vertical");
    user.board.placeShips(user.board.ships[2], 4, 7, "horizontal");
    user.board.placeShips(user.board.ships[3], 0, 4, "vertical");
    user.board.placeShips(user.board.ships[4], 9, 3, "vertical");

    //Create computer board with predetermined values for now
    computer.board.placeShips(computer.board.ships[0], 1, 1, "vertical");
    computer.board.placeShips(computer.board.ships[1], 5, 2, "horizontal");
    computer.board.placeShips(computer.board.ships[2], 4, 5, "vertical");
    computer.board.placeShips(computer.board.ships[3], 7, 8, "horizontal");
    computer.board.placeShips(computer.board.ships[4], 2, 8, "vertical");

    console.log(computer.board);

    renderHTML();
  }

  startGame();
}
