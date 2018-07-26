'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ru_RU = require('../../vc-calendar/src/locale/ru_RU');

var _ru_RU2 = _interopRequireDefault(_ru_RU);

var _ru_RU3 = require('../../time-picker/locale/ru_RU');

var _ru_RU4 = _interopRequireDefault(_ru_RU3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Created by Andrey Gayvoronsky on 13/04/16.
 */

var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Выберите дату',
    rangePlaceholder: ['Начальная дата', 'Конечная дата']
  }, _ru_RU2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ru_RU4['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};exports['default'] = locale;
module.exports = exports['default'];