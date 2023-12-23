import type { Ref, ShallowRef } from 'vue';
import { ref, watch, onUnmounted, onMounted } from 'vue';

const useLayoutEffect = (
  callback: (mount: boolean) => void | VoidFunction,
  deps?: Ref<any> | Ref<any>[] | ShallowRef<any> | ShallowRef<any>[],
) => {
  const firstMountRef = ref(true);

  watch(
    deps,
    () => {
      callback(firstMountRef.value);
    },
    { immediate: true },
  );

  onMounted(() => {
    firstMountRef.value = false;
  });
  onUnmounted(() => {
    firstMountRef.value = true;
  });
};

export const useLayoutUpdateEffect = (callback, deps) => {
  useLayoutEffect(firstMount => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutEffect;
