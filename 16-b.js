const fs = require("fs");

const allFileContents = fs.readFileSync("16.txt", "utf-8");

let valves = new Map();

let toOpen = [0, 0];
allFileContents.split(/\r?\n/).forEach((line) => {
  const regline =
    /^Valve ([A-Z]{2}) has flow rate=([0-9]{1,}); tunnel[s]{0,1} lead[s]{0,1} to valve[s]{0,1} ([A-Z,\s]{1,})/g;
  const [, valveId, flowRate, neighbors] = line.matchAll(regline).next().value;
  if (flowRate > 0) {
    toOpen[0] += Number(flowRate);
    toOpen[1]++;
  }
  valves.set(valveId, {
    flowRate: Number(flowRate),
    neighbors: neighbors.split(", "),
  });
});

let queue = [["AA", "AA", 27, 27, 0, {}, {}]];
let maxFlow = 0;

while (queue.length) {
  let nextQueue = [];

  for (let i = 0; i < queue.length; i++) {
    let [
      valveId1,
      valveId2,
      totalMinutes1,
      totalMinutes2,
      totalFlow,
      open,
      lastVisitedScore,
    ] = queue[i];

    let { flowRate: flowRate1, neighbors: neighbors1 } = valves.get(valveId1);
    let { flowRate: flowRate2, neighbors: neighbors2 } = valves.get(valveId2);

    maxFlow = Math.max(maxFlow, totalFlow);
    //console.log(valveId1, valveId2);
    //if (totalFlow <= lastVisitedScore[valveId]) console.log("quit", queue[i]);
    const opened = Object.keys(open).reduce(
      (acc, cur) => acc + valves.get(cur).flowRate,
      0
    );
    const maxWin =
      (toOpen[0] - opened) * (Math.max(totalMinutes1, totalMinutes2) - 2);

    const stillPossible =
      totalFlow + maxWin > maxFlow && Object.keys(open).length < toOpen[1];
    if (
      stillPossible &&
      (totalMinutes1 > 10 || totalMinutes2 > 10) &&
      (lastVisitedScore[`${valveId1}${valveId2}`] === undefined ||
        totalFlow > lastVisitedScore[`${valveId1}${valveId2}`])
    ) {
      // console.log("neigbors ok");
      const done = {};
      neighbors1.forEach((neighbor1) => {
        neighbors2.forEach((neighbor2) => {
          if (neighbor1 !== neighbor2 && !done[`${neighbor1}${neighbor2}`]) {
            done[`${neighbor1}${neighbor2}`] = true;
            done[`${neighbor2}${neighbor1}`] = true;
            // open both valves
            if (
              !open[valveId1] &&
              flowRate1 > 0 &&
              totalMinutes1 > 2 &&
              !open[valveId2] &&
              flowRate2 > 0 &&
              totalMinutes2 > 2
            ) {
              let addedFlow =
                flowRate1 * (totalMinutes1 - 2) +
                flowRate2 * (totalMinutes2 - 2);
              if (
                lastVisitedScore[`${neighbor1}${neighbor2}`] === undefined ||
                totalFlow + addedFlow >
                  lastVisitedScore[`${neighbor1}${neighbor2}`]
              ) {
                nextQueue.push([
                  neighbor1,
                  neighbor2,
                  totalMinutes1 - 2,
                  totalMinutes2 - 2,
                  totalFlow + addedFlow,
                  { ...open, [valveId1]: true, [valveId2]: true },
                  {
                    ...lastVisitedScore,
                    [`${valveId1}${valveId2}`]: totalFlow + addedFlow,
                    [`${valveId2}${valveId1}`]: totalFlow + addedFlow,
                  },
                ]);
              }
            }
            // open only valve 1
            if (!open[valveId1] && flowRate1 > 0 && totalMinutes1 > 2) {
              let addedFlow = flowRate1 * (totalMinutes1 - 2);
              if (
                lastVisitedScore[`${neighbor1}${neighbor2}`] === undefined ||
                totalFlow + addedFlow >
                  lastVisitedScore[`${neighbor1}${neighbor2}`]
              ) {
                nextQueue.push([
                  neighbor1,
                  neighbor2,
                  totalMinutes1 - 2,
                  totalMinutes2 - 1,
                  totalFlow + addedFlow,
                  { ...open, [valveId1]: true },
                  {
                    ...lastVisitedScore,
                    [`${valveId1}${valveId2}`]: totalFlow + addedFlow,
                    [`${valveId2}${valveId1}`]: totalFlow + addedFlow,
                  },
                ]);
              }
            }
            // open only valve 2
            if (!open[valveId2] && flowRate2 > 0 && totalMinutes2 > 2) {
              let addedFlow = flowRate2 * (totalMinutes2 - 2);
              if (
                lastVisitedScore[`${neighbor1}${neighbor2}`] === undefined ||
                totalFlow + addedFlow >
                  lastVisitedScore[`${neighbor1}${neighbor2}`]
              ) {
                nextQueue.push([
                  neighbor1,
                  neighbor2,
                  totalMinutes1 - 1,
                  totalMinutes2 - 2,
                  totalFlow + addedFlow,
                  { ...open, [valveId2]: true },
                  {
                    ...lastVisitedScore,
                    [`${valveId1}${valveId2}`]: totalFlow + addedFlow,
                    [`${valveId2}${valveId1}`]: totalFlow + addedFlow,
                  },
                ]);
              }
            }
            if (
              lastVisitedScore[`${neighbor1}${neighbor2}`] === undefined ||
              totalFlow > lastVisitedScore[`${neighbor1}${neighbor2}`]
            ) {
              // open no valve
              nextQueue.push([
                neighbor1,
                neighbor2,
                totalMinutes1 - 1,
                totalMinutes2 - 1,
                totalFlow,
                open,
                {
                  ...lastVisitedScore,
                  [`${valveId1}${valveId2}`]: totalFlow,
                  [`${valveId2}${valveId1}`]: totalFlow,
                },
              ]);
            }
          }
        });
      });
    }
  }

  queue = nextQueue;
  //console.log(queue);
}
console.log(maxFlow);
