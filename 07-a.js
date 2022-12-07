const fs = require("fs");

const allFileContents = fs.readFileSync("07.txt", "utf-8");

class Directory {
  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.children = [];
    this.childrenMap = new Map();
    this.files = [];
  }

  addChild(directory) {
    this.childrenMap.set(directory.name, directory);
    this.children.push(directory);
    //console.log(this.children);
  }
  addFile(file, size) {
    this.files.push({ file, size });
  }
}

let sum = 0;
let graph;
let currentDir;

// create graph from file
allFileContents.split(/\r?\n/).forEach((line) => {
  const regcd = /^\$\scd/;
  const regdir = /^dir\s[a-z]{1,}/;
  //const regdirsinglefile = /^([0-9]{1,})\s([a-z]{1,})[.]{1,}([a-z]{1,})/g;
  const regfile = /^([0-9]{1,})\s([a-z.]{1,})/g;

  if (line.match(regdir)) {
    // create new directory
    currentDir.addChild(new Directory(line.substring(4), currentDir));
  } else if (line.match(regcd)) {
    // change directory
    let dir = line.substring(5);
    // if first time, initialise graph
    if (dir === "/") {
      graph = new Directory("/", null);
      currentDir = graph;
    } else if (dir === "..") {
      currentDir = currentDir.parent;
    } else {
      currentDir = currentDir.childrenMap.get(dir);
    }
    // file
  } else if (line.match(regfile)) {
    const match = line.matchAll(regfile).next();
    const size = Number(match.value[1]);
    const file = match.value[2];
    currentDir.addFile(file, size);
  }
});

const traverse = (node) => {
  const filesize = node.files.reduce((acc, cur) => acc + cur.size, 0);
  let dirsize = 0;
  node.children.forEach((n) => {
    dirsize += traverse(n);
  });
  //console.log(node.name, filesize, dirsize);
  let total = filesize + dirsize;
  if (total < 100000) {
    console.log(node.name, filesize, dirsize, total);
    sum += total;
  }
  return total;
};
traverse(graph);
//console.log(graph.childrenMap.get("a"));
console.log(sum);
