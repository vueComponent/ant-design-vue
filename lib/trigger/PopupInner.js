'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _LazyRenderBox = require('./LazyRenderBox');

var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: {
    hiddenClassName: _vueTypes2['default'].string.def(''),
    prefixCls: _vueTypes2['default'].string,
    visible: _vueTypes2['default'].bool
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        visible = _$props.visible,
        hiddenClassName = _$props.hiddenClassName;
    var $listeners = this.$listeners;

    var divProps = {
      on: $listeners
    };

    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([divProps, { 'class': !visible ? hiddenClassName : '' }]),
      [h(
        _LazyRenderBox2['default'],
        { 'class': prefixCls + '-content', attrs: { visible: visible }
        },
        [this.$slots['default']]
      )]
    );
  }
};
module.exports = exports['default'];