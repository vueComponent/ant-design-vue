import { defineComponent, provide } from 'vue';
import { initDefaultProps, getSlot, findDOMNode } from '../_util/props-util';
import KeyCode from '../_util/KeyCode';
import contains from '../vc-util/Dom/contains';
import LazyRenderBox from './LazyRenderBox';
import BaseMixin from '../_util/BaseMixin';
import { getTransitionProps, Transition } from '../_util/transition';
import switchScrollingEffect from '../_util/switchScrollingEffect';
import getDialogPropTypes from './IDialogPropTypes';
import warning from '../_util/warning';
const IDialogPropTypes = getDialogPropTypes();

let uuid = 0;

function noop() {}
function getScroll(w, top) {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`];
  const method = `scroll${top ? 'Top' : 'Left'}`;
  if (typeof ret !== 'number') {
    const d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
}

function setTransformOrigin(node, value) {
  const style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach(prefix => {
    style[`${prefix}TransformOrigin`] = value;
  });
  style[`transformOrigin`] = value;
}

function offset(el) {
  const rect = el.getBoundingClientRect();
  const pos = {
    left: rect.left,
    top: rect.top,
  };
  const doc = el.ownerDocument;
  const w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}

let cacheOverflow = {};

export default defineComponent({
  name: 'VcDialog',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(IDialogPropTypes, {
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog',
    getOpenCount: () => null,
    focusTriggerAfterClose: true,
  }),
  data() {
    warning(!this.dialogClass, 'Modal', 'dialogClass is deprecated, please use class instead.');
    warning(!this.dialogStyle, 'Modal', 'dialogStyle is deprecated, please use style instead.');
    return {
      inTransition: false,
      titleId: `rcDialogTitle${uuid++}`,
      dialogMouseDown: undefined,
    };
  },

  watch: {
    visible(val) {
      this.$nextTick(() => {
        this.updatedCallback(!val);
      });
    },
  },
  created() {
    provide('dialogContext', this);
  },
  mounted() {
    this.$nextTick(() => {
      this.updatedCallback(false);
      // if forceRender is true, set element style display to be none;
      if ((this.forceRender || (this.getContainer === false && !this.visible)) && this.$refs.wrap) {
        this.$refs.wrap.style.display = 'none';
      }
    });
  },
  beforeUnmount() {
    const { visible, getOpenCount } = this;
    if ((visible || this.inTransition) && !getOpenCount()) {
      this.switchScrollingEffect();
    }
    clearTimeout(this.timeoutId);
  },
  methods: {
    // 对外暴露的 api 不要更改名称或删除
    getDialogWrap() {
      return this.$refs.wrap;
    },
    updatedCallback(visible) {
      const mousePosition = this.mousePosition;
      const { mask, focusTriggerAfterClose } = this;
      if (this.visible) {
        // first show
        if (!visible) {
          this.openTime = Date.now();
          // this.lastOutSideFocusNode = document.activeElement
          this.switchScrollingEffect();
          // this.$refs.wrap.focus()
          this.tryFocus();
          const dialogNode = findDOMNode(this.$refs.dialog);
          if (mousePosition) {
            const elOffset = offset(dialogNode);
            setTransformOrigin(
              dialogNode,
              `${mousePosition.x - elOffset.left}px ${mousePosition.y - elOffset.top}px`,
            );
          } else {
            setTransformOrigin(dialogNode, '');
          }
        }
      } else if (visible) {
        this.inTransition = true;
        if (mask && this.lastOutSideFocusNode && focusTriggerAfterClose) {
          try {
            this.lastOutSideFocusNode.focus();
          } catch (e) {
            this.lastOutSideFocusNode = null;
          }
          this.lastOutSideFocusNode = null;
        }
      }
    },
    tryFocus() {
      if (!contains(this.$refs.wrap, document.activeElement)) {
        this.lastOutSideFocusNode = document.activeElement;
        this.$refs.sentinelStart.focus();
      }
    },
    onAnimateLeave() {
      const { afterClose } = this;
      // need demo?
      // https://github.com/react-component/dialog/pull/28
      if (this.$refs.wrap) {
        this.$refs.wrap.style.display = 'none';
      }
      this.inTransition = false;
      this.switchScrollingEffect();
      if (afterClose) {
        afterClose();
      }
    },
    onDialogMouseDown() {
      this.dialogMouseDown = true;
    },

    onMaskMouseUp() {
      if (this.dialogMouseDown) {
        this.timeoutId = setTimeout(() => {
          this.dialogMouseDown = false;
        }, 0);
      }
    },
    onMaskClick(e) {
      // android trigger click on open (fastclick??)
      if (Date.now() - this.openTime < 300) {
        return;
      }
      if (e.target === e.currentTarget && !this.dialogMouseDown) {
        this.close(e);
      }
    },
    onKeydown(e) {
      const props = this.$props;
      if (props.keyboard && e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        this.close(e);
        return;
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === KeyCode.TAB) {
          const activeElement = document.activeElement;
          const sentinelStart = this.$refs.sentinelStart;
          if (e.shiftKey) {
            if (activeElement === sentinelStart) {
              this.$refs.sentinelEnd.focus();
            }
          } else if (activeElement === this.$refs.sentinelEnd) {
            sentinelStart.focus();
          }
        }
      }
    },
    getDialogElement() {
      const {
        closable,
        prefixCls,
        width,
        height,
        title,
        footer: tempFooter,
        bodyStyle,
        visible,
        bodyProps,
        forceRender,
        closeIcon,
        dialogStyle = {},
        dialogClass = '',
      } = this;
      const dest = { ...dialogStyle };
      if (width !== undefined) {
        dest.width = typeof width === 'number' ? `${width}px` : width;
      }
      if (height !== undefined) {
        dest.height = typeof height === 'number' ? `${height}px` : height;
      }

      let footer;
      if (tempFooter) {
        footer = (
          <div key="footer" class={`${prefixCls}-footer`} ref="footer">
            {tempFooter}
          </div>
        );
      }

      let header;
      if (title) {
        header = (
          <div key="header" class={`${prefixCls}-header`} ref="header">
            <div class={`${prefixCls}-title`} id={this.titleId}>
              {title}
            </div>
          </div>
        );
      }

      let closer;
      if (closable) {
        closer = (
          <button
            type="button"
            key="close"
            onClick={this.close || noop}
            aria-label="Close"
            class={`${prefixCls}-close`}
          >
            {closeIcon || <span class={`${prefixCls}-close-x`} />}
          </button>
        );
      }
      const { style: stl, class: className } = this.$attrs;
      const style = { ...stl, ...dest };
      const sentinelStyle = { width: 0, height: 0, overflow: 'hidden' };
      const cls = [prefixCls, className, dialogClass];
      const transitionName = this.getTransitionName();
      const dialogElement = (
        <LazyRenderBox
          v-show={visible}
          key="dialog-element"
          role="document"
          ref="dialog"
          style={style}
          class={cls}
          forceRender={forceRender}
          onMousedown={this.onDialogMouseDown}
        >
          <div tabindex={0} ref="sentinelStart" style={sentinelStyle} aria-hidden="true" />
          <div class={`${prefixCls}-content`}>
            {closer}
            {header}
            <div key="body" class={`${prefixCls}-body`} style={bodyStyle} ref="body" {...bodyProps}>
              {getSlot(this)}
            </div>
            {footer}
          </div>
          <div tabindex={0} ref="sentinelEnd" style={sentinelStyle} aria-hidden="true" />
        </LazyRenderBox>
      );
      const dialogTransitionProps = getTransitionProps(transitionName, {
        onAfterLeave: this.onAnimateLeave,
      });
      return (
        <Transition key="dialog" {...dialogTransitionProps}>
          {visible || !this.destroyOnClose ? dialogElement : null}
        </Transition>
      );
    },
    getZIndexStyle() {
      const style = {};
      const props = this.$props;
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex;
      }
      return style;
    },
    getWrapStyle() {
      return { ...this.getZIndexStyle(), ...this.wrapStyle };
    },
    getMaskStyle() {
      return { ...this.getZIndexStyle(), ...this.maskStyle };
    },
    getMaskElement() {
      const props = this.$props;
      let maskElement;
      if (props.mask) {
        const maskTransition = this.getMaskTransitionName();
        const tempMaskElement = (
          <LazyRenderBox
            v-show={props.visible}
            style={this.getMaskStyle()}
            key="mask"
            class={`${props.prefixCls}-mask`}
            {...(props.maskProps || {})}
          />
        );
        if (maskTransition) {
          const maskTransitionProps = getTransitionProps(maskTransition);
          maskElement = (
            <Transition key="mask" {...maskTransitionProps}>
              {tempMaskElement}
            </Transition>
          );
        } else {
          maskElement = tempMaskElement;
        }
      }
      return maskElement;
    },
    getMaskTransitionName() {
      const props = this.$props;
      let transitionName = props.maskTransitionName;
      const animation = props.maskAnimation;
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`;
      }
      return transitionName;
    },
    getTransitionName() {
      const props = this.$props;
      let transitionName = props.transitionName;
      const animation = props.animation;
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`;
      }
      return transitionName;
    },
    // setScrollbar() {
    //   if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
    //     document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    //   }
    // },
    switchScrollingEffect() {
      const { getOpenCount } = this;
      const openCount = getOpenCount();
      if (openCount === 1) {
        if (cacheOverflow.hasOwnProperty('overflowX')) {
          return;
        }
        cacheOverflow = {
          overflowX: document.body.style.overflowX,
          overflowY: document.body.style.overflowY,
          overflow: document.body.style.overflow,
        };
        switchScrollingEffect();
        // Must be set after switchScrollingEffect
        document.body.style.overflow = 'hidden';
      } else if (!openCount) {
        // IE browser doesn't merge overflow style, need to set it separately
        // https://github.com/ant-design/ant-design/issues/19393
        if (cacheOverflow.overflow !== undefined) {
          document.body.style.overflow = cacheOverflow.overflow;
        }
        if (cacheOverflow.overflowX !== undefined) {
          document.body.style.overflowX = cacheOverflow.overflowX;
        }
        if (cacheOverflow.overflowY !== undefined) {
          document.body.style.overflowY = cacheOverflow.overflowY;
        }
        cacheOverflow = {};
        switchScrollingEffect(true);
      }
    },
    // removeScrollingEffect() {
    //   const { getOpenCount } = this;
    //   const openCount = getOpenCount();
    //   if (openCount !== 0) {
    //     return;
    //   }
    //   document.body.style.overflow = '';
    //   switchScrollingEffect(true);
    //   // this.resetAdjustments();
    // },
    close(e) {
      this.__emit('close', e);
    },
  },
  render() {
    const { prefixCls, maskClosable, visible, wrapClassName, title, wrapProps } = this;
    const style = this.getWrapStyle();
    // clear hide display
    // and only set display after async anim, not here for hide
    if (visible) {
      style.display = null;
    }
    return (
      <div class={`${prefixCls}-root`}>
        {this.getMaskElement()}
        <div
          tabindex={-1}
          onKeydown={this.onKeydown}
          class={`${prefixCls}-wrap ${wrapClassName || ''}`}
          ref="wrap"
          onClick={maskClosable ? this.onMaskClick : noop}
          onMouseup={maskClosable ? this.onMaskMouseUp : noop}
          role="dialog"
          aria-labelledby={title ? this.titleId : null}
          style={style}
          {...wrapProps}
        >
          {this.getDialogElement()}
        </div>
      </div>
    );
  },
});
