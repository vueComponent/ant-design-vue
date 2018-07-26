'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeekPickerProps = exports.RangePickerProps = exports.RangePickerValue = exports.MonthPickerProps = exports.DatePickerProps = exports.SinglePickerProps = exports.PickerProps = exports.MomentType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MomentType = exports.MomentType = {
  type: Object,
  validator: function validator(value) {
    return value === undefined || moment.isMoment(value);
  }
};
// import { TimePickerProps } from '../time-picker'
var PickerProps = exports.PickerProps = function PickerProps() {
  return {
    transitionName: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    inputPrefixCls: _vueTypes2['default'].string,
    format: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    allowClear: _vueTypes2['default'].bool,
    popupStyle: _vueTypes2['default'].object,
    dropdownClassName: _vueTypes2['default'].string,
    locale: _vueTypes2['default'].any,
    localeCode: _vueTypes2['default'].string,
    size: _vueTypes2['default'].oneOf(['large', 'small', 'default']),
    getCalendarContainer: _vueTypes2['default'].func,
    open: _vueTypes2['default'].bool,
    // onOpenChange: PropTypes.(status: bool) => void,
    disabledDate: _vueTypes2['default'].func,
    renderExtraFooter: _vueTypes2['default'].any,
    showToday: _vueTypes2['default'].bool,
    dateRender: _vueTypes2['default'].any, // (current: moment.Moment, today: moment.Moment) => React.ReactNode,
    pickerClass: _vueTypes2['default'].string,
    pickerInputClass: _vueTypes2['default'].string,
    timePicker: _vueTypes2['default'].any,
    autoFocus: _vueTypes2['default'].bool
  };
};

var SinglePickerProps = exports.SinglePickerProps = function SinglePickerProps() {
  return {
    value: MomentType,
    defaultValue: MomentType,
    defaultPickerValue: MomentType
    // onChange?: (date: moment.Moment, dateString: string) => void;
  };
};

var DatePickerProps = exports.DatePickerProps = function DatePickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    showTime: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
    open: _vueTypes2['default'].bool,
    disabledTime: _vueTypes2['default'].func,
    // onOpenChange?: (status: bool) => void;
    // onOk?: (selectedTime: moment.Moment) => void;
    placeholder: _vueTypes2['default'].string
  });
};

var MonthPickerProps = exports.MonthPickerProps = function MonthPickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    placeholder: _vueTypes2['default'].string,
    monthCellContentRender: _vueTypes2['default'].func
  });
};
function isMomentArray(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || moment.isMoment(val);
    }) !== -1;
  }
  return false;
}

var RangePickerValue = exports.RangePickerValue = _vueTypes2['default'].custom(isMomentArray);
// export const RangePickerPresetRange = PropTypes.oneOfType([RangePickerValue, PropTypes.func])

var RangePickerProps = exports.RangePickerProps = function RangePickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), {
    value: RangePickerValue,
    defaultValue: RangePickerValue,
    defaultPickerValue: RangePickerValue,
    // onChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
    // onCalendarChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
    // onOk?: (selectedTime: moment.Moment) => void;
    showTime: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
    ranges: _vueTypes2['default'].object,
    placeholder: _vueTypes2['default'].arrayOf(String),
    mode: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(String)]),
    disabledTime: _vueTypes2['default'].func,
    showToday: _vueTypes2['default'].bool
    // onPanelChange?: (value?: RangePickerValue, mode?: string | string[]) => void;
  });
};

var WeekPickerProps = exports.WeekPickerProps = function WeekPickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    placeholder: _vueTypes2['default'].string
  });
};

// export interface DatePickerDecorator extends React.ClassicComponentClass<DatePickerProps> {
//   RangePicker: React.ClassicComponentClass<RangePickerProps>;
//   MonthPicker: React.ClassicComponentClass<MonthPickerProps>;
//   WeekPicker: React.ClassicComponentClass<WeexPickerProps>;
// }