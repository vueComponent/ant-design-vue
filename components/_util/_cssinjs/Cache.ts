export type KeyType = string | number;
type ValueType = [number, any]; // [times, realValue]

const SPLIT = '%';

class Entity {
  instanceId: string;
  constructor(instanceId: string) {
    this.instanceId = instanceId;
  }

  /** @private Internal cache map. Do not access this directly */
  cache = new Map<string, ValueType>();

  get(keys: KeyType[]): ValueType | null {
    return this.cache.get(keys.join(SPLIT)) || null;
  }

  update(keys: KeyType[], valueFn: (origin: ValueType | null) => ValueType | null) {
    const path = keys.join(SPLIT);
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
