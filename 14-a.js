const fs = require("fs");

const allFileContents = fs.readFileSync("14.txt", "utf-8");

let bounds = {
  minX: Number.POSITIVE_INFINITY,
  maxX: Number.NEGATIVE_INFINITY,
  minY: 0,
  maxY: Number.NEGATIVE_INFINITY,
};
let sum = 0;

let graph = new Map();
allFileContents.split(/\r?\n/).forEach((line) => {
  let rocks = line.split(" -> ");
  //console.log(rocks, line);
  for (let i = 0; i < rocks.length - 1; i++) {
    let start = rocks[i].split(",");
    let end = rocks[i + 1].split(",");
    //console.log(start, end);
    bounds.minX = Math.min(bounds.minX, Math.min(start[0], end[0]));
    bounds.maxX = Math.max(bounds.maxX, Math.max(start[0], end[0]));
    bounds.minY = Math.min(bounds.minY, Math.min(start[1], end[1]));
    bounds.maxY = Math.max(bounds.maxY, Math.max(start[1], end[1]));
    if (start[0] === end[0]) {
      let countStart = start[1] < end[1] ? start : end;
      let countEnd = start[1] < end[1] ? end : start;
      for (let j = countStart[1]; j <= countEnd[1]; j++) {
        graph.set(`${countStart[0]},${j}`, "#");
      }
    } else {
      let countStart = start[0] < end[0] ? start : end;
      let countEnd = start[0] < end[0] ? end : start;
      for (let j = countStart[0]; j <= countEnd[0]; j++) {
        graph.set(`${j},${countStart[1]}`, "#");
      }
    }
  }
});

let unitsOfSand = 0;
let roomForSand = true;
let startSand = [500, 0];
let currentSand = startSand;
while (roomForSand) {
  let nextSand = [currentSand[0], currentSand[1] + 1];
  if (graph.has(`${nextSand[0]},${nextSand[1]}`)) {
    nextSand = [currentSand[0] - 1, currentSand[1] + 1];
  }
  if (graph.has(`${nextSand[0]},${nextSand[1]}`)) {
    nextSand = [currentSand[0] + 1, currentSand[1] + 1];
  }
  //console.log({ nextSand });
  if (graph.has(`${nextSand[0]},${nextSand[1]}`)) {
    //not possible to continue, sand remains here
    graph.set(`${currentSand[0]},${currentSand[1]}`);
    //new sand starts
    currentSand = startSand;
    //counts
    unitsOfSand++;
  } else {
    currentSand = nextSand;
  }
  if (
    currentSand[0] < bounds.minX ||
    currentSand[0] > bounds.maxX ||
    currentSand[1] < bounds.minY ||
    currentSand[1] > bounds.maxY
  ) {
    roomForSand = false;
  }
}

console.log(unitsOfSand);
