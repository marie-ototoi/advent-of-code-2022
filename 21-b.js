const fs = require("fs");

let numbers = new Map();
let additions = new Map();
let substractions = new Map();
let multiplications = new Map();
let divisions = new Map();
let rootSides = [];
const allFileContents = fs.readFileSync("21.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  const reglineNumber = /^([a-z]{4}): ([0-9]{1,})/g;
  const reglineOperation = /^([a-z]{4}): ([a-z]{4}) ([+-/*]{1}) ([a-z]{4})/g;
  if (line.match(reglineNumber)) {
    let [, monkeyName, value] = line.matchAll(reglineNumber).next().value;
    if (monkeyName !== "humn") {
      numbers.set(monkeyName, Number(value));
    }
  } else if (line.match(reglineOperation)) {
    let [, monkeyName, f1, op, f2] = line
      .matchAll(reglineOperation)
      .next().value;
    if (monkeyName === "root") {
      rootSides.push(f1, f2);
    } else if (op === "+") {
      additions.set(monkeyName, [f1, f2]);
    } else if (op === "-") {
      substractions.set(monkeyName, [f1, f2]);
    } else if (op === "*") {
      multiplications.set(monkeyName, [f1, f2]);
    } else if (op === "/") {
      divisions.set(monkeyName, [f1, f2]);
    }
  }
});
let human = 0;
const traverse = (monkey) => {
  if (numbers.has(monkey)) return numbers.get(monkey);
  if (monkey === "humn") {
    //console.log({ human });
    return human;
  }
  if (additions.has(monkey)) {
    let [f1, f2] = additions.get(monkey);
    return traverse(f1) + traverse(f2);
  } else if (substractions.has(monkey)) {
    let [f1, f2] = substractions.get(monkey);
    return traverse(f1) - traverse(f2);
  } else if (multiplications.has(monkey)) {
    let [f1, f2] = multiplications.get(monkey);
    return traverse(f1) * traverse(f2);
  } else if (divisions.has(monkey)) {
    let [f1, f2] = divisions.get(monkey);
    return traverse(f1) / traverse(f2);
  }
};

//console.log({ numbers, additions, substractions, multiplications, divisions });
let limit1;
let limit2;

while (limit1 === undefined || limit2 === undefined) {
  let traverseLeft = traverse(rootSides[0]);
  let traverseRight = traverse(rootSides[1]);
  console.log({ traverseLeft, traverseRight, limit1, limit2 });
  if (traverseLeft > traverseRight) {
    limit1 = human;
  } else if (traverseLeft < traverseRight) {
    limit2 = human;
  } else {
    limit1 = limit2 = human;
    console.log("c'est bon on a trouvé");
  }
  human += 100000000000;
}

console.log({ limit1, limit2 });
// when we have limits, search middle

while (limit1 !== limit2) {
  if (limit1 > limit2) {
    human = limit2 + Math.round((limit1 - limit2) / 2);
  } else {
    human = limit1 + Math.round((limit2 - limit1) / 2);
  }
  let traverseLeft = traverse(rootSides[0]);
  let traverseRight = traverse(rootSides[1]);
  if (traverseLeft > traverseRight) {
    limit1 = human;
  } else if (traverseLeft < traverseRight) {
    limit2 = human;
  } else {
    limit1 = limit2 = human;
    console.log("c'est bon on a trouvé");
  }
  console.log({ limit1, limit2, traverseLeft, traverseRight, human });
}

//console.log(traverse("root"));

console.log({ human });
