import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent, inject } from 'vue';
import animation from '../_util/openAnimation';
import { getOptionProps, getComponent, isValidElement, getSlot } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import VcCollapse from '../vc-collapse';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import { defaultConfigProvider } from '../config-provider';
import PropTypes from '../_util/vue-types';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';

export interface PanelProps {
  isActive?: boolean;
  header?: VueNode;
  className?: string;
  class?: string;
  style?: CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  disabled?: boolean;
  extra?: VueNode;
}
type ActiveKeyType = Array<string | number> | string | number;

const collapseProps = {
  prefixCls: PropTypes.string,
  activeKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  defaultActiveKey: { type: [Array, Number, String] as PropType<ActiveKeyType> },
  accordion: PropTypes.looseBool,
  destroyInactivePanel: PropTypes.looseBool,
  bordered: PropTypes.looseBool.def(true),
  expandIcon: PropTypes.func,
  openAnimation: PropTypes.object.def(animation),
  expandIconPosition: PropTypes.oneOf(tuple('left', 'right')).def('left'),
  'onUpdate:activeKey': PropTypes.func,
  onChange: PropTypes.func,
};

export type CollapseProps = Partial<ExtractPropTypes<typeof collapseProps>>;

export default defineComponent({
  name: 'ACollapse',
  inheritAttrs: false,
  props: collapseProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  methods: {
    renderExpandIcon(panelProps: PanelProps = {}, prefixCls: string) {
      const expandIcon = getComponent(this, 'expandIcon', panelProps);
      const icon = expandIcon || <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />;
      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
        ? cloneElement(icon, {
            class: `${prefixCls}-arrow`,
          })
        : icon;
    },
    handleChange(activeKey: ActiveKeyType) {
      this.$emit('update:activeKey', activeKey);
      this.$emit('change', activeKey);
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, bordered, expandIconPosition } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('collapse', customizePrefixCls);
    const { class: className, ...restAttrs } = this.$attrs;
    const collapseClassName = {
      [className as string]: className,
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-icon-position-${expandIconPosition}`]: true,
    };
    const rcCollapeProps = {
      ...getOptionProps(this),
      prefixCls,
      expandIcon: (panelProps: PanelProps) => this.renderExpandIcon(panelProps, prefixCls),
      class: collapseClassName,
      ...restAttrs,
      onChange: this.handleChange,
    };

    return <VcCollapse {...rcCollapeProps}>{getSlot(this)}</VcCollapse>;
  },
});
