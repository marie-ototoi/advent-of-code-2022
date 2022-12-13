const fs = require("fs");

const allFileContents = fs.readFileSync("13.txt", "utf-8");

let sum = 0;
const compare = (left, right) => {
  if (left === undefined && right !== undefined) return 1;
  if (left !== undefined && right === undefined) return -1;
  if (Array.isArray(left) && !Array.isArray(right)) {
    if (left.length === 0 && right === undefined) return -1;
    right = [right];
  }
  if (Array.isArray(right) && !Array.isArray(left)) {
    if (right.length === 0 && left === undefined) return 1;
    left = [left];
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    let isLess = 0;
    let max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i++) {
      const isPairLess = compare(left[i], right[i], isLess);
      if (isPairLess !== 0) {
        return isPairLess;
      }
    }
    return isLess;
  }
  if (left < right) return 1;
  if (left == right) return 0;
  return -1;
};
let currentPair = [];
let index = 1;
allFileContents.split(/\r?\n/).forEach((line) => {
  if (line != "") {
    let pair = eval(line);
    currentPair.push(pair);
    if (currentPair.length === 2) {
      const isInOrder = compare(currentPair[0], currentPair[1]);
      if (isInOrder >= 0) sum += index;
      currentPair = [];
      index++;
    }
  }
});
console.log(sum);
