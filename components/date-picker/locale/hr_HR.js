'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _hr_HR = require('../../vc-calendar/src/locale/hr_HR');

var _hr_HR2 = _interopRequireDefault(_hr_HR);

var _hr_HR3 = require('../../time-picker/locale/hr_HR');

var _hr_HR4 = _interopRequireDefault(_hr_HR3);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])(
    {
      placeholder: 'Odaberite datum',
      rangePlaceholder: ['Početni datum', 'Završni datum'],
    },
    _hr_HR2['default'],
  ),
  timePickerLocale: (0, _extends3['default'])({}, _hr_HR4['default']),
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

exports['default'] = locale;
