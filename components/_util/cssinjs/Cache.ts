export type KeyType = string | number;
type ValueType = [number, any]; // [times, realValue]

class Entity {
  /** @private Internal cache map. Do not access this directly */
  cache = new Map<string, ValueType>();

  get(keys: KeyType[] | string): ValueType | null {
    return this.cache.get(Array.isArray(keys) ? keys.join('%') : keys) || null;
  }

  update(keys: KeyType[] | string, valueFn: (origin: ValueType | null) => ValueType | null) {
    const path = Array.isArray(keys) ? keys.join('%') : keys;
    const prevValue = this.cache.get(path)!;
    const nextValue = valueFn(prevValue);

    if (nextValue === null) {
      this.cache.delete(path);
    } else {
      this.cache.set(path, nextValue);
    }
  }
}

export default Entity;
