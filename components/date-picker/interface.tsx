import type dayjs from 'dayjs';
import type { CSSProperties } from 'vue';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';

export type RangePickerValue =
  | undefined[]
  | null[]
  | [dayjs.Dayjs | string]
  | [undefined, dayjs.Dayjs | string]
  | [dayjs.Dayjs | string, undefined]
  | [null, dayjs.Dayjs | string]
  | [dayjs.Dayjs | string, null]
  | [dayjs.Dayjs, dayjs.Dayjs]
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
  disabledDate?: (current: dayjs.Dayjs | null) => boolean;
  dateRender?: (current: dayjs.Dayjs, today: dayjs.Dayjs) => any;
  autofocus?: boolean;
  onFocus?: EventHandlerNonNull;
  onBlur?: EventHandlerNonNull;
}

export interface SinglePickerProps {
  value?: dayjs.Dayjs | undefined | null | string;
  defaultValue?: dayjs.Dayjs | undefined | null | string;
  defaultPickerValue?: dayjs.Dayjs | undefined | null | string;
  placeholder?: string;
  renderExtraFooter?: (mode: DatePickerMode) => any;
  onChange?: (date: dayjs.Dayjs | null, dateString: string) => void;
}

const DatePickerModes = tuple('time', 'date', 'month', 'year', 'decade');
export type DatePickerMode = typeof DatePickerModes[number];

export interface DatePickerPropsTypes extends PickerProps, SinglePickerProps {
  showTime?: Record<string, any> | boolean;
  showToday?: boolean;
  open?: boolean;
  disabledTime?: (current?: dayjs.Dayjs | null) => {
    disabledHours?: () => number[];
    disabledMinutes?: () => number[];
    disabledSeconds?: () => number[];
  };
  onOpenChange?: (status: boolean) => void;
  onPanelChange?: (value: dayjs.Dayjs | null, mode: DatePickerMode) => void;
  onOk?: (selectedTime: dayjs.Dayjs | null) => void;
  mode?: DatePickerMode;
}

export interface MonthPickerPropsTypes extends PickerProps, SinglePickerProps {
  monthCellContentRender?: (date: dayjs.Dayjs, locale: any) => any;
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
