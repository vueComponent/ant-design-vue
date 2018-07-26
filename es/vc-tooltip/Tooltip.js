import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import Trigger from '../trigger';
import { placements } from './placements';
import { hasProp, getComponentFromProp, getOptionProps } from '../_util/props-util';
function noop() {}
export default {
  props: {
    trigger: PropTypes.any.def('hover'),
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.string.def('right'),
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(function () {}),
    overlay: PropTypes.any,
    overlayStyle: PropTypes.object,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.bool.def(false),
    align: PropTypes.object.def({}),
    arrowContent: PropTypes.any.def(null),
    tipId: PropTypes.string,
    builtinPlacements: PropTypes.object
  },
  methods: {
    getPopupElement: function getPopupElement(h) {
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          tipId = _$props.tipId;

      return [h(
        'div',
        { 'class': prefixCls + '-arrow', key: 'arrow' },
        [getComponentFromProp(this, 'arrowContent')]
      ), h(
        'div',
        { 'class': prefixCls + '-inner', key: 'content', attrs: { id: tipId }
        },
        [getComponentFromProp(this, 'overlay')]
      )];
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    }
  },
  render: function render(h) {
    var _getOptionProps = getOptionProps(this),
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
        restProps = _objectWithoutProperties(_getOptionProps, ['overlayClassName', 'trigger', 'mouseEnterDelay', 'mouseLeaveDelay', 'overlayStyle', 'prefixCls', 'afterVisibleChange', 'transitionName', 'animation', 'placement', 'align', 'destroyTooltipOnHide', 'defaultVisible', 'getTooltipContainer']);

    var extraProps = _extends({}, restProps);
    if (hasProp(this, 'visible')) {
      extraProps.popupVisible = this.$props.visible;
    }
    var triggerProps = {
      props: _extends({
        popupClassName: overlayClassName,
        prefixCls: prefixCls,
        action: trigger,
        builtinPlacements: placements,
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
      Trigger,
      triggerProps,
      [h(
        'template',
        { slot: 'popup' },
        [this.getPopupElement(h)]
      ), this.$slots['default']]
    );
  }
};