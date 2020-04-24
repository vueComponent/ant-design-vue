import { ConfigConsumerProps } from '../config-provider';
import PropTypes from '../_util/vue-types';

export default {
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  props: {
    prefixCls: PropTypes.string,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, $scopedSlots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    const children = ($scopedSlots.deafult && $scopedSlots.default()) || [];
    return <span class={`${prefixCls}-separator`}>{children || '/'}</span>;
  },
};
