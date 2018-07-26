'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelProps = exports.collapseProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var collapseProps = {
  prefixCls: _vueTypes2['default'].string.def('ant-collapse'),
  activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(_vueTypes2['default'].string)]),
  defaultActiveKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(_vueTypes2['default'].string)]),
  accordion: _vueTypes2['default'].bool.def(false),
  destroyInactivePanel: _vueTypes2['default'].bool.def(false)
};

var panelProps = {
  openAnimation: _vueTypes2['default'].object,
  prefixCls: _vueTypes2['default'].string.def('ant-collapse'),
  header: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].node]),
  headerClass: _vueTypes2['default'].string.def(''),
  showArrow: _vueTypes2['default'].bool.def(true),
  isActive: _vueTypes2['default'].bool.def(false),
  destroyInactivePanel: _vueTypes2['default'].bool.def(false),
  disabled: _vueTypes2['default'].bool.def(false)
};

exports.collapseProps = collapseProps;
exports.panelProps = panelProps;