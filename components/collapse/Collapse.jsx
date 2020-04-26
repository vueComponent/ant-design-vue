import animation from '../_util/openAnimation';
import {
  getOptionProps,
  initDefaultProps,
  getComponentFromProp,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import VcCollapse, { collapseProps } from '../vc-collapse';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: initDefaultProps(collapseProps(), {
    bordered: true,
    openAnimation: animation,
    expandIconPosition: '',
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    renderExpandIcon(panelProps, prefixCls) {
      const expandIcon = getComponentFromProp(this, 'expandIcon', panelProps);
      const icon = expandIcon || <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />;
      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
        ? cloneElement(icon, {
            class: `${prefixCls}-arrow`,
          })
        : icon;
    },
    getIconPosition(direction) {
      const { expandIconPosition } = this;
      console.log(expandIconPosition);
      if (expandIconPosition !== '' && expandIconPosition !== undefined) {
        return expandIconPosition;
      }
      return direction === 'rtl' ? 'right' : 'left';
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, bordered } = this;
    const { getPrefixCls, direction } = this.configProvider;
    const iconPosition = this.getIconPosition(direction);
    const prefixCls = getPrefixCls('collapse', customizePrefixCls);

    const collapseClassName = {
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-icon-position-${iconPosition}`]: true,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    };
    const rcCollapeProps = {
      props: {
        ...getOptionProps(this),
        prefixCls,
        expandIcon: panelProps => this.renderExpandIcon(panelProps, prefixCls),
      },
      class: collapseClassName,
      on: getListeners(this),
    };
    return <VcCollapse {...rcCollapeProps}>{this.$slots.default}</VcCollapse>;
  },
};
