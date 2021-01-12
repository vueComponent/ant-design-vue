import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
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
    const { prefixCls: customizePrefixCls, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    const children = $slots.default;
    return <span class={`${prefixCls}-separator`}>{children || '/'}</span>;
  },
};
