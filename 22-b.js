const fs = require("fs");

let grid = [];
let instructions = [];
let width;
let position;
let row = 0;
const allFileContents = fs.readFileSync("22.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  const regGrid = /^([\s\.#]{1,})$/g;
  const regInstructions = /([0-9]+)([RL]{0,1})/g;
  let findInstructions = line.matchAll(regInstructions);
  if (line.match(regGrid)) {
    if (!position) {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === ".") {
          position = [i, 0];
          break;
        }
      }
    }
    if (!width) width = line.length;
    grid.push(line.padEnd(width, " "));

    row++;
  } else if (line.match(regInstructions)) {
    for (const match of findInstructions) {
      instructions.push([match[1], match[2]]);
    }
  }
});

let direction = 0;
let countInstructions = 0;

const getNewDirection = (dir, clockwise) => {
  if (clockwise === "R") {
    dir++;
    if (dir > 3) dir = 0;
  } else {
    dir--;
    if (dir < 0) dir = 3;
  }
  return dir;
};

const inRange = (n, range) => {
  return n >= range[0] && n <= range[1];
};

let limits = new Map();
limits.set("A", [
  [50, 99], // range x
  [0, 49], // range y
]);
limits.set("B", [
  [100, 149],
  [0, 49],
]);
limits.set("C", [
  [50, 99],
  [50, 99],
]);
limits.set("D", [
  [50, 99],
  [100, 149],
]);
limits.set("E", [
  [0, 49],
  [100, 149],
]);
limits.set("F", [
  [0, 49],
  [150, 199],
]);
const getFace = (pos) => {
  let f;
  let h = "center";
  let v = "center";
  let offsetX;
  let offsetY;
  Array.from(limits.entries()).forEach(([key, val]) => {
    if (inRange(pos[0], val[0]) && inRange(pos[1], val[1])) {
      f = key;
      if (pos[0] === val[0][0]) h = "left";
      if (pos[0] === val[0][1]) h = "right";
      if (pos[1] === val[1][0]) v = "up";
      if (pos[1] === val[1][1]) v = "down";
      offsetX = pos[0] - val[0][0];
      offsetY = pos[1] - val[1][0];
    }
  });
  return [f, v, h, offsetY, offsetX];
};

const getNextPositionAndDirection = (pos, dir) => {
  let [face, limitV, limitH, offsetY, offsetX] = getFace(pos);
  //console.log({ face, limitV, limitH, offsetY, offsetX });
  let findDir = dir;
  let findNextI, findNextJ;
  if (dir === 0) {
    if (face === "B" && limitH === "right") {
      let [rangeX, rangeY] = limits.get("D");
      findNextI = rangeX[1];
      findNextJ = rangeY[1] - offsetY;
      findDir = 2; // left
    } else if (face === "C" && limitH === "right") {
      let [rangeX, rangeY] = limits.get("B");
      findNextI = rangeX[0] + offsetY;
      findNextJ = rangeY[1];
      findDir = 3; // up
    } else if (face === "D" && limitH === "right") {
      let [rangeX, rangeY] = limits.get("B");
      findNextI = rangeX[1];
      findNextJ = rangeY[1] - offsetY;
      findDir = 2; // left
    } else if (face === "F" && limitH === "right") {
      let [rangeX, rangeY] = limits.get("D");
      findNextI = rangeX[0] + offsetY;
      findNextJ = rangeY[1];
      findDir = 3; // up
    } else {
      findNextJ = pos[1];
      findNextI = pos[0] + 1;
    }
  } else if (dir === 2) {
    if (face === "A" && limitH === "left") {
      let [rangeX, rangeY] = limits.get("E");
      findNextI = rangeX[0];
      findNextJ = rangeY[1] - offsetY;
      findDir = 0; // right
    } else if (face === "C" && limitH === "left") {
      let [rangeX, rangeY] = limits.get("E");
      findNextI = rangeX[0] + offsetY;
      findNextJ = rangeY[0];
      findDir = 1; // down
    } else if (face === "E" && limitH === "left") {
      let [rangeX, rangeY] = limits.get("A");
      findNextI = rangeX[0];
      findNextJ = rangeY[1] - offsetY;
      findDir = 0; // right
    } else if (face === "F" && limitH === "left") {
      let [rangeX, rangeY] = limits.get("A");
      findNextI = rangeX[0] + offsetY;
      findNextJ = rangeY[0];
      findDir = 1; // down
    } else {
      findNextJ = pos[1];
      findNextI = pos[0] - 1;
    }
  } else if (dir === 1) {
    if (face === "B" && limitV === "down") {
      let [rangeX, rangeY] = limits.get("C");
      findNextI = rangeX[1];
      findNextJ = rangeY[0] + offsetX;
      findDir = 2; // left
    } else if (face === "D" && limitV === "down") {
      let [rangeX, rangeY] = limits.get("F");
      findNextI = rangeX[1];
      findNextJ = rangeY[0] + offsetX;
      findDir = 2; // left
    } else if (face === "F" && limitV === "down") {
      let [rangeX, rangeY] = limits.get("B");
      findNextI = rangeX[0] + offsetX;
      findNextJ = rangeY[0];
      findDir = 1; // down
    } else {
      findNextJ = pos[1] + 1;
      findNextI = pos[0];
    }
  } else if (dir === 3) {
    if (face === "A" && limitV === "up") {
      let [rangeX, rangeY] = limits.get("F");
      findNextI = rangeX[0];
      findNextJ = rangeY[0] + offsetX;
      findDir = 0; // right
    } else if (face === "B" && limitV === "up") {
      let [rangeX, rangeY] = limits.get("F");
      findNextI = rangeX[0] + offsetX;
      findNextJ = rangeY[1];
      findDir = 3; // up
    } else if (face === "E" && limitV === "up") {
      let [rangeX, rangeY] = limits.get("C");
      findNextI = rangeX[0];
      findNextJ = rangeY[0] + offsetX;
      findDir = 0; // right
    } else {
      findNextJ = pos[1] - 1;
      findNextI = pos[0];
    }
  }
  //console.log(findNextI, findNextJ, grid[findNextJ][findNextI]);
  if (grid[findNextJ][findNextI] === "#") {
    return [pos, dir];
  } else {
    return [[findNextI, findNextJ], findDir];
  }
};
//console.log(getNextPositionAndDirection([2, 100], 3));
while (countInstructions < instructions.length) {
  // move in current direction
  //console.log(instructions[countInstructions]);
  for (let i = 0; i < instructions[countInstructions][0]; i++) {
    //if(direction === 0)
    let [newPosition, newDirection] = getNextPositionAndDirection(
      position,
      direction
    );
    if (newPosition[0] === position[0] && newPosition[1] === position[1]) {
      break;
    } else {
      position = newPosition;
      direction = newDirection;
    }
  }
  if (instructions[countInstructions][1])
    direction = getNewDirection(direction, instructions[countInstructions][1]);
  //console.log(position, direction, limitsRow.get(position[1]));
  // change direction
  countInstructions++;
}
//console.log(grid[124][100]);
//console.log({ instructions, limitsRow, grid, width, position });
console.log((position[1] + 1) * 1000 + (position[0] + 1) * 4 + direction);
