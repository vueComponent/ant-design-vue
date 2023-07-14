import type { InjectionKey, Ref } from 'vue';
import { computed, inject, ref, provide } from 'vue';

export type DisabledType = boolean | undefined;
const DisabledContextKey: InjectionKey<Ref<DisabledType>> = Symbol('DisabledContextKey');

export const useInjectDisabled = () => {
  return inject(DisabledContextKey, ref<DisabledType>(undefined));
};
export const useProviderDisabled = (disabled: Ref<DisabledType>) => {
  const parentDisabled = useInjectDisabled();
  provide(
    DisabledContextKey,
    computed(() => disabled.value ?? parentDisabled.value),
  );
  return disabled;
};
