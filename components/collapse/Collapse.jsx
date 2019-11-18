import animation from '../_util/openAnimation';
import {
  getOptionProps,
  initDefaultProps,
  getComponentFromProp,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import VcCollapse, { collapseProps } from '../vc-collapse';
import Icon from '../icon';
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
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    renderExpandIcon(panelProps, prefixCls) {
      const expandIcon = getComponentFromProp(this, 'expandIcon', panelProps);
      const icon = expandIcon || (
        <Icon type="right" rotate={panelProps.isActive ? 90 : undefined} />
      );
      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
        ? cloneElement(icon, {
            class: `${prefixCls}-arrow`,
          })
        : icon;
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, bordered, $listeners } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('collapse', customizePrefixCls);

    const collapseClassName = {
      [`${prefixCls}-borderless`]: !bordered,
    };
    const rcCollapeProps = {
      props: {
        ...getOptionProps(this),
        prefixCls,
        expandIcon: panelProps => this.renderExpandIcon(panelProps, prefixCls),
      },
      class: collapseClassName,
      on: $listeners,
    };
    return <VcCollapse {...rcCollapeProps}>{this.$slots.default}</VcCollapse>;
  },
};
