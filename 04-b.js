const fs = require("fs");

const allFileContents = fs.readFileSync("04.txt", "utf-8");

let sum = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  let [elf1, elf2] = line.split(",");
  elf1 = elf1.split("-").map((c) => Number(c));
  elf2 = elf2.split("-").map((c) => Number(c));
  if (
    (elf1[0] >= elf2[0] && elf1[0] <= elf2[1]) ||
    (elf2[0] >= elf1[0] && elf2[0] <= elf1[1])
  ) {
    console.log(
      elf1,
      elf2,
      elf1[0] >= elf2[0] && elf1[0] <= elf2[1],
      elf2[0] >= elf1[0] && elf2[0] <= elf1[1]
    );
    sum++;
  }
});

console.log("END", sum);
