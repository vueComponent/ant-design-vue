import { inject, defineComponent } from 'vue';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import { breadcrumbSeparatorProps } from './breadcrumbProps';

export default defineComponent({
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  props: breadcrumbSeparatorProps,
  setup(props, { slots }) {
    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);
    return () => {
      const { prefixCls: customizePrefixCls } = props;
      const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
      return (
        <span class={`${prefixCls}-separator`}>
          {slots.default?.() !== undefined ? slots.default() : '/'}
        </span>
      );
    };
  },
});
