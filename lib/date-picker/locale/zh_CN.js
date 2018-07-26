'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _zh_CN = require('../../vc-calendar/src/locale/zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

var _zh_CN3 = require('../../time-picker/locale/zh_CN');

var _zh_CN4 = _interopRequireDefault(_zh_CN3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var locale = {
  lang: (0, _extends3['default'])({
    placeholder: '请选择日期',
    rangePlaceholder: ['开始日期', '结束日期']
  }, _zh_CN2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _zh_CN4['default'])

  // should add whitespace between char in Button
};locale.lang.ok = '确 定';

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

exports['default'] = locale;
module.exports = exports['default'];