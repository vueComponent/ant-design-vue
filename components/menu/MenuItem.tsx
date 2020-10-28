import { defineComponent, inject } from 'vue';
import { Item, itemProps } from '../vc-menu';
import { getOptionProps, getSlot } from '../_util/props-util';
import Tooltip, { TooltipProps } from '../tooltip';
import { SiderContextProps } from '../layout/Sider';
import { injectExtraPropsKey } from '../vc-menu/FunctionProvider';
export default defineComponent({
  name: 'MenuItem',
  inheritAttrs: false,
  props: itemProps,
  isMenuItem: true,
  setup() {
    return {
      getInlineCollapsed: inject<() => boolean>('getInlineCollapsed', () => false),
      layoutSiderContext: inject<SiderContextProps>('layoutSiderContext', {}),
      injectExtraProps: inject(injectExtraPropsKey, () => ({})),
    };
  },
  methods: {
    onKeyDown(e: HTMLElement) {
      (this.$refs.menuItem as any).onKeyDown(e);
    },
  },
  render() {
    const props = getOptionProps(this);
    const { level, title, rootPrefixCls } = { ...props, ...this.injectExtraProps } as any;
    const { getInlineCollapsed, $attrs: attrs } = this;
    const inlineCollapsed = getInlineCollapsed();
    let tooltipTitle = title;
    const children = getSlot(this);
    if (typeof title === 'undefined') {
      tooltipTitle = level === 1 ? children : '';
    } else if (title === false) {
      tooltipTitle = '';
    }
    const tooltipProps: TooltipProps = {
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
      ...props,
      title,
      ...attrs,
      ref: 'menuItem',
    };
    const toolTipProps: TooltipProps = {
      ...tooltipProps,
      placement: 'right',
      overlayClassName: `${rootPrefixCls}-inline-collapsed-tooltip`,
    };
    const item = <Item {...itemProps}>{children}</Item>;
    return <Tooltip {...toolTipProps}>{item}</Tooltip>;
  },
});
