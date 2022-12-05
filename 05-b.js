const fs = require("fs");

const allFileContents = fs.readFileSync("05.txt", "utf-8");

let sum = 0;
let stacks = [];
let stacksLoaded = false;
allFileContents.split(/\r?\n/).forEach((line) => {
  if (!stacksLoaded) {
    if (stacks.length === 0) {
      // first line
      for (let i = 0; i < line.length; i += 4) {
        if (line[i] === " ") {
          stacks.push([]);
        } else {
          stacks.push([line[i + 1]]);
        }
      }
    } else {
      for (let i = 0; i < line.length; i += 4) {
        if (line[i + 1] === "1") {
          stacksLoaded = true;
          for (let j = 0; j < stacks.length; j++) {
            stacks[j].reverse();
          }
        } else if (line[i] !== " ") {
          let index = i / 4;
          stacks[index].push(line[i + 1]);
        }
      }
    }
  } else {
    if (line[0] === "m") {
      const [n, start, end] = line
        .replace("move ", "")
        .replace(" from ", "-")
        .replace(" to ", "-")
        .split("-");
      let count = Number(n);

      while (count > 0) {
        // console.log(n, -1 * count, stacks[start - 1].at(-1 * count));
        stacks[end - 1].push(stacks[start - 1].at(-1 * count));
        count--;
      }
      count = Number(n);
      while (count > 0) {
        stacks[start - 1].pop();
        count--;
      }
    }
  }
});

let res = "";
for (let j = 0; j < stacks.length; j++) {
  res += stacks[j].at(-1);
}
console.log("END", res, stacks);
