import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import PanelContent from './PanelContent';
import { panelProps } from './commonProps';

export default {
  name: 'Panel',
  props: _extends({}, panelProps),
  methods: {
    handleItemClick: function handleItemClick() {
      this.$emit('itemClick');
    }
  },
  render: function render() {
    var _headerCls, _itemCls;

    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        header = _$props.header,
        headerClass = _$props.headerClass,
        isActive = _$props.isActive,
        showArrow = _$props.showArrow,
        destroyInactivePanel = _$props.destroyInactivePanel,
        disabled = _$props.disabled,
        openAnimation = _$props.openAnimation;
    var $slots = this.$slots;


    var transitionProps = {
      props: _extends({
        appear: true,
        css: false
      }),
      on: _extends({}, openAnimation)
    };
    var headerCls = (_headerCls = {}, _defineProperty(_headerCls, prefixCls + '-header', true), _defineProperty(_headerCls, headerClass, headerClass), _headerCls);
    var headerCon = header || $slots.header;
    var itemCls = (_itemCls = {}, _defineProperty(_itemCls, prefixCls + '-item', true), _defineProperty(_itemCls, prefixCls + '-item-active', isActive), _defineProperty(_itemCls, prefixCls + '-item-disabled', disabled), _itemCls);
    return h(
      'div',
      { 'class': itemCls, attrs: { role: 'tablist' }
      },
      [h(
        'div',
        {
          'class': headerCls,
          on: {
            'click': this.handleItemClick.bind(this)
          },
          attrs: {
            role: 'tab',
            'aria-expanded': isActive
          }
        },
        [showArrow && h('i', { 'class': 'arrow' }), headerCon]
      ), h(
        'transition',
        transitionProps,
        [h(
          PanelContent,
          {
            directives: [{
              name: 'show',
              value: isActive
            }],
            attrs: {
              prefixCls: prefixCls,
              isActive: isActive,
              destroyInactivePanel: destroyInactivePanel
            }
          },
          [$slots['default']]
        )]
      )]
    );
  }
};