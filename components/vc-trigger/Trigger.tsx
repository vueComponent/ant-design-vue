import type { HTMLAttributes } from 'vue';
import { computed, defineComponent, inject, provide, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import contains from '../vc-util/Dom/contains';
import raf from '../_util/raf';
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
import Popup from './Popup';
import { getAlignFromPlacement, getAlignPopupClassName } from './utils/alignUtil';
import BaseMixin from '../_util/BaseMixin';
import Portal from '../_util/Portal';
import classNames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import supportsPassive from '../_util/supportsPassive';

function noop() {}
function returnEmptyString() {
  return '';
}

function returnDocument(element) {
  if (element) {
    return element.ownerDocument;
  }
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
    popupStyle: PropTypes.style,
    prefixCls: PropTypes.string.def('rc-trigger-popup'),
    popupClassName: PropTypes.string.def(''),
    popupPlacement: PropTypes.string,
    builtinPlacements: PropTypes.object,
    popupTransitionName: PropTypes.string,
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
    maskTransitionName: PropTypes.string,
    maskAnimation: PropTypes.string,
    stretch: PropTypes.string,
    alignPoint: PropTypes.looseBool, // Maybe we can support user pass position in the future
    autoDestroy: PropTypes.looseBool.def(false),
    mobile: Object,
    getTriggerDOMNode: Function,
  },
  setup(props) {
    const align = computed(() => {
      const { popupPlacement, popupAlign, builtinPlacements } = props;
      if (popupPlacement && builtinPlacements) {
        return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
      }
      return popupAlign;
    });
    return {
      vcTriggerContext: inject(
        'vcTriggerContext',
        {} as { onPopupMouseDown?: (...args: any[]) => void },
      ),
      popupRef: ref(null),
      triggerRef: ref(null),
      align,
      focusTime: null,
      clickOutsideHandler: null,
      contextmenuOutsideHandler1: null,
      contextmenuOutsideHandler2: null,
      touchOutsideHandler: null,
      attachId: null,
      delayTimer: null,
      hasPopupMouseDown: false,
      preClickTime: null,
      preTouchTime: null,
      mouseDownTimeout: null,
      childOriginEvents: {},
    };
  },
  data() {
    const props = this.$props;
    let popupVisible;
    if (this.popupVisible !== undefined) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    ALL_HANDLERS.forEach(h => {
      (this as any)[`fire${h}`] = e => {
        (this as any).fireEvents(h, e);
      };
    });

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
    provide('vcTriggerContext', {
      onPopupMouseDown: this.onPopupMouseDown,
    });
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
    raf.cancel(this.attachId);
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
          currentDocument = props.getDocument(this.getRootDomNode());
          this.clickOutsideHandler = addEventListener(
            currentDocument,
            'mousedown',
            this.onDocumentClick,
          );
        }
        // always hide on mobile
        if (!this.touchOutsideHandler) {
          currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
          this.touchOutsideHandler = addEventListener(
            currentDocument,
            'touchstart',
            this.onDocumentClick,
            supportsPassive ? { passive: false } : false,
          );
        }
        // close popup when trigger type contains 'onContextmenu' and document is scrolling.
        if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
          currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
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
        contains(this.popupRef?.getElement(), e.relatedTarget)
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
    onPopupMouseDown(...args: any[]) {
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
      const root = this.getRootDomNode();
      const popupNode = this.getPopupDomNode();
      if (
        // mousedown on the target should also close popup when action is contextMenu.
        // https://github.com/ant-design/ant-design/issues/29853
        (!contains(root, target) || this.isContextMenuOnly()) &&
        !contains(popupNode, target) &&
        !this.hasPopupMouseDown
      ) {
        this.close();
      }
    },
    getPopupDomNode() {
      // for test
      return this.popupRef?.getElement() || null;
    },

    getRootDomNode() {
      const { getTriggerDOMNode } = this.$props;
      if (getTriggerDOMNode) {
        return getTriggerDOMNode(this.triggerRef);
      }

      try {
        const domNode = findDOMNode(this.triggerRef);
        if (domNode) {
          return domNode;
        }
      } catch (err) {
        // Do nothing
      }
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
    getComponent() {
      const mouseProps: HTMLAttributes = {};
      if (this.isMouseEnterToShow()) {
        mouseProps.onMouseenter = this.onPopupMouseenter;
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.onMouseleave = this.onPopupMouseleave;
      }
      mouseProps.onMousedown = this.onPopupMouseDown;
      mouseProps[supportsPassive ? 'onTouchstartPassive' : 'onTouchstart'] = this.onPopupMouseDown;
      const { handleGetPopupClassFromAlign, getRootDomNode, getContainer, $attrs } = this;
      const {
        prefixCls,
        destroyPopupOnHide,
        popupClassName,
        popupAnimation,
        popupTransitionName,
        popupStyle,
        mask,
        maskAnimation,
        maskTransitionName,
        zIndex,
        stretch,
        alignPoint,
        mobile,
        forceRender,
      } = this.$props;
      const { sPopupVisible, point } = this.$data;
      const popupProps = {
        prefixCls,
        destroyPopupOnHide,
        visible: sPopupVisible,
        point: alignPoint ? point : null,
        align: this.align,
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
        class: popupClassName,
        style: popupStyle,
        onAlign: $attrs.onPopupAlign || noop,
        ...mouseProps,
        ref: 'popupRef',
        mobile,
        forceRender,
      } as any;
      return (
        <Popup
          {...popupProps}
          v-slots={{ default: this.$slots.popup || (() => getComponent(this, 'popup')) }}
        ></Popup>
      );
    },

    attachParent(popupContainer) {
      raf.cancel(this.attachId);

      const { getPopupContainer, getDocument } = this.$props;
      const domNode = this.getRootDomNode();

      let mountNode;
      if (!getPopupContainer) {
        mountNode = getDocument(this.getRootDomNode()).body;
      } else if (domNode || getPopupContainer.length === 0) {
        // Compatible for legacy getPopupContainer with domNode argument.
        // If no need `domNode` argument, will call directly.
        // https://codesandbox.io/s/eloquent-mclean-ss93m?file=/src/App.js
        mountNode = getPopupContainer(domNode);
      }

      if (mountNode) {
        mountNode.appendChild(popupContainer);
      } else {
        // Retry after frame render in case parent not ready
        this.attachId = raf(() => {
          this.attachParent(popupContainer);
        });
      }
    },

    getContainer() {
      const { $props: props } = this;
      const { getDocument } = props;
      const popupContainer = getDocument(this.getRootDomNode()).createElement('div');
      // Make sure default popup container will never cause scrollbar appearing
      // https://github.com/react-component/trigger/issues/41
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '100%';
      this.attachParent(popupContainer);
      return popupContainer;
    },

    setPopupVisible(sPopupVisible: boolean, event?: any) {
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
      if (alignPoint && event && sPopupVisible) {
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
    delaySetPopupVisible(visible: boolean, delayS: number, event?: any) {
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

    createTwoChains(event: string) {
      let fn = () => {};
      const events = getEvents(this);
      if (this.childOriginEvents[event] && events[event]) {
        return this[`fire${event}`];
      }
      fn = this.childOriginEvents[event] || events[event] || fn;
      return fn as any;
    },

    isClickToShow() {
      const { action, showAction } = this.$props;
      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    },

    isContextMenuOnly() {
      const { action } = this.$props;
      return action === 'contextmenu' || (action.length === 1 && action[0] === 'contextmenu');
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
      if (this.$data.sPopupVisible) {
        this.popupRef?.forceAlign();
      }
    },
    fireEvents(type: string, e: Event) {
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
    const { forceRender, alignPoint, autoDestroy } = this.$props;

    const child = children[0];
    this.childOriginEvents = getEvents(child);
    const newChildProps: any = {
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
        if (
          e &&
          (!e.relatedTarget || !contains(e.target as HTMLElement, e.relatedTarget as HTMLElement))
        ) {
          this.createTwoChains('onBlur')(e);
        }
      };
    }
    const childrenClassName = classNames(child && child.props && child.props.class, $attrs.class);
    if (childrenClassName) {
      newChildProps.class = childrenClassName;
    }
    const trigger = cloneElement(child, { ...newChildProps, ref: 'triggerRef' }, true, true);
    let portal;
    // prevent unmounting after it's rendered
    if (sPopupVisible || this.popupRef || forceRender) {
      portal = (
        <Portal
          key="portal"
          v-slots={{ default: this.getComponent }}
          getContainer={this.getContainer}
          didUpdate={this.handlePortalUpdate}
        ></Portal>
      );
    }
    if (!sPopupVisible && autoDestroy) {
      portal = null;
    }
    return (
      <>
        {portal}
        {trigger}
      </>
    );
  },
});
