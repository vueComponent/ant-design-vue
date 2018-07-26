'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fi_FI = require('../../vc-calendar/src/locale/fi_FI');

var _fi_FI2 = _interopRequireDefault(_fi_FI);

var _fi_FI3 = require('../../time-picker/locale/fi_FI');

var _fi_FI4 = _interopRequireDefault(_fi_FI3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Valitse päivä',
    rangePlaceholder: ['Alku päivä', 'Loppu päivä']
  }, _fi_FI2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _fi_FI4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];