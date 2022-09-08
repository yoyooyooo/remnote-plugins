type Predicate<T> = (item: T, index: number, items: T[]) => Promise<boolean>;

export const any = async <T>(array: T[], predicate: Predicate<T>): Promise<T> => {
  return Promise.any(
    array.map(async (item, index, items) => {
      if (await predicate(item, index, items)) {
        return item;
      }

      throw new Error();
    })
  );
};

export const findAsync = async <T>(array: T[], predicate: Predicate<T>): Promise<T | undefined> => {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (await predicate(item, i, array)) {
      return item;
    }
  }

  return Promise.resolve(undefined);
};
