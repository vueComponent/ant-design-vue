'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vcMenu = require('../vc-menu');

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  props: _vcMenu.itemProps,
  name: 'MenuItem',
  inject: {
    getInlineCollapsed: { 'default': function _default() {
        return noop;
      } }
  },
  isMenuItem: 1,
  methods: {
    onKeyDown: function onKeyDown(e) {
      this.$refs.menuItem.onKeyDown(e);
    }
  },
  render: function render(h) {
    var getInlineCollapsed = this.getInlineCollapsed,
        props = this.$props,
        $slots = this.$slots,
        attrs = this.$attrs,
        $listeners = this.$listeners;

    var inlineCollapsed = getInlineCollapsed();
    var itemProps = {
      props: props,
      attrs: attrs,
      on: $listeners,
      'class': (0, _propsUtil.getClass)(this),
      style: (0, _propsUtil.getStyle)(this)
    };
    var toolTipProps = {
      props: {
        placement: 'right',
        overlayClassName: props.rootPrefixCls + '-inline-collapsed-tooltip'
      },
      on: {}
    };
    return inlineCollapsed && props.level === 1 ? h(
      _tooltip2['default'],
      toolTipProps,
      [h(
        'template',
        { slot: 'title' },
        [(0, _vnode.cloneVNodes)($slots['default'], true)]
      ), h(
        _vcMenu.Item,
        (0, _babelHelperVueJsxMergeProps2['default'])([itemProps, { ref: 'menuItem' }]),
        [$slots['default']]
      )]
    ) : h(
      _vcMenu.Item,
      (0, _babelHelperVueJsxMergeProps2['default'])([itemProps, { ref: 'menuItem' }]),
      [$slots['default']]
    );
  }
};
module.exports = exports['default'];