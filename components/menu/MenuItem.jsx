import { inject } from 'vue';
import { Item, itemProps } from '../vc-menu';
import { getOptionProps, getSlot } from '../_util/props-util';
import Tooltip from '../tooltip';
function noop() {}
export default {
  name: 'MenuItem',
  inheritAttrs: false,
  props: itemProps,
  isMenuItem: true,
  setup() {
    return {
      getInlineCollapsed: inject('getInlineCollapsed', noop),
      layoutSiderContext: inject('layoutSiderContext', {}),
    };
  },
  methods: {
    onKeyDown(e) {
      this.$refs.menuItem.onKeyDown(e);
    },
  },
  render() {
    const props = getOptionProps(this);
    const { level, title, rootPrefixCls } = props;
    const { getInlineCollapsed, $attrs: attrs } = this;
    const inlineCollapsed = getInlineCollapsed();
    const tooltipProps = {
      title: title || (level === 1 ? getSlot(this) : ''),
    };
    const siderCollapsed = this.layoutSiderContext.sCollapsed;
    if (!siderCollapsed && !inlineCollapsed) {
      tooltipProps.title = null;
      // Reset `visible` to fix control mode tooltip display not correct
      // ref: https://github.com/ant-design/ant-design/issues/16742
      tooltipProps.visible = false;
    }

    const itemProps = {
      ...props,
      title,
      ...attrs,
      ref: 'menuItem',
    };
    const toolTipProps = {
      ...tooltipProps,
      placement: 'right',
      overlayClassName: `${rootPrefixCls}-inline-collapsed-tooltip`,
    };
    const item = <Item {...itemProps}>{getSlot(this)}</Item>;
    return <Tooltip {...toolTipProps}>{item}</Tooltip>;
  },
};
