const { Ship, Gameboard } = require("./gamelogic");

test("Ship constructor", () => {
  const carrier = new Ship("carrier", 5, 0, 5, false);
  expect(carrier).toEqual({
    name: "carrier",
    length: 5,
    timesHit: 0,
    maxHits: 5,
    sunk: false,
  });
});

test("Ship hits & sinks", () => {
  const battleship = new Ship("battleship", 4, 0, 4, false);
  battleship.hit();
  expect(battleship).toEqual({
    name: "battleship",
    length: 4,
    timesHit: 1,
    maxHits: 4,
    sunk: false,
  });

  battleship.hit();
  battleship.hit();

  expect(battleship).toEqual({
    name: "battleship",
    length: 4,
    timesHit: 3,
    maxHits: 4,
    sunk: false,
  });

  battleship.hit();

  expect(battleship).toEqual({
    name: "battleship",
    length: 4,
    timesHit: 4,
    maxHits: 4,
    sunk: true,
  });
});
