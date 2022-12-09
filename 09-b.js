const fs = require("fs");

const allFileContents = fs.readFileSync("09.txt", "utf-8");

let visited = new Map();
let coords = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

allFileContents.split(/\r?\n/).forEach((line) => {
  let [direction, move] = line.split(" ");
  while (move > 0) {
    // HEAD
    if (direction === "D") {
      coords[0][1]++;
    } else if (direction === "R") {
      coords[0][0]++;
    } else if (direction === "U") {
      coords[0][1]--;
    } else if (direction === "L") {
      coords[0][0]--;
    }
    // TAIL
    let head = 0;
    while (head < coords.length - 1) {
      //same line
      if (coords[head][1] === coords[head + 1][1]) {
        if (coords[head][0] - coords[head + 1][0] === 2) {
          coords[head + 1][0]++;
        } else if (coords[head][0] - coords[head + 1][0] === -2) {
          coords[head + 1][0]--;
        }
        // head above 1 line
      } else if (coords[head][1] === coords[head + 1][1] - 1) {
        if (coords[head][0] - coords[head + 1][0] === 2) {
          coords[head + 1][0]++;
          coords[head + 1][1]--;
        } else if (coords[head][0] - coords[head + 1][0] === -2) {
          coords[head + 1][0]--;
          coords[head + 1][1]--;
        }
        // head below 1 line
      } else if (coords[head][1] === coords[head + 1][1] + 1) {
        if (coords[head][0] - coords[head + 1][0] === 2) {
          coords[head + 1][0]++;
          coords[head + 1][1]++;
        } else if (coords[head][0] - coords[head + 1][0] === -2) {
          coords[head + 1][0]--;
          coords[head + 1][1]++;
        }
        // head above 2 lines
      } else if (coords[head][1] === coords[head + 1][1] - 2) {
        if (
          coords[head][0] - coords[head + 1][0] === 1 ||
          coords[head][0] - coords[head + 1][0] === 2
        ) {
          coords[head + 1][0]++;
          coords[head + 1][1]--;
        } else if (
          coords[head][0] - coords[head + 1][0] === -1 ||
          coords[head][0] - coords[head + 1][0] === -2
        ) {
          coords[head + 1][0]--;
          coords[head + 1][1]--;
        } else if (coords[head][0] - coords[head + 1][0] === 0) {
          coords[head + 1][1]--;
        }
        // head below 2 lines
      } else if (coords[head][1] === coords[head + 1][1] + 2) {
        if (
          coords[head][0] - coords[head + 1][0] === 1 ||
          coords[head][0] - coords[head + 1][0] === 2
        ) {
          coords[head + 1][0]++;
          coords[head + 1][1]++;
        } else if (
          coords[head][0] - coords[head + 1][0] === -1 ||
          coords[head][0] - coords[head + 1][0] === -2
        ) {
          coords[head + 1][0]--;
          coords[head + 1][1]++;
        } else if (coords[head][0] - coords[head + 1][0] === 0) {
          coords[head + 1][1]++;
        }
      }
      head++;
    }
    visited.set(`${coords.at(-1)[0]},${coords.at(-1)[1]}`);
    //console.log(line, coords, visited);
    move--;
  }
});

console.log(visited);
console.log(visited.size);
