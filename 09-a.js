const fs = require("fs");

const allFileContents = fs.readFileSync("09.txt", "utf-8");

let visited = new Map();
let xHead = 0;
let yHead = 0;
let xTail = 0;
let yTail = 0;

allFileContents.split(/\r?\n/).forEach((line) => {
  let [direction, move] = line.split(" ");
  while (move > 0) {
    // HEAD
    if (direction === "D") {
      yHead++;
    } else if (direction === "R") {
      xHead++;
    } else if (direction === "U") {
      yHead--;
    } else if (direction === "L") {
      xHead--;
    }
    // TAIL
    if (yHead === yTail) {
      if (xHead - xTail === 2) {
        xTail++;
      } else if (xHead - xTail === -2) {
        xTail--;
      }
    } else if (yHead === yTail - 1) {
      if (xHead - xTail === 2) {
        xTail++;
        yTail--;
      } else if (xHead - xTail === -2) {
        xTail--;
        yTail--;
      }
    } else if (yHead === yTail + 1) {
      if (xHead - xTail === 2) {
        xTail++;
        yTail++;
      } else if (xHead - xTail === -2) {
        xTail--;
        yTail++;
      }
    } else if (yHead === yTail - 2) {
      if (xHead - xTail === 1) {
        xTail++;
        yTail--;
      } else if (xHead - xTail === -1) {
        xTail--;
        yTail--;
      } else if (xHead - xTail === 0) {
        yTail--;
      }
    } else if (yHead === yTail + 2) {
      if (xHead - xTail === 1) {
        xTail++;
        yTail++;
      } else if (xHead - xTail === -1) {
        xTail--;
        yTail++;
      } else if (xHead - xTail === 0) {
        yTail++;
      }
    }
    visited.set(`${xTail},${yTail}`);
    // console.log(line, xHead, yHead, xTail, yTail, visited);
    move--;
  }
});

//console.log(visited);
console.log(visited.size);
