const fs = require("fs");

const allFileContents = fs.readFileSync("03.txt", "utf-8");
let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let priority = alphabet.split("").reduce((acc, cur, ind) => {
  acc.set(cur, ind + 1);
  return acc;
}, new Map());
// console.log(priority);
let sum = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  // console.log(line);
  const mapFirstHalf = new Map();
  for (let i = 0; i < line.length; i++) {
    // sum += combinations[strategy[line]];
    if (i < line.length / 2) {
      mapFirstHalf.set(line[i]);
    } else {
      if (mapFirstHalf.has(line[i])) {
        sum += priority.get(line[i]);
        // console.log(line[j], priority.get(line[j]));
        break;
      }
    }
  }
});

console.log("END", sum);
