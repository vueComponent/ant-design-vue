/* eslint-disable */
const Track = {
  functional: true,
  render(h, context) {
    const { included, vertical, offset, length, reverse } = context.props;
    const { style, class: className } = context.data;

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
  },
};

export default Track;
