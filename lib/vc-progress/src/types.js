'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.defaultProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultProps = exports.defaultProps = {
  // className: '',
  percent: 0,
  prefixCls: 'rc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  // style: {},
  trailColor: '#D9D9D9',
  trailWidth: 1
};

var propTypes = exports.propTypes = {
  // className: PropTypes.string,
  percent: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  prefixCls: _vueTypes2['default'].string,
  strokeColor: _vueTypes2['default'].string,
  strokeLinecap: _vueTypes2['default'].oneOf(['butt', 'round', 'square']),
  strokeWidth: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  // style: PropTypes.object,
  trailColor: _vueTypes2['default'].string,
  trailWidth: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string])
};