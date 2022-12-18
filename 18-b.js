const fs = require("fs");

const allFileContents = fs.readFileSync("18.txt", "utf-8");

let cubes = new Map();
let bounds = {
  minX: Number.POSITIVE_INFINITY,
  minY: Number.POSITIVE_INFINITY,
  minZ: Number.POSITIVE_INFINITY,
  maxX: Number.NEGATIVE_INFINITY,
  maxY: Number.NEGATIVE_INFINITY,
  maxZ: Number.NEGATIVE_INFINITY,
};
let waysOut = new Map();

allFileContents.split(/\r?\n/).forEach((line) => {
  let [x, y, z] = line.split(",");
  bounds.minX = Math.min(bounds.minX, Number(x));
  bounds.minY = Math.min(bounds.minY, Number(y));
  bounds.minZ = Math.min(bounds.minZ, Number(z));
  bounds.maxX = Math.max(bounds.maxX, Number(x));
  bounds.maxY = Math.max(bounds.maxY, Number(y));
  bounds.maxZ = Math.max(bounds.maxZ, Number(z));
  cubes.set(`${x},${y},${z}`, [Number(x), Number(y), Number(z)]);
});
console.log(cubes);

const hasWayOut = (x, y, z) => {
  let empty = !cubes.has(`${x},${y},${z}`);
  let edge =
    x === bounds.minX ||
    x === bounds.maxX ||
    y === bounds.minY ||
    y === bounds.maxY ||
    z === bounds.minZ ||
    z === bounds.maxZ;
  let neighborOut =
    waysOut.has(`${x - 1},${y},${z}`) ||
    waysOut.has(`${x + 1},${y},${z}`) ||
    waysOut.has(`${x},${y - 1},${z}`) ||
    waysOut.has(`${x},${y + 1},${z}`) ||
    waysOut.has(`${x},${y},${z - 1}`) ||
    waysOut.has(`${x},${y},${z + 1}`);
  return waysOut.has(`${x},${y},${z}`) || (empty && (edge || neighborOut));
};

for (let x1 = bounds.minX, x2 = bounds.maxX; x1 <= x2; x1++, x2--) {
  for (let y1 = bounds.minY, y2 = bounds.maxY; y1 <= y2; y1++, y2--) {
    for (let z1 = bounds.minZ, z2 = bounds.maxZ; z1 <= z2; z1++, z2--) {
      //console.log(x1, y1, z1, hasWayOut(x1, y1, z1));
      //console.log(x2, y2, z2, hasWayOut(x2, y2, z2));
      if (hasWayOut(x1, y1, z1)) waysOut.set(`${x1},${y1},${z1}`);
      if (hasWayOut(x1, y1, z2)) waysOut.set(`${x1},${y1},${z2}`);
      if (hasWayOut(x1, y2, z1)) waysOut.set(`${x1},${y2},${z1}`);
      if (hasWayOut(x1, y2, z2)) waysOut.set(`${x1},${y2},${z2}`);
      if (hasWayOut(x2, y2, z2)) waysOut.set(`${x2},${y2},${z2}`);
      if (hasWayOut(x2, y2, z1)) waysOut.set(`${x2},${y2},${z1}`);
      if (hasWayOut(x2, y1, z1)) waysOut.set(`${x2},${y1},${z1}`);
      if (hasWayOut(x2, y1, z2)) waysOut.set(`${x2},${y1},${z2}`);
    }
  }
}

//console.log(waysOut);

let total = 0;
Array.from(cubes.values()).forEach(([x, y, z]) => {
  //console.log("loop", x, y, z);
  let faces = 6;
  // x neighbors
  if (
    x !== bounds.minX &&
    (cubes.has(`${x - 1},${y},${z}`) || !hasWayOut(x - 1, y, z))
  )
    faces--;
  if (
    x !== bounds.maxX &&
    (cubes.has(`${x + 1},${y},${z}`) || !hasWayOut(x + 1, y, z))
  )
    faces--;
  // y neighbors
  if (
    y !== bounds.minY &&
    (cubes.has(`${x},${y - 1},${z}`) || !hasWayOut(x, y - 1, z))
  )
    faces--;
  if (
    y !== bounds.maxY &&
    (cubes.has(`${x},${y + 1},${z}`) || !hasWayOut(x, y + 1, z))
  )
    faces--;
  // z neighbors
  if (
    z !== bounds.minZ &&
    (cubes.has(`${x},${y},${z - 1}`) || !hasWayOut(x, y, z - 1))
  )
    faces--;

  if (
    z !== bounds.maxZ &&
    (cubes.has(`${x},${y},${z + 1}`) || !hasWayOut(x, y, z + 1))
  )
    faces--;
  //console.log([x, y, z], faces);
  total += faces;
});

/*map.forEach((row) => {
  console.log(row.join(""));
});*/
console.log(bounds, total);
/**/
