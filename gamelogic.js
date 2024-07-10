class Ship {
  constructor(name, length, timesHit, maxHits, sunk) {
    this.name = name;
    this.length = length;
    this.timesHit = timesHit;
    this.maxHits = maxHits;
    this.sunk = sunk;
  }

  hit() {
    let count = 0;
    if (this.timesHit) {
      count++;
    }
  }

  isSunk() {
    if (this.timesHit === this.maxHits) {
      this.sunk = true;
    }
    this.sunk = false;
  }
}
