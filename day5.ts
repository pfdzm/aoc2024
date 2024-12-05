import { readFile } from "node:fs/promises";

export async function day5(fileName: string): Promise<number> {
  const input = await readFile(fileName, "utf-8");

  const [pageOrderingRulesInput, updatesInput] = input
    .split("\n\n")
    .map((section) => section.split("\n").filter((line) => line !== ""));

  const rules = [];
  for (const line of pageOrderingRulesInput) {
    const [x, y] = line.split("|").map(Number);
    console.log([x, y]);
    rules.push([x, y]);
  }

  const updates = updatesInput.map((line) => line.split(",").map(Number));

  const validUpdates = [];
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
        console.log(pageNumber, rule);
      }
      if (invalid) {
        break;
      }
    }
    if (invalid) {
      continue;
    }
    validUpdates.push(update);
  }

  console.log(rules);

  return validUpdates
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((prev, curr) => prev + curr, 0);
}
