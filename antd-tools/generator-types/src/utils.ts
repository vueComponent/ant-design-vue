// myName -> my-name
export function toKebabCase(input: string): string {
  return input.replace(/[A-Z]/g, (val, index) => (index === 0 ? '' : '-') + val.toLowerCase());
}

// name `v2.0.0` -> name
export function removeVersion(str: string) {
  return str.replace(/`(\w|\.)+`/g, '').trim();
}

// *boolean* -> boolean
// _boolean_ -> boolean
export function formatType(type: string) {
  return type
    .replace(/(^(\*|_))|((\*|_)$)/g, '')
    .replace('\\', '')
    .replace('\\', '');
}

export function getComponentName(name: string) {
  const title = name
    .split('-')
    .map(it => it.substring(0, 1) + it.substring(1))
    .join('');
  return title.substring(0, 1).toUpperCase() + title.substring(1);
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}
