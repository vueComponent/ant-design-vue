"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = callMoment;
// https://github.com/moment/moment/issues/3650
function callMoment(moment) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return (moment["default"] || moment).apply(undefined, args);
}
module.exports = exports["default"];