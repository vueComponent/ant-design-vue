function omit<T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  fields: K,
): {
  [K2 in Exclude<keyof T, K[number]>]: T[K2];
} {
  // eslint-disable-next-line prefer-object-spread
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}
export default omit;
