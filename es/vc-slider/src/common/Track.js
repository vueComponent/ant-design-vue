import _extends from "babel-runtime/helpers/extends";
/* eslint-disable */
var Track = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var _context$props = context.props,
        included = _context$props.included,
        vertical = _context$props.vertical,
        offset = _context$props.offset,
        length = _context$props.length;
    var _context$data = context.data,
        style = _context$data.style,
        className = _context$data["class"];


    var positonStyle = vertical ? {
      bottom: offset + "%",
      height: length + "%"
    } : {
      left: offset + "%",
      width: length + "%"
    };

    var elStyle = _extends({}, style, positonStyle);
    return included ? h("div", { "class": className, style: elStyle }) : null;
  }
};

export default Track;