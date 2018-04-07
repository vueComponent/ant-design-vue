import classNames from 'classnames'
import PropTypes from '../_util/vue-types'
import { getOptionProps, initDefaultProps } from '../_util/props-util'
import Icon from '../icon'
import { Circle } from '../vc-progress'

function addUnit (num, unit) {
  const unitType = unit || 'px'
  return num ? num + unitType : null
}
const statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068',
}

export const ProgressProps = {
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(['success', 'active', 'exception']),
  showInfo: PropTypes.bool,
  strokeWidth: PropTypes.number,
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: PropTypes.oneOf(['default', 'small']),
}

export default {
  name: 'Progress',
  props: initDefaultProps(ProgressProps, {
    type: 'line',
    percent: 0,
    showInfo: true,
    trailColor: '#f3f3f3',
    prefixCls: 'ant-progress',
    size: 'default',
  }),

  render () {
    const props = getOptionProps(this)
    const {
      prefixCls, percent = 0, status, format, trailColor, size, successPercent,
      type, strokeWidth, width, showInfo, gapDegree = 0, gapPosition,
    } = props
    const progressStatus = parseInt((successPercent ? successPercent.toString() : percent.toString()), 10) >= 100 &&
    !('status' in props) ? 'success' : (status || 'normal')
    let progressInfo
    let progress
    const textFormatter = format || (percentNumber => `${percentNumber}%`)

    if (showInfo) {
      let text
      const iconType = (type === 'circle' || type === 'dashboard') ? '' : '-circle'
      if (progressStatus === 'exception') {
        text = format ? textFormatter(percent) : <Icon type={`cross${iconType}`} />
      } else if (progressStatus === 'success') {
        text = format ? textFormatter(percent) : <Icon type={`check${iconType}`} />
      } else {
        text = textFormatter(percent)
      }
      progressInfo = <span class={`${prefixCls}-text`}>{text}</span>
    }

    if (type === 'line') {
      const percentStyle = {
        width: `${percent}%`,
        height: addUnit(strokeWidth) || (size === 'small' ? '6px' : '8px'),
      }
      const successPercentStyle = {
        width: `${successPercent}%`,
        height: addUnit(strokeWidth) || (size === 'small' ? '6px' : '8px'),
      }
      const successSegment = successPercent !== undefined
        ? <div class={`${prefixCls}-success-bg`} style={successPercentStyle} />
        : null
      progress = (
        <div>
          <div class={`${prefixCls}-outer`}>
            <div class={`${prefixCls}-inner`}>
              <div class={`${prefixCls}-bg`} style={percentStyle} />
              {successSegment}
            </div>
          </div>
          {progressInfo}
        </div>
      )
    } else if (type === 'circle' || type === 'dashboard') {
      const circleSize = width || 120
      const circleStyle = {
        width: addUnit(circleSize),
        height: addUnit(circleSize),
        fontSize: addUnit(circleSize * 0.15 + 6),
      }
      const circleWidth = strokeWidth || 6
      const gapPos = gapPosition || type === 'dashboard' && 'bottom' || 'top'
      const gapDeg = gapDegree || (type === 'dashboard' && 75)
      progress = (
        <div class={`${prefixCls}-inner`} style={circleStyle}>
          <Circle
            percent={percent}
            strokeWidth={circleWidth}
            trailWidth={circleWidth}
            strokeColor={statusColorMap[progressStatus]}
            trailColor={trailColor}
            prefixCls={prefixCls}
            gapDegree={gapDeg || 0}
            gapPosition={gapPos}
          />
          {progressInfo}
        </div>
      )
    }

    const classString = classNames(prefixCls, {
      [`${prefixCls}-${type === 'dashboard' && 'circle' || type}`]: true,
      [`${prefixCls}-status-${progressStatus}`]: true,
      [`${prefixCls}-show-info`]: showInfo,
      [`${prefixCls}-${size}`]: size,
    })

    const progressProps = {
      on: this.$listeners,
      class: classString,
    }
    return (
      <div {...progressProps}>
        {progress}
      </div>
    )
  },
}
