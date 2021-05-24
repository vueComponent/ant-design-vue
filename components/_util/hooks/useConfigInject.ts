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
  getTargetContainer: ComputedRef<() => HTMLElement>;
} => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  const direction = computed(() => configProvider.direction);
  const size = computed(() => props.size || configProvider.componentSize);
  const getTargetContainer = computed(() => props.getTargetContainer);
  return { configProvider, prefixCls, direction, size, getTargetContainer };
};
