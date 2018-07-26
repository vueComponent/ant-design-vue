'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = exports.Line = undefined;

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

var _Circle = require('./Circle');

var _Circle2 = _interopRequireDefault(_Circle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.Line = _Line2['default'];
exports.Circle = _Circle2['default'];
exports['default'] = {
  Line: _Line2['default'],
  Circle: _Circle2['default']
};