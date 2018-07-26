'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcCalendar = require('../vc-calendar');

var _vcCalendar2 = _interopRequireDefault(_vcCalendar);

var _MonthCalendar = require('../vc-calendar/src/MonthCalendar');

var _MonthCalendar2 = _interopRequireDefault(_MonthCalendar);

var _createPicker = require('./createPicker');

var _createPicker2 = _interopRequireDefault(_createPicker);

var _wrapPicker = require('./wrapPicker');

var _wrapPicker2 = _interopRequireDefault(_wrapPicker);

var _RangePicker = require('./RangePicker');

var _RangePicker2 = _interopRequireDefault(_RangePicker);

var _WeekPicker = require('./WeekPicker');

var _WeekPicker2 = _interopRequireDefault(_WeekPicker);

var _interface = require('./interface');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DatePicker = (0, _wrapPicker2['default'])((0, _extends3['default'])({}, (0, _createPicker2['default'])(_vcCalendar2['default'], (0, _interface.DatePickerProps)()), { name: 'ADatePicker' }), (0, _interface.DatePickerProps)());

var MonthPicker = (0, _wrapPicker2['default'])((0, _extends3['default'])({}, (0, _createPicker2['default'])(_MonthCalendar2['default'], (0, _interface.MonthPickerProps)()), { name: 'AMonthPicker' }), (0, _interface.MonthPickerProps)(), 'YYYY-MM');

(0, _extends3['default'])(DatePicker, {
  RangePicker: (0, _wrapPicker2['default'])(_RangePicker2['default'], (0, _interface.RangePickerProps)()),
  MonthPicker: MonthPicker,
  WeekPicker: (0, _wrapPicker2['default'])(_WeekPicker2['default'], (0, _interface.WeekPickerProps)(), 'gggg-wo')
});

exports['default'] = DatePicker;
module.exports = exports['default'];