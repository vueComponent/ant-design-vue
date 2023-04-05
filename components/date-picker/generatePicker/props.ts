import type { FocusEventHandler, MouseEventHandler } from '../../_util/EventInterface';
import type { CSSProperties } from 'vue';
import type { PickerLocale } from '.';
import type { SizeType } from '../../config-provider';
import type {
  PresetDate,
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
import {
  stringType,
  arrayType,
  someType,
  booleanType,
  objectType,
  functionType,
} from '../../_util/type';
import type { InputStatus } from '../../_util/statusUtils';

const DataPickerPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const;
type DataPickerPlacement = (typeof DataPickerPlacements)[number];

type RangeShowTimeObject<DateType> = Omit<SharedTimeProps<DateType>, 'defaultValue'> & {
  defaultValue?: DateType[];
};

function commonProps<DateType = any>() {
  return {
    id: String,
    /**
     * @deprecated `dropdownClassName` is deprecated which will be removed in next major
     *   version.Please use `popupClassName` instead.
     */
    dropdownClassName: String,
    popupClassName: String,
    popupStyle: objectType<CSSProperties>(),
    transitionName: String,
    placeholder: String,
    allowClear: booleanType(),
    autofocus: booleanType(),
    disabled: booleanType(),
    tabindex: Number,
    open: booleanType(),
    defaultOpen: booleanType(),
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: booleanType(),
    format: someType<string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[]>([
      String,
      Function,
      Array,
    ]),
    // Value
    // format:  string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    // Render
    // suffixIcon?: VueNode;
    // clearIcon?: VueNode;
    // prevIcon?: VueNode;
    // nextIcon?: VueNode;
    // superPrevIcon?: VueNode;
    // superNextIcon?: VueNode;
    getPopupContainer: functionType<(node: HTMLElement) => HTMLElement>(),
    panelRender: functionType<(originPanel: VueNode) => VueNode>(),
    // // Events
    onChange: functionType<(value: DateType | string | null, dateString: string) => void>(),
    'onUpdate:value': functionType<(value: DateType | string | null) => void>(),
    onOk: functionType<(value: DateType | string | null) => void>(),
    onOpenChange: functionType<(open: boolean) => void>(),
    'onUpdate:open': functionType<(open: boolean) => void>(),
    onFocus: functionType<FocusEventHandler>(),
    onBlur: functionType<FocusEventHandler>(),
    onMousedown: functionType<MouseEventHandler>(),
    onMouseup: functionType<MouseEventHandler>(),
    onMouseenter: functionType<MouseEventHandler>(),
    onMouseleave: functionType<MouseEventHandler>(),
    onClick: functionType<MouseEventHandler>(),
    onContextmenu: functionType<MouseEventHandler>(),
    onKeydown: functionType<(event: KeyboardEvent, preventDefault: () => void) => void>(),
    // WAI-ARIA
    role: String,
    name: String,
    autocomplete: String,
    direction: stringType<'ltr' | 'rtl'>(),
    showToday: booleanType(),
    showTime: someType<boolean | SharedTimeProps<DateType>>([Boolean, Object]),
    locale: objectType<PickerLocale>(),
    size: stringType<SizeType>(),
    bordered: booleanType(),
    dateRender: functionType<DateRender<DateType>>(),
    disabledDate: functionType<(date: DateType) => boolean>(),
    mode: stringType<PanelMode>(),
    picker: stringType<PickerMode>(),
    valueFormat: String,
    placement: stringType<DataPickerPlacement>(),
    status: stringType<InputStatus>(),

    /** @deprecated Please use `disabledTime` instead. */
    disabledHours: functionType<DisabledTimes['disabledHours']>(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes: functionType<DisabledTimes['disabledMinutes']>(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds: functionType<DisabledTimes['disabledSeconds']>(),
  };
}

export interface CommonProps<DateType> {
  id?: string;
  prefixCls?: string;
  /**
   * @deprecated `dropdownClassName` is deprecated which will be removed in next major
   *   version.Please use `popupClassName` instead.
   */

  dropdownClassName?: string;
  popupClassName?: string;
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
  placement?: DataPickerPlacement;
  status?: InputStatus;
}

function datePickerProps<DateType = any>() {
  return {
    defaultPickerValue: someType<DateType | string>([Object, String]),
    defaultValue: someType<DateType | string>([Object, String]),
    value: someType<DateType | string>([Object, String]),
    presets: arrayType<PresetDate<DateType>[]>(),
    disabledTime: functionType<DisabledTime<DateType>>(),
    renderExtraFooter: functionType<(mode: PanelMode) => VueNode>(),
    showNow: booleanType(),
    monthCellRender: functionType<MonthCellRender<DateType>>(),
    // deprecated  Please use `monthCellRender"` instead.',
    monthCellContentRender: functionType<MonthCellRender<DateType>>(),
  };
}

export interface DatePickerProps<DateType> {
  defaultPickerValue?: DateType | string;
  defaultValue?: DateType | string;
  value?: DateType | string;
  presets?: PresetDate<DateType>[];
  disabledTime?: DisabledTime<DateType>;
  renderExtraFooter?: (mode: PanelMode) => VueNode;
  showNow?: boolean;
  monthCellRender?: MonthCellRender<DateType>;
  // deprecated  Please use `monthCellRender"` instead.',
  monthCellContentRender?: MonthCellRender<DateType>;
}

function rangePickerProps<DateType>() {
  return {
    allowEmpty: arrayType<[boolean, boolean]>(),
    dateRender: functionType<RangeDateRender<DateType>>(),
    defaultPickerValue: arrayType<RangeValue<DateType> | RangeValue<string>>(),
    defaultValue: arrayType<RangeValue<DateType> | RangeValue<string>>(),
    value: arrayType<RangeValue<DateType> | RangeValue<string>>(),
    presets: arrayType<PresetDate<Array<DateType>>[]>(),
    disabledTime: functionType<(date: EventValue<DateType>, type: RangeType) => DisabledTimes>(),
    disabled: someType<boolean | [boolean, boolean]>([Boolean, Array]),
    renderExtraFooter: functionType<() => VueNode>(),
    separator: { type: String },
    showTime: someType<boolean | RangeShowTimeObject<DateType>>([Boolean, Object]),
    ranges:
      objectType<
        Record<
          string,
          Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)
        >
      >(),
    placeholder: arrayType<string[]>(),
    mode: arrayType<[PanelMode, PanelMode]>(),
    onChange:
      functionType<
        (
          value: RangeValue<DateType> | RangeValue<string> | null,
          dateString: [string, string],
        ) => void
      >(),
    'onUpdate:value':
      functionType<(value: RangeValue<DateType> | RangeValue<string> | null) => void>(),
    onCalendarChange:
      functionType<
        (
          values: RangeValue<DateType> | RangeValue<string>,
          formatString: [string, string],
          info: RangeInfo,
        ) => void
      >(),
    onPanelChange:
      functionType<
        (values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void
      >(),
    onOk: functionType<(dates: RangeValue<DateType> | RangeValue<string>) => void>(),
  };
}

export interface RangePickerProps<DateType> {
  allowEmpty?: [boolean, boolean];
  dateRender?: RangeDateRender<DateType>;
  defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
  defaultValue?: RangeValue<DateType> | RangeValue<string>;
  value?: RangeValue<DateType> | RangeValue<string>;
  presets?: PresetDate<RangeValue<DateType>>[];
  disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
  disabled?: [boolean, boolean];
  renderExtraFooter?: () => VueNode;
  separator?: string;
  showTime?: boolean | RangeShowTimeObject<DateType>;
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
