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
  rootPrefixCls: ComputedRef<string>;
  direction: ComputedRef<Direction>;
  size: ComputedRef<SizeType>;
  getTargetContainer: ComputedRef<() => HTMLElement>;
  space: ComputedRef<{ size: SizeType | number }>;
  pageHeader: ComputedRef<{ ghost: boolean }>;
  form?: ComputedRef<{
    requiredMark?: RequiredMark;
  }>;
  autoInsertSpaceInButton: ComputedRef<boolean>;
  renderEmpty?: ComputedRef<(componentName?: string) => VNodeChild | JSX.Element>;
  virtual: ComputedRef<boolean>;
  dropdownMatchSelectWidth: ComputedRef<boolean | number>;
  getPopupContainer: ComputedRef<ConfigProviderProps['getPopupContainer']>;
} => {
  const configProvider = inject<UnwrapRef<ConfigProviderProps>>(
    'configProvider',
    defaultConfigProvider,
  );
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  const direction = computed(() => props.direction ?? configProvider.direction);
  const rootPrefixCls = computed(() => configProvider.getPrefixCls());
  const autoInsertSpaceInButton = computed(() => configProvider.autoInsertSpaceInButton);
  const renderEmpty = computed(() => configProvider.renderEmpty);
  const space = computed(() => configProvider.space);
  const pageHeader = computed(() => configProvider.pageHeader);
  const form = computed(() => configProvider.form);
  const getTargetContainer = computed(
    () => props.getTargetContainer || configProvider.getTargetContainer,
  );
  const getPopupContainer = computed(
    () => props.getPopupContainer || configProvider.getPopupContainer,
  );
  const virtual = computed(() => props.virtual ?? configProvider.virtual);
  const dropdownMatchSelectWidth = computed<boolean | number>(
    () => props.dropdownMatchSelectWidth ?? configProvider.dropdownMatchSelectWidth,
  );
  const size = computed(() => props.size || configProvider.componentSize);
  return {
    configProvider,
    prefixCls,
    direction,
    size,
    getTargetContainer,
    getPopupContainer,
    space,
    pageHeader,
    form,
    autoInsertSpaceInButton,
    renderEmpty,
    virtual,
    dropdownMatchSelectWidth,
    rootPrefixCls,
  };
};
