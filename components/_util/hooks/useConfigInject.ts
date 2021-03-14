import { computed, inject } from 'vue';
import { defaultConfigProvider } from '../../config-provider';

export default (name: string, props: Record<any, any>) => {
  const configProvider = inject('configProvider', defaultConfigProvider);
  const prefixCls = computed(() => configProvider.getPrefixCls(name, props.prefixCls));
  return { configProvider, prefixCls };
};
