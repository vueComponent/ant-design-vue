'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  prefixCls: _vueTypes2['default'].string.def('ant-menu'),
  focusable: _vueTypes2['default'].bool.def(true),
  multiple: _vueTypes2['default'].bool,
  defaultActiveFirst: _vueTypes2['default'].bool,
  visible: _vueTypes2['default'].bool.def(true),
  activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])),
  defaultSelectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])).def([]),
  defaultOpenKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])).def([]),
  openKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])),
  openAnimation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
  mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  triggerSubMenuAction: _vueTypes2['default'].string.def('hover'),
  subMenuOpenDelay: _vueTypes2['default'].number.def(0.1),
  subMenuCloseDelay: _vueTypes2['default'].number.def(0.1),
  level: _vueTypes2['default'].number.def(1),
  inlineIndent: _vueTypes2['default'].number.def(24),
  theme: _vueTypes2['default'].oneOf(['light', 'dark']).def('light'),
  getPopupContainer: _vueTypes2['default'].func,
  openTransitionName: _vueTypes2['default'].string,
  forceSubMenuRender: _vueTypes2['default'].bool,
  selectable: _vueTypes2['default'].bool,
  isRootMenu: _vueTypes2['default'].bool.def(true)
};
module.exports = exports['default'];