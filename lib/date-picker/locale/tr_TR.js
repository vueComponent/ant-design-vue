'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _en_US = require('../../vc-calendar/src/locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _tr_TR = require('../../time-picker/locale/tr_TR');

var _tr_TR2 = _interopRequireDefault(_tr_TR);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Tarih Seç',
    rangePlaceholder: ['Başlangıç Tarihi', 'Bitiş Tarihi']
  }, _en_US2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _tr_TR2['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];