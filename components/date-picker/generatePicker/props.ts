import type { FocusEventHandler, MouseEventHandler } from '../../_util/EventInterface';
import type { CSSProperties, PropType } from 'vue';
import type { PickerLocale } from '.';
import type { SizeType } from '../../config-provider';
import type { AlignType } from '../../vc-align/interface';
import type {
  CustomFormat,
  DisabledTime,
  DisabledTimes,
  EventValue,
  PanelMode,
  PickerMode,
  RangeValue,
} from '../../vc-picker/interface';
import type { DateRender } from '../../vc-picker/panels/DatePanel/DateBody';
import type { MonthCellRender } from '../../vc-picker/panels/MonthPanel/MonthBody';
import type { SharedTimeProps } from '../../vc-picker/panels/TimePanel';
import type { RangeDateRender, RangeInfo, RangeType } from '../../vc-picker/RangePicker';
import type { VueNode } from '../../_util/type';

function commonProps<DateType = any>() {
  return {
    id: String,
    dropdownClassName: String,
    dropdownAlign: { type: Object as PropType<AlignType> },
    popupStyle: { type: Object as PropType<CSSProperties> },
    transitionName: String,
    placeholder: String,
    allowClear: { type: Boolean, default: undefined },
    autofocus: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    tabindex: Number,
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: { type: Boolean, default: undefined },
    format: {
      type: [String, Function, Array] as PropType<
        string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[]
      >,
    },
    // Value
    // format:  string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    // Render
    // suffixIcon?: VueNode;
    // clearIcon?: VueNode;
    // prevIcon?: VueNode;
    // nextIcon?: VueNode;
    // superPrevIcon?: VueNode;
    // superNextIcon?: VueNode;
    getPopupContainer: { type: Function as PropType<(node: HTMLElement) => HTMLElement> },
    panelRender: { type: Function as PropType<(originPanel: VueNode) => VueNode> },
    // // Events
    onChange: {
      type: Function as PropType<(value: DateType | string | null, dateString: string) => void>,
    },
    'onUpdate:value': { type: Function as PropType<(value: DateType | string | null) => void> },
    onOk: { type: Function as PropType<(value: DateType | string | null) => void> },
    onOpenChange: { type: Function as PropType<(open: boolean) => void> },
    'onUpdate:open': { type: Function as PropType<(open: boolean) => void> },
    onFocus: { type: Function as PropType<FocusEventHandler> },
    onBlur: { type: Function as PropType<FocusEventHandler> },
    onMousedown: { type: Function as PropType<MouseEventHandler> },
    onMouseup: { type: Function as PropType<MouseEventHandler> },
    onMouseenter: { type: Function as PropType<MouseEventHandler> },
    onMouseleave: { type: Function as PropType<MouseEventHandler> },
    onClick: { type: Function as PropType<MouseEventHandler> },
    onContextmenu: { type: Function as PropType<MouseEventHandler> },
    onKeydown: {
      type: Function as PropType<(event: KeyboardEvent, preventDefault: () => void) => void>,
    },
    // WAI-ARIA
    role: String,
    name: String,
    autocomplete: String,
    direction: { type: String as PropType<'ltr' | 'rtl'> },
    showToday: { type: Boolean, default: undefined },
    showTime: {
      type: [Boolean, Object] as PropType<boolean | SharedTimeProps<DateType>>,
      default: undefined,
    },
    locale: { type: Object as PropType<PickerLocale> },
    size: { type: String as PropType<SizeType> },
    bordered: { type: Boolean, default: undefined },
    dateRender: { type: Function as PropType<DateRender<DateType>> },
    disabledDate: { type: Function as PropType<(date: DateType) => boolean> },
    mode: { type: String as PropType<PanelMode> },
    picker: { type: String as PropType<PickerMode> },
    valueFormat: String,

    /** @deprecated Please use `disabledTime` instead. */
    disabledHours: Function as PropType<DisabledTimes['disabledHours']>,
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes: Function as PropType<DisabledTimes['disabledMinutes']>,
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds: Function as PropType<DisabledTimes['disabledSeconds']>,
  };
}

export interface CommonProps<DateType> {
  id?: string;
  prefixCls?: string;
  dropdownClassName?: string;
  dropdownAlign?: AlignType;
  popupStyle?: CSSProperties;
  transitionName?: string;
  placeholder?: string;
  allowClear?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  tabindex?: number;
  open?: boolean;
  defaultOpen?: boolean;
  inputReadOnly?: boolean;
  format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
  suffixIcon?: VueNode;
  clearIcon?: VueNode;
  prevIcon?: VueNode;
  nextIcon?: VueNode;
  superPrevIcon?: VueNode;
  superNextIcon?: VueNode;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  panelRender?: (originPanel: VueNode) => VueNode;
  onChange?: (value: DateType | string | null, dateString: string) => void;
  'onUpdate:value'?: (value: DateType | string | null) => void;
  onOk?: (value: DateType | string | null) => void;
  onOpenChange?: (open: boolean) => void;
  'onUpdate:open'?: (open: boolean) => void;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onMousedown?: MouseEventHandler;
  onMouseup?: MouseEventHandler;
  onMouseenter?: MouseEventHandler;
  onMouseleave?: MouseEventHandler;
  onClick?: MouseEventHandler;
  onContextmenu?: MouseEventHandler;
  onKeydown?: (event: KeyboardEvent, preventDefault: () => void) => void;
  role?: string;
  name?: string;
  autocomplete?: string;
  direction?: 'ltr' | 'rtl';
  showToday?: boolean;
  showTime?: boolean | SharedTimeProps<DateType>;
  locale?: PickerLocale;
  size?: SizeType;
  bordered?: boolean;
  dateRender?: DateRender<DateType>;
  disabledDate?: (date: DateType) => boolean;
  mode?: PanelMode;
  picker?: PickerMode;
  valueFormat?: string;
}

function datePickerProps<DateType = any>() {
  return {
    defaultPickerValue: { type: [String, Object] as PropType<DateType | string> },
    defaultValue: { type: [String, Object] as PropType<DateType | string> },
    value: { type: [String, Object] as PropType<DateType | string> },
    disabledTime: { type: Function as PropType<DisabledTime<DateType>> },
    renderExtraFooter: { type: Function as PropType<(mode: PanelMode) => VueNode> },
    showNow: { type: Boolean, default: undefined },
    monthCellRender: { type: Function as PropType<MonthCellRender<DateType>> },
    // deprecated  Please use `monthCellRender"` instead.',
    monthCellContentRender: { type: Function as PropType<MonthCellRender<DateType>> },
  };
}

export interface DatePickerProps<DateType> {
  defaultPickerValue?: DateType | string;
  defaultValue?: DateType | string;
  value?: DateType | string;
  disabledTime?: DisabledTime<DateType>;
  renderExtraFooter?: (mode: PanelMode) => VueNode;
  showNow?: boolean;
  monthCellRender?: MonthCellRender<DateType>;
  // deprecated  Please use `monthCellRender"` instead.',
  monthCellContentRender?: MonthCellRender<DateType>;
}

function rangePickerProps<DateType>() {
  return {
    allowEmpty: { type: Array as unknown as PropType<[boolean, boolean]> },
    dateRender: { type: Function as PropType<RangeDateRender<DateType>> },
    defaultPickerValue: {
      type: Array as unknown as PropType<RangeValue<DateType> | RangeValue<string>>,
    },
    defaultValue: { type: Array as unknown as PropType<RangeValue<DateType> | RangeValue<string>> },
    value: { type: Array as unknown as PropType<RangeValue<DateType> | RangeValue<string>> },
    disabledTime: {
      type: Function as PropType<(date: EventValue<DateType>, type: RangeType) => DisabledTimes>,
    },
    disabled: { type: [Boolean, Array] as unknown as PropType<boolean | [boolean, boolean]> },
    renderExtraFooter: { type: Function as PropType<() => VueNode> },
    separator: { type: String },
    ranges: {
      type: Object as PropType<
        Record<
          string,
          Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)
        >
      >,
    },
    placeholder: Array,
    mode: { type: Array as unknown as PropType<[PanelMode, PanelMode]> },
    onChange: {
      type: Function as PropType<
        (
          value: RangeValue<DateType> | RangeValue<string> | null,
          dateString: [string, string],
        ) => void
      >,
    },
    'onUpdate:value': {
      type: Function as PropType<(value: RangeValue<DateType> | RangeValue<string> | null) => void>,
    },
    onCalendarChange: {
      type: Function as PropType<
        (
          values: RangeValue<DateType> | RangeValue<string>,
          formatString: [string, string],
          info: RangeInfo,
        ) => void
      >,
    },
    onPanelChange: {
      type: Function as PropType<
        (values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void
      >,
    },
    onOk: {
      type: Function as PropType<(dates: RangeValue<DateType> | RangeValue<string>) => void>,
    },
  };
}

export interface RangePickerProps<DateType> {
  allowEmpty?: [boolean, boolean];
  dateRender?: RangeDateRender<DateType>;
  defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
  defaultValue?: RangeValue<DateType> | RangeValue<string>;
  value?: RangeValue<DateType> | RangeValue<string>;
  disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
  disabled?: [boolean, boolean];
  renderExtraFooter?: () => VueNode;
  separator?: string;
  ranges?: Record<
    string,
    Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)
  >;
  placeholder?: [string, string];
  mode?: [PanelMode, PanelMode];
  onChange?: (
    value: RangeValue<DateType> | RangeValue<string> | null,
    dateString: [string, string],
  ) => void;
  'onUpdate:value'?: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
  onCalendarChange?: (
    values: RangeValue<DateType> | RangeValue<string>,
    formatString: [string, string],
    info: RangeInfo,
  ) => void;
  onPanelChange?: (
    values: RangeValue<DateType> | RangeValue<string>,
    modes: [PanelMode, PanelMode],
  ) => void;
  onOk?: (dates: RangeValue<DateType> | RangeValue<string>) => void;
}

export type ExtraDatePickerProps<DateType> = {
  valueFormat?: string;
  defaultPickerValue?: DateType | string;
  defaultValue?: DateType | string;
  value?: DateType | string;
};

export type ExtraRangePickerProps<DateType> = {
  valueFormat?: string;
  defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
  defaultValue?: RangeValue<DateType> | RangeValue<string>;
  value?: RangeValue<DateType> | RangeValue<string>;
};

export { commonProps, datePickerProps, rangePickerProps };
