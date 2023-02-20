import { computed, inject } from 'vue';
import { defaultConfigProvider, configProviderKey } from '../context';
export default (name: string, props: Record<any, any>) => {
  const configProvider = inject(configProviderKey, {
    ...defaultConfigProvider,
    renderEmpty: () => null,
  });
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  const direction = computed(() => props.direction ?? configProvider.direction?.value);
  const iconPrefixCls = computed(() => props.iconPrefixCls ?? configProvider.iconPrefixCls.value);
  const rootPrefixCls = computed(() => configProvider.getPrefixCls());
  const autoInsertSpaceInButton = computed(() => configProvider.autoInsertSpaceInButton?.value);
  const renderEmpty = configProvider.renderEmpty;
  const space = configProvider.space;
  const pageHeader = configProvider.pageHeader;
  const form = configProvider.form;
  const getTargetContainer = configProvider.getTargetContainer;
  const getPopupContainer = configProvider.getPopupContainer;

  const dropdownMatchSelectWidth = computed<boolean | number>(
    () => props.dropdownMatchSelectWidth ?? configProvider.dropdownMatchSelectWidth?.value,
  );
  const virtual = computed(
    () =>
      (props.virtual === undefined
        ? configProvider.virtual?.value !== false
        : props.virtual !== false) && dropdownMatchSelectWidth.value !== false,
  );
  const size = computed(() => props.size || configProvider.componentSize?.value);
  const autocomplete = computed(
    () => props.autocomplete ?? configProvider.input?.value?.autocomplete,
  );
  const disabled = computed(() => props.disabled || configProvider.componentDisabled?.value);
  const csp = computed(() => props.csp ?? configProvider.csp);
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
    getPrefixCls: configProvider.getPrefixCls,
    autocomplete,
    csp,
    iconPrefixCls,
    disabled,
    select: configProvider.select,
  };
};
