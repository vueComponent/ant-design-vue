'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _uk_UA = require('../../vc-calendar/src/locale/uk_UA');

var _uk_UA2 = _interopRequireDefault(_uk_UA);

var _uk_UA3 = require('../../time-picker/locale/uk_UA');

var _uk_UA4 = _interopRequireDefault(_uk_UA3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Оберіть дату',
    rangePlaceholder: ['Початкова дата', 'Кінцева дата']
  }, _uk_UA2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _uk_UA4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];