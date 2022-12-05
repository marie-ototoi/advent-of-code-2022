const fs = require("fs");

const allFileContents = fs.readFileSync("03.txt", "utf-8");
let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let priority = alphabet.split("").reduce((acc, cur, ind) => {
  acc.set(cur, ind + 1);
  return acc;
}, new Map());
// console.log(priority);
let sum = 0;
let count = 1;
const mapItems = new Map();
allFileContents.split(/\r?\n/).forEach((line) => {
  // console.log(count, line);
  for (let i = 0; i < line.length; i++) {
    // sum += combinations[strategy[line]];
    if (count < 3) {
      mapItems.set(
        line[i],
        mapItems.has(line[i]) ? [...mapItems.get(line[i]), count] : [count]
      );
    } else {
      console.log(line[i], mapItems.get(line[i]));
      const levels = mapItems.get(line[i]);
      if (levels && levels.includes(1) && levels.includes(2)) {
        sum += priority.get(line[i]);
        count = 0;
        mapItems.clear();
        break;
      }
    }
  }
  count++;
});

console.log("END", sum);
