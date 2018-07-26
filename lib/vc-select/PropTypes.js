'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectPropTypes = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SelectPropTypes = exports.SelectPropTypes = {
  defaultActiveFirstOption: _vueTypes2['default'].bool,
  multiple: _vueTypes2['default'].bool,
  filterOption: _vueTypes2['default'].any,
  // children: PropTypes.any,
  showSearch: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  allowClear: _vueTypes2['default'].bool,
  showArrow: _vueTypes2['default'].bool,
  tags: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  // className: PropTypes.string,
  transitionName: _vueTypes2['default'].string,
  optionLabelProp: _vueTypes2['default'].string,
  optionFilterProp: _vueTypes2['default'].string,
  animation: _vueTypes2['default'].string,
  choiceTransitionName: _vueTypes2['default'].string,
  // onChange: PropTypes.func,
  // onBlur: PropTypes.func,
  // onFocus: PropTypes.func,
  // onSelect: PropTypes.func,
  // onSearch: PropTypes.func,
  // onPopupScroll: PropTypes.func,
  // onMouseEnter: PropTypes.func,
  // onMouseLeave: PropTypes.func,
  // onInputKeyDown: PropTypes.func,
  placeholder: _vueTypes2['default'].any,
  // onDeselect: PropTypes.func,
  labelInValue: _vueTypes2['default'].bool,
  value: _vueTypes2['default'].any,
  defaultValue: _vueTypes2['default'].any,
  dropdownStyle: _vueTypes2['default'].object,
  dropdownClassName: _vueTypes2['default'].string,
  maxTagTextLength: _vueTypes2['default'].number,
  maxTagCount: _vueTypes2['default'].number,
  maxTagPlaceholder: _vueTypes2['default'].any,
  tokenSeparators: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  getInputElement: _vueTypes2['default'].func,
  showAction: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  autoFocus: _vueTypes2['default'].bool,
  getPopupContainer: _vueTypes2['default'].func
};