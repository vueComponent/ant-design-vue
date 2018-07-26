import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';

import { Item, itemProps } from '../vc-menu';
import { getClass, getStyle } from '../_util/props-util';
import { cloneVNodes } from '../_util/vnode';
import Tooltip from '../tooltip';
function noop() {}
export default {
  props: itemProps,
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
      'class': getClass(this),
      style: getStyle(this)
    };
    var toolTipProps = {
      props: {
        placement: 'right',
        overlayClassName: props.rootPrefixCls + '-inline-collapsed-tooltip'
      },
      on: {}
    };
    return inlineCollapsed && props.level === 1 ? h(
      Tooltip,
      toolTipProps,
      [h(
        'template',
        { slot: 'title' },
        [cloneVNodes($slots['default'], true)]
      ), h(
        Item,
        _mergeJSXProps([itemProps, { ref: 'menuItem' }]),
        [$slots['default']]
      )]
    ) : h(
      Item,
      _mergeJSXProps([itemProps, { ref: 'menuItem' }]),
      [$slots['default']]
    );
  }
};