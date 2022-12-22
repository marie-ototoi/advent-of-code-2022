const fs = require("fs");

const allFileContents = fs.readFileSync("20.txt", "utf-8");
function ListNode(val, previous, next) {
  this.val = val === undefined ? 0 : val;
  this.moved = false;
  this.next = next === undefined ? null : next;
  this.previous = previous === undefined ? null : previous;
}

//console.log(currentNode.val);
const getList = (list) => {
  const l = [list.val];
  let h = list;
  while (h.next) {
    h = h.next;
    l.push(h.val);
  }
  console.log(l.length);
  return l;
};

let head;
let currentNode;
let count = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  let node = new ListNode(Number(line), currentNode);
  if (currentNode) currentNode.next = node;
  if (count === 0) head = node;
  currentNode = node;
  count++;
});

let tail = currentNode;
currentNode = head;

let nodeToSwap;
let countMoved = 0;

while (countMoved < count) {
  let val = currentNode.val;
  //console.log(val);
  if (!currentNode.moved) {
    nodeToSwap = currentNode;

    if (val === 0) {
      console.log("STTTTOOOOP", countMoved);
      // do nothing
      currentNode.moved = true;
      currentNode = currentNode.next;
    } else {
      let currentNodeNext = currentNode.next;
      let currentNodePrevious = currentNode.previous;
      if (val < 0) {
        // move left
        //console.log({ val }, "av");
        while (Math.abs(val) >= count) val += count - 1;
        //console.log({ val }, "ap");
        if (Math.abs(val) === count - 1) {
          currentNode.moved = true;
        } else {
          let move = 0;
          while (move < Math.abs(val)) {
            if (nodeToSwap.previous) {
              nodeToSwap = nodeToSwap.previous;
            } else {
              nodeToSwap = tail;
            }
            move++;
          }
          let nodeToSwapPrevious = nodeToSwap.previous;
          nodeToSwap.previous = currentNode;
          currentNode.next = nodeToSwap;
          currentNode.previous = nodeToSwapPrevious;
          if (nodeToSwapPrevious) nodeToSwapPrevious.next = currentNode;
          // si le noeud a déplacer n'était pas le dernier
          if (currentNodeNext) {
            currentNodeNext.previous = currentNodePrevious;
          } else {
            tail = currentNodePrevious;
          }
          // si le noeud a déplacer n'était pas le premier
          if (currentNodePrevious) {
            currentNodePrevious.next = currentNodeNext;
          } else {
            head = currentNodeNext;
          }
          // si le noeud a déplacer devient le premier, il part à la fin
          if (!currentNode.previous) {
            head = currentNode.next;
            head.previous = null;
            tail.next = currentNode;
            currentNode.next = null;
            currentNode.previous = tail;
            tail = currentNode;
          }
        }
      } else if (val > 0) {
        // move right
        //console.log(val);
        while (val >= count) val -= count - 1;
        if (val === count - 1) {
          currentNode.moved = true;
        } else {
          //console.log(val);
          let move = 0;
          while (move < val) {
            if (nodeToSwap.next) {
              nodeToSwap = nodeToSwap.next;
            } else {
              nodeToSwap = head;
            }
            move++;
          }
          let nodeToSwapNext = nodeToSwap.next;
          nodeToSwap.next = currentNode;
          currentNode.previous = nodeToSwap;
          currentNode.next = nodeToSwapNext;
          if (nodeToSwapNext) nodeToSwapNext.previous = currentNode;
          // si le noeud a déplacer n'était pas le dernier
          if (currentNodeNext) {
            currentNodeNext.previous = currentNodePrevious;
          } else {
            tail = currentNodePrevious;
          }
          // si le noeud a déplacer n'était pas le premier
          if (currentNodePrevious) {
            currentNodePrevious.next = currentNodeNext;
          } else {
            head = currentNodeNext;
          }
          // si le noeud a déplacer devient le dernier, il part au début

          if (!currentNode.next) {
            tail = currentNode.previous;
            tail.next = null;
            head.previous = currentNode;
            currentNode.next = head;
            currentNode.previous = null;
            head = currentNode;
          }
        }
      }

      currentNode.moved = true;
      currentNode = currentNodeNext;
    }
    countMoved++;
  } else {
    currentNode = currentNode.next;
  }
}

const getIndex = (list, index) => {
  let h = list;
  let i = 0;
  while (i < index) {
    if (h.next) {
      h = h.next;
    } else {
      h = head;
    }
    i++;
  }
  return h.val;
};
console.log(getList(head));
//console.log(getIndex(head, 2744 + 3000));

let firstOffset = 1000 % count;
let secondOffset = 2000 % count;
let thirdOffset = 3000 % count;

console.log({ firstOffset, secondOffset, thirdOffset });
let numbers = [];
let start = false;
currentNode = head;
let i = 0;
while (!start) {
  if (currentNode.val === 0) {
    start = true;
    console.log(i);
  } else {
    currentNode = currentNode.next;
  }
  i++;
}

let iterate = 0;
while (numbers.length < 3) {
  if (iterate === firstOffset) {
    numbers.push(currentNode.val);
  }
  if (iterate === secondOffset) {
    numbers.push(currentNode.val);
  }
  if (iterate === thirdOffset) {
    numbers.push(currentNode.val);
  }
  if (currentNode.next) {
    currentNode = currentNode.next;
  } else {
    currentNode = head;
  }
  iterate++;
}
console.log(
  numbers,
  numbers.reduce((acc, cur) => acc + cur, 0)
);
