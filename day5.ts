import { readFile } from "node:fs/promises";
import { fail } from "./utils";

export async function day5(fileName: string): Promise<number> {
  const input = await readFile(fileName, "utf-8");

  const [pageOrderingRulesInput, updatesInput] = input
    .split("\n\n")
    .map((section) => section.split("\n").filter((line) => line !== ""));

  const rules: number[][] = [];
  for (const line of pageOrderingRulesInput) {
    const [x, y] = line.split("|").map(Number);
    rules.push([x, y]);
  }

  const updates = updatesInput.map((line) => line.split(",").map(Number));

  const validUpdates = [];
  const invalidUpdates = [];

  for (const update of updates) {
    let invalid = false;
    for (const [index, pageNumber] of update.entries()) {
      if (!rules.some((rule) => rule.includes(pageNumber))) {
        continue;
      }
      const applicableRules = rules.filter((rule) => rule.includes(pageNumber));
      for (const rule of applicableRules) {
        const [x, y] = rule;
        if (x === pageNumber) {
          if (!update.slice(0, index).every((pageNumber) => pageNumber !== y)) {
            invalid = true;
            break;
          }
        } else {
          if (
            !update.slice(index + 1).every((pageNumber) => pageNumber !== x)
          ) {
            invalid = true;
            break;
          }
        }
      }
      if (invalid) {
        break;
      }
    }
    if (invalid) {
      invalidUpdates.push(update);
      continue;
    }
    validUpdates.push(update);
  }

  console.log(
    "part 2:",
    invalidUpdates
      .map((update) =>
        update.toSorted((a, b) => {
          const applicableRules = rules.filter((rule) =>
            [a, b].some((val) => rule.includes(val))
          );
          if (applicableRules.length === 0) {
            return 0;
          }
          for (const rule of applicableRules) {
            const [x, y] = rule;
            if (x === a) {
              if (b !== y) {
                continue;
              }
              return -1;
            } else if (x === b) {
              // curr: a, b -> b, a
              // b, a
              if (a !== y) {
                continue;
              }
              return 1;
            } else if (y === a) {
              // b, a
              if (b !== x) {
                continue;
              }
              return 1;
            } else if (y === b) {
              if (a !== x) {
                continue;
              }
              return 1;
            }
            return fail("unreachable");
          }
          return fail("unreachable");
        })
      )
      .map((update) => update[Math.floor(update.length / 2)])
      .reduce((prev, curr) => prev + curr, 0)
  );

  return validUpdates
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((prev, curr) => prev + curr, 0);
}
