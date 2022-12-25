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
    // collec
    if (minutesLeft < 6 && maxGeode > 0) {
      let stillPossible = resources[3] + (robots[3] + 1) * minutesLeft;
      // if we can build one more robot
      //if (maxGeode > 0) console.log({ maxGeode });
      if (stillPossible < maxGeode) return;
    }
    let resourcesAfter = [...resources];
    robots.forEach((robot, index) => {
      resourcesAfter[index] += robot;
    });

    let hasBuiltGeode = false;
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
        if (i === 3) {
          hasBuiltGeode = true;
          break;
        }
      }
    }
    // do not build any robot
    if (!hasBuiltGeode)
      play(cost, [...resourcesAfter], [...robots], minutesLeft - 1);
  };
  play(iCost, iResources, iRobots, iMinutesLeft);

  return maxGeode;
};
let res = [];
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
  let minutesLeft = 32;

  if (i === 2) {
    console.log({ blueprintId, cost });
    let geodes = maxGeodes(cost, resources, robots, minutesLeft);
    console.log(geodes);
    res.push(geodes);
  }
  i++;
});

console.log(res);
