'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _is_IS = require('../../vc-calendar/src/locale/is_IS');

var _is_IS2 = _interopRequireDefault(_is_IS);

var _is_IS3 = require('../../time-picker/locale/is_IS');

var _is_IS4 = _interopRequireDefault(_is_IS3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Veldu dag',
    rangePlaceholder: ['Upphafsdagur', 'Lokadagur']
  }, _is_IS2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _is_IS4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];