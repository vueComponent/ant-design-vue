import { inject, cloneVNode } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import {
  getOptionProps,
  getPropsData,
  initDefaultProps,
  filterEmpty,
  getComponent,
} from '../_util/props-util';
import TimelineItem from './TimelineItem';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { ConfigConsumerProps } from '../config-provider';

export const TimelineProps = {
  prefixCls: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.string,
  reverse: PropTypes.bool,
  mode: PropTypes.oneOf(['left', 'alternate', 'right', '']),
};

export default {
  name: 'ATimeline',
  props: initDefaultProps(TimelineProps, {
    reverse: false,
    mode: '',
  }),
  setup() {
    const configProvider = inject('configProvider', ConfigConsumerProps);
    return {
      configProvider,
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, reverse, mode } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('timeline', customizePrefixCls);

    const pendingDot = getComponent(this, 'pendingDot');
    const pending = getComponent(this, 'pending');
    const pendingNode = typeof pending === 'boolean' ? null : pending;
    const classString = classNames(prefixCls, {
      [`${prefixCls}-pending`]: !!pending,
      [`${prefixCls}-reverse`]: !!reverse,
      [`${prefixCls}-${mode}`]: !!mode,
    });
    const children = filterEmpty(this.$slots.default && this.$slots.default());
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

    const getPositionCls = (ele, idx) => {
      const eleProps = getPropsData(ele);
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

    const timelineProps = {
      class: classString,
    };
    return <ul {...timelineProps}>{items}</ul>;
  },
};
