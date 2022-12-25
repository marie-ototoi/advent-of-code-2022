const fs = require("fs");

const allFileContents = fs.readFileSync("16.txt", "utf-8");

let valves = new Map();

allFileContents.split(/\r?\n/).forEach((line) => {
  const regline =
    /^Valve ([A-Z]{2}) has flow rate=([0-9]{1,}); tunnel[s]{0,1} lead[s]{0,1} to valve[s]{0,1} ([A-Z,\s]{1,})/g;
  const [, valveId, flowRate, neighbors] = line.matchAll(regline).next().value;
  if (flowRate > 0) toOpen += Number(flowRate);
  valves.set(valveId, {
    flowRate: Number(flowRate),
    neighbors: neighbors.split(", "),
  });
});

let valvesToOpen = Array.from(valves.entries())
  .filter(([, value]) => value.flowRate > 0)
  .sort((a, b) => b[1].flowRate - a[1].flowRate)
  .map(([key]) => key);
valvesToOpen.forEach((v, i) => {
  valves.set(v, { ...valves.get(v), rank: i });
});

const memoPathLength = new Map();
const findPathLength = (v1, v2) => {
  if (memoPathLength.has(`${v1},${v2}`))
    return memoPathLength.get(`${v1},${v2}`);

  let minSteps = Number.POSITIVE_INFINITY;
  let seen = new Map();
  const traverse = (node, steps) => {
    if (node === v2) {
      minSteps = Math.min(steps, minSteps);
      return;
    }
    if (steps > minSteps) return;
    if (seen.has(node)) return;
    seen.set(node);
    let neighbors = valves.get(node).neighbors;
    neighbors.forEach((neighbor) => {
      traverse(neighbor, steps + 1);
    });
  };
  traverse(v1, 0);
  memoPathLength.set(`${v1},${v2}`, minSteps);
  memoPathLength.set(`${v2},${v1}`, minSteps);
  return minSteps;
};

let memoCombinations = new Map();

let maxFlow = Number.NEGATIVE_INFINITY;
const traverse = (node, totalFlow, minutesLeft, opened) => {
  maxFlow = Math.max(maxFlow, totalFlow);
  const op = opened.sort((a, b) => a.localeCompare(b)).join(",");
  if (!memoCombinations.has(op) || memoCombinations.get(op) < totalFlow)
    memoCombinations.set(op, totalFlow);
  //console.log({ node, totalFlow, minutesLeft, opened });
  valvesToOpen.forEach((neighbor) => {
    if (neighbor !== node && !opened.includes(neighbor)) {
      let neighborInfo = valves.get(neighbor);
      if (neighborInfo.flowRate > 0) {
        let pathLength = findPathLength(node, neighbor);
        if (minutesLeft > pathLength + 1) {
          let open = traverse(
            neighbor,
            totalFlow + neighborInfo.flowRate * (minutesLeft - pathLength - 1),
            minutesLeft - pathLength - 1,
            [...opened, neighbor]
          );
        }
      }
    }
  });
};

const getBestCombinationFromValves = (arr) => {
  let bestComb = Number.NEGATIVE_INFINITY;
  const permutations = permute(arr);
  console.log(permutations);
  for (let i = 0; i < permutations.length; i++) {
    let permutation = permutations[i].sort((a, b) => a.localeCompare(b));
    // full array
    if (memoCombinations.has(permutation.join(","))) {
      bestComb = memoCombinations.get(permutation.join(","));
    }
    let longestComb;
    // subsets
    let comb = [...permutation.slice(0, i), ...permutation.slice(i + j)];
    while (!longestComb && comb.length > 0) {
      if (memoCombinations.has(comb.join(","))) {
        longestComb = memoCombinations.get(comb.join(","));
      } else {
        comb.pop();
      }
    }
    if (longestComb > bestComb) {
      console.log(permutation.join(","), { comb });
    }
    bestComb = Math.max(bestComb, longestComb);
  }

  return bestComb;
};

const getComplementary = (combination) => {
  let complementary = [];
  valvesToOpen.forEach((v) => {
    if (!combination.includes(v)) complementary.push(v);
  });
  complementary.sort((a, b) => a.localeCompare(b));
  return complementary;
};

traverse("AA", 0, 26, []);
console.log(maxFlow, memoCombinations.size);

let maxDoubleFlow = Number.NEGATIVE_INFINITY;
Array.from(memoCombinations.entries()).forEach(([key, flow]) => {
  let combination = key.split(",");
  let maxComplementary = Number.NEGATIVE_INFINITY;
  Array.from(memoCombinations.entries()).forEach(([ckey, cflow]) => {
    let ccombination = ckey.split(",");
    let ok = true;
    for (let i = 0; i < ccombination.length; i++) {
      if (combination.includes(ccombination[i])) {
        ok = false;
        break;
      }
    }
    if (ok) {
      maxComplementary = Math.max(maxComplementary, cflow);
    }
  });
  maxDoubleFlow = Math.max(maxDoubleFlow, flow + maxComplementary);
});
console.log({ maxDoubleFlow });
