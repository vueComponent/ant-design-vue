import PropTypes from '../_util/vue-types';
export default {
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: [String, Number],
  type: {
    default: 'text',
    type: String,
  },
  name: String,
  size: PropTypes.oneOf(['small', 'large', 'default']),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  // onPressEnter?: React.FormEventHandler<any>;
  // onKeyDown?: React.FormEventHandler<any>;
  // onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // onClick?: React.FormEventHandler<any>;
  // onFocus?: React.FormEventHandler<any>;
  // onBlur?: React.FormEventHandler<any>;
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  // spellCheck: Boolean,
  autoFocus: Boolean,
  allowClear: Boolean,
  lazy: {
    default: true,
    type: Boolean,
  },
  maxLength: PropTypes.number,
  loading: PropTypes.bool,
  className: PropTypes.string,
};
