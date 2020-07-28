import { inject } from 'vue';
import animation from '../_util/openAnimation';
import {
  getOptionProps,
  initDefaultProps,
  getComponent,
  isValidElement,
  getSlot,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import VcCollapse, { collapseProps } from '../vc-collapse';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACollapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    bordered: true,
    openAnimation: animation,
    expandIconPosition: 'left',
  }),
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  methods: {
    renderExpandIcon(panelProps, prefixCls) {
      const expandIcon = getComponent(this, 'expandIcon', panelProps);
      const icon = expandIcon || <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />;
      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
        ? cloneElement(icon, {
            class: `${prefixCls}-arrow`,
          })
        : icon;
    },
    handleChange(activeKey) {
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
      [className]: className,
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-icon-position-${expandIconPosition}`]: true,
    };
    const rcCollapeProps = {
      ...getOptionProps(this),
      prefixCls,
      expandIcon: panelProps => this.renderExpandIcon(panelProps, prefixCls),
      class: collapseClassName,
      ...restAttrs,
      onChange: this.handleChange,
      'onUpdate:change': undefined,
    };

    return <VcCollapse {...rcCollapeProps}>{getSlot(this)}</VcCollapse>;
  },
};
