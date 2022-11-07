import { unref } from 'vue';
import type { MaybeComputedRef } from './types';

/**
 * Get the value of value/ref/getter.
 */
export function resolveUnref<T>(r: MaybeComputedRef<T>): T {
  return typeof r === 'function' ? (r as any)() : unref(r);
}
