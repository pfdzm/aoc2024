import { readFile } from "node:fs/promises";
import { fail } from "./utils";

const letters = "XMAS";
export async function day4(fileName: string) {
  console.log("\n", fileName, "\n");
  const input = await readFile(fileName, "utf-8");
  // const lines = input.split("\n").map((line) => line.split(""));

  const possibleStartLocations = [];
  const matrix = input
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => line.split(""));
  for (const [i, row] of matrix.entries()) {
    for (const [j, col] of row.entries()) {
      if (col !== "A") {
        // if (col !== "X") { // pt 1
        continue;
      }
      possibleStartLocations.push([i, j]);
    }
  }

  type Finder = (possibleStart: number[], matrix: string[][]) => boolean;

  // pt 1
  // const finders = [
  //   findLeft,
  //   findRight,
  //   findTop,
  //   findBottom,
  //   findBottomLeft,
  //   findBottomRight,
  //   findTopLeft,
  //   findTopRight,
  // ];

  // pt 2
  const findTopLeftAndBottomRight: Finder = ([row, col], matrix) => {
    if (row < 1) {
      // starting point is too far to the top
      return false;
    }
    if (col < 1) {
      // starting point is too far to the left
      return false;
    }
    if (row > matrix.length - 1 - 1) {
      // starting point is too far to the bottom
      return false;
    }
    if (col > (matrix.at(0) ?? fail("expected to find a row")).length - 1 - 1) {
      // starting point is too far to the right
      return false;
    }
    const letters = ["M", "S"];
    const topLeft = matrix[row - 1][col - 1];
    const bottomRight = matrix[row + 1][col + 1];
    if (!letters.includes(topLeft) || !letters.includes(bottomRight)) {
      return false;
    }

    switch (topLeft) {
      case "M":
        if (bottomRight !== "S") {
          return false;
        }
        return true;
      case "S":
        if (bottomRight !== "M") {
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const findTopRightAndBottomLeft: Finder = ([row, col], matrix) => {
    if (row < 1) {
      // starting point is too far to the top
      return false;
    }
    if (col > (matrix.at(0) ?? fail("expected to find a row")).length - 1 - 1) {
      // starting point is too far to the right
      return false;
    }
    if (row > matrix.length - 1 - 1) {
      // starting point is too far to the bottom
      return false;
    }
    if (col < 1) {
      // starting point is too far to the left
      return false;
    }
    const letters = ["M", "S"];
    const topRight = matrix[row - 1][col + 1];
    const bottomLeft = matrix[row + 1][col - 1];
    if (!letters.includes(topRight) || !letters.includes(bottomLeft)) {
      return false;
    }

    switch (topRight) {
      case "M":
        if (bottomLeft !== "S") {
          return false;
        }
        return true;
      case "S":
        if (bottomLeft !== "M") {
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  // pt 2
  const finders: Finder[] = [
    findTopLeftAndBottomRight,
    findTopRightAndBottomLeft,
  ];

  let matches = 0;
  for (const startLocation of possibleStartLocations) {
    matches += finders.every((find) => find(startLocation, matrix)) ? 1 : 0; // pt 2
    // .reduce((prev, curr) => prev + (curr ? 1 : 0), 0); // pt 1
  }
  return matches;
}

// left i.e. backwards
function findLeft([row, col]: number[], matrix: string[][]): boolean {
  if (col < 3) {
    // starting point is too far to the left
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row][col - i] !== letters[i]) {
      return false;
    }
  }
  console.log("findLeft", [row, col]);
  return true;
}

function findRight([row, col]: number[], matrix: string[][]): boolean {
  if (col > (matrix.at(0) ?? fail("expected to find a row")).length - 1 - 3) {
    // starting point is too far to the right
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row][col + i] !== letters[i]) {
      return false;
    }
  }
  console.log("foundRight", [row, col]);
  return true;
}

function findTop([row, col]: number[], matrix: string[][]): boolean {
  if (row < 3) {
    // starting point is too far to the top
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row - i][col] !== letters[i]) {
      return false;
    }
  }
  console.log("findTop", [row, col]);
  return true;
}

function findBottom([row, col]: number[], matrix: string[][]): boolean {
  if (row > matrix.length - 1 - 3) {
    // starting point is too far to the bottom
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row + i][col] !== letters[i]) {
      return false;
    }
  }
  console.log("findBottom", [row, col]);
  return true;
}

function findTopRight([row, col]: number[], matrix: string[][]): boolean {
  if (row < 3) {
    // starting point is too far to the top
    return false;
  }
  if (col > (matrix.at(0) ?? fail("expected to find a row")).length - 1 - 3) {
    // starting point is too far to the right
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row - i][col + i] !== letters[i]) {
      return false;
    }
  }
  console.log("findTopRight", [row, col]);
  return true;
}

function findTopLeft([row, col]: number[], matrix: string[][]): boolean {
  if (row < 3) {
    // starting point is too far to the top
    return false;
  }
  if (col < 3) {
    // starting point is too far to the left
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row - i][col - i] !== letters[i]) {
      return false;
    }
  }
  console.log("findTopLeft", [row, col]);
  return true;
}

function findBottomRight([row, col]: number[], matrix: string[][]): boolean {
  if (row > matrix.length - 1 - 3) {
    // starting point is too far to the bottom
    return false;
  }
  if (col > (matrix.at(0) ?? fail("expected to find a row")).length - 1 - 3) {
    // starting point is too far to the right
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row + i][col + i] !== letters[i]) {
      return false;
    }
  }
  console.log("findBottomRight", [row, col]);
  return true;
}

function findBottomLeft([row, col]: number[], matrix: string[][]): boolean {
  if (row > matrix.length - 1 - 3) {
    // starting point is too far to the bottom
    return false;
  }
  if (col < 3) {
    // starting point is too far to the left
    return false;
  }
  for (let i = 1; i < 4; i++) {
    if (matrix[row + i][col - i] !== letters[i]) {
      return false;
    }
  }
  console.log("findBottomLeft", [row, col]);
  return true;
}
