import { defineComponent, HTMLAttributes, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponent, getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import DropDown from '../dropdown/dropdown';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';

export default defineComponent({
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.VNodeChild.def('/'),
    overlay: PropTypes.VNodeChild,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  methods: {
    /**
     * if overlay is have
     * Wrap a DropDown
     */
    renderBreadcrumbNode(breadcrumbItem: HTMLAttributes, prefixCls: string) {
      const overlay = getComponent(this, 'overlay');
      if (overlay) {
        return (
          <DropDown overlay={overlay} placement="bottomCenter">
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <DownOutlined />
            </span>
          </DropDown>
        );
      }
      return breadcrumbItem;
    },
  },
  render() {
    const { prefixCls: customizePrefixCls } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
    const separator = getComponent(this, 'separator');
    const children = getSlot(this);
    let link: HTMLAttributes;
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
});
