import type { SizeType } from '../SizeContext';
import { useInjectSize } from '../SizeContext';
import type { Ref } from 'vue';
import { computed, shallowRef, watch } from 'vue';

const useSize = <T>(customSize?: T | ((ctxSize: SizeType) => T)): Ref<T> => {
  const size = useInjectSize();

  const mergedSize = shallowRef(null);

  watch(
    computed(() => {
      return [customSize, size.value];
    }),
    () => {
      if (!customSize) {
        mergedSize.value = size.value as T;
      }
      if (typeof customSize === 'string') {
        mergedSize.value = customSize ?? (size.value as T);
      }
      if (customSize instanceof Function) {
        mergedSize.value = customSize(size.value) as T;
      }
    },
    { immediate: true },
  );

  return mergedSize;
};

export default useSize;
