const fs = require("fs");

const allFileContents = fs.readFileSync("08.txt", "utf-8");

let columns = [];
let visible = new Map();

let y = 0;

allFileContents.split(/\r?\n/).forEach((line) => {
  let queueLeft = [];
  let queueRight = [];
  for (let x = 0, x2 = line.length - 1; x < line.length, x2 >= 0; x++, x2--) {
    // stores vertical lines
    if (!columns[x]) columns.push([]);
    columns[x].push(line[x]);

    // checks horizontal lines

    while (queueLeft.length > 0 && line[x] > queueLeft.at(-1).size) {
      queueLeft.pop();
    }
    let leftVis = x - (queueLeft.length > 0 ? queueLeft.at(-1).x : 0);
    if (!visible.has(`${x},${y}`)) {
      visible.set(`${x},${y}`, { left: leftVis });
    } else {
      visible.set(`${x},${y}`, {
        ...visible.get(`${x},${y}`),
        left: leftVis,
      });
    }
    queueLeft.push({ x, size: line[x] });

    while (queueRight.length > 0 && line[x2] > queueRight.at(-1).size) {
      queueRight.pop();
    }
    let rightVis =
      (queueRight.length === 0 ? line.length - 1 : queueRight.at(-1).x) - x2;
    //console.log(x2, queueRight, rightVis);
    if (!visible.has(`${x2},${y}`)) {
      visible.set(`${x2},${y}`, { right: rightVis });
    } else {
      visible.set(`${x2},${y}`, {
        ...visible.get(`${x2},${y}`),
        right: rightVis,
      });
    }
    queueRight.push({ x: x2, size: line[x2] });
  }
  y++;
});

// checks vertical lines
columns.forEach((line, x) => {
  let queueTop = [];
  let queueBottom = [];
  for (let y = 0, y2 = line.length - 1; y < line.length, y2 >= 0; y++, y2--) {
    while (queueTop.length > 0 && line[y] > queueTop.at(-1).size) {
      queueTop.pop();
    }
    let topVis = y - (queueTop.length > 0 ? queueTop.at(-1).y : 0);
    if (!visible.has(`${x},${y}`)) {
      visible.set(`${x},${y}`, { top: topVis });
    } else {
      visible.set(`${x},${y}`, {
        ...visible.get(`${x},${y}`),
        top: topVis,
      });
    }
    queueTop.push({ y, size: line[y] });

    while (queueBottom.length > 0 && line[y2] > queueBottom.at(-1).size) {
      queueBottom.pop();
    }
    let bottomVis =
      (queueBottom.length === 0 ? line.length - 1 : queueBottom.at(-1).y) - y2;
    //console.log(y2, queueBottom, bottomVis);
    if (!visible.has(`${x},${y2}`)) {
      visible.set(`${x},${y2}`, { bottom: bottomVis });
    } else {
      visible.set(`${x},${y2}`, {
        ...visible.get(`${x},${y2}`),
        bottom: bottomVis,
      });
    }
    queueBottom.push({ y: y2, size: line[y2] });
  }
});
//console.log(visible);
let max = 0;
Array.from(visible.values()).forEach(({ left, top, bottom, right }) => {
  const product = left * top * bottom * right;
  max = Math.max(max, product);
  //console.log(product, left, top, bottom, right);
});
console.log(max);
