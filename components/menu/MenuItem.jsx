import { Item, itemProps } from '../vc-menu';
import { getOptionProps, getListeners } from '../_util/props-util';
import Tooltip from '../tooltip';
function noop() {}
export default {
  name: 'MenuItem',
  inheritAttrs: false,
  props: itemProps,
  inject: {
    getInlineCollapsed: { default: () => noop },
    layoutSiderContext: { default: () => ({}) },
  },
  isMenuItem: true,
  methods: {
    onKeyDown(e) {
      this.$refs.menuItem.onKeyDown(e);
    },
  },
  render() {
    const props = getOptionProps(this);
    const { level, title, rootPrefixCls } = props;
    const { getInlineCollapsed, $slots, $attrs: attrs } = this;
    const inlineCollapsed = getInlineCollapsed();
    let tooltipTitle = title;
    if (typeof title === 'undefined') {
      tooltipTitle = level === 1 ? $slots.default : '';
    } else if (title === false) {
      tooltipTitle = '';
    }
    const tooltipProps = {
      title: tooltipTitle,
    };
    const siderCollapsed = this.layoutSiderContext.sCollapsed;
    if (!siderCollapsed && !inlineCollapsed) {
      tooltipProps.title = null;
      // Reset `visible` to fix control mode tooltip display not correct
      // ref: https://github.com/ant-design/ant-design/issues/16742
      tooltipProps.visible = false;
    }

    const itemProps = {
      props: {
        ...props,
        title,
      },
      attrs,
      on: getListeners(this),
    };
    const toolTipProps = {
      props: {
        ...tooltipProps,
        placement: 'right',
        overlayClassName: `${rootPrefixCls}-inline-collapsed-tooltip`,
      },
    };
    return (
      <Tooltip {...toolTipProps}>
        <Item {...itemProps} ref="menuItem">
          {$slots.default}
        </Item>
      </Tooltip>
    );
  },
};
