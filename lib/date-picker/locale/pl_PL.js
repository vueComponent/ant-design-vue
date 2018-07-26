'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _pl_PL = require('../../vc-calendar/src/locale/pl_PL');

var _pl_PL2 = _interopRequireDefault(_pl_PL);

var _pl_PL3 = require('../../time-picker/locale/pl_PL');

var _pl_PL4 = _interopRequireDefault(_pl_PL3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Wybierz datę',
    rangePlaceholder: ['Data początkowa', 'Data końcowa']
  }, _pl_PL2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _pl_PL4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];