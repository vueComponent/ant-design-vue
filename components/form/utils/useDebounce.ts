import type { Ref } from 'vue';
import { shallowRef, watchEffect } from 'vue';

export default function useDebounce<T>(value: Ref<T[]>): Ref<T[]> {
  const cacheValue = shallowRef(value.value.slice());
  let timeout: any = null;
  watchEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(
      () => {
        cacheValue.value = value.value;
      },
      value.value.length ? 0 : 10,
    );
  });

  return cacheValue;
}
