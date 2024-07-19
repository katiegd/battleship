export class Ship {
  constructor(name, length, timesHit = 0, maxHits, sunk = false) {
    this.name = name;
    this.length = length;
    this.timesHit = timesHit;
    this.maxHits = maxHits;
    this.sunk = sunk;
  }

  hit() {
    this.timesHit += 1;
    this.isSunk();
  }

  isSunk() {
    if (this.timesHit === this.maxHits) {
      this.sunk = true;
    } else {
      this.sunk = false;
    }
    return this.sunk;
  }
}

export class Gameboard {
  constructor(size) {
    this.size = size;
    this.board = this.createBoard(size);
    this.ships = [];
    this.createShips();
  }

  createBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = new Array(size).fill(null);
      board.push(row);
    }
    return board;
  }

  createShips() {
    const carrier = new Ship("carrier", 5, 0, 5);
    const battleship = new Ship("battleship", 4, 0, 4);
    const destroyer = new Ship("destroyer", 3, 0, 3);
    const submarine = new Ship("submarine", 3, 0, 3);
    const patrol = new Ship("patrol", 2, 0, 2);

    this.ships.push(carrier, battleship, destroyer, submarine, patrol);
  }

  placeShips(ship, xStart, yStart, orientation) {
    if (this.isValidPlacement(ship, xStart, yStart, orientation)) {
      for (let i = 0; i < ship.length; i++) {
        if (orientation === "horizontal") {
          this.board[xStart + i][yStart] = ship;
        } else if (orientation === "vertical") {
          this.board[xStart][yStart + i] = ship;
        }
      }
    } else {
      throw new Error("Invalid ship placement.");
    }
  }

  clearShips() {
    this.ships = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] instanceof Ship) {
          this.board[i][j] = null;
        }
      }
    }
  }

  placeShipsRandomly() {
    this.clearShips();
    this.createShips();

    this.ships.forEach((ship) => {
      let placed = false;

      while (!placed) {
        let orientation = Math.random();
        if (orientation >= 0.5) {
          orientation = "horizontal";
        } else {
          orientation = "vertical";
        }
        let i = Math.floor(Math.random() * this.size);
        let j = Math.floor(Math.random() * this.size);

        if (this.isValidPlacement(ship, i, j, orientation)) {
          this.placeShips(ship, i, j, orientation);
          placed = true;
        }
      }
    });
  }

  isValidPlacement(ship, xStart, yStart, orientation) {
    for (let i = 0; i < ship.length; i++) {
      if (orientation === "horizontal") {
        if (
          // checks if the ship goes out of bounds, or doesn't cover all blank/null spots
          xStart + i >= this.size ||
          this.board[xStart + i][yStart] !== null
        ) {
          return false;
        }
      }
      if (orientation === "vertical") {
        if (
          yStart + i >= this.size ||
          this.board[xStart][yStart + i] !== null
        ) {
          return false;
        }
      }
    }
    return true;
  }

  receiveAttack(x, y) {
    if (this.board[x][y] === "Hit" || this.board[x][y] === "Miss") {
      return "Already attacked.";
    }
    if (this.board[x][y] instanceof Ship) {
      const ship = this.board[x][y];
      ship.hit();
      this.board[x][y] = "Hit";
      return "Hit";
    } else if (this.board[x][y] === null) {
      this.board[x][y] = "Miss";
      return "Miss";
    }
  }

  hasShipSunk() {
    for (let ship of this.ships) {
      if (ship.isSunk()) {
        return ship;
      }
    }
    return null;
  }
}

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard(10);
  }

  hasLost() {
    // Returns true if all ships are sunk. Player has lost.
    return this.board.ships.every((ship) => ship.isSunk());
  }
}

// for testing purposes:
// module.exports = { Ship, Gameboard, Player };
