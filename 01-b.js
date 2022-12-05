const fs = require("fs");

const allFileContents = fs.readFileSync("01.txt", "utf-8");
let sums = [];
let currentSum = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  currentSum += Number(line);
  if (line === "") {
    sums.push(currentSum);
    currentSum = 0;
  }
});
sums.sort((a, b) => b - a);
console.log(sums);
console.log(sums[0] + sums[1] + sums[2]);
