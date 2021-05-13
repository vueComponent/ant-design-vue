import { computed, ComputedRef, inject, provide, UnwrapRef } from 'vue';
import { ConfigProviderProps, defaultConfigProvider, SizeType } from '../../config-provider';

const sizeProvider = Symbol('SizeProvider');

const useProviderSize = <T = SizeType>(props: Record<any, any>): ComputedRef<T> => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const size = computed<T>(() => props.size || configProvider.componentSize);
  provide(sizeProvider, size);
  return size;
};

const useInjectSize = <T = SizeType>(): ComputedRef<T> => {
  const size: ComputedRef<T> = inject(
    sizeProvider,
    computed(() => ('default' as unknown) as T),
  );
  return size;
};

export { useInjectSize, sizeProvider, useProviderSize };

export default useProviderSize;
