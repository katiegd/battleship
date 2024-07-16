import { Ship, Player, Gameboard } from "./gamelogic.js";

export function DOMLogic() {
  const user = new Player("Player1");
  const computer = new Player("Computer");
  let currentPlayer = user;

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
        boardSquare.setAttribute("class", "enemy-board-square");

        //Delete eventually to hide computer ships
        if (computer.board.board[i][j] instanceof Ship) {
          boardSquare.classList.add("comp-ship");
        }

        const handleClick = () => {
          // remove event listener if someone has lost. game is over
          if (user.hasLost() || computer.hasLost()) {
            boardSquare.removeEventListener("click", handleClick);
          } else {
            const result = computer.board.receiveAttack(i, j);
            if (result === "Already attacked.") {
              return;
            }
            if (result === "Miss") {
              boardSquare.classList.add("miss");
              boardSquare.textContent = "•";
            } else if (result === "Hit") {
              boardSquare.classList.add("hit");
              boardSquare.textContent = "x";
            }

            checkForWinner();
            switchTurns();
          }
        };

        boardSquare.addEventListener("click", handleClick);

        computerBoard.appendChild(boardSquare);
      }
    }

    headerContainer.appendChild(header);
    boardsContainer.appendChild(player1Board);
    boardsContainer.appendChild(computerBoard);

    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(boardsContainer);
  }

  function checkForWinner() {
    let winner = "";

    if (user.hasLost()) {
      winner = computer.name;
      displayWinMessage(winner);
    } else if (computer.hasLost()) {
      winner = user.name;
      displayWinMessage(winner);
    }
  }

  function displayWinMessage(winner) {
    const winnerMessage = document.createElement("h1");
    winnerMessage.textContent = `The battle is over. Captain ${winner} wins!`;
    mainContainer.appendChild(winnerMessage);
  }

  function placeShipsRandomly(board) {
    board.ships.forEach((ship) => {
      let placed = false;

      while (!placed) {
        let orientation = Math.random();
        if (orientation >= 0.5) {
          orientation = "horizontal";
        } else {
          orientation = "vertical";
        }
        let i = Math.floor(Math.random() * 10);
        let j = Math.floor(Math.random() * 10);

        if (board.isValidPlacement(ship, i, j, orientation)) {
          board.placeShips(ship, i, j, orientation);
          placed = true;
        }
      }
    });
  }

  function computerTurn() {
    let moveMade = false;
    while (!moveMade) {
      let i = Math.floor(Math.random() * 10);
      let j = Math.floor(Math.random() * 10);
      const result = user.board.receiveAttack(i, j);
      console.log(result);

      if (result !== "Already attacked.") {
        const playerBoard = document.getElementById("player-board");
        // PlayerBoard uses a 1D index, so that's why we're multiplying i * 10 (user.board.size) + j
        const attackedSquare = playerBoard.children[i * user.board.size + j];
        setTimeout(() => {
          updateBoardSquare(attackedSquare, result);
        }, 500);
        moveMade = true;

        switchTurns();
      }
      if (result === "Hit") {
        let hitCoordinates = [i][j];
        let direction = Math.floor(Math.random() * 4);
        if (direction === 1 && i < 9) {
          user.board.receiveAttack(i + 1, j);
        }
        if (direction === 2 && i > 0) {
          user.board.receiveAttack(i - 1, j);
        }
        if (direction === 3 && j < 9) {
          user.board.receiveAttack(i, j + 1);
        }
        if (direction === 4 && j > 0) {
          user.board.receiveAttack(i, j - 1);
        }
      }
    }
  }

  function updateBoardSquare(attackedSquare, result) {
    const boardSquare = attackedSquare;
    console.log(attackedSquare);
    if (result === "Miss") {
      boardSquare.classList.add("miss");
      boardSquare.textContent = "•";
    } else if (result === "Hit") {
      boardSquare.classList.add("hit");
      boardSquare.textContent = "x";
    }
  }

  function switchTurns() {
    if (currentPlayer === user) {
      currentPlayer = computer;
      computerTurn();
    } else {
      currentPlayer = user;
    }
  }

  function startGame() {
    placeShipsRandomly(user.board);
    placeShipsRandomly(computer.board);

    renderHTML();
  }

  startGame();
}
