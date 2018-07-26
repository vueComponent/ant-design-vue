'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cssAnimation = require('./css-animation');

var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

var _getRequestAnimationFrame = require('./getRequestAnimationFrame');

var _getRequestAnimationFrame2 = _interopRequireDefault(_getRequestAnimationFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var reqAnimFrame = (0, _getRequestAnimationFrame2['default'])();

function animate(node, show, done) {
  var height = void 0;
  var requestAnimationFrameId = void 0;
  return (0, _cssAnimation2['default'])(node, 'ant-motion-collapse', {
    start: function start() {
      if (!show) {
        node.style.height = node.offsetHeight + 'px';
        node.style.opacity = 1;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
        node.style.opacity = 0;
      }
    },
    active: function active() {
      if (requestAnimationFrameId) {
        (0, _getRequestAnimationFrame.cancelRequestAnimationFrame)(requestAnimationFrameId);
      }
      requestAnimationFrameId = reqAnimFrame(function () {
        node.style.height = (show ? height : 0) + 'px';
        node.style.opacity = show ? 1 : 0;
      });
    },
    end: function end() {
      if (requestAnimationFrameId) {
        (0, _getRequestAnimationFrame.cancelRequestAnimationFrame)(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done();
    }
  });
}

var animation = {
  enter: function enter(node, done) {
    return animate(node, true, done);
  },
  leave: function leave(node, done) {
    return animate(node, false, done);
  }
};

exports['default'] = animation;
module.exports = exports['default'];