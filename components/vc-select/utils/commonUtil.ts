export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export const isClient =
  typeof window !== 'undefined' && window.document && window.document.documentElement;

/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && isClient;
