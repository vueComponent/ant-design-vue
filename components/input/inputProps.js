export default {
  prefixCls: {
    default: 'ant-input',
    type: String,
  },
  defaultValue: [String, Number],
  value: [String, Number],
  placeholder: [String, Number],
  type: {
    default: 'text',
    type: String,
  },
  id: [String, Number],
  name: String,
  size: {
    validator (value) {
      return ['small', 'large', 'default'].includes(value)
    },
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  readOnly: Boolean,
  // addonBefore: React.ReactNode,
  // addonAfter: React.ReactNode,
  // onPressEnter?: React.FormEventHandler<any>;
  // onKeyDown?: React.FormEventHandler<any>;
  // onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // onClick?: React.FormEventHandler<any>;
  // onFocus?: React.FormEventHandler<any>;
  // onBlur?: React.FormEventHandler<any>;
  // autoComplete: String;
  // prefix: React.ReactNode,
  // suffix: React.ReactNode,
  spellCheck: Boolean,
  autoFocus: Boolean,
}
