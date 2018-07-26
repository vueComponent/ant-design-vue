'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _placements = require('./placements');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  props: {
    trigger: _vueTypes2['default'].any.def('hover'),
    defaultVisible: _vueTypes2['default'].bool,
    visible: _vueTypes2['default'].bool,
    placement: _vueTypes2['default'].string.def('right'),
    transitionName: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    animation: _vueTypes2['default'].any,
    afterVisibleChange: _vueTypes2['default'].func.def(function () {}),
    overlay: _vueTypes2['default'].any,
    overlayStyle: _vueTypes2['default'].object,
    overlayClassName: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string.def('rc-tooltip'),
    mouseEnterDelay: _vueTypes2['default'].number.def(0),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1),
    getTooltipContainer: _vueTypes2['default'].func,
    destroyTooltipOnHide: _vueTypes2['default'].bool.def(false),
    align: _vueTypes2['default'].object.def({}),
    arrowContent: _vueTypes2['default'].any.def(null),
    tipId: _vueTypes2['default'].string,
    builtinPlacements: _vueTypes2['default'].object
  },
  methods: {
    getPopupElement: function getPopupElement(h) {
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          tipId = _$props.tipId;

      return [h(
        'div',
        { 'class': prefixCls + '-arrow', key: 'arrow' },
        [(0, _propsUtil.getComponentFromProp)(this, 'arrowContent')]
      ), h(
        'div',
        { 'class': prefixCls + '-inner', key: 'content', attrs: { id: tipId }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'overlay')]
      )];
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    }
  },
  render: function render(h) {
    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        overlayClassName = _getOptionProps.overlayClassName,
        trigger = _getOptionProps.trigger,
        mouseEnterDelay = _getOptionProps.mouseEnterDelay,
        mouseLeaveDelay = _getOptionProps.mouseLeaveDelay,
        overlayStyle = _getOptionProps.overlayStyle,
        prefixCls = _getOptionProps.prefixCls,
        afterVisibleChange = _getOptionProps.afterVisibleChange,
        transitionName = _getOptionProps.transitionName,
        animation = _getOptionProps.animation,
        placement = _getOptionProps.placement,
        align = _getOptionProps.align,
        destroyTooltipOnHide = _getOptionProps.destroyTooltipOnHide,
        defaultVisible = _getOptionProps.defaultVisible,
        getTooltipContainer = _getOptionProps.getTooltipContainer,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['overlayClassName', 'trigger', 'mouseEnterDelay', 'mouseLeaveDelay', 'overlayStyle', 'prefixCls', 'afterVisibleChange', 'transitionName', 'animation', 'placement', 'align', 'destroyTooltipOnHide', 'defaultVisible', 'getTooltipContainer']);

    var extraProps = (0, _extends3['default'])({}, restProps);
    if ((0, _propsUtil.hasProp)(this, 'visible')) {
      extraProps.popupVisible = this.$props.visible;
    }
    var triggerProps = {
      props: (0, _extends3['default'])({
        popupClassName: overlayClassName,
        prefixCls: prefixCls,
        action: trigger,
        builtinPlacements: _placements.placements,
        popupPlacement: placement,
        popupAlign: align,
        getPopupContainer: getTooltipContainer,
        afterPopupVisibleChange: afterVisibleChange,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        defaultPopupVisible: defaultVisible,
        destroyPopupOnHide: destroyTooltipOnHide,
        mouseLeaveDelay: mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay: mouseEnterDelay
      }, extraProps),
      on: {
        popupVisibleChange: this.$listeners.visibleChange || noop,
        popupAlign: this.$listeners.popupAlign || noop
      },
      ref: 'trigger'
    };
    return h(
      _trigger2['default'],
      triggerProps,
      [h(
        'template',
        { slot: 'popup' },
        [this.getPopupElement(h)]
      ), this.$slots['default']]
    );
  }
};
module.exports = exports['default'];