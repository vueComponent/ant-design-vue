'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fa_IR = require('../../vc-calendar/src/locale/fa_IR');

var _fa_IR2 = _interopRequireDefault(_fa_IR);

var _fa_IR3 = require('../../time-picker/locale/fa_IR');

var _fa_IR4 = _interopRequireDefault(_fa_IR3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'انتخاب تاریخ',
    rangePlaceholder: ['تاریخ شروع', 'تاریخ پایان']
  }, _fa_IR2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _fa_IR4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];