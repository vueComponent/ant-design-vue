'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cssAnimation = require('./css-animation');

var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var noop = function noop() {};
var getTransitionProps = function getTransitionProps(transitionName) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var beforeEnter = opt.beforeEnter,
      enter = opt.enter,
      leave = opt.leave,
      afterLeave = opt.afterLeave,
      _opt$appear = opt.appear,
      appear = _opt$appear === undefined ? true : _opt$appear,
      tag = opt.tag;

  var transitionProps = {
    props: {
      appear: appear,
      css: false
    },
    on: {
      beforeEnter: beforeEnter || noop,
      enter: enter || function (el, done) {
        (0, _cssAnimation2['default'])(el, transitionName + '-enter', done);
      },
      leave: leave || function (el, done) {
        (0, _cssAnimation2['default'])(el, transitionName + '-leave', done);
      },
      afterLeave: afterLeave || noop
    }
    // transition-group
  };if (tag) {
    transitionProps.tag = tag;
  }
  return transitionProps;
};

exports['default'] = getTransitionProps;
module.exports = exports['default'];