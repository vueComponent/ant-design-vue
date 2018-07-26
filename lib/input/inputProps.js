'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
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
  addonBefore: _vueTypes2['default'].any,
  addonAfter: _vueTypes2['default'].any,
  // onPressEnter?: React.FormEventHandler<any>;
  // onKeyDown?: React.FormEventHandler<any>;
  // onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // onClick?: React.FormEventHandler<any>;
  // onFocus?: React.FormEventHandler<any>;
  // onBlur?: React.FormEventHandler<any>;
  prefix: _vueTypes2['default'].any,
  suffix: _vueTypes2['default'].any,
  spellCheck: Boolean,
  autoFocus: Boolean
};
module.exports = exports['default'];