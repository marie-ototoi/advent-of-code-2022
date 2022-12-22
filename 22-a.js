const fs = require("fs");

let grid = [];
let instructions = [];
let width;
let position;
let limitsRow = new Map();
let limitsCol = new Map();
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
    let start, end;
    for (let i = 0; i < line.length; i++) {
      if (i === 0 && (line[i] === "." || line[i] === "#")) {
        start = i;
      } else if (
        line[i] === " " &&
        (line[i + 1] === "." || line[i + 1] === "#")
      ) {
        start = i + 1;
      }
      if (i === line.length - 1 && (line[i] === "." || line[i] === "#")) {
        end = i;
      } else if ((line[i] === "." || line[i] === "#") && line[i + 1] === " ") {
        end = i;
      }
    }
    limitsRow.set(row, [start, end]);
    grid.push(line.padEnd(width, " "));

    row++;
  } else if (line.match(regInstructions)) {
    for (const match of findInstructions) {
      instructions.push([match[1], match[2]]);
    }
  }
});

let start, end;
for (let i = 0; i < width; i++) {
  for (let j = 0; j < row; j++) {
    const line = grid[j];
    if (j === 0 && (line[i] === "." || line[i] === "#")) {
      start = j;
    } else if (
      line[i] === " " &&
      grid[j + 1] &&
      (grid[j + 1][i] === "." || grid[j + 1][i] === "#")
    ) {
      start = j + 1;
    }
    if (j === row - 1 && (line[i] === "." || line[i] === "#")) {
      end = j;
    } else if (
      (line[i] === "." || line[i] === "#") &&
      grid[j + 1] &&
      grid[j + 1][i] === " "
    ) {
      end = j;
    }
  }
  limitsCol.set(i, [start, end]);
}

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

const getNextPosition = (pos, dir) => {
  let limitsR = limitsRow.get(pos[1]);
  let limitsC = limitsCol.get(pos[0]);
  let findNextI, findNextJ;
  if (dir === 0) {
    findNextJ = pos[1];
    findNextI = limitsR[1] === pos[0] ? limitsR[0] : pos[0] + 1;
  } else if (dir === 2) {
    findNextJ = pos[1];
    findNextI = limitsR[0] === pos[0] ? limitsR[1] : pos[0] - 1;
  } else if (dir === 1) {
    findNextI = pos[0];
    findNextJ = limitsC[1] === pos[1] ? limitsC[0] : pos[1] + 1;
  } else if (dir === 3) {
    findNextI = pos[0];
    findNextJ = limitsC[0] === pos[1] ? limitsC[1] : pos[1] - 1;
  }
  if (grid[findNextJ][findNextI] === "#") {
    return pos;
  } else {
    return [findNextI, findNextJ];
  }
};
//console.log(position);
while (countInstructions < instructions.length) {
  // move in current direction
  //console.log(instructions[countInstructions]);
  for (let i = 0; i < instructions[countInstructions][0]; i++) {
    //if(direction === 0)
    let newPosition = getNextPosition(position, direction);
    if (newPosition[0] === position[0] && newPosition[1] === position[1]) {
      break;
    } else {
      position = newPosition;
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
