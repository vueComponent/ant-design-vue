import type { PropType } from 'vue';
import type moment from 'moment';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { tuple } from '../_util/type';

export type PickerValue = moment.Moment | undefined | null | string;

export type RangePickerValue =
  | undefined[]
  | null[]
  | [moment.Moment | string]
  | [undefined, moment.Moment | string]
  | [moment.Moment | string, undefined]
  | [null, moment.Moment | string]
  | [moment.Moment | string, null]
  | [moment.Moment, moment.Moment]
  | [string, string];

export const PickerProps = {
  name: PropTypes.string,
  transitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
  disabled: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  suffixIcon: PropTypes.any,
  popupStyle: PropTypes.object,
  dropdownClassName: PropTypes.string,
  locale: PropTypes.any,
  localeCode: PropTypes.string,
  size: PropTypes.oneOf(tuple('large', 'small', 'default')),
  getCalendarContainer: PropTypes.func,
  open: PropTypes.looseBool,
  disabledDate: PropTypes.func,
  showToday: PropTypes.looseBool,
  dateRender: PropTypes.any, // ({current: moment.Moment, today: moment.Moment}) => vNode,
  pickerClass: PropTypes.string,
  pickerInputClass: PropTypes.string,
  timePicker: PropTypes.any,
  autofocus: PropTypes.looseBool,
  tagPrefixCls: PropTypes.string,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.object.def(() => ({})),
  inputReadOnly: PropTypes.looseBool,
  valueFormat: PropTypes.string,
  onOpenChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  //'onUpdate:value': PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
};

export const SinglePickerProps = {
  value: { type: [String, Object] as PropType<PickerValue> },
  defaultValue: { type: [String, Object] as PropType<PickerValue> },
  defaultPickerValue: { type: [String, Object] as PropType<PickerValue> },
  renderExtraFooter: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export const DatePickerProps = {
  ...PickerProps,
  ...SinglePickerProps,
  showTime: withUndefined(PropTypes.oneOfType([PropTypes.object, PropTypes.looseBool])),
  open: PropTypes.looseBool,
  disabledTime: PropTypes.func,
  mode: PropTypes.oneOf(tuple('time', 'date', 'month', 'year', 'decade')),
  onOpenChange: PropTypes.func,
  onPanelChange: PropTypes.func,
  onOk: PropTypes.func,
};

export const MonthPickerProps = {
  ...PickerProps,
  ...SinglePickerProps,
  placeholder: PropTypes.string,
  monthCellContentRender: PropTypes.func,
};
// export const RangePickerPresetRange = PropTypes.oneOfType([TimesType, PropTypes.func])

export const RangePickerProps = {
  ...PickerProps,
  tagPrefixCls: PropTypes.string,
  value: { type: Array as PropType<RangePickerValue> },
  defaultValue: { type: Array as PropType<RangePickerValue> },
  defaultPickerValue: { type: Array as PropType<RangePickerValue> },
  timePicker: PropTypes.any,
  showTime: withUndefined(PropTypes.oneOfType([PropTypes.object, PropTypes.looseBool])),
  ranges: PropTypes.object,
  placeholder: PropTypes.arrayOf(String),
  mode: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  separator: PropTypes.any,
  disabledTime: PropTypes.func,
  showToday: PropTypes.looseBool,
  renderExtraFooter: PropTypes.any,
  onChange: PropTypes.func,
  onCalendarChange: PropTypes.func,
  onOk: PropTypes.func,
  onPanelChange: PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
};

export const WeekPickerProps = {
  ...PickerProps,
  ...SinglePickerProps,
  placeholder: PropTypes.string,
};
