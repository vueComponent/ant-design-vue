import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import type { SizeType } from '../config-provider';
import type { VueNode } from '../_util/type';
import { stringType } from '../_util/type';
import type {
  ChangeEventHandler,
  CompositionEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from '../_util/EventInterface';
import type { InputStatus } from '../_util/statusUtils';
import type { InputFocusOptions } from './utils/commonUtils';
export const inputDefaultValue = Symbol() as unknown as string;
export const commonInputProps = () => {
  return {
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    clearIcon: PropTypes.any,
    affixWrapperClassName: String,
    groupClassName: String,
    wrapperClassName: String,
    inputClassName: String,
    allowClear: { type: Boolean, default: undefined },
  };
};
export const baseInputProps = () => {
  return {
    ...commonInputProps(),
    value: {
      type: [String, Number, Symbol] as PropType<string | number>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, Symbol] as PropType<string | number>,
      default: undefined,
    },
    inputElement: PropTypes.any,
    prefixCls: String,
    disabled: { type: Boolean, default: undefined },
    focused: { type: Boolean, default: undefined },
    triggerFocus: Function as PropType<() => void>,
    readonly: { type: Boolean, default: undefined },
    handleReset: Function as PropType<MouseEventHandler>,
    hidden: { type: Boolean, default: undefined },
  };
};
export const inputProps = () => ({
  ...baseInputProps(),
  id: String,
  placeholder: {
    type: [String, Number] as PropType<string | number>,
  },
  autocomplete: String,
  type: stringType<
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
  >('text'),
  name: String,
  size: { type: String as PropType<SizeType> },
  autofocus: { type: Boolean, default: undefined },
  lazy: { type: Boolean, default: true },
  maxlength: Number,
  loading: { type: Boolean, default: undefined },
  bordered: { type: Boolean, default: undefined },
  showCount: { type: [Boolean, Object] as PropType<boolean | ShowCountProps> },
  htmlSize: Number,
  onPressEnter: Function as PropType<KeyboardEventHandler>,
  onKeydown: Function as PropType<KeyboardEventHandler>,
  onKeyup: Function as PropType<KeyboardEventHandler>,
  onFocus: Function as PropType<FocusEventHandler>,
  onBlur: Function as PropType<FocusEventHandler>,
  onChange: Function as PropType<ChangeEventHandler>,
  onInput: Function as PropType<ChangeEventHandler>,
  'onUpdate:value': Function as PropType<(val: string) => void>,
  onCompositionstart: Function as PropType<CompositionEventHandler>,
  onCompositionend: Function as PropType<CompositionEventHandler>,
  valueModifiers: Object,
  hidden: { type: Boolean, default: undefined },
  status: String as PropType<InputStatus>,
});
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;

export interface ShowCountProps {
  formatter: (args: { count: number; maxlength?: number; value?: string }) => VueNode;
}

export interface InputRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  setSelectionRange: (
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none',
  ) => void;
  select: () => void;
  input: HTMLInputElement | null;
}
