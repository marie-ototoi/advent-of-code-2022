const fs = require("fs");

const allFileContents = fs.readFileSync("02.txt", "utf-8");
let combinations = {
  "A X": 1 + 3,
  "A Y": 2 + 6,
  "A Z": 3 + 0,
  "B X": 1 + 0,
  "B Y": 2 + 3,
  "B Z": 3 + 6,
  "C X": 1 + 6,
  "C Y": 2 + 0,
  "C Z": 3 + 3,
};
let sum = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  sum += combinations[line];
  // console.log(line, combinations[line]);
});

console.log("END", sum);
