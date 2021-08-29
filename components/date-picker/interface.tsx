import type moment from 'moment';
import type { CSSProperties } from 'vue';
import type { EventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';

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

export interface PickerProps {
  name?: string;
  transitionName?: string;
  prefixCls?: string;
  inputPrefixCls?: string;
  format?: string | string[] | Function;
  disabled?: boolean;
  allowClear?: boolean;
  pickerClass?: string;
  pickerInputClass?: string;
  suffixIcon?: VueNode;
  popupStyle?: CSSProperties;
  dropdownClassName?: string;
  locale?: any;
  localeCode?: string;
  size?: 'large' | 'small' | 'default';
  getCalendarContainer?: (triggerNode: Element) => HTMLElement;
  open?: boolean;
  valueFormat?: string;
  onOpenChange?: (status: boolean) => void;
  disabledDate?: (current: moment.Moment | null) => boolean;
  dateRender?: (current: moment.Moment, today: moment.Moment) => any;
  autofocus?: boolean;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
}

export interface SinglePickerProps {
  value?: moment.Moment | undefined | null | string;
  defaultValue?: moment.Moment | undefined | null | string;
  defaultPickerValue?: moment.Moment | undefined | null | string;
  placeholder?: string;
  renderExtraFooter?: (mode: DatePickerMode) => any;
  onChange?: (date: moment.Moment | null, dateString: string) => void;
}

const DatePickerModes = tuple('time', 'date', 'month', 'year', 'decade');
export type DatePickerMode = typeof DatePickerModes[number];

export interface DatePickerPropsTypes extends PickerProps, SinglePickerProps {
  showTime?: Record<string, any> | boolean;
  showToday?: boolean;
  open?: boolean;
  disabledTime?: (current?: moment.Moment | null) => {
    disabledHours?: () => number[];
    disabledMinutes?: () => number[];
    disabledSeconds?: () => number[];
  };
  onOpenChange?: (status: boolean) => void;
  onPanelChange?: (value: moment.Moment | null, mode: DatePickerMode) => void;
  onOk?: (selectedTime: moment.Moment | null) => void;
  mode?: DatePickerMode;
}

export interface MonthPickerPropsTypes extends PickerProps, SinglePickerProps {
  monthCellContentRender?: (date: moment.Moment, locale: any) => any;
}

export type RangePickerPresetRange = RangePickerValue | (() => RangePickerValue);

export interface RangePickerPropsTypes extends PickerProps {
  tagPrefixCls?: string;
  value?: RangePickerValue;
  defaultValue?: RangePickerValue;
  defaultPickerValue?: RangePickerValue;
  timePicker?: VueNode;
  onChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  onCalendarChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  onOk?: (selectedTime: RangePickerPresetRange) => void;
  showTime?: Record<string, any> | boolean;
  showToday?: boolean;
  ranges?: {
    [range: string]: RangePickerPresetRange;
  };
  placeholder?: [string, string];
  mode?: string | string[];
  separator?: VueNode;
  disabledTime?: (
    current: RangePickerValue,
    type: string,
  ) => {
    disabledHours?: () => number[];
    disabledMinutes?: () => number[];
    disabledSeconds?: () => number[];
  };
  onPanelChange?: (value?: RangePickerValue, mode?: string | string[]) => void;
  renderExtraFooter?: () => any;
  onMouseenter?: (e: MouseEvent) => void;
  onMouseleave?: (e: MouseEvent) => void;
}

export interface WeekPickerPropsTypes extends PickerProps, SinglePickerProps {
  // - currently no own props -
}
