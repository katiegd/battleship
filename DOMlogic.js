import { Ship, Player, Gameboard } from "./gamelogic.js";

export function DOMLogic() {
  const user = new Player("Player1");
  const computer = new Player("Computer");
  let currentPlayer = user;
  let hitCoordinates = [];
  let nextCoordinates = null;
  let direction = null;
  let consecutiveHits = 0;
  let lastHit = hitCoordinates[hitCoordinates.length - 1];
  let initialHit = null;

  const mainContainer = document.querySelector("#main-container");
  const headerContainer = document.createElement("div");
  headerContainer.setAttribute("id", "header");
  const header = document.createElement("h1");
  header.textContent = "battleship";

  const player1BoardContainer = document.createElement("div");
  player1BoardContainer.classList.add("P1-board-button-container");

  const randomP1ShipsBtn = document.createElement("button");
  randomP1ShipsBtn.textContent = "Randomize Ship Placement";

  randomP1ShipsBtn.addEventListener("click", () => {
    user.board.placeShipsRandomly();

    renderBoards();
  });

  function renderBoards() {
    mainContainer.innerHTML = "";

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

    player1BoardContainer.appendChild(player1Board);
    player1BoardContainer.appendChild(randomP1ShipsBtn);

    boardsContainer.appendChild(player1BoardContainer);
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

  function computerTurn() {
    const playerBoard = document.getElementById("player-board");
    let moveMade = false;

    while (!moveMade) {
      let i, j;

      if (nextCoordinates) {
        //If there are coordinates saved, use them now.
        [i, j] = nextCoordinates;
        nextCoordinates = null; // Then set them back to null after use.
      } else {
        i = Math.floor(Math.random() * 10); //Otherwise generate random coordinates
        j = Math.floor(Math.random() * 10);
      }

      console.log(i, j);

      // Validate coordinates are within bounds
      if (i < 0 || i >= 10 || j < 0 || j >= 10) {
        console.log("Invalid coordinates generated: ", i, j);
        continue; // Skip the rest of the loop iteration and generate new coordinates
      }

      const result = user.board.receiveAttack(i, j);

      if (result !== "Already attacked.") {
        // PlayerBoard uses a 1D index, so that's why we're multiplying i * 10 (user.board.size) + j
        const attackedSquare = playerBoard.children[i * user.board.size + j];
        setTimeout(() => {
          updateBoardSquare(attackedSquare, result);
        }, 500);
        moveMade = true;

        if (result === "Hit") {
          //If computer hits, save those coordinates and add to consecutiveHits counter.
          hitCoordinates.push([i, j]);
          consecutiveHits++;

          console.log(
            "There's been a hit." +
              "Hit Coordinates: " +
              lastHit +
              " " +
              "Consecutive Hits: " +
              consecutiveHits
          );

          if (consecutiveHits === 1) {
            initialHit = [i, j]; // Store where the first hit was to be used later.
            //Choose a random direction to go
            direction = Math.floor(Math.random() * 4);
            nextCoordinates = getNextCoordinates(i, j, direction);
            console.log("Choosing initial direction: " + direction);
          } else {
            // Continue in the current direction.
            nextCoordinates = getNextCoordinates(i, j, direction);
            console.log("Continuing in direction: " + direction);

            if (
              // if coordinates aren't valid, switch directions
              !isValidCoordinate(nextCoordinates)
            ) {
              direction = (direction + 2) % 4;
              console.log("Invalid coordinates: ", nextCoordinates);
              nextCoordinates = getNextCoordinates(i, j, direction);
              console.log(
                "Coordinates not valid, rerunning the direction algo."
              );
              console.log(nextCoordinates);
            } else if (result === "Miss" && consecutiveHits > 0) {
              direction = (direction + 2) % 4;
              nextCoordinates = getNextCoordinates(
                lastHit[0],
                lastHit[1],
                direction
              );
              console.log(
                "Miss after hits. Reversing direction. New direction: " +
                  direction
              );
            }
          }

          if (user.board.hasShipSunk()) {
            hitCoordinates = [];
            consecutiveHits = 0;
            direction = null;
            nextCoordinates = null;
            initialHit = null;
            console.log("Computer has sunk your ship!");
          }
        }
        switchTurns();
      }
    }
  }

  function getNextCoordinates(i, j, direction) {
    if (direction === 0) {
      return [i + 1, j];
    } else if (direction === 1) {
      return [i - 1, j];
    } else if (direction === 2) {
      return [i, j + 1];
    } else if (direction === 3) {
      return [i, j - 1];
    }
  }

  function isValidCoordinate(coords) {
    //Returns true if coordinates are in bounds
    return (
      coords &&
      coords[0] >= 1 &&
      coords[0] < 9 &&
      coords[1] >= 1 &&
      coords[1] < 9
    );
  }

  function updateBoardSquare(attackedSquare, result) {
    const boardSquare = attackedSquare;
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
    user.board.placeShipsRandomly();
    computer.board.placeShipsRandomly();

    renderBoards();
  }

  startGame();
}
