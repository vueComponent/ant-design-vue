'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Group = exports.Button = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Button = {
  'extends': _Radio2['default'],
  name: 'ARadioButton',
  props: (0, _extends3['default'])({}, _Radio2['default'].props, {
    prefixCls: {
      'default': 'ant-radio-button',
      type: String
    }
  })
};
_Radio2['default'].Group = _Group2['default'];
_Radio2['default'].Button = Button;
exports.Button = Button;
exports.Group = _Group2['default'];
exports['default'] = _Radio2['default'];