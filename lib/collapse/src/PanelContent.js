'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'PanelContent',
  props: {
    prefixCls: _vueTypes2['default'].string,
    isActive: _vueTypes2['default'].bool,
    destroyInactivePanel: _vueTypes2['default'].bool
  },
  data: function data() {
    return {
      _isActive: undefined
    };
  },
  render: function render() {
    var _contentCls;

    var h = arguments[0];

    this._isActive = this._isActive || this.isActive;
    if (!this._isActive) {
      return null;
    }
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        isActive = _$props.isActive,
        destroyInactivePanel = _$props.destroyInactivePanel;
    var $slots = this.$slots;

    var contentCls = (_contentCls = {}, (0, _defineProperty3['default'])(_contentCls, prefixCls + '-content', true), (0, _defineProperty3['default'])(_contentCls, prefixCls + '-content-active', isActive), _contentCls);
    var child = !isActive && destroyInactivePanel ? null : h(
      'div',
      { 'class': prefixCls + '-content-box' },
      [$slots['default']]
    );
    return h(
      'div',
      {
        'class': contentCls,
        attrs: { role: 'tabpanel'
        }
      },
      [child]
    );
  }
};
module.exports = exports['default'];