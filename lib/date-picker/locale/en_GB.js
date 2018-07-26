'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _en_GB = require('../../vc-calendar/src/locale/en_GB');

var _en_GB2 = _interopRequireDefault(_en_GB);

var _en_GB3 = require('../../time-picker/locale/en_GB');

var _en_GB4 = _interopRequireDefault(_en_GB3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date']
  }, _en_GB2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _en_GB4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];