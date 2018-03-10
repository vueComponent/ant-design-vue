<script>
import PropTypes from '../_util/vue-types'
import ScrollNumber from './ScrollNumber'
import classNames from 'classnames'
import { initDefaultProps, filterEmpty } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'

export const BadgeProps = {
  /** Number to show in badge */
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string, null]),
  showZero: PropTypes.bool,
  /** Max count to show */
  overflowCount: PropTypes.number,
  /** whether to show red dot without number */
  dot: PropTypes.bool,
  prefixCls: PropTypes.string,
  scrollNumberPrefixCls: PropTypes.string,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.string,
  offset: PropTypes.array,
  numberStyle: PropTypes.object.def({}),
}

export default {
  props: initDefaultProps(BadgeProps, {
    prefixCls: 'ant-badge',
    scrollNumberPrefixCls: 'ant-scroll-number',
    count: null,
    showZero: false,
    dot: false,
    overflowCount: 99,
  }),

  render () {
    const {
      count,
      showZero,
      prefixCls,
      scrollNumberPrefixCls,
      overflowCount,
      dot,
      status,
      text,
      offset,
      $slots,
      numberStyle,
    } = this
    const isDot = dot || status
    let displayCount = count > overflowCount ? `${overflowCount}+` : count
    // dot mode don't need count
    if (isDot) {
      displayCount = ''
    }
    const children = filterEmpty($slots.default)
    const isZero = displayCount === '0' || displayCount === 0
    const isEmpty = displayCount === null || displayCount === undefined || displayCount === ''
    const hidden = (isEmpty || (isZero && !showZero)) && !isDot
    const statusCls = classNames({
      [`${prefixCls}-status-dot`]: !!status,
      [`${prefixCls}-status-${status}`]: !!status,
    })
    const scrollNumberCls = classNames({
      [`${prefixCls}-dot`]: isDot,
      [`${prefixCls}-count`]: !isDot,
      [`${prefixCls}-multiple-words`]: count && count.toString && count.toString().length > 1,
      [`${prefixCls}-status-${status}`]: !!status,
    })
    const badgeCls = classNames(prefixCls, {
      [`${prefixCls}-status`]: !!status,
      [`${prefixCls}-not-a-wrapper`]: !children.length,
    })
    const styleWithOffset = offset ? {
      marginTop: offset[0],
      marginLeft: offset[1],
      ...numberStyle,
    } : numberStyle
    // <Badge status="success" />

    if (!children.length && status) {
      return (
        <span class={badgeCls} style={styleWithOffset}>
          <span class={statusCls} />
          <span class={`${prefixCls}-status-text`}>{text}</span>
        </span>
      )
    }

    const scrollNumber = hidden ? null : (
      <ScrollNumber
        prefixCls={scrollNumberPrefixCls}
        v-show={!hidden}
        class={scrollNumberCls}
        count={displayCount}
        title={count}
        style={styleWithOffset}
      />
    )

    const statusText = (hidden || !text) ? null : (
      <span class={`${prefixCls}-status-text`}>{text}</span>
    )
    const transitionProps = getTransitionProps(children.length ? `${prefixCls}-zoom` : '')

    return (<span class={badgeCls}>
      {children}
      <transition {...transitionProps}>
        {scrollNumber}
      </transition>
      {statusText}
    </span>)
  },
}

</script>
