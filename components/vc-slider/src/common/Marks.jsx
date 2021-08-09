import supportsPassive from '../../../_util/supportsPassive';
import classNames from '../../../_util/classNames';
import { isValidElement } from '../../../_util/props-util';

const Marks = (_, { attrs }) => {
  const {
    class: className,
    vertical,
    reverse,
    marks,
    included,
    upperBound,
    lowerBound,
    max,
    min,
    onClickLabel,
  } = attrs;
  const marksKeys = Object.keys(marks);

  const range = max - min;
  const elements = marksKeys
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(point => {
      const markPoint = typeof marks[point] === 'function' ? marks[point](h) : marks[point];
      const markPointIsObject = typeof markPoint === 'object' && !isValidElement(markPoint);
      const markLabel = markPointIsObject ? markPoint.label : markPoint;
      if (!markLabel && markLabel !== 0) {
        return null;
      }

      const isActive =
        (!included && point === upperBound) ||
        (included && point <= upperBound && point >= lowerBound);
      const markClassName = classNames({
        [`${className}-text`]: true,
        [`${className}-text-active`]: isActive,
      });

      const bottomStyle = {
        marginBottom: '-50%',
        [reverse ? 'top' : 'bottom']: `${((point - min) / range) * 100}%`,
      };

      const leftStyle = {
        transform: `translateX(-50%)`,
        msTransform: `translateX(-50%)`,
        [reverse ? 'right' : 'left']: reverse
          ? `${((point - min / 4) / range) * 100}%`
          : `${((point - min) / range) * 100}%`,
      };

      const style = vertical ? bottomStyle : leftStyle;
      const markStyle = markPointIsObject ? { ...style, ...markPoint.style } : style;
      const touchEvents = {
        [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: e => onClickLabel(e, point),
      };
      return (
        <span
          class={markClassName}
          style={markStyle}
          key={point}
          onMousedown={e => onClickLabel(e, point)}
          {...touchEvents}
        >
          {markLabel}
        </span>
      );
    });

  return <div class={className}>{elements}</div>;
};

Marks.inheritAttrs = false;
export default Marks;
