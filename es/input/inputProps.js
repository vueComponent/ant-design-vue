import PropTypes from '../_util/vue-types';
export default {
  prefixCls: {
    'default': 'ant-input',
    type: String
  },
  defaultValue: [String, Number],
  value: [String, Number],
  placeholder: [String, Number],
  type: {
    'default': 'text',
    type: String
  },
  name: String,
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  },
  disabled: {
    'default': false,
    type: Boolean
  },
  readOnly: Boolean,
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
  spellCheck: Boolean,
  autoFocus: Boolean
};