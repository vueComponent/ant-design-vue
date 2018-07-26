'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _PanelContent = require('./PanelContent');

var _PanelContent2 = _interopRequireDefault(_PanelContent);

var _commonProps = require('./commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Panel',
  props: (0, _extends3['default'])({}, _commonProps.panelProps),
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
      props: (0, _extends3['default'])({
        appear: true,
        css: false
      }),
      on: (0, _extends3['default'])({}, openAnimation)
    };
    var headerCls = (_headerCls = {}, (0, _defineProperty3['default'])(_headerCls, prefixCls + '-header', true), (0, _defineProperty3['default'])(_headerCls, headerClass, headerClass), _headerCls);
    var headerCon = header || $slots.header;
    var itemCls = (_itemCls = {}, (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item', true), (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item-active', isActive), (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item-disabled', disabled), _itemCls);
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
          _PanelContent2['default'],
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
module.exports = exports['default'];