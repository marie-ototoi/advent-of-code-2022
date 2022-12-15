const fs = require("fs");

const allFileContents = fs.readFileSync("15.txt", "utf-8");

let beacons = new Map();
let sensors = new Map();
let limitX = 4000000,
  limitY = 4000000;

allFileContents.split(/\r?\n/).forEach((line) => {
  const [sensorSentence, beaconSentence] = line.split(
    ": closest beacon is at x="
  );
  let [sensorXSentence, sY] = sensorSentence.split(", y=");
  let [, sX] = sensorXSentence.split("Sensor at x=");
  sX = Number(sX);
  sY = Number(sY);
  let [bX, bY] = beaconSentence.split(", y=");
  bX = Number(bX);
  bY = Number(bY);
  if (!beacons.has(bY)) beacons.set(bY, new Map());
  beacons.get(bY).set(bX);
  let distanceX = Math.abs(bX - sX);
  let distanceY = Math.abs(bY - sY);
  let distance = distanceX + distanceY;
  sensors.set(`${sX},${sY}`, distance);
});

const mergeRanges = (range1, range2) => {
  if (!range1) return [range2];
  if (!range2) return [range1];
  const first = range1[0] < range2[0] ? range1 : range2;
  const second = range1[0] < range2[0] ? range2 : range1;
  if (first[1] + 1 < second[0]) return [first, second];
  if (first[1] > second[1]) return [first];
  return [[first[0], second[1]]];
};

const inRange = (n, range) => {
  return n >= range[0] && n <= range[1];
};

const reduceRange = (range, ranges) => {
  let res = [];
  let isMerged = false;
  ranges.forEach((r) => {
    let merged = mergeRanges(r, range);
    if (merged.length === 1) {
      res.push(...merged);
      isMerged = true;
    } else {
      res.push(r);
    }
  });
  if (!isMerged) res.push(range);
  return res;
};

const countNoBeacons = (row) => {
  let total = 0;
  let rangesX = [];
  Array.from(sensors.entries()).forEach(([key, distance]) => {
    let [x, y] = key.split(",");
    x = Number(x);
    y = Number(y);
    let rangeY = [y - distance, y + distance];
    let diff = Math.abs(row - y);

    let startRange = Math.max(0, x - Math.abs(distance - diff));
    let endRange = Math.min(limitX, x + Math.abs(distance - diff));
    if (inRange(row, rangeY)) {
      rangesX.push([startRange, endRange]);
    }
  });
  rangesX = rangesX.reduce((acc, cur) => reduceRange(cur, acc), [undefined]);
  rangesX = rangesX.reduce((acc, cur) => reduceRange(cur, acc), [undefined]);
  rangesX = rangesX.filter((range) => range !== undefined);
  rangesX.forEach((range) => {
    total += range[1] - range[0] + 1;
  });
  return [total, rangesX];
};
let find;
for (let i = 0; i < limitY; i++) {
  let count = countNoBeacons(i);
  if (count[0] < limitX + 1) {
    if (count[1].length > 0) {
      sorted = [...count[1]].sort((a, b) => a[0] < b[0]);
      let x = sorted[0][1] + 1;
      //find = [x, i];
      find = x * 4000000 + i;
    }
  }
}
console.log(find);
