'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _et_EE = require('../../vc-calendar/src/locale/et_EE');

var _et_EE2 = _interopRequireDefault(_et_EE);

var _et_EE3 = require('../../time-picker/locale/et_EE');

var _et_EE4 = _interopRequireDefault(_et_EE3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 统一合并为完整的 Locale
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Vali kuupäev',
    rangePlaceholder: ['Algus kuupäev', 'Lõpu kuupäev']
  }, _et_EE2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _et_EE4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];