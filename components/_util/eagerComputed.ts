import { watchEffect, shallowRef, version, computed } from 'vue';
import type { ComputedRef } from 'vue';
export declare type ComputedGetter<T> = (...args: any[]) => T;
export default function eagerComputed<T>(fn: ComputedGetter<T>) {
  const currentVueVersion = Number(version.split('.').slice(0, 2).join(''));

  // version >= 3.4.x, use computed instead of watchSyncEffect
  if (currentVueVersion >= 34) {
    return computed(fn);
  }

  const result = shallowRef<T>();
  watchEffect(
    () => {
      result.value = fn();
    },
    {
      flush: 'sync', // needed so updates are immediate.
    },
  );

  return result as any as ComputedRef<T>;
}
