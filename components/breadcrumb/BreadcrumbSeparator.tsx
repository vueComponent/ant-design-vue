import { defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';

export default defineComponent({
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls } = this;
    const { separator, class: className, ...restAttrs } = this.$attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    const children = getSlot(this);
    return (
      <span class={[`${prefixCls}-separator`, className]} {...restAttrs}>
        {children.length > 0 ? children : '/'}
      </span>
    );
  },
});
