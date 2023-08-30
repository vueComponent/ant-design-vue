import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, shallowRef, watch, watchEffect } from 'vue';
import contains from '../vc-util/Dom/contains';
import type ScrollLocker from '../vc-util/Dom/scrollLocker';
import classNames from '../_util/classNames';
import type { MouseEventHandler } from '../_util/EventInterface';
import KeyCode from '../_util/KeyCode';
import omit from '../_util/omit';
import pickAttrs from '../_util/pickAttrs';
import { initDefaultProps } from '../_util/props-util';
import type { ContentRef } from './Content';
import Content from './Content';
import dialogPropTypes from './IDialogPropTypes';
import Mask from './Mask';
import { getMotionName, getUUID } from './util';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'VcDialog',
  inheritAttrs: false,
  props: initDefaultProps(
    {
      ...dialogPropTypes(),
      getOpenCount: Function as PropType<() => number>,
      scrollLocker: Object as PropType<ScrollLocker>,
    },
    {
      mask: true,
      visible: false,
      keyboard: true,
      closable: true,
      maskClosable: true,
      destroyOnClose: false,
      prefixCls: 'rc-dialog',
      getOpenCount: () => null,
      focusTriggerAfterClose: true,
    },
  ),
  setup(props, { attrs, slots }) {
    const lastOutSideActiveElementRef = shallowRef<HTMLElement>();
    const wrapperRef = shallowRef<HTMLDivElement>();
    const contentRef = shallowRef<ContentRef>();
    const animatedVisible = shallowRef(props.visible);
    const ariaIdRef = shallowRef<string>(`vcDialogTitle${getUUID()}`);

    // ========================= Events =========================
    const onDialogVisibleChanged = (newVisible: boolean) => {
      if (newVisible) {
        // Try to focus
        if (!contains(wrapperRef.value, document.activeElement as HTMLElement)) {
          lastOutSideActiveElementRef.value = document.activeElement as HTMLElement;
          contentRef.value?.focus();
        }
      } else {
        const preAnimatedVisible = animatedVisible.value;
        // Clean up scroll bar & focus back
        animatedVisible.value = false;
        if (props.mask && lastOutSideActiveElementRef.value && props.focusTriggerAfterClose) {
          try {
            lastOutSideActiveElementRef.value.focus({ preventScroll: true });
          } catch (e) {
            // Do nothing
          }
          lastOutSideActiveElementRef.value = null;
        }

        // Trigger afterClose only when change visible from true to false
        if (preAnimatedVisible) {
          props.afterClose?.();
        }
      }
    };

    const onInternalClose = (e: MouseEvent | KeyboardEvent) => {
      props.onClose?.(e);
    };

    // >>> Content
    const contentClickRef = shallowRef(false);
    const contentTimeoutRef = shallowRef<any>();

    // We need record content click incase content popup out of dialog
    const onContentMouseDown: MouseEventHandler = () => {
      clearTimeout(contentTimeoutRef.value);
      contentClickRef.value = true;
    };

    const onContentMouseUp: MouseEventHandler = () => {
      contentTimeoutRef.value = setTimeout(() => {
        contentClickRef.value = false;
      });
    };

    const onWrapperClick = (e: MouseEvent) => {
      if (!props.maskClosable) return null;
      if (contentClickRef.value) {
        contentClickRef.value = false;
      } else if (wrapperRef.value === e.target) {
        onInternalClose(e);
      }
    };
    const onWrapperKeyDown = (e: KeyboardEvent) => {
      if (props.keyboard && e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        onInternalClose(e);
        return;
      }

      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === KeyCode.TAB) {
          contentRef.value.changeActive(!e.shiftKey);
        }
      }
    };

    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          animatedVisible.value = true;
        }
      },
      { flush: 'post' },
    );

    onBeforeUnmount(() => {
      clearTimeout(contentTimeoutRef.value);
      props.scrollLocker?.unLock();
    });
    watchEffect(() => {
      props.scrollLocker?.unLock();
      if (animatedVisible.value) {
        props.scrollLocker?.lock();
      }
    });

    return () => {
      const {
        prefixCls,
        mask,
        visible,
        maskTransitionName,
        maskAnimation,
        zIndex,
        wrapClassName,
        rootClassName,
        wrapStyle,
        closable,
        maskProps,
        maskStyle,
        transitionName,
        animation,
        wrapProps,
        title = slots.title,
      } = props;
      const { style, class: className } = attrs;
      return (
        <div class={[`${prefixCls}-root`, rootClassName]} {...pickAttrs(props, { data: true })}>
          <Mask
            prefixCls={prefixCls}
            visible={mask && visible}
            motionName={getMotionName(prefixCls, maskTransitionName, maskAnimation)}
            style={{
              zIndex,
              ...maskStyle,
            }}
            maskProps={maskProps}
          />
          <div
            tabIndex={-1}
            onKeydown={onWrapperKeyDown}
            class={classNames(`${prefixCls}-wrap`, wrapClassName)}
            ref={wrapperRef}
            onClick={onWrapperClick}
            role="dialog"
            aria-labelledby={title ? ariaIdRef.value : null}
            style={{ zIndex, ...wrapStyle, display: !animatedVisible.value ? 'none' : null }}
            {...wrapProps}
          >
            <Content
              {...omit(props, ['scrollLocker'])}
              style={style}
              class={className}
              v-slots={slots}
              onMousedown={onContentMouseDown}
              onMouseup={onContentMouseUp}
              ref={contentRef}
              closable={closable}
              ariaId={ariaIdRef.value}
              prefixCls={prefixCls}
              visible={visible}
              onClose={onInternalClose}
              onVisibleChanged={onDialogVisibleChanged}
              motionName={getMotionName(prefixCls, transitionName, animation)}
            />
          </div>
        </div>
      );
    };
  },
});
