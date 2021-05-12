import { computed, ComputedRef, inject, UnwrapRef } from 'vue';
import {
  ConfigProviderProps,
  defaultConfigProvider,
  Direction,
  SizeType,
} from '../../config-provider';

export default (
  name: string,
  props: Record<any, any>,
): {
  configProvider: UnwrapRef<ConfigProviderProps>;
  prefixCls: ComputedRef<string>;
  direction: ComputedRef<Direction>;
  size: ComputedRef<SizeType>;
} => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  const direction = computed(() => configProvider.direction);
  const size = computed(() => props.size || configProvider.componentSize);
  return { configProvider, prefixCls, direction, size };
};
