/* eslint-disable */
const Track = {
  functional: true,
  render(createElement, context) {
    const { included, vertical, offset, length } = context.props;
    const { style, class: className } = context.data;

    const positonStyle = vertical
      ? {
          bottom: `${offset}%`,
          height: `${length}%`,
        }
      : {
          left: `${offset}%`,
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
