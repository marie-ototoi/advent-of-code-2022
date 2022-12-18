const fs = require("fs");

const allFileContents = fs.readFileSync("18.txt", "utf-8");

let cubes = new Map();
allFileContents.split(/\r?\n/).forEach((line) => {
  let [x, y, z] = line.split(",");
  cubes.set(`${x},${y},${z}`, [Number(x), Number(y), Number(z)]);
});
console.log(cubes);
let total = 0;
Array.from(cubes.values()).forEach(([x, y, z]) => {
  let faces = 6;
  // x neighbors
  if (cubes.has(`${x - 1},${y},${z}`)) faces--;
  if (cubes.has(`${x + 1},${y},${z}`)) faces--;
  // y neighbors
  if (cubes.has(`${x},${y - 1},${z}`)) faces--;
  if (cubes.has(`${x},${y + 1},${z}`)) faces--;
  // z neighbors
  if (cubes.has(`${x},${y},${z - 1}`)) faces--;
  if (cubes.has(`${x},${y},${z + 1}`)) faces--;
  total += faces;
});

/*map.forEach((row) => {
  console.log(row.join(""));
});*/
console.log(total);
/**/
