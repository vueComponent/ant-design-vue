import { defineComponent, ExtractPropTypes, inject } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

export const timeLineItemProps = {
  prefixCls: PropTypes.string,
  color: PropTypes.string,
  dot: PropTypes.any,
  pending: PropTypes.looseBool,
  position: PropTypes.oneOf(tuple('left', 'right', '')).def(''),
};

export type TimeLineItemProps = Partial<ExtractPropTypes<typeof timeLineItemProps>>;

export default defineComponent({
  name: 'ATimelineItem',
  props: initDefaultProps(timeLineItemProps, {
    color: 'blue',
    pending: false,
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, color = '', pending } = getOptionProps(this);
    const { getPrefixCls } = this.configProvider;
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
        <div class={`${prefixCls}-item-content`}>{this.$slots.default?.()}</div>
      </li>
    );
  },
});
