import type { Ref, ShallowRef } from 'vue';

import { shallowRef, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

function useLayoutEffect(
  fn: (mount: boolean) => void | VoidFunction,
  deps?: Ref<any> | Ref<any>[] | ShallowRef<any> | ShallowRef<any>[],
) {
  const firstMount = shallowRef(true);
  const cleanupFn = ref(null);
  let stopWatch = null;

  stopWatch = watch(
    deps,
    () => {
      nextTick(() => {
        if (cleanupFn.value) {
          cleanupFn.value();
        }
        cleanupFn.value = fn(firstMount.value);
      });
    },
    { immediate: true, flush: 'post' },
  );

  onMounted(() => {
    firstMount.value = false;
  });

  onUnmounted(() => {
    if (cleanupFn.value) {
      cleanupFn.value();
    }
    if (stopWatch) {
      stopWatch();
    }
  });
}

export const useLayoutUpdateEffect = (callback, deps) => {
  useLayoutEffect(firstMount => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutEffect;
