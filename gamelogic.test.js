const { Ship, Gameboard, Player } = require("./gamelogic");

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
  const battleship = new Ship("battleship", 4, 0, 4);
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

test("Placing ships horizontally error", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  expect(() => {
    board.placeShips(carrier, 6, 2, "horizontal");
  }).toThrow("Invalid ship placement");
});

test("Placing ships horizontally", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 0, 0, "horizontal");

  expect(board.ships).toContain(carrier);
});

test("Placing ships vertically", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 0, 0, "vertical");

  expect(board.ships).toContain(carrier);
});

test("Placing ships in same spot throws error.", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);
  const submarine = new Ship("submarine", 2, 0, 2, "vertical");

  board.placeShips(submarine, 0, 0, "vertical");

  expect(() => {
    board.placeShips(carrier, 0, 0, "horizontal");
  }).toThrow("Invalid ship placement");
});

test("Receive attack function: Already attacked", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 3, 3, "horizontal");

  board.receiveAttack(4, 3);
  const result = board.receiveAttack(4, 3);

  expect(result).toEqual("Already attacked.");
});

test("Receive attack function: Miss", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 3, 3, "horizontal");

  const result = board.receiveAttack(7, 5);

  expect(result).toEqual("Miss");
});

test("Receive attack function: Hit", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 3, 3, "horizontal");

  const result = board.receiveAttack(5, 3);

  expect(result).toEqual("Hit");
});

test("Check hit count", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 1, 3, "horizontal");

  board.receiveAttack(1, 3);
  board.receiveAttack(2, 3);
  board.receiveAttack(3, 3);

  expect(carrier.timesHit).toEqual(3);
});

test("Check if boat sinks", () => {
  const board = new Gameboard(10);
  const carrier = new Ship("carrier", 5, 0, 5, false);

  board.placeShips(carrier, 1, 3, "horizontal");

  board.receiveAttack(1, 3);
  board.receiveAttack(2, 3);
  board.receiveAttack(3, 3);
  board.receiveAttack(4, 3);
  board.receiveAttack(5, 3);

  expect(carrier.sunk).toEqual(true);
  expect(carrier.timesHit).toEqual(5);
});

test("Player exists?", () => {
  const player1 = new Player("Katie");

  expect(player1).toEqual({
    name: "Katie",
    board: new Gameboard(10),
  });
});

test("Player loses?", () => {
  const player1 = new Player("Katie");

  const ship1 = new Ship("sub", 2, 0, 2);

  player1.board.placeShips(ship1, 1, 1, "horizontal");
  player1.board.receiveAttack(1, 1);
  player1.board.receiveAttack(2, 1);

  expect(player1.hasLost()).toBe(true);
});
