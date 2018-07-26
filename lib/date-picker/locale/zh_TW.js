'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _zh_TW = require('../../vc-calendar/src/locale/zh_TW');

var _zh_TW2 = _interopRequireDefault(_zh_TW);

var _zh_TW3 = require('../../time-picker/locale/zh_TW');

var _zh_TW4 = _interopRequireDefault(_zh_TW3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var locale = {
  lang: (0, _extends3['default'])({
    placeholder: '請選擇日期',
    rangePlaceholder: ['開始日期', '結束日期']
  }, _zh_TW2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _zh_TW4['default'])
};

locale.lang.ok = '確 定';

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

exports['default'] = locale;
module.exports = exports['default'];