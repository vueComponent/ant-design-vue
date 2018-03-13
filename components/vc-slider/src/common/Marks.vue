import React from 'react'
import classNames from 'classnames'

const Marks = ({
  className,
  vertical,
  marks,
  included,
  upperBound,
  lowerBound,
  max, min,
  onClickLabel,
}) => {
  const marksKeys = Object.keys(marks)
  const marksCount = marksKeys.length
  const unit = marksCount > 1 ? 100 / (marksCount - 1) : 100
  const markWidth = unit * 0.9

  const range = max - min
  const elements = marksKeys.map(parseFloat).sort((a, b) => a - b).map(point => {
    const markPoint = marks[point]
    const markPointIsObject = typeof markPoint === 'object' &&
            !React.isValidElement(markPoint)
    const markLabel = markPointIsObject ? markPoint.label : markPoint
    if (!markLabel && markLabel !== 0) {
      return null
    }

    const isActive = (!included && point === upperBound) ||
            (included && point <= upperBound && point >= lowerBound)
    const markClassName = classNames({
      [`${className}-text`]: true,
      [`${className}-text-active`]: isActive,
    })

    const bottomStyle = {
      marginBottom: '-50%',
      bottom: `${(point - min) / range * 100}%`,
    }

    const leftStyle = {
      width: `${markWidth}%`,
      marginLeft: `${-markWidth / 2}%`,
      left: `${(point - min) / range * 100}%`,
    }

    const style = vertical ? bottomStyle : leftStyle
    const markStyle = markPointIsObject
            ? { ...style, ...markPoint.style } : style
    return (
      <span
        className={markClassName}
        style={markStyle}
        key={point}
        onMouseDown={(e) => onClickLabel(e, point)}
        onTouchStart={(e) => onClickLabel(e, point)}
      >
        {markLabel}
      </span>
    )
  })

  return <div className={className}>{elements}</div>
};

export default Marks
