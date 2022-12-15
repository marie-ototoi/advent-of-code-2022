const fs = require("fs");

const allFileContents = fs.readFileSync("15.txt", "utf-8");

let beacons = new Map();
let sensors = new Map();

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
    if (inRange(row, rangeY)) {
      rangesX.push([x - (distance - diff), x + (distance - diff)]);
    }
  });
  rangesX = rangesX.reduce((acc, cur) => reduceRange(cur, acc), [undefined]);
  rangesX = rangesX.reduce((acc, cur) => reduceRange(cur, acc), [undefined]);
  rangesX.forEach((range) => {
    total += range[1] - range[0] + 1;
    const checkBeacons = beacons.get(row);
    if (checkBeacons) {
      Array.from(checkBeacons.keys()).forEach((beacon) => {
        if (beacon >= range[0] && beacon <= range[1]) {
          total--;
        }
      });
    }
  });
  return total;
};

console.log(countNoBeacons(2000000));
