import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import type { SizeType } from '../config-provider';
import omit from '../_util/omit';
import type { LiteralUnion } from '../_util/type';
export const inputDefaultValue = Symbol() as unknown as string;
const inputProps = {
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
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
  name: PropTypes.string,
  size: { type: String as PropType<SizeType> },
  disabled: PropTypes.looseBool,
  readonly: PropTypes.looseBool,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  autofocus: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  lazy: PropTypes.looseBool.def(true),
  maxlength: PropTypes.number,
  loading: PropTypes.looseBool,
  bordered: PropTypes.looseBool,
  htmlSize: Number,
  onPressEnter: PropTypes.func,
  onKeydown: PropTypes.func,
  onKeyup: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  'onUpdate:value': PropTypes.func,
  valueModifiers: Object,
};
export default inputProps;
export type InputProps = Partial<ExtractPropTypes<typeof inputProps>>;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}
export interface ShowCountProps {
  formatter: (args: { count: number; maxlength?: number }) => string;
}
const textAreaProps = {
  ...omit(inputProps, ['prefix', 'addonBefore', 'addonAfter', 'suffix']),
  autosize: { type: [Boolean, Object] as PropType<AutoSizeType>, default: undefined },
  autoSize: { type: [Boolean, Object] as PropType<AutoSizeType>, default: undefined },
  showCount: { type: [Boolean, Object] as PropType<boolean | ShowCountProps> },
  onResize: { type: Function as PropType<(size: { width: number; height: number }) => void> },
  onCompositionstart: PropTypes.func,
  onCompositionend: PropTypes.func,
  valueModifiers: Object,
};

export { textAreaProps };

export type TextAreaProps = Partial<ExtractPropTypes<typeof textAreaProps>>;
