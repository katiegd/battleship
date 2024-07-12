class Ship {
  constructor(name, length, timesHit = 0, maxHits, sunk = false) {
    this.name = name;
    this.length = length;
    this.timesHit = timesHit;
    this.maxHits = maxHits;
    this.sunk = sunk;
  }

  hit() {
    this.timesHit++;
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

class Gameboard {
  constructor(size) {
    this.size = size;
    this.board = this.createBoard(size);
    this.ships = [];
  }

  createBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = new Array(size).fill(null);
      board.push(row);
    }
    return board;
  }

  placeShips(ship, xStart, yStart, orientation) {
    if (this.isValidPlacement(ship, xStart, yStart, orientation)) {
      for (let i = 0; i < ship.length; i++) {
        if (orientation === "horizontal") {
          this.board[xStart + i][yStart] = ship;
        } else if (orientation === "vertical") {
          this.board[xStart][yStart + i] = ship;
        }
        this.ships.push(ship);
      }
    } else {
      throw new Error("Invalid ship placement.");
    }
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
      this.board[x][y].hit();
      this.board[x][y] = "Hit";
      return "Hit";
    } else {
      this.board[x][y] = "Miss";
      return "Miss";
    }
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard(10);
  }

  hasLost() {
    // Returns true if all ships are sunk. Player has lost.
    return this.board.ships.every((ship) => ship.isSunk());
  }
}

module.exports = { Ship, Gameboard, Player };
