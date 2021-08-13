import { defineComponent, inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import contains from '../vc-util/Dom/contains';
import {
  hasProp,
  getComponent,
  getEvents,
  filterEmpty,
  getSlot,
  findDOMNode,
} from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';
import addEventListener from '../vc-util/Dom/addEventListener';
import warning from '../_util/warning';
import Popup from './Popup';
import { getAlignFromPlacement, getAlignPopupClassName, noop } from './utils';
import BaseMixin from '../_util/BaseMixin';
import Portal from '../_util/Portal';
import classNames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import supportsPassive from '../_util/supportsPassive';

function returnEmptyString() {
  return '';
}

function returnDocument() {
  return window.document;
}
const ALL_HANDLERS = [
  'onClick',
  'onMousedown',
  'onTouchstart',
  'onMouseenter',
  'onMouseleave',
  'onFocus',
  'onBlur',
  'onContextmenu',
];

export default defineComponent({
  name: 'Trigger',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def([]),
    showAction: PropTypes.any.def([]),
    hideAction: PropTypes.any.def([]),
    getPopupClassNameFromAlign: PropTypes.any.def(returnEmptyString),
    onPopupVisibleChange: PropTypes.func.def(noop),
    afterPopupVisibleChange: PropTypes.func.def(noop),
    popup: PropTypes.any,
    popupStyle: PropTypes.object.def(() => ({})),
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
    forceRender: PropTypes.looseBool,
    destroyPopupOnHide: PropTypes.looseBool.def(false),
    mask: PropTypes.looseBool.def(false),
    maskClosable: PropTypes.looseBool.def(true),
    // onPopupAlign: PropTypes.func.def(noop),
    popupAlign: PropTypes.object.def(() => ({})),
    popupVisible: PropTypes.looseBool,
    defaultPopupVisible: PropTypes.looseBool.def(false),
    maskTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maskAnimation: PropTypes.string,
    stretch: PropTypes.string,
    alignPoint: PropTypes.looseBool, // Maybe we can support user pass position in the future
  },
  setup() {
    return {
      vcTriggerContext: inject('vcTriggerContext', {}),
      savePopupRef: inject('savePopupRef', noop),
      dialogContext: inject('dialogContext', null),
    };
  },
  data() {
    const props = this.$props;
    let popupVisible;
    if (hasProp(this, 'popupVisible')) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    ALL_HANDLERS.forEach(h => {
      this[`fire${h}`] = e => {
        this.fireEvents(h, e);
      };
    });
    this._component = null;
    this.focusTime = null;
    this.clickOutsideHandler = null;
    this.contextmenuOutsideHandler1 = null;
    this.contextmenuOutsideHandler2 = null;
    this.touchOutsideHandler = null;
    return {
      prevPopupVisible: popupVisible,
      sPopupVisible: popupVisible,
      point: null,
    };
  },
  watch: {
    popupVisible(val) {
      if (val !== undefined) {
        this.prevPopupVisible = this.sPopupVisible;
        this.sPopupVisible = val;
      }
    },
  },
  created() {
    provide('vcTriggerContext', this);
  },
  deactivated() {
    this.setPopupVisible(false);
  },
  mounted() {
    this.$nextTick(() => {
      this.updatedCal();
    });
  },

  updated() {
    this.$nextTick(() => {
      this.updatedCal();
    });
  },

  beforeUnmount() {
    this.clearDelayTimer();
    this.clearOutsideHandler();
    clearTimeout(this.mouseDownTimeout);
  },
  methods: {
    updatedCal() {
      const props = this.$props;
      const state = this.$data;

      // We must listen to `mousedown` or `touchstart`, edge case:
      // https://github.com/ant-design/ant-design/issues/5804
      // https://github.com/react-component/calendar/issues/250
      // https://github.com/react-component/trigger/issues/50
      if (state.sPopupVisible) {
        let currentDocument;
        if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow())) {
          currentDocument = props.getDocument();
          this.clickOutsideHandler = addEventListener(
            currentDocument,
            'mousedown',
            this.onDocumentClick,
          );
        }
        // always hide on mobile
        if (!this.touchOutsideHandler) {
          currentDocument = currentDocument || props.getDocument();
          this.touchOutsideHandler = addEventListener(
            currentDocument,
            'touchstart',
            this.onDocumentClick,
            supportsPassive ? { passive: false } : false,
          );
        }
        // close popup when trigger type contains 'onContextmenu' and document is scrolling.
        if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
          currentDocument = currentDocument || props.getDocument();
          this.contextmenuOutsideHandler1 = addEventListener(
            currentDocument,
            'scroll',
            this.onContextmenuClose,
          );
        }
        // close popup when trigger type contains 'onContextmenu' and window is blur.
        if (!this.contextmenuOutsideHandler2 && this.isContextmenuToShow()) {
          this.contextmenuOutsideHandler2 = addEventListener(
            window,
            'blur',
            this.onContextmenuClose,
          );
        }
      } else {
        this.clearOutsideHandler();
      }
    },
    onMouseenter(e) {
      const { mouseEnterDelay } = this.$props;
      this.fireEvents('onMouseenter', e);
      this.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e);
    },

    onMouseMove(e) {
      this.fireEvents('onMousemove', e);
      this.setPoint(e);
    },

    onMouseleave(e) {
      this.fireEvents('onMouseleave', e);
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },

    onPopupMouseenter() {
      this.clearDelayTimer();
    },

    onPopupMouseleave(e) {
      if (
        e &&
        e.relatedTarget &&
        !e.relatedTarget.setTimeout &&
        this._component &&
        this._component.getPopupDomNode &&
        contains(this._component.getPopupDomNode(), e.relatedTarget)
      ) {
        return;
      }
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },

    onFocus(e) {
      this.fireEvents('onFocus', e);
      // incase focusin and focusout
      this.clearDelayTimer();
      if (this.isFocusToShow()) {
        this.focusTime = Date.now();
        this.delaySetPopupVisible(true, this.$props.focusDelay);
      }
    },

    onMousedown(e) {
      this.fireEvents('onMousedown', e);
      this.preClickTime = Date.now();
    },

    onTouchstart(e) {
      this.fireEvents('onTouchstart', e);
      this.preTouchTime = Date.now();
    },

    onBlur(e) {
      if (!contains(e.target, e.relatedTarget || document.activeElement)) {
        this.fireEvents('onBlur', e);
        this.clearDelayTimer();
        if (this.isBlurToHide()) {
          this.delaySetPopupVisible(false, this.$props.blurDelay);
        }
      }
    },

    onContextmenu(e) {
      e.preventDefault();
      this.fireEvents('onContextmenu', e);
      this.setPopupVisible(true, e);
    },

    onContextmenuClose() {
      if (this.isContextmenuToShow()) {
        this.close();
      }
    },

    onClick(event) {
      this.fireEvents('onClick', event);
      // focus will trigger click
      if (this.focusTime) {
        let preTime;
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
      // Only prevent default when all the action is click.
      // https://github.com/ant-design/ant-design/issues/17043
      // https://github.com/ant-design/ant-design/issues/17291
      if (
        this.isClickToShow() &&
        (this.isClickToHide() || this.isBlurToHide()) &&
        event &&
        event.preventDefault
      ) {
        event.preventDefault();
      }
      if (event && event.domEvent) {
        event.domEvent.preventDefault();
      }
      const nextVisible = !this.$data.sPopupVisible;
      if ((this.isClickToHide() && !nextVisible) || (nextVisible && this.isClickToShow())) {
        this.setPopupVisible(!this.$data.sPopupVisible, event);
      }
    },
    onPopupMouseDown(...args) {
      const { vcTriggerContext = {} } = this;
      this.hasPopupMouseDown = true;

      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = setTimeout(() => {
        this.hasPopupMouseDown = false;
      }, 0);

      if (vcTriggerContext.onPopupMouseDown) {
        vcTriggerContext.onPopupMouseDown(...args);
      }
    },

    onDocumentClick(event) {
      if (this.$props.mask && !this.$props.maskClosable) {
        return;
      }
      const target = event.target;
      const root = findDOMNode(this);
      if (!contains(root, target) && !this.hasPopupMouseDown) {
        this.close();
      }
    },
    getPopupDomNode() {
      if (this._component && this._component.getPopupDomNode) {
        return this._component.getPopupDomNode();
      }
      return null;
    },

    getRootDomNode() {
      return findDOMNode(this);
    },

    handleGetPopupClassFromAlign(align) {
      const className = [];
      const props = this.$props;
      const {
        popupPlacement,
        builtinPlacements,
        prefixCls,
        alignPoint,
        getPopupClassNameFromAlign,
      } = props;
      if (popupPlacement && builtinPlacements) {
        className.push(getAlignPopupClassName(builtinPlacements, prefixCls, align, alignPoint));
      }
      if (getPopupClassNameFromAlign) {
        className.push(getPopupClassNameFromAlign(align));
      }
      return className.join(' ');
    },

    getPopupAlign() {
      const props = this.$props;
      const { popupPlacement, popupAlign, builtinPlacements } = props;
      if (popupPlacement && builtinPlacements) {
        return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
      }
      return popupAlign;
    },
    savePopup(node) {
      this._component = node;
      this.savePopupRef(node);
    },
    getComponent() {
      const self = this;
      const mouseProps = {};
      if (this.isMouseEnterToShow()) {
        mouseProps.onMouseenter = self.onPopupMouseenter;
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.onMouseleave = self.onPopupMouseleave;
      }
      mouseProps.onMousedown = this.onPopupMouseDown;
      mouseProps[supportsPassive ? 'onTouchstartPassive' : 'onTouchstart'] = this.onPopupMouseDown;
      const { handleGetPopupClassFromAlign, getRootDomNode, getContainer, $attrs } = self;
      const {
        prefixCls,
        destroyPopupOnHide,
        popupClassName,
        action,
        popupAnimation,
        popupTransitionName,
        popupStyle,
        mask,
        maskAnimation,
        maskTransitionName,
        zIndex,
        stretch,
        alignPoint,
      } = self.$props;
      const { sPopupVisible, point } = this.$data;
      const align = this.getPopupAlign();
      const popupProps = {
        prefixCls,
        destroyPopupOnHide,
        visible: sPopupVisible,
        point: alignPoint ? point : null,
        action,
        align,
        animation: popupAnimation,
        getClassNameFromAlign: handleGetPopupClassFromAlign,
        stretch,
        getRootDomNode,
        mask,
        zIndex,
        transitionName: popupTransitionName,
        maskAnimation,
        maskTransitionName,
        getContainer,
        popupClassName,
        popupStyle,
        onAlign: $attrs.onPopupAlign || noop,
        ...mouseProps,
        ref: this.savePopup,
      };
      return <Popup {...popupProps}>{getComponent(self, 'popup')}</Popup>;
    },

    getContainer() {
      const { $props: props, dialogContext } = this;
      const popupContainer = document.createElement('div');
      // Make sure default popup container will never cause scrollbar appearing
      // https://github.com/react-component/trigger/issues/41
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '100%';
      const mountNode = props.getPopupContainer
        ? props.getPopupContainer(findDOMNode(this), dialogContext)
        : props.getDocument().body;
      mountNode.appendChild(popupContainer);
      this.popupContainer = popupContainer;
      return popupContainer;
    },

    setPopupVisible(sPopupVisible, event) {
      const { alignPoint, sPopupVisible: prevPopupVisible, onPopupVisibleChange } = this;
      this.clearDelayTimer();
      if (prevPopupVisible !== sPopupVisible) {
        if (!hasProp(this, 'popupVisible')) {
          this.setState({
            sPopupVisible,
            prevPopupVisible,
          });
        }
        onPopupVisibleChange && onPopupVisibleChange(sPopupVisible);
      }
      // Always record the point position since mouseEnterDelay will delay the show
      if (alignPoint && event) {
        this.setPoint(event);
      }
    },

    setPoint(point) {
      const { alignPoint } = this.$props;
      if (!alignPoint || !point) return;

      this.setState({
        point: {
          pageX: point.pageX,
          pageY: point.pageY,
        },
      });
    },
    handlePortalUpdate() {
      if (this.prevPopupVisible !== this.sPopupVisible) {
        this.afterPopupVisibleChange(this.sPopupVisible);
      }
    },
    delaySetPopupVisible(visible, delayS, event) {
      const delay = delayS * 1000;
      this.clearDelayTimer();
      if (delay) {
        const point = event ? { pageX: event.pageX, pageY: event.pageY } : null;
        this.delayTimer = requestAnimationTimeout(() => {
          this.setPopupVisible(visible, point);
          this.clearDelayTimer();
        }, delay);
      } else {
        this.setPopupVisible(visible, event);
      }
    },

    clearDelayTimer() {
      if (this.delayTimer) {
        cancelAnimationTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    },

    clearOutsideHandler() {
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

    createTwoChains(event) {
      let fn = () => {};
      const events = getEvents(this);
      if (this.childOriginEvents[event] && events[event]) {
        return this[`fire${event}`];
      }
      fn = this.childOriginEvents[event] || events[event] || fn;
      return fn;
    },

    isClickToShow() {
      const { action, showAction } = this.$props;
      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    },

    isContextmenuToShow() {
      const { action, showAction } = this.$props;
      return action.indexOf('contextmenu') !== -1 || showAction.indexOf('contextmenu') !== -1;
    },

    isClickToHide() {
      const { action, hideAction } = this.$props;
      return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
    },

    isMouseEnterToShow() {
      const { action, showAction } = this.$props;
      return action.indexOf('hover') !== -1 || showAction.indexOf('mouseenter') !== -1;
    },

    isMouseLeaveToHide() {
      const { action, hideAction } = this.$props;
      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseleave') !== -1;
    },

    isFocusToShow() {
      const { action, showAction } = this.$props;
      return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
    },

    isBlurToHide() {
      const { action, hideAction } = this.$props;
      return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
    },
    forcePopupAlign() {
      if (this.$data.sPopupVisible && this._component && this._component.alignInstance) {
        this._component.alignInstance.forceAlign();
      }
    },
    fireEvents(type, e) {
      if (this.childOriginEvents[type]) {
        this.childOriginEvents[type](e);
      }
      const event = this.$props[type] || this.$attrs[type];
      if (event) {
        event(e);
      }
    },

    close() {
      this.setPopupVisible(false);
    },
  },
  render() {
    const { sPopupVisible, $attrs } = this;
    const children = filterEmpty(getSlot(this));
    const { forceRender, alignPoint } = this.$props;

    if (children.length > 1) {
      warning(false, 'Trigger children just support only one default', true);
    }
    const child = children[0];
    this.childOriginEvents = getEvents(child);
    const newChildProps = {
      key: 'trigger',
    };

    if (this.isContextmenuToShow()) {
      newChildProps.onContextmenu = this.onContextmenu;
    } else {
      newChildProps.onContextmenu = this.createTwoChains('onContextmenu');
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.onClick = this.onClick;
      newChildProps.onMousedown = this.onMousedown;
      newChildProps[supportsPassive ? 'onTouchstartPassive' : 'onTouchstart'] = this.onTouchstart;
    } else {
      newChildProps.onClick = this.createTwoChains('onClick');
      newChildProps.onMousedown = this.createTwoChains('onMousedown');
      newChildProps[supportsPassive ? 'onTouchstartPassive' : 'onTouchstart'] =
        this.createTwoChains('onTouchstart');
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.onMouseenter = this.onMouseenter;
      if (alignPoint) {
        newChildProps.onMousemove = this.onMouseMove;
      }
    } else {
      newChildProps.onMouseenter = this.createTwoChains('onMouseenter');
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.onMouseleave = this.onMouseleave;
    } else {
      newChildProps.onMouseleave = this.createTwoChains('onMouseleave');
    }

    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.onFocus = this.onFocus;
      newChildProps.onBlur = this.onBlur;
    } else {
      newChildProps.onFocus = this.createTwoChains('onFocus');
      newChildProps.onBlur = e => {
        if (e && (!e.relatedTarget || !contains(e.target, e.relatedTarget))) {
          this.createTwoChains('onBlur')(e);
        }
      };
    }
    const childrenClassName = classNames(child && child.props && child.props.class, $attrs.class);
    if (childrenClassName) {
      newChildProps.class = childrenClassName;
    }
    const trigger = cloneElement(child, newChildProps);
    let portal;
    // prevent unmounting after it's rendered
    if (sPopupVisible || this._component || forceRender) {
      portal = (
        <Portal
          key="portal"
          children={this.getComponent()}
          getContainer={this.getContainer}
          didUpdate={this.handlePortalUpdate}
        ></Portal>
      );
    }
    return [portal, trigger];
  },
});
