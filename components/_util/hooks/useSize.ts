import type { ComputedRef, UnwrapRef } from 'vue';
import { computed, inject, provide } from 'vue';
import type { ConfigProviderProps, SizeType } from '../../config-provider';
import { defaultConfigProvider } from '../../config-provider';

const sizeProvider = Symbol('SizeProvider');

const useProvideSize = <T = SizeType>(props: Record<any, any>): ComputedRef<T> => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const size = computed<T>(() => props.size || configProvider.componentSize);
  provide(sizeProvider, size);
  return size;
};

const useInjectSize = <T = SizeType>(props?: Record<any, any>): ComputedRef<T> => {
  const size: ComputedRef<T> = props
    ? computed(() => props.size)
    : inject(
        sizeProvider,
        computed(() => 'default' as unknown as T),
      );
  return size;
};

export { useInjectSize, sizeProvider, useProvideSize };

export default useProvideSize;
