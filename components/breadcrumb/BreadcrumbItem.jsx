import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import DropDown from '../dropdown/dropdown';
import Icon from '../icon';

export default {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.any.def('/'),
    overlay: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    /**
     * if overlay is have
     * Wrap a DropDown
     */
    renderBreadcrumbNode(breadcrumbItem, prefixCls) {
      const overlay = getComponentFromProp(this, 'overlay');
      if (overlay) {
        return (
          <DropDown overlay={overlay} placement="bottomCenter">
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <Icon type="down" />
            </span>
          </DropDown>
        );
      }
      return breadcrumbItem;
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
    const separator = getComponentFromProp(this, 'separator');
    const children = $slots.default;
    let link;
    if (hasProp(this, 'href')) {
      link = <a class={`${prefixCls}-link`}>{children}</a>;
    } else {
      link = <span class={`${prefixCls}-link`}>{children}</span>;
    }
    // wrap to dropDown
    link = this.renderBreadcrumbNode(link, prefixCls);
    if (children) {
      return (
        <span>
          {link}
          {separator && separator !== '' && (
            <span class={`${prefixCls}-separator`}>{separator}</span>
          )}
        </span>
      );
    }
    return null;
  },
};
