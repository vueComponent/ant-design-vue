'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchPropTypes = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var switchPropTypes = exports.switchPropTypes = {
  prefixCls: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool.def(false),
  checkedChildren: _vueTypes2['default'].any,
  unCheckedChildren: _vueTypes2['default'].any,
  // onChange: PropTypes.func,
  // onMouseUp: PropTypes.func,
  // onClick: PropTypes.func,
  tabIndex: _vueTypes2['default'].number,
  checked: _vueTypes2['default'].bool.def(false),
  defaultChecked: _vueTypes2['default'].bool.def(false),
  autoFocus: _vueTypes2['default'].bool.def(false)
};