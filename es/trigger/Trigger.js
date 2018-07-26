import _extends from 'babel-runtime/helpers/extends';

import Vue from 'vue';
import antRefDirective from '../_util/antRefDirective';
import PropTypes from '../_util/vue-types';
import contains from '../_util/Dom/contains';
import { hasProp, getComponentFromProp, getEvents, filterEmpty } from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';
import addEventListener from '../_util/Dom/addEventListener';
import warning from '../_util/warning';
import Popup from './Popup';
import { getAlignFromPlacement, getPopupClassNameFromAlign, noop } from './utils';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
import ContainerRender from '../_util/ContainerRender';
Vue.use(antRefDirective);

function returnEmptyString() {
  return '';
}

function returnDocument() {
  return window.document;
}
var ALL_HANDLERS = ['click', 'mousedown', 'touchstart', 'mouseenter', 'mouseleave', 'focus', 'blur', 'contextmenu'];

export default {
  name: 'Trigger',
  props: {
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def([]),
    showAction: PropTypes.any.def([]),
    hideAction: PropTypes.any.def([]),
    getPopupClassNameFromAlign: PropTypes.any.def(returnEmptyString),
    // onPopupVisibleChange: PropTypes.func.def(noop),
    afterPopupVisibleChange: PropTypes.func.def(noop),
    popup: PropTypes.any,
    popupStyle: PropTypes.object.def({}),
    prefixCls: PropTypes.string.def('rc-trigger-popup'),
    popupClassName: PropTypes.string.def(''),
    popupPlacement: PropTypes.string,
    builtinPlacements: PropTypes.object,
    popupTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    popupAnimation: PropTypes.any,
    mouseEnterDelay: PropTypes.number.def(0),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    zIndex: PropTypes.number,
    focusDelay: PropTypes.number.def(0),
    blurDelay: PropTypes.number.def(0.15),
    getPopupContainer: PropTypes.func,
    getDocument: PropTypes.func.def(returnDocument),
    forceRender: PropTypes.bool,
    destroyPopupOnHide: PropTypes.bool.def(false),
    mask: PropTypes.bool.def(false),
    maskClosable: PropTypes.bool.def(true),
    // onPopupAlign: PropTypes.func.def(noop),
    popupAlign: PropTypes.object.def({}),
    popupVisible: PropTypes.bool,
    defaultPopupVisible: PropTypes.bool.def(false),
    maskTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maskAnimation: PropTypes.string
  },

  mixins: [BaseMixin],
  data: function data() {
    var props = this.$props;
    var popupVisible = void 0;
    if (hasProp(this, 'popupVisible')) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    return {
      sPopupVisible: popupVisible
    };
  },
  beforeCreate: function beforeCreate() {
    var _this = this;

    ALL_HANDLERS.forEach(function (h) {
      _this['fire' + h] = function (e) {
        _this.fireEvents(h, e);
      };
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.renderComponent(null);
      _this2.updatedCal();
    });
  },

  watch: {
    popupVisible: function popupVisible(val) {
      if (val !== undefined) {
        this.sPopupVisible = val;
      }
    },
    sPopupVisible: function sPopupVisible(val) {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.renderComponent(null, function () {
          _this3.afterPopupVisibleChange(val);
        });
      });
    }
  },

  updated: function updated() {
    var _this4 = this;

    this.$nextTick(function () {
      _this4.updatedCal();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearDelayTimer();
    this.clearOutsideHandler();
  },

  methods: {
    updatedCal: function updatedCal() {
      var props = this.$props;
      var state = this.$data;

      // We must listen to `mousedown` or `touchstart`, edge case:
      // https://github.com/ant-design/ant-design/issues/5804
      // https://github.com/react-component/calendar/issues/250
      // https://github.com/react-component/trigger/issues/50
      if (state.sPopupVisible) {
        var currentDocument = void 0;
        if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow())) {
          currentDocument = props.getDocument();
          this.clickOutsideHandler = addEventListener(currentDocument, 'mousedown', this.onDocumentClick);
        }
        // always hide on mobile
        if (!this.touchOutsideHandler) {
          currentDocument = currentDocument || props.getDocument();
          this.touchOutsideHandler = addEventListener(currentDocument, 'touchstart', this.onDocumentClick);
        }
        // close popup when trigger type contains 'onContextmenu' and document is scrolling.
        if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
          currentDocument = currentDocument || props.getDocument();
          this.contextmenuOutsideHandler1 = addEventListener(currentDocument, 'scroll', this.onContextmenuClose);
        }
        // close popup when trigger type contains 'onContextmenu' and window is blur.
        if (!this.contextmenuOutsideHandler2 && this.isContextmenuToShow()) {
          this.contextmenuOutsideHandler2 = addEventListener(window, 'blur', this.onContextmenuClose);
        }
      } else {
        this.clearOutsideHandler();
      }
    },
    onMouseenter: function onMouseenter(e) {
      this.fireEvents('mouseenter', e);
      this.delaySetPopupVisible(true, this.$props.mouseEnterDelay);
    },
    onMouseleave: function onMouseleave(e) {
      this.fireEvents('mouseleave', e);
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },
    onPopupMouseenter: function onPopupMouseenter() {
      this.clearDelayTimer();
    },
    onPopupMouseleave: function onPopupMouseleave(e) {
      if (e && e.relatedTarget && !e.relatedTarget.setTimeout && this._component && this._component.getPopupDomNode && contains(this._component.getPopupDomNode(), e.relatedTarget)) {
        return;
      }
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },
    onFocus: function onFocus(e) {
      this.fireEvents('focus', e);
      // incase focusin and focusout
      this.clearDelayTimer();
      if (this.isFocusToShow()) {
        this.focusTime = Date.now();
        this.delaySetPopupVisible(true, this.$props.focusDelay);
      }
    },
    onMousedown: function onMousedown(e) {
      this.fireEvents('mousedown', e);
      this.preClickTime = Date.now();
    },
    onTouchstart: function onTouchstart(e) {
      this.fireEvents('touchstart', e);
      this.preTouchTime = Date.now();
    },
    onBlur: function onBlur(e) {
      this.fireEvents('blur', e);
      this.clearDelayTimer();
      if (this.isBlurToHide()) {
        this.delaySetPopupVisible(false, this.$props.blurDelay);
      }
    },
    onContextmenu: function onContextmenu(e) {
      e.preventDefault();
      this.fireEvents('contextmenu', e);
      this.setPopupVisible(true);
    },
    onContextmenuClose: function onContextmenuClose() {
      if (this.isContextmenuToShow()) {
        this.close();
      }
    },
    onClick: function onClick(event) {
      this.fireEvents('click', event);
      // focus will trigger click
      if (this.focusTime) {
        var preTime = void 0;
        if (this.preClickTime && this.preTouchTime) {
          preTime = Math.min(this.preClickTime, this.preTouchTime);
        } else if (this.preClickTime) {
          preTime = this.preClickTime;
        } else if (this.preTouchTime) {
          preTime = this.preTouchTime;
        }
        if (Math.abs(preTime - this.focusTime) < 20) {
          return;
        }
        this.focusTime = 0;
      }
      this.preClickTime = 0;
      this.preTouchTime = 0;
      event.preventDefault && event.preventDefault();
      if (event.domEvent) {
        event.domEvent.preventDefault();
      }
      var nextVisible = !this.$data.sPopupVisible;
      if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
        this.setPopupVisible(!this.$data.sPopupVisible);
      }
    },
    onDocumentClick: function onDocumentClick(event) {
      if (this.$props.mask && !this.$props.maskClosable) {
        return;
      }
      var target = event.target;
      var root = this.$el;
      var popupNode = this.getPopupDomNode();
      if (!contains(root, target) && !contains(popupNode, target)) {
        this.close();
      }
    },
    getPopupDomNode: function getPopupDomNode() {
      if (this._component && this._component.getPopupDomNode) {
        return this._component.getPopupDomNode();
      }
      return null;
    },
    getRootDomNode: function getRootDomNode() {
      return this.$el;
      // return this.$el.children[0] || this.$el
    },
    handleGetPopupClassFromAlign: function handleGetPopupClassFromAlign(align) {
      var className = [];
      var props = this.$props;
      var popupPlacement = props.popupPlacement,
          builtinPlacements = props.builtinPlacements,
          prefixCls = props.prefixCls;

      if (popupPlacement && builtinPlacements) {
        className.push(getPopupClassNameFromAlign(builtinPlacements, prefixCls, align));
      }
      if (props.getPopupClassNameFromAlign) {
        className.push(props.getPopupClassNameFromAlign(align));
      }
      return className.join(' ');
    },
    getPopupAlign: function getPopupAlign() {
      var props = this.$props;
      var popupPlacement = props.popupPlacement,
          popupAlign = props.popupAlign,
          builtinPlacements = props.builtinPlacements;

      if (popupPlacement && builtinPlacements) {
        return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
      }
      return popupAlign;
    },
    savePopup: function savePopup(node) {
      this._component = node && node.componentInstance;
    },
    getComponent: function getComponent() {
      var h = this.$createElement;

      var self = this;
      var mouseProps = {};
      if (this.isMouseEnterToShow()) {
        mouseProps.mouseenter = self.onPopupMouseenter;
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.mouseleave = self.onPopupMouseleave;
      }
      var prefixCls = self.prefixCls,
          destroyPopupOnHide = self.destroyPopupOnHide,
          sPopupVisible = self.sPopupVisible,
          popupStyle = self.popupStyle,
          popupClassName = self.popupClassName,
          action = self.action,
          popupAnimation = self.popupAnimation,
          handleGetPopupClassFromAlign = self.handleGetPopupClassFromAlign,
          getRootDomNode = self.getRootDomNode,
          mask = self.mask,
          zIndex = self.zIndex,
          popupTransitionName = self.popupTransitionName,
          getPopupAlign = self.getPopupAlign,
          maskAnimation = self.maskAnimation,
          maskTransitionName = self.maskTransitionName,
          getContainer = self.getContainer;

      var popupProps = {
        props: {
          prefixCls: prefixCls,
          destroyPopupOnHide: destroyPopupOnHide,
          visible: sPopupVisible,
          action: action,
          align: getPopupAlign(),
          animation: popupAnimation,
          getClassNameFromAlign: handleGetPopupClassFromAlign,
          getRootDomNode: getRootDomNode,
          mask: mask,
          zIndex: zIndex,
          transitionName: popupTransitionName,
          maskAnimation: maskAnimation,
          maskTransitionName: maskTransitionName,
          getContainer: getContainer,
          popupClassName: popupClassName,
          popupStyle: popupStyle
        },
        on: _extends({
          align: self.$listeners.popupAlign || noop
        }, mouseProps),
        directives: [{
          name: 'ant-ref',
          value: this.savePopup
        }]
      };
      return h(
        Popup,
        popupProps,
        [getComponentFromProp(self, 'popup')]
      );
    },
    getContainer: function getContainer() {
      var props = this.$props;

      var popupContainer = document.createElement('div');
      // Make sure default popup container will never cause scrollbar appearing
      // https://github.com/react-component/trigger/issues/41
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '100%';
      var mountNode = props.getPopupContainer ? props.getPopupContainer(this.$el) : props.getDocument().body;
      mountNode.appendChild(popupContainer);
      this.popupContainer = popupContainer;
      return popupContainer;
    },
    setPopupVisible: function setPopupVisible(sPopupVisible) {
      this.clearDelayTimer();
      if (this.$data.sPopupVisible !== sPopupVisible) {
        if (!hasProp(this, 'popupVisible')) {
          this.setState({
            sPopupVisible: sPopupVisible
          });
        }
        this.$listeners.popupVisibleChange && this.$listeners.popupVisibleChange(sPopupVisible);
      }
    },
    delaySetPopupVisible: function delaySetPopupVisible(visible, delayS) {
      var _this5 = this;

      var delay = delayS * 1000;
      this.clearDelayTimer();
      if (delay) {
        this.delayTimer = requestAnimationTimeout(function () {
          _this5.setPopupVisible(visible);
          _this5.clearDelayTimer();
        }, delay);
      } else {
        this.setPopupVisible(visible);
      }
    },
    clearDelayTimer: function clearDelayTimer() {
      if (this.delayTimer) {
        cancelAnimationTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    },
    clearOutsideHandler: function clearOutsideHandler() {
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.remove();
        this.clickOutsideHandler = null;
      }

      if (this.contextmenuOutsideHandler1) {
        this.contextmenuOutsideHandler1.remove();
        this.contextmenuOutsideHandler1 = null;
      }

      if (this.contextmenuOutsideHandler2) {
        this.contextmenuOutsideHandler2.remove();
        this.contextmenuOutsideHandler2 = null;
      }

      if (this.touchOutsideHandler) {
        this.touchOutsideHandler.remove();
        this.touchOutsideHandler = null;
      }
    },
    createTwoChains: function createTwoChains(event) {
      var fn = function fn() {};
      var events = this.$listeners;
      if (this.childOriginEvents[event] && events[event]) {
        return this['fire' + event];
      }
      fn = this.childOriginEvents[event] || events[event] || fn;
      return fn;
    },
    isClickToShow: function isClickToShow() {
      var _$props = this.$props,
          action = _$props.action,
          showAction = _$props.showAction;

      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    },
    isContextmenuToShow: function isContextmenuToShow() {
      var _$props2 = this.$props,
          action = _$props2.action,
          showAction = _$props2.showAction;

      return action.indexOf('contextmenu') !== -1 || showAction.indexOf('contextmenu') !== -1;
    },
    isClickToHide: function isClickToHide() {
      var _$props3 = this.$props,
          action = _$props3.action,
          hideAction = _$props3.hideAction;

      return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
    },
    isMouseEnterToShow: function isMouseEnterToShow() {
      var _$props4 = this.$props,
          action = _$props4.action,
          showAction = _$props4.showAction;

      return action.indexOf('hover') !== -1 || showAction.indexOf('mouseenter') !== -1;
    },
    isMouseLeaveToHide: function isMouseLeaveToHide() {
      var _$props5 = this.$props,
          action = _$props5.action,
          hideAction = _$props5.hideAction;

      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseleave') !== -1;
    },
    isFocusToShow: function isFocusToShow() {
      var _$props6 = this.$props,
          action = _$props6.action,
          showAction = _$props6.showAction;

      return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
    },
    isBlurToHide: function isBlurToHide() {
      var _$props7 = this.$props,
          action = _$props7.action,
          hideAction = _$props7.hideAction;

      return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
    },
    forcePopupAlign: function forcePopupAlign() {
      if (this.$data.sPopupVisible && this._component && this._component.$refs.alignInstance) {
        this._component.$refs.alignInstance.forceAlign();
      }
    },
    fireEvents: function fireEvents(type, e) {
      if (this.childOriginEvents[type]) {
        this.childOriginEvents[type](e);
      }
      this.__emit(type, e);
    },
    close: function close() {
      this.setPopupVisible(false);
    }
  },
  render: function render(h) {
    var _this6 = this;

    var children = filterEmpty(this.$slots['default']);
    if (children.length > 1) {
      warning(false, 'Trigger $slots.default.length > 1, just support only one default', true);
    }
    var child = children[0];
    this.childOriginEvents = getEvents(child);
    var newChildProps = {
      props: {},
      on: {},
      key: 'trigger'
    };

    if (this.isContextmenuToShow()) {
      newChildProps.on.contextmenu = this.onContextmenu;
    } else {
      newChildProps.on.contextmenu = this.createTwoChains('contextmenu');
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.on.click = this.onClick;
      newChildProps.on.mousedown = this.onMousedown;
      newChildProps.on.touchstart = this.onTouchstart;
    } else {
      newChildProps.on.click = this.createTwoChains('click');
      newChildProps.on.mousedown = this.createTwoChains('mousedown');
      newChildProps.on.touchstart = this.createTwoChains('onTouchstart');
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.on.mouseenter = this.onMouseenter;
    } else {
      newChildProps.on.mouseenter = this.createTwoChains('mouseenter');
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.on.mouseleave = this.onMouseleave;
    } else {
      newChildProps.on.mouseleave = this.createTwoChains('mouseleave');
    }

    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.on.focus = this.onFocus;
      newChildProps.on.blur = this.onBlur;
    } else {
      newChildProps.on.focus = this.createTwoChains('focus');
      newChildProps.on.blur = function (e) {
        if (e && (!e.relatedTarget || !contains(e.target, e.relatedTarget))) {
          _this6.createTwoChains('blur')(e);
        }
      };
    }
    var sPopupVisible = this.sPopupVisible,
        forceRender = this.forceRender;

    var trigger = cloneElement(child, newChildProps);

    return h(ContainerRender, {
      attrs: {
        parent: this,
        visible: sPopupVisible,
        autoMount: false,
        forceRender: forceRender,
        getComponent: this.getComponent,
        getContainer: this.getContainer,
        children: function children(_ref) {
          var renderComponent = _ref.renderComponent;

          _this6.renderComponent = renderComponent;
          return trigger;
        }
      }
    });
  }
};