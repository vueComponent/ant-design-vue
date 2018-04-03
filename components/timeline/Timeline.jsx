import classNames from 'classnames'
import PropTypes from '../_util/vue-types'
import { getOptionProps, initDefaultProps, filterEmpty, getComponentFromProp } from '../_util/props-util'
import { cloneElement } from '../_util/vnode'
import TimelineItem from './TimelineItem'
import Icon from '../icon'

export const TimelineProps = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
}

export default {
  name: 'Timeline',
  props: initDefaultProps(TimelineProps, {
    prefixCls: 'ant-timeline',
  }),
  render () {
    const { prefixCls, ...restProps } = getOptionProps(this)
    const pending = getComponentFromProp(this, 'pending')
    const pendingNode = typeof pending === 'boolean' ? null : pending
    const classString = classNames(prefixCls, {
      [`${prefixCls}-pending`]: !!pending,
    })
    // Remove falsy items
    const falsylessItems = filterEmpty(this.$slots.default)
    const items = falsylessItems.map((item, idx) => {
      return cloneElement(item, {
        props: {
          last: falsylessItems.length - 1 === idx,
        },
      })
    })
    const pendingItem = (pending) ? (
      <TimelineItem
        pending={!!pending}
      >
        <Icon slot='dot' type='loading' />
        {pendingNode}
      </TimelineItem>
    ) : null
    const timelineProps = {
      props: {
        ...restProps,
      },
      class: classString,
      on: this.$listeners,
    }
    return (
      <ul {...timelineProps}>
        {items}
        {pendingItem}
      </ul>
    )
  },
}
