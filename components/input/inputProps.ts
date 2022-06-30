import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import type { SizeType } from '../config-provider';
import omit from '../_util/omit';
import type { LiteralUnion, VueNode } from '../_util/type';
import type {
  ChangeEventHandler,
  CompositionEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from '../_util/EventInterface';
export const inputDefaultValue = Symbol() as unknown as string;
const inputProps = () => ({
  id: String,
  prefixCls: String,
  inputPrefixCls: String,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: {
    type: [String, Number, Symbol] as PropType<string | number>,
    default: undefined,
  },
  placeholder: {
    type: [String, Number] as PropType<string | number>,
  },
  autocomplete: String,
  type: {
    type: String as PropType<
      LiteralUnion<
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
        | 'week',
        string
      >
    >,
    default: 'text',
  },
  name: String,
  size: { type: String as PropType<SizeType> },
  disabled: { type: Boolean, default: undefined },
  readonly: { type: Boolean, default: undefined },
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  autofocus: { type: Boolean, default: undefined },
  allowClear: { type: Boolean, default: undefined },
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
  valueModifiers: Object,
  hidden: Boolean,
});
export default inputProps;
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}
export interface ShowCountProps {
  formatter: (args: { count: number; maxlength?: number }) => VueNode;
}
const textAreaProps = () => ({
  ...omit(inputProps(), ['prefix', 'addonBefore', 'addonAfter', 'suffix']),
  rows: Number,
  autosize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  autoSize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  onResize: { type: Function as PropType<(size: { width: number; height: number }) => void> },
  onCompositionstart: Function as PropType<CompositionEventHandler>,
  onCompositionend: Function as PropType<CompositionEventHandler>,
  valueModifiers: Object,
});

export { textAreaProps };

export type TextAreaProps = Partial<ExtractPropTypes<ReturnType<typeof textAreaProps>>>;
