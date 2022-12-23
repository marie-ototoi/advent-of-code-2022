const fs = require("fs");

let elves = new Map();
let directions = ["N", "S", "W", "E"];
let canMoveCheck = new Map();
canMoveCheck.set("N", [
  [0, -1], // N
  [-1, -1], // NW
  [1, -1], //NE
]);
canMoveCheck.set("S", [
  [0, 1], // S
  [-1, 1], // SW
  [1, 1], //SE
]);
canMoveCheck.set("W", [
  [-1, 0], // W
  [-1, -1], // NW
  [-1, 1], // SW
]);
canMoveCheck.set("E", [
  [1, 0], // E
  [1, -1], // NE
  [1, 1], //SE
]);

let shouldMoveCheck = [
  [0, -1], // N
  [1, -1], // NE
  [1, 0], // E
  [1, 1], // SE
  [0, 1], // S
  [-1, 1], // SW
  [-1, 0], // W
  [-1, -1], // NW
];

let row = 0;
let countElves = 1;
const allFileContents = fs.readFileSync("23.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "#") {
      elves.set(`${i},${row}`, [i, row]);
      countElves++;
    }
  }
  row++;
});

const getNextPosition = (pos, dir) => {
  let nextPos;
  for (let i = 0; i < dir.length; i++) {
    let isFree = true;
    let moves = canMoveCheck.get(dir[i]);
    moves.forEach((move) => {
      /*console.log(
        pos,
        move,
        `${pos[0] + move[0]},${pos[1] + move[1]}`,
        elves.has(`${pos[0] + move[0]},${pos[1] + move[1]}`)
      );*/
      if (elves.has(`${pos[0] + move[0]},${pos[1] + move[1]}`)) {
        isFree = false;
      }
      /*console.log(
        pos,
        dir[i],
        `${pos[0] + move[0]},${pos[1] + move[1]}`,
        elves.has(`${pos[0] + move[0]},${pos[1] + move[1]}`)
      );*/
    });
    if (isFree) {
      nextPos = [pos[0] + moves[0][0], pos[1] + moves[0][1]];
      break;
    }
  }
  return nextPos;
};

const shouldMove = (pos, elv) => {
  let isFree = true;
  shouldMoveCheck.forEach((move) => {
    if (elv.has(`${pos[0] + move[0]},${pos[1] + move[1]}`)) {
      isFree = false;
    }
  });
  return !isFree;
};

const rotateDirections = (dir) => {
  return [...dir.slice(1, 4), dir[0]];
};

const getBounds = (elv) => {
  let bound = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  Array.from(elv.values()).forEach(([x, y]) => {
    bound.minX = Math.min(x, bound.minX);
    bound.minY = Math.min(y, bound.minY);
    bound.maxX = Math.max(x, bound.maxX);
    bound.maxY = Math.max(y, bound.maxY);
  });
  return bound;
};

const drawMap = (elv, bound) => {
  for (let j = Math.min(bound.minY, 0); j <= bound.maxY; j++) {
    let line = "";
    for (let i = Math.min(bound.minX, 0); i <= bound.maxX; i++) {
      line += elv.has(`${i},${j}`) ? "#" : ".";
    }
    console.log(line);
  }
};
let round = 0;
//

let bounds = getBounds(elves);
//drawMap(elves, bounds);
//console.log("before ", elves.size, elves, bounds);
let stop = false;
while (!stop) {
  let nextPositions = new Map();
  Array.from(elves.values()).forEach((elf) => {
    //console.log(elf, shouldMove(elf, elves));
    if (shouldMove(elf, elves)) {
      const next = getNextPosition(elf, directions);
      if (next) {
        const [x, y] = next;
        if (nextPositions.has(`${x},${y}`)) {
          nextPositions.get(`${x},${y}`).push(elf);
        } else {
          nextPositions.set(`${x},${y}`, [elf]);
        }
      }
    }
  });

  directions = rotateDirections(directions);

  //console.log({ nextPositions });
  Array.from(nextPositions.entries()).forEach(([nextPos, candidates]) => {
    if (candidates.length === 1) {
      const [x, y] = nextPos.split(",");
      const [formerX, formerY] = candidates[0];
      elves.delete(`${formerX},${formerY}`);
      elves.set(`${x},${y}`, [Number(x), Number(y)]);
    }
  });
  //bounds = getBounds(elves);
  //drawMap(elves, bounds);
  //console.log("done", round);
  round++;
  if (nextPositions.size === 0) stop = true;
}

bounds = getBounds(elves);
//console.log(bounds, elves);

console.log(round);
