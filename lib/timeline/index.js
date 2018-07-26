'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeLineItemProps = exports.TimelineProps = undefined;

var _Timeline = require('./Timeline');

Object.defineProperty(exports, 'TimelineProps', {
  enumerable: true,
  get: function get() {
    return _Timeline.TimelineProps;
  }
});

var _TimelineItem = require('./TimelineItem');

Object.defineProperty(exports, 'TimeLineItemProps', {
  enumerable: true,
  get: function get() {
    return _TimelineItem.TimeLineItemProps;
  }
});

var _Timeline2 = _interopRequireDefault(_Timeline);

var _TimelineItem2 = _interopRequireDefault(_TimelineItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Timeline2['default'].Item = _TimelineItem2['default'];

exports['default'] = _Timeline2['default'];