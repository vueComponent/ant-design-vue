import animation from '../_util/openAnimation';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import VcCollapse, { collapseProps } from '../vc-collapse';
import Icon from '../icon';
export default {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: initDefaultProps(collapseProps, {
    prefixCls: 'ant-collapse',
    bordered: true,
    openAnimation: animation,
  }),
  methods: {
    renderExpandIcon() {
      return <Icon type="right" class="arrow" />;
    },
  },
  render() {
    const { prefixCls, bordered, $listeners } = this;
    const collapseClassName = {
      [`${prefixCls}-borderless`]: !bordered,
    };
    const rcCollapeProps = {
      props: {
        ...getOptionProps(this),
        expandIcon: this.renderExpandIcon,
      },
      class: collapseClassName,
      on: $listeners,
    };
    return <VcCollapse {...rcCollapeProps}>{this.$slots.default}</VcCollapse>;
  },
};
