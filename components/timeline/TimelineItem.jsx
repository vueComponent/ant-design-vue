import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export const TimeLineItemProps = {
  prefixCls: PropTypes.string,
  color: PropTypes.string,
  dot: PropTypes.any,
  pending: PropTypes.bool,
};

export default {
  name: 'ATimelineItem',
  props: initDefaultProps(TimeLineItemProps, {
    color: 'blue',
    pending: false,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, color = '', pending } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('timeline', customizePrefixCls);

    const dot = getComponentFromProp(this, 'dot');
    const itemClassName = classNames({
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-pending`]: pending,
    });

    const dotClassName = classNames({
      [`${prefixCls}-item-head`]: true,
      [`${prefixCls}-item-head-custom`]: dot,
      [`${prefixCls}-item-head-${color}`]: true,
    });
    const liProps = {
      class: itemClassName,
      on: this.$listeners,
    };
    return (
      <li {...liProps}>
        <div class={`${prefixCls}-item-tail`} />
        <div
          class={dotClassName}
          style={{ borderColor: /blue|red|green/.test(color) ? undefined : color }}
        >
          {dot}
        </div>
        <div class={`${prefixCls}-item-content`}>{this.$slots.default}</div>
      </li>
    );
  },
};
