const fs = require("fs");

const allFileContents = fs.readFileSync("08.txt", "utf-8");

let columns = [];
let visible = new Map();

let y = 0;

allFileContents.split(/\r?\n/).forEach((line) => {
  let maxLeft;
  let maxRight;
  for (let x = 0, x2 = line.length - 1; x < line.length, x2 >= 0; x++, x2--) {
    // stores vertical lines
    if (!columns[x]) columns.push([]);
    columns[x].push(line[x]);

    // checks horizontal lines
    if (x === 0 || line[x] > maxLeft) {
      maxLeft = line[x];
      visible.set(`${x},${y}`);
    }
    if (x2 === line.length - 1 || line[x2] > maxRight) {
      maxRight = line[x2];
      visible.set(`${x2},${y}`);
    }
  }
  y++;
});

// checks vertical lines
columns.forEach((line, x) => {
  let maxTop;
  let maxBottom;
  for (let y = 0, y2 = line.length - 1; y < line.length, y2 >= 0; y++, y2--) {
    if (y === 0 || line[y] > maxTop) {
      maxTop = line[y];
      visible.set(`${x},${y}`);
    }
    if (y2 === line.length - 1 || line[y2] > maxBottom) {
      maxBottom = line[y2];
      visible.set(`${x},${y2}`);
    }
  }
});
console.log(visible.size);
