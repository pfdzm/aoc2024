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

  let guard: { row: null; col: null; dir: null } | Guard = {
    row: null,
    col: null,
    dir: null,
  };

  const obstacles: number[][] = [];

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
        };
        continue;
      }
      obstacles.push([row, col]);
    }
  }

  if (guard.row === null || guard.col === null || guard.dir === null) {
    throw new Error("fatal, expected guard to have position and direction");
  }

  const prevPos: {
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
      const prev =
        prevPos.pop() ?? fail("expected to have a previous position!");
      guard = { ...prev, dir: nextDir(guard.dir) };
    }

    switch (guard.dir) {
      case "<": {
        const nextPos: Guard = { ...guard, col: guard.col - 1 };
        prevPos.push(guard);
        guard = nextPos;
        break;
      }
      case ">": {
        const nextPos: Guard = { ...guard, col: guard.col + 1 };
        prevPos.push(guard);
        guard = nextPos;
        break;
      }
      case "^": {
        const nextPos: Guard = { ...guard, row: guard.row - 1 };
        prevPos.push(guard);
        guard = nextPos;
        break;
      }
      case "v": {
        const nextPos: Guard = { ...guard, row: guard.row + 1 };
        prevPos.push(guard);
        guard = nextPos;
        break;
      }
      default:
        throw new Error("unexpected - guard has no direction");
    }
  }

  const uniquePos = new Set(prevPos.map(({ row, col }) => `${row},${col}`));
  return uniquePos.size;
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
