import warning from '../../../_util/warning';
import type { ShallowRef } from 'vue';
import { onUnmounted, watch } from 'vue';

// DO NOT register functions in useEffect cleanup function, or functions that registered will never be called.
const useCleanupRegister = (deps?: ShallowRef<string>) => {
  const effectCleanups: (() => void)[] = [];
  let cleanupFlag = false;
  function register(fn: () => void) {
    if (cleanupFlag) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          false,
          '[Ant Design Vue CSS-in-JS] You are registering a cleanup function after unmount, which will not have any effect.',
        );
      }
      return;
    }
    effectCleanups.push(fn);
  }

  watch(
    deps,
    () => {
      // Compatible with strict mode
      cleanupFlag = false;
    },
    { immediate: true },
  );

  onUnmounted(() => {
    cleanupFlag = true;
    if (effectCleanups.length) {
      effectCleanups.forEach(fn => fn());
    }
  });

  return register;
};

export default useCleanupRegister;
