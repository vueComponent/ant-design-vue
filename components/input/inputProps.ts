import { InputHTMLAttributes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';

export const InputSizeType = tuple('small', 'large', 'default');

const InputType = tuple(
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week',
);

export default {
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(InputType),
  name: PropTypes.string,
  size: PropTypes.oneOf(tuple('small', 'large', 'default')),
  disabled: PropTypes.looseBool,
  readonly: PropTypes.looseBool,
  addonBefore: PropTypes.VNodeChild,
  addonAfter: PropTypes.VNodeChild,
  // onClick?: React.FormEventHandler<any>;
  prefix: PropTypes.VNodeChild,
  suffix: PropTypes.VNodeChild,
  // spellCheck: Boolean,
  autofocus: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  lazy: PropTypes.looseBool.def(true),
  maxlength: PropTypes.number,
  loading: PropTypes.looseBool,
  onPressEnter: Function as PropType<InputHTMLAttributes['onKeypress']>,
  onKeydown: Function as PropType<InputHTMLAttributes['onKeydown']>,
  onKeyup: Function as PropType<InputHTMLAttributes['onKeyup']>,
  onFocus: Function as PropType<InputHTMLAttributes['onFocus']>,
  onBlur: Function as PropType<InputHTMLAttributes['onBlur']>,
  onChange: Function as PropType<InputHTMLAttributes['onChange']>,
  onInput: Function as PropType<InputHTMLAttributes['onInput']>,
};
