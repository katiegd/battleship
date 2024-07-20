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
  header.classList.add("title-header");
  header.textContent = "battleship";

  const userInputDiv = document.createElement("div");
  userInputDiv.classList.add("user-input-div");

  const userInputLabel = document.createElement("span");
  userInputLabel.classList.add("user-input-label");
  userInputLabel.textContent = "Name:";

  const userInput = document.createElement("input");
  userInput.classList.add("user-input");
  userInput.setAttribute("required", "required");

  const userInputSubmitBtn = document.createElement("button");
  userInputSubmitBtn.classList.add("submit-btn");
  userInputSubmitBtn.textContent = "GO";

  const restartBtn = document.createElement("button");
  restartBtn.classList.add("restart-btn");
  restartBtn.textContent = "Restart";

  restartBtn.addEventListener("click", () => {
    user.board.clearShips();
    renderBoards();
    renderGameElements();
  });

  let userName = "Player 1";

  function initialPageLoad() {
    userInputDiv.appendChild(userInputLabel);
    userInputDiv.appendChild(userInput);
    userInputDiv.appendChild(userInputSubmitBtn);

    headerContainer.appendChild(header);
    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(userInputDiv);

    function handleSubmit() {
      if (userInput.checkValidity()) {
        userName = userInput.value;
        renderBoards();
        renderGameElements();
      } else {
        showErrorMessage();
      }
    }
    userInputSubmitBtn.addEventListener("click", () => {
      handleSubmit();
    });

    userInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    });
  }

  function showErrorMessage() {
    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Please enter your name, Captain!";

    mainContainer.appendChild(errorMessage);
  }

  const randomP1ShipsBtn = document.createElement("button");
  randomP1ShipsBtn.classList.add("randomize-btn");
  randomP1ShipsBtn.textContent = "Randomize Ships";

  const startBtn = document.createElement("button");
  startBtn.classList.add("start-btn");
  startBtn.textContent = "START";

  startBtn.addEventListener("click", startGame);

  randomP1ShipsBtn.addEventListener("click", () => {
    user.board.placeShipsRandomly();
    renderBoards();
    renderGameElements();
  });

  function renderBoards() {
    mainContainer.innerHTML = "";

    const player1BoardName = document.createElement("h2");
    player1BoardName.classList.add("h2-player-name");
    player1BoardName.textContent = `Captain ${userName}`;

    const computerBoardName = document.createElement("h2");
    computerBoardName.classList.add("h2-computer-name");
    computerBoardName.textContent = `Captain Computer`;

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

    boardsContainer.appendChild(player1BoardName);
    boardsContainer.appendChild(computerBoardName);
    boardsContainer.appendChild(player1Board);
    boardsContainer.appendChild(computerBoard);

    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(boardsContainer);
  }

  function renderGameElements() {
    const gameBtnsDiv = document.createElement("div");
    gameBtnsDiv.classList.add("game-btns-div");

    gameBtnsDiv.appendChild(randomP1ShipsBtn);
    gameBtnsDiv.appendChild(startBtn);

    mainContainer.appendChild(gameBtnsDiv);
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
    winner = userName;
    const winnerMessage = document.createElement("h1");
    winnerMessage.classList.add("winner-message");
    winnerMessage.textContent = `The battle is over. Captain ${winner} wins!`;

    mainContainer.appendChild(winnerMessage);
    mainContainer.appendChild(restartBtn);
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
    computer.board.placeShipsRandomly();

    const boardsContainer = document.querySelector("#boards");
    if (boardsContainer.contains(startBtn)) {
      boardsContainer.removeChild(startBtn);
    }

    if (boardsContainer.contains(randomP1ShipsBtn)) {
      boardsContainer.removeChild(randomP1ShipsBtn);
    }

    renderBoards();
  }

  initialPageLoad();
}
