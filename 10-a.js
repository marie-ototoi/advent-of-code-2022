const fs = require("fs");

const allFileContents = fs.readFileSync("10.txt", "utf-8");

let cycle = 0;
let targetCycles = [20];
let sum = 0;
let X = 1;

allFileContents.split(/\r?\n/).forEach((line) => {
  let previousCycle = cycle;
  let previousX = X;
  let nextTarget = targetCycles.at(-1);
  cycle = line === "noop" ? cycle + 1 : cycle + 2;
  if (line !== "noop") {
    const [, addX] = line.split("addx ");
    console.log(previousCycle, cycle);
    X += Number(addX);
  }
  if (nextTarget > previousCycle && nextTarget <= cycle) {
    sum += previousX * nextTarget;
    targetCycles.push(nextTarget + 40);
  }
  //console.log(previousCycle, cycle, X, sum, nextTarget);
});

//console.log(visited);
console.log(sum);
