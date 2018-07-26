'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _bg_BG = require('../../vc-calendar/src/locale/bg_BG');

var _bg_BG2 = _interopRequireDefault(_bg_BG);

var _bg_BG3 = require('../../time-picker/locale/bg_BG');

var _bg_BG4 = _interopRequireDefault(_bg_BG3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Избор на дата',
    rangePlaceholder: ['Начална', 'Крайна']
  }, _bg_BG2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _bg_BG4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];