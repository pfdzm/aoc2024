import fs from "node:fs/promises";

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

console.log(await day1());
