/* eslint-disable */
const Track = (_, { attrs }) => {
  const { included, vertical, offset, length, reverse, style, class: className } = attrs;

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
