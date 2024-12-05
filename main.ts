import fs from "node:fs/promises";
import { day5 } from "./day5";
import { fail } from "./utils";
import { day4 } from "./day4";

async function day1() {
  const input = await fs.readFile("input-d01.txt", "utf-8");
  const lines = input.split("\n").filter((line) => line !== "");

  const leftCol = [];
  const rightCol = [];
  for (const line of lines) {
    const [left, right] = line.split("   ");
    leftCol.push(parseInt(left, 10));
    rightCol.push(parseInt(right, 10));
  }

  const sortedLeftCol = leftCol.slice().sort((a, b) => a - b);
  const sortedRightCol = rightCol.slice().sort((a, b) => a - b);

  console.log(sortedLeftCol);
  console.log(sortedRightCol);

  if (sortedLeftCol.length !== sortedRightCol.length) {
    throw new Error("columns have different lengths!");
  }

  // part 1
  // const distances = [];
  // for (let index = 0; index < sortedLeftCol.length; index++) {
  //   const leftElement = sortedLeftCol[index];
  //   const rightElement = sortedRightCol[index];
  //   distances.push(Math.abs(leftElement - rightElement));
  // }

  // return distances.reduce((prev, curr) => prev + curr, 0);

  // part 2
  const similarities = [];
  for (const number of sortedLeftCol) {
    similarities.push(number * rightCol.filter((num) => num === number).length);
  }
  return similarities.reduce((prev, curr) => prev + curr, 0);
}

// console.log(await day1());

async function day2() {
  const input = await fs.readFile("input-d02.txt", "utf-8");
  const lines = input.split("\n").filter((line) => line !== "");

  let safeReports = 0;
  for (const line of lines) {
    const levels = line.split(" ").map(Number);
    if (checkLevels(levels)) {
      safeReports++;
    } else {
      // part 2
      for (const [index] of levels.entries()) {
        if (
          checkLevels([...levels.slice(0, index), ...levels.slice(index + 1)])
        ) {
          safeReports++;
          break;
        }
      }
    }
  }
  return safeReports;
}

// console.log(await day2());

function checkLevels(levels: number[]): boolean {
  let gradient: "inc" | "dec" | null = null;
  for (const [index, level] of levels.entries()) {
    if (index === levels.length - 1) {
      // last element, no next
      return true;
    }
    const nextLevel = levels[index + 1];
    const diff = nextLevel - level;
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      break;
    }
    if (diff > 0) {
      if (gradient === "dec") {
        break;
      }
      gradient = "inc";
    } else {
      if (gradient === "inc") {
        break;
      }
      gradient = "dec";
    }
  }
  return false;
}

async function day3(fileName: string) {
  console.log("\n", fileName, "\n");
  const input = await fs.readFile(fileName, "utf-8");
  const line = input
    .split("\n")
    .filter((line) => line !== "")
    .join("");
  const mults = [];

  const ranges = [];

  const instructions = line.matchAll(
    new RegExp(String.raw`do\(\)|don't\(\)`, "gd")
  );
  for (const instructionMatch of instructions) {
    const end =
      instructionMatch.indices?.at(0)?.at(1) ??
      fail("expected do to have index");
    ranges.push({
      type: instructionMatch[0] === "do()" ? "do" : "don't",
      end,
    });
  }

  const regExp = new RegExp(String.raw`mul\((\d+),(\d+)\)`, "g");
  const results = line.matchAll(regExp);
  for (const match of results) {
    let relevantRange = ranges.findLast(
      (range) => range.end <= match.index
    ) ?? {
      type: "do",
      end: 0,
    };

    if (relevantRange.type === "do") {
      const [, left, right] = match;
      mults.push([parseInt(left), parseInt(right)]);
      continue;
    }
  }

  return mults.reduce((prev, [left, right]) => {
    return prev + left * right;
  }, 0);
}
// console.log(await day3("input-d03-example.txt"));
// console.log(await day3("input-d03.txt"));

console.log(await day4("input-d04-example.txt"));
console.log(await day4("input-d04.txt"));


console.log(await day5("input-d05-example.txt"));
console.log(await day5("input-d05.txt"));
