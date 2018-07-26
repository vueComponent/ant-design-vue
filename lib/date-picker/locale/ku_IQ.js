'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ku_IQ = require('../../vc-calendar/src/locale/ku_IQ');

var _ku_IQ2 = _interopRequireDefault(_ku_IQ);

var _ku_IQ3 = require('../../time-picker/locale/ku_IQ');

var _ku_IQ4 = _interopRequireDefault(_ku_IQ3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Dîrok hilbijêre',
    rangePlaceholder: ['Dîroka destpêkê', 'Dîroka dawîn']
  }, _ku_IQ2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ku_IQ4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json
};exports['default'] = locale;
module.exports = exports['default'];