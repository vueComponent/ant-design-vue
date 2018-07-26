'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ca_ES = require('../../vc-calendar/src/locale/ca_ES');

var _ca_ES2 = _interopRequireDefault(_ca_ES);

var _ca_ES3 = require('../../time-picker/locale/ca_ES');

var _ca_ES4 = _interopRequireDefault(_ca_ES3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Seleccionar data',
    rangePlaceholder: ['Data inicial', 'Data final']
  }, _ca_ES2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ca_ES4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];