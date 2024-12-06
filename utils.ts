export const fail = (message: string) => {
  throw new Error(message);
};

export const expectEnum = <T extends string>(
  data: unknown,
  enumValues: readonly T[]
): T => {
  for (const val of enumValues) {
    if (val === data) {
      return val;
    }
  }
  return fail("data is not of valid type");
};
