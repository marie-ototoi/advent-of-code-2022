const fs = require("fs");

const allFileContents = fs.readFileSync("19.txt", "utf-8");

const maxGeodes = (iCost, iResources, iRobots, iMinutesLeft) => {
  let maxGeode = 0;
  let maxConfig;
  const play = (cost, resources, robots, minutesLeft) => {
    if (minutesLeft === 0) {
      //console.log("STOP", resources[3]);
      if (resources[3] > maxGeode) {
        maxGeode = resources[3];
        maxConfig = [resources, robots, minutesLeft];
      }
      return;
    }

    let resourcesAfter = [...resources];
    robots.forEach((robot, index) => {
      resourcesAfter[index] += robot;
    });
    // do not build any robot
    play(cost, [...resourcesAfter], [...robots], minutesLeft - 1);
    // if can build robot

    for (let i = 3; i >= 0; i--) {
      if (
        cost[i][0] <= resources[0] &&
        cost[i][1] <= resources[1] &&
        cost[i][2] <= resources[2]
      ) {
        let newRobots = [...robots];
        newRobots[i]++;
        play(
          cost,
          [
            resourcesAfter[0] - cost[i][0],
            resourcesAfter[1] - cost[i][1],
            resourcesAfter[2] - cost[i][2],
            resourcesAfter[3],
          ],
          [...newRobots],
          minutesLeft - 1
        );
        if (i === 3) break;
      }
    }
  };
  play(iCost, iResources, iRobots, iMinutesLeft);

  return maxGeode;
};
let sum = 0;
i = 0;
allFileContents.split(/\r?\n/).forEach((line) => {
  const regline =
    /^Blueprint ([0-9]{1,}): Each ore robot costs ([0-9]{1,}) ore. Each clay robot costs ([0-9]{1,}) ore. Each obsidian robot costs ([0-9]{1,}) ore and ([0-9]{1,}) clay. Each geode robot costs ([0-9]{1,}) ore and ([0-9]{1,}) obsidian/g;
  let [
    ,
    blueprintId,
    oreRobotOre,
    clayRobotOre,
    obsidianRobotOre,
    obsidianRobotClay,
    geodeRobotOre,
    geodeRobotObsidian,
  ] = line.matchAll(regline).next().value;
  blueprintId = Number(blueprintId);
  let cost = [
    [Number(oreRobotOre), 0, 0],
    [Number(clayRobotOre), 0, 0],
    [Number(obsidianRobotOre), Number(obsidianRobotClay), 0],
    [Number(geodeRobotOre), 0, Number(geodeRobotObsidian)],
  ];

  let resources = [0, 0, 0, 0];
  let robots = [1, 0, 0, 0];
  let minutesLeft = 24;

  // run them one by one in parallel in different terminals !
  if (i === 3) {
    console.log({ blueprintId, cost });
    let geodes = maxGeodes(cost, resources, robots, minutesLeft);
    console.log(blueprintId * geodes);
    sum += blueprintId * geodes;
  }
  i++;
});

console.log({ sum });
