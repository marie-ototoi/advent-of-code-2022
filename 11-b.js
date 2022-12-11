const fs = require("fs");

const allFileContents = fs.readFileSync("11.txt", "utf-8");

class Monkey {
  static totalWorryLevelProduct = 1;
  constructor(index) {
    this.index = index;
    this.items = [];
    this.inspected = 0;
  }

  addItem(item) {
    this.items.push(item);
  }
  removeItem(item) {
    this.items.shift();
  }
  addTargetLevel(level) {
    this.targetLevel = level;
    this.constructor.totalWorryLevelProduct *= level;
  }
  addOperation(operation) {
    const [operand, factor] = operation.split(" ");
    this.operand = operand;
    this.factor = factor === "old" ? "old" : Number(factor);
  }
  inspectItem(item) {
    let res;
    if (this.operand === "*") {
      res = item * (this.factor === "old" ? item : this.factor);
    } else if (this.operand === "+") {
      res = item + (this.factor === "old" ? item : this.factor);
    } else if (this.operand === "/") {
      res = item / (this.factor === "old" ? item : this.factor);
    } else if (this.operand === "-") {
      res = item - (this.factor === "old" ? item : this.factor);
    }
    while (res > Monkey.totalWorryLevelProduct)
      res -= Monkey.totalWorryLevelProduct;
    return Math.floor(res);
  }
  addTargetMonkey(targetMonkey, isDivided) {
    if (isDivided) {
      this.targetMonkeyTrue = targetMonkey;
    } else {
      this.targetMonkeyFalse = targetMonkey;
    }
  }
  inspectItemAndSelectMonkey(item) {
    this.inspected++;
    const inspectedItem = this.inspectItem(item);
    if (inspectedItem % this.targetLevel === 0) {
      return [inspectedItem, this.targetMonkeyTrue];
    } else {
      return [inspectedItem, this.targetMonkeyFalse];
    }
  }
}
let monkeys = new Map();
let currentMonkey;
let cycle = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  if (cycle === 0) {
    let [, index] = line.split("Monkey ");
    [index] = index.split(":");
    monkeys.set(index, new Monkey(index));
    currentMonkey = index;
  } else if (cycle === 1) {
    let [, items] = line.split("  Starting items: ");
    items = items.split(",");
    items.forEach((item) => {
      monkeys.get(currentMonkey).addItem(Number(item));
    });
  } else if (cycle === 2) {
    let [, operation] = line.split("  Operation: new = old ");
    monkeys.get(currentMonkey).addOperation(operation);
  } else if (cycle === 3) {
    let [, target] = line.split("  Test: divisible by ");
    monkeys.get(currentMonkey).addTargetLevel(Number(target));
  } else if (cycle === 4) {
    let [, monkey] = line.split("    If true: throw to monkey ");
    monkeys.get(currentMonkey).addTargetMonkey(monkey, true);
  } else if (cycle === 5) {
    let [, monkey] = line.split("    If false: throw to monkey ");
    monkeys.get(currentMonkey).addTargetMonkey(monkey, false);
  }
  if (cycle < 6) {
    cycle++;
  } else {
    cycle = 0;
  }
  //console.log(previousCycle, cycle, X, sum, nextTarget);
});
//console.log(monkeys);
let round = 0;
while (round < 10000) {
  const iterate = Array.from(monkeys.entries());
  for (let i = 0; i < iterate.length; i++) {
    let [key, monkey] = iterate[i];
    let j = monkey.items.length;
    while (j > 0) {
      let item = monkey.items[0];
      let [newItem, newMonkey] = monkey.inspectItemAndSelectMonkey(item);
      monkeys.get(newMonkey).addItem(newItem);
      monkey.removeItem(item);
      j--;
      //console.log(j, monkeys);
    }
  }
  round++;
}
const sortedInspected = Array.from(monkeys.values())
  .map((v) => v.inspected)
  .sort((a, b) => b - a);
//console.log(Monkey.totalWorryLevelProduct);
//console.log(sortedInspected);
console.log(sortedInspected[0] * sortedInspected[1]);
