function firstNotUndefined<T>(arr: T[] = []): T {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] !== undefined) {
      return arr[i];
    }
  }
  return undefined;
}

export default firstNotUndefined;
