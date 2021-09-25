import type { ExtractPropTypes } from 'vue';
import { cloneVNode, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TimelineItem from './TimelineItem';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';

export const timelineProps = () => ({
  prefixCls: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.any,
  reverse: PropTypes.looseBool,
  mode: PropTypes.oneOf(tuple('left', 'alternate', 'right', '')),
});

export type TimelineProps = Partial<ExtractPropTypes<ReturnType<typeof timelineProps>>>;

export default defineComponent({
  name: 'ATimeline',
  props: initDefaultProps(timelineProps(), {
    reverse: false,
    mode: '',
  }),
  slots: ['pending', 'pendingDot'],
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('timeline', props);
    const getPositionCls = (ele, idx: number) => {
      const eleProps = ele.props || {};
      if (props.mode === 'alternate') {
        if (eleProps.position === 'right') return `${prefixCls.value}-item-right`;
        if (eleProps.position === 'left') return `${prefixCls.value}-item-left`;
        return idx % 2 === 0 ? `${prefixCls.value}-item-left` : `${prefixCls.value}-item-right`;
      }
      if (props.mode === 'left') return `${prefixCls.value}-item-left`;
      if (props.mode === 'right') return `${prefixCls.value}-item-right`;
      if (eleProps.position === 'right') return `${prefixCls.value}-item-right`;
      return '';
    };

    return () => {
      const {
        pending = slots.pending?.(),
        pendingDot = slots.pendingDot?.(),
        reverse,
        mode,
      } = props;
      const pendingNode = typeof pending === 'boolean' ? null : pending;
      const children = filterEmpty(slots.default?.());

      const pendingItem = pending ? (
        <TimelineItem pending={!!pending} dot={pendingDot || <LoadingOutlined />}>
          {pendingNode}
        </TimelineItem>
      ) : null;

      if (pendingItem) {
        children.push(pendingItem);
      }

      const timeLineItems = reverse ? children.reverse() : children;

      const itemsCount = timeLineItems.length;
      const lastCls = `${prefixCls.value}-item-last`;
      const items = timeLineItems.map((ele, idx) => {
        const pendingClass = idx === itemsCount - 2 ? lastCls : '';
        const readyClass = idx === itemsCount - 1 ? lastCls : '';
        return cloneVNode(ele, {
          class: classNames([
            !reverse && !!pending ? pendingClass : readyClass,
            getPositionCls(ele, idx),
          ]),
        });
      });
      const hasLabelItem = timeLineItems.some(
        item => !!(item.props?.label || item.children?.label),
      );
      const classString = classNames(prefixCls.value, {
        [`${prefixCls.value}-pending`]: !!pending,
        [`${prefixCls.value}-reverse`]: !!reverse,
        [`${prefixCls.value}-${mode}`]: !!mode && !hasLabelItem,
        [`${prefixCls.value}-label`]: hasLabelItem,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });
      return <ul class={classString}>{items}</ul>;
    };
  },
});
