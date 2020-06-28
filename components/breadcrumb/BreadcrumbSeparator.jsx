import { inject } from 'vue';
import { ConfigConsumerProps } from '../config-provider';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';

export default {
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  props: {
    prefixCls: PropTypes.string,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    const children = getSlot(this);
    return <span class={`${prefixCls}-separator`}>{children || '/'}</span>;
  },
};
