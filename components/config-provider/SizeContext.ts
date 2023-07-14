import type { InjectionKey, Ref } from 'vue';
import { computed, inject, ref, provide } from 'vue';
export type SizeType = 'small' | 'middle' | 'large' | undefined;
const SizeContextKey: InjectionKey<Ref<SizeType>> = Symbol('SizeContextKey');

export const useInjectSize = () => {
  return inject(SizeContextKey, ref(undefined as SizeType));
};
export const useProviderSize = (size: Ref<SizeType>) => {
  const parentSize = useInjectSize();
  provide(
    SizeContextKey,
    computed(() => size.value || parentSize.value),
  );
  return size;
};
