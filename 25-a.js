const fs = require("fs");

let sum = 0;

const decipherNumber = (str) => {
  let total = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    let n;
    if (str[i] === "-") {
      n = -1;
    } else if (str[i] === "=") {
      n = -2;
    } else {
      n = Number(str[i]);
    }
    //console.log(i, str[i], 5 ** i * n);
    total += 5 ** (str.length - 1 - i) * n;
  }
  return total;
};

const getMaxDown = (n) => {
  let total = 0;
  while (n >= 0) {
    total += 2 * 5 ** n;
    n--;
  }
  return total;
};

//console.log(getMaxDown(3));

let table = new Map();
table.set(2, "2");
table.set(1, "1");
table.set(0, "0");
table.set(-1, "-");
table.set(-2, "=");

const cipherNumber = (num) => {
  let n = 0;
  while (num > getMaxDown(n)) {
    n++;
  }
  let factors = [];
  let rest = num;
  for (let i = n; i >= 0; i--) {
    let f = Math.round(rest / 5 ** i);
    if (f > 2) {
      f = 2;
    } else if (f < -2) {
      f = -2;
    }
    factors.push(f);
    rest -= f * 5 ** i;
  }
  return factors.map((f) => table.get(f)).join("");
};

/*console.log(cipherNumber(1747));
console.log(cipherNumber(906));
console.log(cipherNumber(198));
console.log(cipherNumber(11));
console.log(cipherNumber(201));
console.log(cipherNumber(31));
console.log(cipherNumber(1257));
console.log(cipherNumber(32));
console.log(cipherNumber(353));
console.log(cipherNumber(107));
console.log(cipherNumber(7));
console.log(cipherNumber(3));
console.log(cipherNumber(37));*/
/*console.log(decipherNumber("1=-0-2"));
console.log(decipherNumber("12111"));
console.log(decipherNumber("2=0="));
console.log(decipherNumber("21"));
console.log(decipherNumber("2=01"));
console.log(decipherNumber("111"));
console.log(decipherNumber("20012"));
console.log(decipherNumber("112"));
console.log(decipherNumber("1=-1="));
console.log(decipherNumber("1-12"));
console.log(decipherNumber("12"));
console.log(decipherNumber("1="));
console.log(decipherNumber("122"));*/

const allFileContents = fs.readFileSync("25.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  //console.log(line);
  sum += decipherNumber(line);
});

console.log(sum, cipherNumber(sum));

//console.log(decipherNumber("20"));
//console.log(decipherNumber("2="));
//console.log(decipherNumber("2=-01"));
//console.log(decipherNumber("1121-1110-1=0"));
