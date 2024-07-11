class Ship {
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
      return (this.sunk = true);
    }
    return (this.sunk = false);
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

  placeShip(ship) {}

  receiveAttack() {
    this.playableSquares;
  }
}

module.exports = { Ship, Gameboard };
