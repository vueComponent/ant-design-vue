"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = uid;
var now = +new Date();
var index = 0;

function uid() {
  return "vc-upload-" + now + "-" + ++index;
}
module.exports = exports["default"];