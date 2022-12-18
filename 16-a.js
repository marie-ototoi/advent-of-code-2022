const fs = require("fs");

const allFileContents = fs.readFileSync("16.txt", "utf-8");

let valves = new Map();

let toOpen = 0;
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

let queue = [["AA", 31, 0, {}, {}]];
let maxFlow = 0;

while (queue.length) {
  let nextQueue = [];

  for (let i = 0; i < queue.length; i++) {
    let [valveId, totalMinutes, totalFlow, open, lastVisitedScore] = queue[i];

    let { flowRate, neighbors } = valves.get(valveId);

    maxFlow = Math.max(maxFlow, totalFlow);
    //console.log(valveId, totalFlow, lastVisitedScore[valveId]);
    //if (totalFlow <= lastVisitedScore[valveId]) console.log("quit", queue[i]);
    const opened = Object.keys(open).reduce(
      (acc, cur) => acc + valves.get(cur).flowRate,
      0
    );
    const maxWin = (toOpen - opened) * (totalMinutes - 2);

    const stillPossible = totalFlow + maxWin > maxFlow;
    if (
      stillPossible &&
      totalMinutes > 0 &&
      (lastVisitedScore[valveId] === undefined ||
        totalFlow > lastVisitedScore[valveId])
    ) {
      neighbors.forEach((neighbor) => {
        // either open the valve if not already open
        if (!open[valveId] && flowRate > 0) {
          nextQueue.push([
            neighbor,
            totalMinutes - 2,
            totalFlow + flowRate * (totalMinutes - 2),
            { ...open, [valveId]: true },
            {
              ...lastVisitedScore,
              [valveId]: totalFlow + flowRate * (totalMinutes - 2),
            },
          ]);
        }
        // or move to next valve
        nextQueue.push([
          neighbor,
          totalMinutes - 1,
          totalFlow,
          open,
          {
            ...lastVisitedScore,
            [valveId]: totalFlow,
          },
        ]);
      });
    }
  }

  queue = nextQueue;
  //console.log(queue);
}
console.log(maxFlow);
