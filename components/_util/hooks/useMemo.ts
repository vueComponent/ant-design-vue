import { Ref, ref, watch } from 'vue';

export default function useMemo<T>(
  getValue: () => T,
  condition: any[],
  shouldUpdate: (prev: any[], next: any[]) => boolean,
) {
  const cacheRef: Ref<T> = ref(getValue() as any);
  watch(condition, (pre, next) => {
    if (shouldUpdate(pre, next)) {
      cacheRef.value = getValue();
    }
  });

  return cacheRef;
}
