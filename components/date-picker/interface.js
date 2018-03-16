import * as moment from 'moment'
import { TimePickerProps } from '../time-picker'
import PropTypes from '../_util/vue-types'

export const MomentType = {
  type: Object,
  validator: function (value) {
    return moment.isMoment(value)
  },
}

export const PickerProps = () => ({
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  format: PropTypes.string,
  disabled: PropTypes.boolean,
  allowClear: PropTypes.boolean,
  popupStyle: PropTypes.object,
  locale: PropTypes.any,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  getCalendarContainer: PropTypes.func,
  open: PropTypes.boolean,
  // onOpenChange: PropTypes.(status: boolean) => void,
  disabledDate: PropTypes.func,
  renderExtraFooter: PropTypes.any,
  dateRender: PropTypes.any, // (current: moment.Moment, today: moment.Moment) => React.ReactNode,
})

export const SinglePickerProps = () => ({
  value: MomentType,
  defaultValue: MomentType,
  defaultPickerValue: MomentType,
  // onChange?: (date: moment.Moment, dateString: string) => void;
})

export const DatePickerProps = () => ({
  ...PickerProps(), ...SinglePickerProps(),
  showTime: PropTypes.oneOfType([PropTypes.shape(TimePickerProps()).loose, PropTypes.bool]),
  showToday: PropTypes.bool,
  open: PropTypes.bool,
  disabledTime: PropTypes.func,
  // onOpenChange?: (status: boolean) => void;
  // onOk?: (selectedTime: moment.Moment) => void;
  placeholder: PropTypes.string,
})

export const MonthPickerProps = () => ({
  ...PickerProps(), ...SinglePickerProps(),
  placeholder: PropTypes.string,
})

export const RangePickerValue = PropTypes.arrayOf(PropTypes.oneOfType([undefined, MomentType]))
export const RangePickerPresetRange = PropTypes.oneOfType([RangePickerValue, PropTypes.func])

export const RangePickerProps = () => ({
  ...PickerProps(),
  value: RangePickerValue,
  defaultValue: RangePickerValue,
  defaultPickerValue: RangePickerValue,
  // onChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  // onCalendarChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  // onOk?: (selectedTime: moment.Moment) => void;
  showTime: PropTypes.oneOfType([PropTypes.shape(TimePickerProps()).loose, PropTypes.bool]),
  ranges: PropTypes.objectOf(String),
  placeholder: PropTypes.oneOfType(String),
  mode: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOfType(String)]),
  disabledTime: PropTypes.func,
  // onPanelChange?: (value?: RangePickerValue, mode?: string | string[]) => void;
})

export const WeexPickerProps = () => ({
  ...PickerProps(), ...SinglePickerProps(),
  placeholder: PropTypes.string,
})

// export interface DatePickerDecorator extends React.ClassicComponentClass<DatePickerProps> {
//   RangePicker: React.ClassicComponentClass<RangePickerProps>;
//   MonthPicker: React.ClassicComponentClass<MonthPickerProps>;
//   WeekPicker: React.ClassicComponentClass<WeexPickerProps>;
// }
