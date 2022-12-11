const fs = require("fs");

const allFileContents = fs.readFileSync("10.txt", "utf-8");

let cycle = 0;
let targetCycles = [20];
let sum = 0;
let X = 1;
let toDraw = "";

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

  let count = previousCycle;
  while (count >= 40) count -= 40;
  toDraw +=
    count === previousX || count === previousX - 1 || count === previousX + 1
      ? "#"
      : ".";
  if (line !== "noop") {
    toDraw +=
      count + 1 === previousX ||
      count + 1 === previousX - 1 ||
      count + 1 === previousX + 1
        ? "#"
        : ".";
  }
  //console.log(previousCycle, cycle, X, sum, nextTarget);
});
for (let i = 0; i < 6; i++) {
  //  console.log(40 * i);
  console.log(toDraw.substr(40 * i, 40));
}
console.log(sum);
