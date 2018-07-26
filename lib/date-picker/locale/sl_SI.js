'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _sl_SI = require('../../time-picker/locale/sl_SI');

var _sl_SI2 = _interopRequireDefault(_sl_SI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: {
    placeholder: 'Izberite datum',
    rangePlaceholder: ['Začetni datum', 'Končni datum'],
    today: 'Danes',
    now: 'Trenutno',
    backToToday: 'Nazaj na trenutni datum',
    ok: 'Ok',
    clear: 'Počisti',
    month: 'Mesec',
    year: 'Leto',
    timeSelect: 'Izberi čas',
    dateSelect: 'Izberi datum',
    monthSelect: 'Izberite mesec',
    yearSelect: 'Izberite leto',
    decadeSelect: 'Izberite desetletje',
    yearFormat: 'YYYY',
    dateFormat: 'D.M.YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'D.M.YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Prejšnji mesec (PageUp)',
    nextMonth: 'Naslednji mesec (PageDown)',
    previousYear: 'Lansko leto (Control + left)',
    nextYear: 'Naslednje leto (Control + right)',
    previousDecade: 'Prejšnje desetletje',
    nextDecade: 'Naslednje desetletje',
    previousCentury: 'Zadnje stoletje',
    nextCentury: 'Naslednje stoletje'
  },
  timePickerLocale: (0, _extends3['default'])({}, _sl_SI2['default'])

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

};exports['default'] = locale;
module.exports = exports['default'];