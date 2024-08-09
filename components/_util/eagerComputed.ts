import compareVersions from 'compare-versions';
import { watchEffect, shallowRef, computed, version } from 'vue';
import type { ComputedRef } from 'vue';
export declare type ComputedGetter<T> = (...args: any[]) => T;

const breakingChangeVersion = '3.4.0';
const needEager = compareVersions(version, breakingChangeVersion) < 0;

const eagerComputed = needEager
  ? function <T>(fn: ComputedGetter<T>) {
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
  : computed;

export default eagerComputed;
