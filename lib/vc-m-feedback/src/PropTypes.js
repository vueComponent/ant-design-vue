'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ITouchProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ITouchProps = exports.ITouchProps = {
  disabled: _vueTypes2['default'].bool,
  activeClassName: _vueTypes2['default'].string,
  activeStyle: _vueTypes2['default'].any
  // onTouchStart: PropTypes.func,
  // onTouchEnd: PropTypes.func,
  // onTouchCancel: PropTypes.func,
  // onMouseDown: PropTypes.func,
  // onMouseUp: PropTypes.func,
  // onMouseLeave: PropTypes.func,
};