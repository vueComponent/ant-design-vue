'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fr_BE = require('../../vc-calendar/src/locale/fr_BE');

var _fr_BE2 = _interopRequireDefault(_fr_BE);

var _fr_BE3 = require('../../time-picker/locale/fr_BE');

var _fr_BE4 = _interopRequireDefault(_fr_BE3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Sélectionner une date',
    rangePlaceholder: ['Date de début', 'Date de fin']
  }, _fr_BE2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _fr_BE4['default'])

  // All settings at: https://github.com/ant-design/ant-design/issues/424

};exports['default'] = locale;
module.exports = exports['default'];