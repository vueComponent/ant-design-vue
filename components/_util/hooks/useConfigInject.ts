import type { RequiredMark } from '../../form/Form';
import type { ComputedRef, UnwrapRef, VNodeChild } from 'vue';
import { computed, inject } from 'vue';
import type { ConfigProviderProps, Direction, SizeType } from '../../config-provider';
import { defaultConfigProvider } from '../../config-provider';

export default (
  name: string,
  props: Record<any, any>,
): {
  configProvider: UnwrapRef<ConfigProviderProps>;
  prefixCls: ComputedRef<string>;
  direction: ComputedRef<Direction>;
  size: ComputedRef<SizeType>;
  getTargetContainer: ComputedRef<() => HTMLElement>;
  space: ComputedRef<{ size: SizeType | number }>;
  pageHeader: ComputedRef<{ ghost: boolean }>;
  form?: ComputedRef<{
    requiredMark?: RequiredMark;
  }>;
  autoInsertSpaceInButton: ComputedRef<Boolean>;
  renderEmpty?: ComputedRef<(componentName?: string) => VNodeChild | JSX.Element>;
} => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  const direction = computed(() => configProvider.direction);
  const autoInsertSpaceInButton = computed(() => configProvider.autoInsertSpaceInButton);
  const renderEmpty = computed(() => configProvider.renderEmpty);
  const space = computed(() => configProvider.space);
  const pageHeader = computed(() => configProvider.pageHeader);
  const form = computed(() => configProvider.form);
  const size = computed(() => props.size || configProvider.componentSize);
  const getTargetContainer = computed(() => props.getTargetContainer);
  return {
    configProvider,
    prefixCls,
    direction,
    size,
    getTargetContainer,
    space,
    pageHeader,
    form,
    autoInsertSpaceInButton,
    renderEmpty,
  };
};
