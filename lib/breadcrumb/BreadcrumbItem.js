'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: _vueTypes2['default'].string.def('ant-breadcrumb'),
    href: _vueTypes2['default'].string,
    separator: _vueTypes2['default'].any
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        $slots = this.$slots;

    var children = $slots['default'];
    var link = void 0;
    if ((0, _propsUtil.hasProp)(this, 'href')) {
      link = h(
        'a',
        { 'class': prefixCls + '-link' },
        [children]
      );
    } else {
      link = h(
        'span',
        { 'class': prefixCls + '-link' },
        [children]
      );
    }
    if (children) {
      return h('span', [link, h(
        'span',
        { 'class': prefixCls + '-separator' },
        [(0, _propsUtil.getComponentFromProp)(this, 'separator') || '/']
      )]);
    }
    return null;
  }
};
module.exports = exports['default'];