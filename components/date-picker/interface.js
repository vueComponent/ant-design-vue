// import { TimePickerProps } from '../time-picker'
import PropTypes from '../_util/vue-types';
import { TimesType, TimeType } from '../_util/moment-util';

export const PickerProps = () => ({
  name: PropTypes.string,
  transitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  suffixIcon: PropTypes.any,
  popupStyle: PropTypes.object,
  dropdownClassName: PropTypes.string,
  locale: PropTypes.any,
  localeCode: PropTypes.string,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  getCalendarContainer: PropTypes.func,
  open: PropTypes.bool,
  disabledDate: PropTypes.func,
  showToday: PropTypes.bool,
  dateRender: PropTypes.any, // ({current: moment.Moment, today: moment.Moment}) => vNode,
  pickerClass: PropTypes.string,
  pickerInputClass: PropTypes.string,
  timePicker: PropTypes.any,
  autofocus: PropTypes.bool,
  tagPrefixCls: PropTypes.string,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.object.def(() => ({})),
  inputReadOnly: PropTypes.bool,
  valueFormat: PropTypes.string,
  onOpenChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  'onUpdate:value': PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
});

export const SinglePickerProps = () => ({
  value: TimeType,
  defaultValue: TimeType,
  defaultPickerValue: TimeType,
  renderExtraFooter: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
});

export const DatePickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  open: PropTypes.bool,
  disabledTime: PropTypes.func,
  mode: PropTypes.oneOf(['time', 'date', 'month', 'year']),
  onOpenChange: PropTypes.func,
  onPanelChange: PropTypes.func,
  onOk: PropTypes.func,
});

export const MonthPickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  placeholder: PropTypes.string,
  monthCellContentRender: PropTypes.func,
});
// export const RangePickerPresetRange = PropTypes.oneOfType([TimesType, PropTypes.func])

export const RangePickerProps = () => ({
  ...PickerProps(),
  tagPrefixCls: PropTypes.string,
  value: TimesType,
  defaultValue: TimesType,
  defaultPickerValue: TimesType,
  timePicker: PropTypes.any,
  showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  ranges: PropTypes.object,
  placeholder: PropTypes.arrayOf(String),
  mode: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  separator: PropTypes.any,
  disabledTime: PropTypes.func,
  showToday: PropTypes.bool,
  renderExtraFooter: PropTypes.any,
  onChange: PropTypes.func,
  onCalendarChange: PropTypes.func,
  onOk: PropTypes.func,
  onPanelChange: PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
});

export const WeekPickerProps = () => ({
  ...PickerProps(),
  ...SinglePickerProps(),
  placeholder: PropTypes.string,
});

// export interface DatePickerDecorator extends React.ClassicComponentClass<DatePickerProps> {
//   RangePicker: React.ClassicComponentClass<RangePickerProps>;
//   MonthPicker: React.ClassicComponentClass<MonthPickerProps>;
//   WeekPicker: React.ClassicComponentClass<WeexPickerProps>;
// }
