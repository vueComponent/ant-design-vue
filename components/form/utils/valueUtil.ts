import { toArray } from './typeUtil';
import type { InternalNamePath, NamePath } from '../interface';
import get from '../../vc-util/get';
import set from '../../vc-util/set';

/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export function getNamePath(path: NamePath | null): InternalNamePath {
  return toArray(path);
}

export function getValue<T>(store: T, namePath: InternalNamePath) {
  const value = get(store, namePath);
  return value;
}

export function setValue<T>(
  store: T,
  namePath: InternalNamePath,
  value: any,
  removeIfUndefined = false,
): T {
  const newStore = set(store, namePath, value, removeIfUndefined);
  return newStore;
}

export function containsNamePath(namePathList: InternalNamePath[], namePath: InternalNamePath) {
  return namePathList && namePathList.some(path => matchNamePath(path, namePath));
}

function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}

/**
 * Copy values into store and return a new values object
 * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
 */
function internalSetValues<T>(store: T, values: T): T {
  const newStore: T = (Array.isArray(store) ? [...store] : { ...store }) as T;

  if (!values) {
    return newStore;
  }

  Object.keys(values).forEach(key => {
    const prevValue = newStore[key];
    const value = values[key];

    // If both are object (but target is not array), we use recursion to set deep value
    const recursive = isObject(prevValue) && isObject(value);
    newStore[key] = recursive ? internalSetValues(prevValue, value || {}) : value;
  });

  return newStore;
}

export function setValues<T>(store: T, ...restValues: T[]): T {
  return restValues.reduce(
    (current: T, newStore: T) => internalSetValues(current, newStore),
    store,
  );
}

export function cloneByNamePathList<T>(store: T, namePathList: InternalNamePath[]): T {
  let newStore = {} as T;
  namePathList.forEach(namePath => {
    const value = getValue(store, namePath);
    newStore = setValue(newStore, namePath, value);
  });

  return newStore;
}

export function matchNamePath(
  namePath: InternalNamePath,
  changedNamePath: InternalNamePath | null,
) {
  if (!namePath || !changedNamePath || namePath.length !== changedNamePath.length) {
    return false;
  }
  return namePath.every((nameUnit, i) => changedNamePath[i] === nameUnit);
}
