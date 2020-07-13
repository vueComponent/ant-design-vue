import { toArray } from './typeUtil';

/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export function getNamePath(path) {
  return toArray(path);
}

// export function getValue(store: Store, namePath: InternalNamePath) {
//   const value = get(store, namePath);
//   return value;
// }

// export function setValue(store: Store, namePath: InternalNamePath, value: StoreValue): Store {
//   const newStore = set(store, namePath, value);
//   return newStore;
// }

// export function cloneByNamePathList(store: Store, namePathList: InternalNamePath[]): Store {
//   let newStore = {};
//   namePathList.forEach(namePath => {
//     const value = getValue(store, namePath);
//     newStore = setValue(newStore, namePath, value);
//   });

//   return newStore;
// }

export function containsNamePath(namePathList, namePath) {
  return namePathList && namePathList.some(path => matchNamePath(path, namePath));
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}

/**
 * Copy values into store and return a new values object
 * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
 */
function internalSetValues(store, values) {
  const newStore = Array.isArray(store) ? [...store] : { ...store };

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

export function setValues(store, ...restValues) {
  return restValues.reduce((current, newStore) => internalSetValues(current, newStore), store);
}

export function matchNamePath(namePath, changedNamePath) {
  if (!namePath || !changedNamePath || namePath.length !== changedNamePath.length) {
    return false;
  }
  return namePath.every((nameUnit, i) => changedNamePath[i] === nameUnit);
}
