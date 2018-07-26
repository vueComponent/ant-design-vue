'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _sr_RS = require('../../vc-calendar/src/locale/sr_RS');

var _sr_RS2 = _interopRequireDefault(_sr_RS);

var _sr_RS3 = require('../../time-picker/locale/sr_RS');

var _sr_RS4 = _interopRequireDefault(_sr_RS3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Izaberite datum',
    rangePlaceholder: ['Početni datum', 'Krajnji datum']
  }, _sr_RS2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _sr_RS4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];