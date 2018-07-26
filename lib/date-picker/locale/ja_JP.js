'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ja_JP = require('../../vc-calendar/src/locale/ja_JP');

var _ja_JP2 = _interopRequireDefault(_ja_JP);

var _ja_JP3 = require('../../time-picker/locale/ja_JP');

var _ja_JP4 = _interopRequireDefault(_ja_JP3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var locale = {
  lang: (0, _extends3['default'])({
    placeholder: '日付を選択',
    rangePlaceholder: ['開始日付', '終了日付']
  }, _ja_JP2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ja_JP4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];