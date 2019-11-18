import classNames from 'classnames';
import { isValidElement } from '../../../_util/props-util';

const Marks = {
  functional: true,
  render(h, context) {
    const {
      className,
      vertical,
      marks,
      included,
      upperBound,
      lowerBound,
      max,
      min,
    } = context.props;
    const { clickLabel } = context.listeners;
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
          bottom: `${((point - min) / range) * 100}%`,
        };

        const leftStyle = {
          left: `${((point - min) / range) * 100}%`,
          transform: `translateX(-50%)`,
          msTransform: `translateX(-50%)`,
        };

        const style = vertical ? bottomStyle : leftStyle;
        const markStyle = markPointIsObject ? { ...style, ...markPoint.style } : style;
        return (
          <span
            class={markClassName}
            style={markStyle}
            key={point}
            onMousedown={e => clickLabel(e, point)}
            onTouchstart={e => clickLabel(e, point)}
          >
            {markLabel}
          </span>
        );
      });

    return <div class={className}>{elements}</div>;
  },
};

export default Marks;
