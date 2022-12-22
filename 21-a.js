const fs = require("fs");

let numbers = new Map();
let additions = new Map();
let substractions = new Map();
let multiplications = new Map();
let divisions = new Map();

const allFileContents = fs.readFileSync("21.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  const reglineNumber = /^([a-z]{4}): ([0-9]{1,})/g;
  const reglineOperation = /^([a-z]{4}): ([a-z]{4}) ([+-/*]{1}) ([a-z]{4})/g;
  if (line.match(reglineNumber)) {
    let [, monkeyName, value] = line.matchAll(reglineNumber).next().value;
    numbers.set(monkeyName, Number(value));
  } else if (line.match(reglineOperation)) {
    let [, monkeyName, f1, op, f2] = line
      .matchAll(reglineOperation)
      .next().value;
    if (op === "+") {
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

const traverse = (monkey) => {
  if (numbers.has(monkey)) return numbers.get(monkey);

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

console.log(traverse("root"));
