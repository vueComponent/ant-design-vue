import { inject } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps, getComponent } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export const TimeLineItemProps = {
  prefixCls: PropTypes.string,
  color: PropTypes.string,
  dot: PropTypes.any,
  pending: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right', '']).def(''),
};

export default {
  name: 'ATimelineItem',
  props: initDefaultProps(TimeLineItemProps, {
    color: 'blue',
    pending: false,
  }),
  setup() {
    const configProvider = inject('configProvider', ConfigConsumerProps);
    return {
      configProvider,
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, color = '', pending } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('timeline', customizePrefixCls);

    const dot = getComponent(this, 'dot');
    const itemClassName = classNames({
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-pending`]: pending,
    });

    const dotClassName = classNames({
      [`${prefixCls}-item-head`]: true,
      [`${prefixCls}-item-head-custom`]: dot,
      [`${prefixCls}-item-head-${color}`]: true,
    });
    return (
      <li class={itemClassName}>
        <div class={`${prefixCls}-item-tail`} />
        <div
          class={dotClassName}
          style={{ borderColor: /blue|red|green|gray/.test(color) ? undefined : color }}
        >
          {dot}
        </div>
        <div class={`${prefixCls}-item-content`}>
          {this.$slots.default && this.$slots.default()}
        </div>
      </li>
    );
  },
};
