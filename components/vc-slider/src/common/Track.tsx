/* eslint-disable */
const Track = (_, { attrs }) => {
  const { included, vertical, style, class: className } = attrs;
  let { length, offset, reverse } = attrs;
  if (length < 0) {
    reverse = !reverse;
    length = Math.abs(length);
    offset = 100 - offset;
  }
  const positonStyle = vertical
    ? {
        [reverse ? 'top' : 'bottom']: `${offset}%`,
        [reverse ? 'bottom' : 'top']: 'auto',
        height: `${length}%`,
      }
    : {
        [reverse ? 'right' : 'left']: `${offset}%`,
        [reverse ? 'left' : 'right']: 'auto',
        width: `${length}%`,
      };

  const elStyle = {
    ...style,
    ...positonStyle,
  };
  return included ? <div class={className} style={elStyle} /> : null;
};

Track.inheritAttrs = false;
export default Track;
