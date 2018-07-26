"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

    var elStyle = (0, _extends3["default"])({}, style, positonStyle);
    return included ? h("div", { "class": className, style: elStyle }) : null;
  }
};

exports["default"] = Track;
module.exports = exports["default"];