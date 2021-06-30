import type { ExtractPropTypes } from 'vue';
import { inject, cloneVNode, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getPropsData, filterEmpty, getComponent } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { TimelineItemProps } from './TimelineItem';
import TimelineItem from './TimelineItem';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

export const timelineProps = {
  prefixCls: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.string,
  reverse: PropTypes.looseBool,
  mode: PropTypes.oneOf(tuple('left', 'alternate', 'right', '')),
};

export type TimelineProps = Partial<ExtractPropTypes<typeof timelineProps>>;

export default defineComponent({
  name: 'ATimeline',
  props: initDefaultProps(timelineProps, {
    reverse: false,
    mode: '',
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, reverse, mode } = getOptionProps(this);
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('timeline', customizePrefixCls);

    const pendingDot = getComponent(this, 'pendingDot');
    const pending = getComponent(this, 'pending');
    const pendingNode = typeof pending === 'boolean' ? null : pending;
    const classString = classNames(prefixCls, {
      [`${prefixCls}-pending`]: !!pending,
      [`${prefixCls}-reverse`]: !!reverse,
      [`${prefixCls}-${mode}`]: !!mode,
    });
    const children = filterEmpty(this.$slots.default?.());
    // // Remove falsy items
    // const falsylessItems = filterEmpty(this.$slots.default)
    // const items = falsylessItems.map((item, idx) => {
    //   return cloneElement(item, {
    //     props: {
    //       last: falsylessItems.length - 1 === idx,
    //     },
    //   })
    // })
    const pendingItem = pending ? (
      <TimelineItem pending={!!pending} dot={pendingDot || <LoadingOutlined />}>
        {pendingNode}
      </TimelineItem>
    ) : null;

    const timeLineItems = reverse
      ? [pendingItem, ...children.reverse()]
      : [...children, pendingItem];

    const getPositionCls = (ele, idx: number) => {
      const eleProps = getPropsData(ele) as TimelineItemProps;
      if (mode === 'alternate') {
        if (eleProps.position === 'right') return `${prefixCls}-item-right`;
        if (eleProps.position === 'left') return `${prefixCls}-item-left`;
        return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
      }
      if (mode === 'left') return `${prefixCls}-item-left`;
      if (mode === 'right') return `${prefixCls}-item-right`;
      if (eleProps.position === 'right') return `${prefixCls}-item-right`;
      return '';
    };

    // Remove falsy items
    const truthyItems = timeLineItems.filter(item => !!item);
    const itemsCount = truthyItems.length;
    const lastCls = `${prefixCls}-item-last`;
    const items = truthyItems.map((ele, idx) => {
      const pendingClass = idx === itemsCount - 2 ? lastCls : '';
      const readyClass = idx === itemsCount - 1 ? lastCls : '';
      return cloneVNode(ele, {
        class: classNames([
          !reverse && !!pending ? pendingClass : readyClass,
          getPositionCls(ele, idx),
        ]),
      });
    });

    return <ul class={classString}>{items}</ul>;
  },
});
