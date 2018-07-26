'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _nb_NO = require('../../vc-calendar/src/locale/nb_NO');

var _nb_NO2 = _interopRequireDefault(_nb_NO);

var _nb_NO3 = require('../../time-picker/locale/nb_NO');

var _nb_NO4 = _interopRequireDefault(_nb_NO3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Velg dato',
    rangePlaceholder: ['Startdato', 'Sluttdato']
  }, _nb_NO2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _nb_NO4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];