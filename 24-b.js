const fs = require("fs");

let winds = new Map();
let walls = new Map();
let start, end;
let width,
  height = 0;

const allFileContents = fs.readFileSync("24 .txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  const regStartEnd = /([#]{2,})/g;
  if (!width) width = line.length;
  if (line.match(regStartEnd)) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "." && height === 0) {
        start = [i, height];
      } else if (line[i] === ".") {
        end = [i, height];
      } else {
        walls.set(`${i},${height}`);
      }
    }
  } else {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "#") {
        walls.set(`${i},${height}`);
      } else if (line[i] !== ".") {
        winds.set(`${i},${height}`, [line[i]]);
      }
    }
  }
  height++;
});

const getNextWindPosition = (pos, dir) => {
  if (dir === ">") {
    if (pos[0] === width - 2) {
      return [1, pos[1]];
    } else {
      return [pos[0] + 1, pos[1]];
    }
  } else if (dir === "<") {
    if (pos[0] === 1) {
      return [width - 2, pos[1]];
    } else {
      return [pos[0] - 1, pos[1]];
    }
  } else if (dir === "^") {
    if (pos[1] === 1) {
      return [pos[0], height - 2];
    } else {
      return [pos[0], pos[1] - 1];
    }
  } else if (dir === "v") {
    if (pos[1] === height - 2) {
      return [pos[0], 1];
    } else {
      return [pos[0], pos[1] + 1];
    }
  }
};

const setNextWinds = () => {
  let nextWinds = new Map();
  for (let j = 1; j < height - 1; j++) {
    for (let i = 1; i < width - 1; i++) {
      if (winds.has(`${i},${j}`)) {
        const dirs = winds.get(`${i},${j}`);
        dirs.forEach((dir) => {
          const [x, y] = getNextWindPosition([i, j], dir);
          if (nextWinds.has(`${x},${y}`)) {
            nextWinds.get(`${x},${y}`).push(dir);
          } else {
            nextWinds.set(`${x},${y}`, [dir]);
          }
        });
      }
    }
  }
  winds = new Map(nextWinds);
};

const getWindsAtTime = (time) => {
  let newWinds = new Map(winds);
  let count = 0;
  while (count < time) {
    let nextWinds = new Map();
    for (let j = 1; j < height - 1; j++) {
      for (let i = 1; i < width - 1; i++) {
        if (newWinds.has(`${i},${j}`)) {
          const dirs = newWinds.get(`${i},${j}`);
          dirs.forEach((dir) => {
            const [x, y] = getNextWindPosition([i, j], dir);
            if (nextWinds.has(`${x},${y}`)) {
              nextWinds.get(`${x},${y}`).push(dir);
            } else {
              nextWinds.set(`${x},${y}`, [dir]);
            }
          });
        }
      }
    }
    newWinds = new Map(nextWinds);
    count++;
  }
  return newWinds;
};
const drawMapAtTime = (time) => {
  const map = getWindsAtTime(time);
  for (let j = 0; j < height; j++) {
    let line = "";
    for (let i = 0; i < width; i++) {
      if (
        i === 0 ||
        i === width - 1 ||
        (j === 0 && i !== start[0]) ||
        (j === height - 1 && i !== end[0])
      ) {
        line += "#";
      } else if (map.has(`${i},${j}`)) {
        let c = map.get(`${i},${j}`);
        line += c.length > 1 ? c.length : [c[0]];
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
};
//console.log(walls);
const getPossibleDirections = (pos, map) => {
  let dirs = [];
  //if (end[0] - pos[0] > 0) {
  if (
    !map.has(`${pos[0] + 1},${pos[1]}`) &&
    !walls.has(`${pos[0] + 1},${pos[1]}`)
  )
    dirs.push([pos[0] + 1, pos[1]]);
  //} else if (end[0] - pos[0] < 0) {
  if (
    !map.has(`${pos[0] - 1},${pos[1]}`) &&
    !walls.has(`${pos[0] - 1},${pos[1]}`)
  )
    dirs.push([pos[0] - 1, pos[1]]);
  //}
  // always try to go down
  if (
    !map.has(`${pos[0]},${pos[1] + 1}`) &&
    !walls.has(`${pos[0]},${pos[1] + 1}`) &&
    pos[1] + 1 <= height - 1
  )
    dirs.push([pos[0], pos[1] + 1]);
  // go up or stay in place only if no other option
  //if (dirs.length === 0) {
  if (
    !map.has(`${pos[0]},${pos[1] - 1}`) &&
    !walls.has(`${pos[0]},${pos[1] - 1}`) &&
    pos[1] - 1 >= 0
  )
    dirs.push([pos[0], pos[1] - 1]);
  //}
  // don't move
  if (!map.has(`${pos[0]},${pos[1]}`)) dirs.push([pos[0], pos[1]]);

  return dirs;
};
const getManhattanDistance = (pos, goal) => {
  return Math.abs(pos[0] - goal[0]) + Math.abs(pos[1] - goal[1]);
};

let minTime = Number.POSITIVE_INFINITY;

let queue = [[start, 0, 0, end]];
let records = new Map();

//console.log(record);
while (queue.length) {
  let nextQueue = [];
  setNextWinds();
  for (let i = 0; i < queue.length; i++) {
    let [pos, timePast, round, target] = queue[i];
    if (pos[0] === target[0] && pos[1] === target[1]) {
      //stop
      if (round === 0) {
        nextQueue.push([pos, timePast + 1, 1, start]);
      } else if (round === 1) {
        target = end;
        nextQueue.push([pos, timePast + 1, 2, end]);
      } else if (round === 2) {
        minTime = Math.min(minTime, timePast);
        console.log(timePast);
      }
    } else {
      //console.log("here ?", pos);
      const left = getManhattanDistance(pos, target);
      const alreadyThereAtThisTime =
        records.has(`${pos[0]},${pos[1]}|${round}`) &&
        records.get(`${pos[0]},${pos[1]}|${round}`).includes(timePast);
      const tooLate = timePast + left >= minTime;

      if (!tooLate && !alreadyThereAtThisTime) {
        if (records.has(`${pos[0]},${pos[1]}|${round}`)) {
          records.get(`${pos[0]},${pos[1]}|${round}`).push(timePast);
        } else {
          records.set(`${pos[0]},${pos[1]}|${round}`, [timePast]);
        }
        // move in possible directions or wait
        const dirs = getPossibleDirections(pos, winds);
        //console.log(dirs);
        dirs.forEach((dir) => {
          nextQueue.push([dir, timePast + 1, round, target]);
        });
      }
    }
  }

  queue = nextQueue;
}

console.log(minTime);
