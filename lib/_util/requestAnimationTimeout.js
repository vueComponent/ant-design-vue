'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAnimationTimeout = exports.cancelAnimationTimeout = undefined;

var _getRequestAnimationFrame = require('./getRequestAnimationFrame');

var _getRequestAnimationFrame2 = _interopRequireDefault(_getRequestAnimationFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var raf = (0, _getRequestAnimationFrame2['default'])();

var cancelAnimationTimeout = exports.cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return (0, _getRequestAnimationFrame.cancelRequestAnimationFrame)(frame.id);
};

var requestAnimationTimeout = exports.requestAnimationTimeout = function requestAnimationTimeout(callback, delay) {
  var start = Date.now();
  function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf(timeout);
    }
  }

  var frame = {
    id: raf(timeout)
  };

  return frame;
};