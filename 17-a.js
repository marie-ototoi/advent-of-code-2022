const fs = require("fs");

const allFileContents = fs.readFileSync("17.txt", "utf-8");

let pattern;
allFileContents.split(/\r?\n/).forEach((line) => {
  pattern = line;
});
let emptyRows = [
  ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
];
const getRock = (index) => {
  return JSON.parse(JSON.stringify(rocks[index]));
};
let rocks = [
  [
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", "@", "@", "@", "@", ".", ".", "#"],
  ],
  [
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", "@", ".", ".", ".", "#"],
    ["#", ".", ".", "@", "@", "@", ".", ".", "#"],
    ["#", ".", ".", ".", "@", ".", ".", ".", "#"],
  ],
  [
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", "@", "@", "@", ".", ".", "#"],
    ["#", ".", ".", "@", ".", ".", ".", ".", "#"],
    ["#", ".", ".", "@", ".", ".", ".", ".", "#"],
  ],
  [
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", "@", ".", ".", "#"],
    ["#", ".", ".", ".", ".", "@", ".", ".", "#"],
    ["#", ".", ".", ".", ".", "@", ".", ".", "#"],
    ["#", ".", ".", ".", ".", "@", ".", ".", "#"],
  ],
  [
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
    ["#", ".", ".", ".", "@", "@", ".", ".", "#"],
    ["#", ".", ".", ".", "@", "@", ".", ".", "#"],
  ],
];
let saveRows = 0;
let cursorPattern = 0;
let countRocks = 0;
let rockCursor = 0;
let falling = true;
let rockHeight;
let map = [["#", "#", "#", "#", "#", "#", "#", "#", "#"]];
map.push(...getRock(rockCursor));
rockHeight = rocks[rockCursor].length - 3;
rockCursor++;
//countRocks++;

while (countRocks < 2022) {
  let movement = pattern[cursorPattern] === ">" ? "left" : "right";
  let findLastRow;
  let exploreRows = -1;
  while (!findLastRow) {
    let row = map.at(exploreRows);
    if (row.includes("@")) findLastRow = exploreRows;
    exploreRows--;
  }
  // lateral
  //console.log({ movement });
  if (movement === "left") {
    let leftFree = true;
    for (let i = findLastRow; i > findLastRow - rockHeight; i--) {
      let row = map.at(i);
      for (let j = 1; j < row.length - 1; j++) {
        if (row[j - 1] === "#" && row[j] === "@") {
          leftFree = false;
        }
      }
    }
    //console.log({ leftFree });
    if (leftFree) {
      for (let i = findLastRow; i > findLastRow - rockHeight; i--) {
        let row = map.at(i);
        for (let j = 1; j < row.length - 1; j++) {
          if (row[j] === "@") {
            map[map.length + i][j - 1] = "@";
            map[map.length + i][j] = ".";
          }
        }
      }
    }
  } else {
    let rightFree = true;
    for (let i = findLastRow; i > findLastRow - rockHeight; i--) {
      let row = map.at(i);
      for (let j = 1; j < row.length - 1; j++) {
        if (row[j + 1] === "#" && row[j] === "@") {
          rightFree = false;
        }
      }
    }
    //console.log({ rightFree });
    if (rightFree) {
      for (let i = findLastRow; i > findLastRow - rockHeight; i--) {
        let row = map.at(i);
        for (let j = row.length - 2; j > 0; j--) {
          if (row[j] === "@") {
            map[map.length + i][j + 1] = "@";
            map[map.length + i][j] = ".";
          }
        }
      }
    }
  }

  // up
  let upFree = true;
  for (let i = findLastRow; i > findLastRow - rockHeight; i--) {
    let row = map.at(i);
    let previousRow = map.at(i - 1);
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "@" && previousRow[j] === "#") {
        upFree = false;
        break;
      }
    }
  }
  //console.log("up free", upFree);
  for (let i = findLastRow - rockHeight + 1; i <= findLastRow; i++) {
    let row = map.at(i);
    //console.log(i);

    // if it is not, tranform and call next rock
    if (!upFree) {
      for (let j = 0; j < row.length; j++) {
        if (row[j] === "@") {
          map[map.length + i][j] = "#";
        }
      }
      falling = false;
    } else {
      // else proceed
      for (let j = i; j < row.length - 1; j++) {
        if (row[j] === "@") {
          map[map.length + (i - 1)][j] = "@";
          map[map.length + i][j] = ".";
        }
      }
    }
  }

  // check last row and delete it if empty
  let row = map.at(-1);
  let empty = true;
  for (let j = 0; j < row.length; j++) {
    if (j > 0 && j < row.length - 1) {
      if (row[j] === "@" || row[j] === "#") {
        empty = false;
      }
    }
  }
  //console.log(empty);
  if (empty) map.pop();

  if (!falling) {
    /*console.log({
      countRocks,
      rockCursor,
      "rocks[rockCursor]": rocks[rockCursor],
      rocks,
    });*/
    countRocks++;
    if (countRocks < 2022) {
      map.push(...getRock(rockCursor));
      rockHeight = rocks[rockCursor].length - 3;
      rockCursor++;
      if (rockCursor > rocks.length - 1) rockCursor -= rocks.length;

      falling = true;
    }
  }
  //
  cursorPattern++;
  if (cursorPattern > pattern.length - 1) cursorPattern -= pattern.length;
}
/*map.forEach((row) => {
  console.log(row.join(""));
});*/
console.log(map.length - 1);
/**/
