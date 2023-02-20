import type { InjectionKey, Ref } from 'vue';
import { computed, inject, ref, provide } from 'vue';
import type { ScreenSizeMap } from '../_util/responsiveObserve';
export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;
const SizeContextKey: InjectionKey<Ref<AvatarSize>> = Symbol('SizeContextKey');

export const useInjectSize = () => {
  return inject(SizeContextKey, ref('default' as AvatarSize));
};
export const useProviderSize = (size: Ref<AvatarSize>) => {
  const parentSize = useInjectSize();
  provide(
    SizeContextKey,
    computed(() => size.value || parentSize.value),
  );
  return size;
};
