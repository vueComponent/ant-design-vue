'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _de_DE = require('../../vc-calendar/src/locale/de_DE');

var _de_DE2 = _interopRequireDefault(_de_DE);

var _de_DE3 = require('../../time-picker/locale/de_DE');

var _de_DE4 = _interopRequireDefault(_de_DE3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Datum auswählen',
    rangePlaceholder: ['Startdatum', 'Enddatum']
  }, _de_DE2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _de_DE4['default'])

  // All settings at: https://github.com/ant-design/ant-design/issues/424

};exports['default'] = locale;
module.exports = exports['default'];