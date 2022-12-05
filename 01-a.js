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
console.log(sums);
console.log(Math.max(...sums));
