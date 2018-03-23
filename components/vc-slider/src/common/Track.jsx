/* eslint-disable */
const Track = {
  functional: true,
  render (createElement, context) {
    const { included, vertical, offset, length, style } = context.data

    const positonStyle = vertical ? {
      bottom: `${offset}%`,
      height: `${length}%`,
    } : {
      left: `${offset}%`,
      width: `${length}%`,
    }

    context.data.style = {
      ...style,
      ...positonStyle,
    }
    return included ? createElement('div', context.data, context.children) : null
  },
}

export default Track
