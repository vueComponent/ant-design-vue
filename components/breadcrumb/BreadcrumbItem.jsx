import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    const children = $slots.default;
    let link;
    if (hasProp(this, 'href')) {
      link = <a class={`${prefixCls}-link`}>{children}</a>;
    } else {
      link = <span class={`${prefixCls}-link`}>{children}</span>;
    }
    if (children) {
      return (
        <span>
          {link}
          <span class={`${prefixCls}-separator`}>
            {getComponentFromProp(this, 'separator') || '/'}
          </span>
        </span>
      );
    }
    return null;
  },
};
