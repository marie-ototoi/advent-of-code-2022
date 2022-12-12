const fs = require("fs");

const allFileContents = fs.readFileSync("12.txt", "utf-8");

let graph = new Map();
let letters = "abcdefghijklmnopqrstuvwxyz";
let heights = letters.split("").reduce((acc, cur, ind) => {
  acc.set(cur, ind + 1);
  return acc;
}, new Map());
let start;
let target;
let lineLength = 0;
let rowLength;
allFileContents.split(/\r?\n/).forEach((line) => {
  if (!rowLength) rowLength = line.length;
  for (let i = 0; i < line.length; i++) {
    // cell
    if (line[i] === "S") {
      graph.set(`${i},${lineLength}`, heights.get("a"));
      start = `${i},${lineLength}`;
    } else if (line[i] === "E") {
      graph.set(`${i},${lineLength}`, heights.get("z"));
      target = `${i},${lineLength}`;
    } else {
      graph.set(`${i},${lineLength}`, heights.get(line[i]));
    }
  }
  lineLength++;
});
let steps = 0;
let visited = new Map();
let queue = [[target, 0]];

while (queue.length) {
  let nextQueue = [];

  for (let i = 0; i < queue.length; i++) {
    let [node, distance] = queue[i];
    if (graph.get(node) === 1) {
      //console.log("YEE");
      steps = distance;
      queue = [];
      nextQueue = [];
    } else {
      if (!visited.has(node)) {
        visited.set(node);
        let [x, y] = node.split(",").map((n) => Number(n));

        // top
        let top = `${x},${y - 1}`;
        if (y > 0 && graph.get(node) - graph.get(top) <= 1) {
          nextQueue.push([top, distance + 1]);
        }
        // right
        let right = `${x + 1},${y}`;
        if (x < rowLength && graph.get(node) - graph.get(right) <= 1) {
          nextQueue.push([right, distance + 1]);
        }
        // bottom
        let bottom = `${x},${y + 1}`;
        if (y < lineLength && graph.get(node) - graph.get(bottom) <= 1) {
          nextQueue.push([bottom, distance + 1]);
        }
        // left
        let left = `${x - 1},${y}`;
        if (x > 0 && graph.get(node) - graph.get(left) <= 1) {
          nextQueue.push([left, distance + 1]);
        }
      }
    }
  }
  queue = nextQueue;
}
console.log(steps);
