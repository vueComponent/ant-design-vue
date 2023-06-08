// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, nextTick, onMounted } from 'vue';
import type { Fn } from './types';

/**
 * Call onMounted() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export function tryOnMounted(fn: Fn, sync = true) {
  if (getCurrentInstance()) onMounted(fn);
  else if (sync) fn();
  else nextTick(fn);
}
