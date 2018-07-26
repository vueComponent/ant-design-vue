'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ar_EG = require('../../vc-calendar/src/locale/ar_EG');

var _ar_EG2 = _interopRequireDefault(_ar_EG);

var _ar_EG3 = require('../../time-picker/locale/ar_EG');

var _ar_EG4 = _interopRequireDefault(_ar_EG3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'اختيار التاريخ',
    rangePlaceholder: ['البداية', 'النهاية']
  }, _ar_EG2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ar_EG4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

};exports['default'] = locale;
module.exports = exports['default'];