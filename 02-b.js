const fs = require("fs");

const allFileContents = fs.readFileSync("02.txt", "utf-8");
let combinations = {
  "A A": 1 + 3,
  "A B": 2 + 6,
  "A C": 3 + 0,
  "B A": 1 + 0,
  "B B": 2 + 3,
  "B C": 3 + 6,
  "C A": 1 + 6,
  "C B": 2 + 0,
  "C C": 3 + 3,
};

let strategy = {
  "A X": "A C",
  "A Y": "A A",
  "A Z": "A B",
  "B X": "B A",
  "B Y": "B B",
  "B Z": "B C",
  "C X": "C B",
  "C Y": "C C",
  "C Z": "C A",
};
let sum = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  sum += combinations[strategy[line]];
  console.log(line, combinations[strategy[line]]);
});

console.log("END", sum);
