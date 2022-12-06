const fs = require("fs");

const allFileContents = fs.readFileSync("06.txt", "utf-8");

let count = new Map();
allFileContents.split(/\r?\n/).forEach((line) => {
  for (let i = 0; i < line.length; i++) {
    if (i > 13) {
      // remove first
      const valueFirst = count.get(line[i - 14]) - 1;
      if (valueFirst > 0) {
        count.set(line[i - 14], valueFirst);
      } else {
        count.delete(line[i - 14]);
      }
    }
    // add last
    const valueLast = count.has(line[i]) ? count.get(line[i]) + 1 : 1;
    count.set(line[i], valueLast);
    // console.log(count);
    if (count.size === 14) {
      console.log(i + 1);
      break;
    }
  }
});
