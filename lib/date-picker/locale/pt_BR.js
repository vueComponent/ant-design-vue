'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _pt_BR = require('../../vc-calendar/src/locale/pt_BR');

var _pt_BR2 = _interopRequireDefault(_pt_BR);

var _pt_BR3 = require('../../time-picker/locale/pt_BR');

var _pt_BR4 = _interopRequireDefault(_pt_BR3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Selecionar data',
    rangePlaceholder: ['Data de início', 'Data de fim']
  }, _pt_BR2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _pt_BR4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];