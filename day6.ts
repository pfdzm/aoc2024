import { readFile } from "node:fs/promises";
import { expectEnum, fail } from "./utils";

const directionChars = ["^", "v", ">", "<"] as const;
type Direction = (typeof directionChars)[number];

export async function day6(fileName: string): Promise<number> {
  console.log(`${fileName}: \n`);
  const input = (await readFile(fileName, "utf-8"))
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => line.split(""));

  type Guard = {
    row: number;
    col: number;
    dir: Direction;
  };

  const bounds = {
    row: {
      min: 0,
      max: input.length - 1,
    },
    col: {
      min: 0,
      max: (input.at(0)?.length ?? fail("no columns!")) - 1,
    },
  } as const;

  let { obstacles, guard } = findGuardPosition();

  const visited: {
    row: number;
    col: number;
  }[] = [];

  while (
    guard.row >= bounds.row.min &&
    guard.row <= bounds.row.max &&
    guard.col >= bounds.col.min &&
    guard.col <= bounds.row.max
  ) {
    if (
      obstacles.some(
        ([obstacleRow, obstacleCol]) =>
          obstacleRow === guard.row && obstacleCol === guard.col
      )
    ) {
      const previousPosition =
        visited.pop() ?? fail("expected to have a previous position!");
      guard = { ...previousPosition, dir: nextDir(guard.dir) };
    }

    switch (guard.dir) {
      case "<": {
        const nextPos: Guard = { ...guard, col: guard.col - 1 };
        visited.push(guard);
        guard = nextPos;
        break;
      }
      case ">": {
        const nextPos: Guard = { ...guard, col: guard.col + 1 };
        visited.push(guard);
        guard = nextPos;
        break;
      }
      case "^": {
        const nextPos: Guard = { ...guard, row: guard.row - 1 };
        visited.push(guard);
        guard = nextPos;
        break;
      }
      case "v": {
        const nextPos: Guard = { ...guard, row: guard.row + 1 };
        visited.push(guard);
        guard = nextPos;
        break;
      }
      default:
        throw new Error("unexpected - guard has no direction");
    }
  }

  const uniqueVisited = new Set(visited.map(({ row, col }) => `${row},${col}`));

  const loopingObstaclePositions = [];
  // we skip the first position, since we don't want
  // to put an obstacle on the guard's head
  for (const [row, col] of [...uniqueVisited]
    .slice(1)
    .map((v) => v.split(",").map(Number))) {
    let { guard, obstacles } = findGuardPosition();

    obstacles.push([row, col]);

    const visited: {
      row: number;
      col: number;
      dir: Direction;
    }[] = [];

    while (
      guard.row >= bounds.row.min &&
      guard.row <= bounds.row.max &&
      guard.col >= bounds.col.min &&
      guard.col <= bounds.row.max
    ) {
      if (
        obstacles.some(
          ([obstacleRow, obstacleCol]) =>
            obstacleRow === guard.row && obstacleCol === guard.col
        )
      ) {
        const previousPosition =
          visited.pop() ?? fail("expected to have a previous position!");
        guard = { ...previousPosition, dir: nextDir(guard.dir) };
      }

      if (
        visited.some(
          (v) =>
            v.row === guard.row && v.col === guard.col && v.dir === guard.dir
        )
      ) {
        const obstacle = obstacles.pop();
        loopingObstaclePositions.push(obstacle);
        break;
      }

      switch (guard.dir) {
        case "<": {
          const nextPos: Guard = { ...guard, col: guard.col - 1 };
          visited.push(guard);
          guard = nextPos;
          break;
        }
        case ">": {
          const nextPos: Guard = { ...guard, col: guard.col + 1 };
          visited.push(guard);
          guard = nextPos;
          break;
        }
        case "^": {
          const nextPos: Guard = { ...guard, row: guard.row - 1 };
          visited.push(guard);
          guard = nextPos;
          break;
        }
        case "v": {
          const nextPos: Guard = { ...guard, row: guard.row + 1 };
          visited.push(guard);
          guard = nextPos;
          break;
        }
        default:
          throw new Error("unexpected - guard has no direction");
      }
    }
  }
  console.log("obstacle loops:", loopingObstaclePositions.length);

  return uniqueVisited.size;

  function findGuardPosition() {
    const obstacles: number[][] = [];
    let guard: Guard | { row: null; col: null; dir: null } = {
      row: null,
      col: null,
      dir: null,
    };
    for (const [row, line] of input.entries()) {
      for (const [col, letter] of line.entries()) {
        if (letter === ".") {
          continue;
        }
        if (directionChars.some((char) => char === letter)) {
          guard = {
            row,
            col,
            dir: expectEnum(letter, directionChars),
          } as const;
          continue;
        }
        obstacles.push([row, col]);
      }
    }
    if (guard.row === null || guard.col === null || guard.dir === null) {
      throw new Error("fatal! no guard found");
    }
    return { obstacles, guard };
  }
}

function nextDir(dir: Direction): Direction {
  switch (dir) {
    case "<":
      return "^";
    case ">":
      return "v";
    case "^":
      return ">";
    case "v":
      return "<";
    default:
      throw new Error("unexpected direction");
  }
}

/**
 * For part 2 I will try a brute force approach: from the "vanilla" path, choose a random position
 * to insert an obstacle. Let the guard do its thing and detect a loop (when row, col and dir have been seen)
 */
