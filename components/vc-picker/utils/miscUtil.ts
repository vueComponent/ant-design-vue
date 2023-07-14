export function leftPad(str: string | number, length: number, fill = '0') {
  let current = String(str);
  while (current.length < length) {
    current = `${fill}${str}`;
  }
  return current;
}

export const tuple = <T extends string[]>(...args: T) => args;

export function toArray<T>(val: T | T[]): T[] {
  if (val === null || val === undefined) {
    return [];
  }

  return Array.isArray(val) ? val : [val];
}

export default function getDataOrAriaProps(props: any) {
  const retProps: any = {};

  Object.keys(props).forEach(key => {
    if (
      (key.startsWith('data-') || key.startsWith('aria-') || key === 'role' || key === 'name') &&
      !key.startsWith('data-__')
    ) {
      retProps[key] = props[key];
    }
  });

  return retProps;
}

export function getValue<T>(values: null | undefined | (T | null)[], index: number): T | null {
  return values ? values[index] : null;
}

type UpdateValue<T> = (prev: T) => T;

export function updateValues<T, R = [T | null, T | null] | null>(
  values: [T | null, T | null] | null,
  value: T | UpdateValue<T>,
  index: number,
): R {
  const newValues: [T | null, T | null] = [getValue(values, 0), getValue(values, 1)];

  newValues[index] =
    typeof value === 'function' ? (value as UpdateValue<T | null>)(newValues[index]) : value;

  if (!newValues[0] && !newValues[1]) {
    return null as unknown as R;
  }

  return newValues as unknown as R;
}
