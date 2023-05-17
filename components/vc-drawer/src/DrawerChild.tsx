import {
  Transition,
  defineComponent,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  shallowRef,
} from 'vue';
import classnames from '../../_util/classNames';
import KeyCode from '../../_util/KeyCode';
import omit from '../../_util/omit';
import { drawerChildProps } from './IDrawerPropTypes';
import { dataToArray, windowIsUndefined } from './utils';

const currentDrawer: Record<string, boolean> = {};

export interface scrollLockOptions {
  container: HTMLElement;
}

const DrawerChild = defineComponent({
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: drawerChildProps(),
  emits: ['close', 'handleClick', 'change'],
  setup(props, { emit, slots }) {
    const contentWrapper = shallowRef<HTMLElement>();
    const dom = shallowRef<HTMLElement>();
    const maskDom = shallowRef<HTMLElement>();
    const handlerDom = shallowRef<HTMLElement>();
    const contentDom = shallowRef<HTMLElement>();
    let levelDom = [];
    const drawerId = `drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`;

    onMounted(() => {
      nextTick(() => {
        const { open, getContainer, showMask, autofocus } = props;
        const container = getContainer?.();
        getLevelDom(props);
        if (open) {
          if (container && container.parentNode === document.body) {
            currentDrawer[drawerId] = open;
          }
          nextTick(() => {
            if (autofocus) {
              domFocus();
            }
          });
          if (showMask) {
            props.scrollLocker?.lock();
          }
        }
      });
    });
    watch(
      () => props.level,
      () => {
        getLevelDom(props);
      },
      { flush: 'post' },
    );
    watch(
      () => props.open,
      () => {
        const { open, getContainer, scrollLocker, showMask, autofocus } = props;
        const container = getContainer?.();
        if (container && container.parentNode === document.body) {
          currentDrawer[drawerId] = !!open;
        }
        if (open) {
          if (autofocus) {
            domFocus();
          }
          if (showMask) {
            scrollLocker?.lock();
          }
        } else {
          scrollLocker?.unLock();
        }
      },
      { flush: 'post' },
    );

    onUnmounted(() => {
      const { open } = props;
      delete currentDrawer[drawerId];
      if (open) {
        document.body.style.touchAction = '';
      }
      props.scrollLocker?.unLock();
    });

    watch(
      () => props.placement,
      val => {
        if (val) {
          // test 的 bug, 有动画过场，删除 dom
          contentDom.value = null;
        }
      },
    );

    const domFocus = () => {
      dom.value?.focus?.();
    };

    const onClose = (e: Event) => {
      emit('close', e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        onClose(e);
      }
    };

    const onAfterVisibleChange = () => {
      const { open, afterVisibleChange } = props;
      if (afterVisibleChange) {
        afterVisibleChange(!!open);
      }
    };

    const getLevelDom = ({ level, getContainer }) => {
      if (windowIsUndefined) {
        return;
      }
      const container = getContainer?.();
      const parent = container ? (container.parentNode as HTMLElement) : null;
      levelDom = [];
      if (level === 'all') {
        const children: HTMLElement[] = parent ? Array.prototype.slice.call(parent.children) : [];
        children.forEach((child: HTMLElement) => {
          if (
            child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
          ) {
            levelDom.push(child);
          }
        });
      } else if (level) {
        dataToArray(level).forEach(key => {
          document.querySelectorAll(key).forEach(item => {
            levelDom.push(item);
          });
        });
      }
    };

    const onHandleClick = e => {
      emit('handleClick', e);
    };

    const canOpen = shallowRef(false);
    watch(dom, () => {
      nextTick(() => {
        canOpen.value = true;
      });
    });

    return () => {
      const {
        width,
        height,
        open: $open,
        prefixCls,
        placement,
        level,
        levelMove,
        ease,
        duration,
        getContainer,
        onChange,
        afterVisibleChange,
        showMask,
        maskClosable,
        maskStyle,
        keyboard,
        getOpenCount,
        scrollLocker,
        contentWrapperStyle,
        style,
        class: className,
        rootClassName,
        rootStyle,
        maskMotion,
        motion,
        inline,
        ...otherProps
      } = props;
      // 首次渲染都将是关闭状态。
      const open = $open && canOpen.value;
      const wrapperClassName = classnames(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        [`${prefixCls}-inline`]: inline,
        'no-mask': !showMask,
        [rootClassName]: true,
      });

      const motionProps = typeof motion === 'function' ? motion(placement) : motion;
      return (
        <div
          {...omit(otherProps, ['autofocus'])}
          tabindex={-1}
          class={wrapperClassName}
          style={rootStyle}
          ref={dom}
          onKeydown={open && keyboard ? onKeyDown : undefined}
        >
          <Transition {...maskMotion}>
            {showMask && (
              <div
                v-show={open}
                class={`${prefixCls}-mask`}
                onClick={maskClosable ? onClose : undefined}
                style={maskStyle}
                ref={maskDom}
              />
            )}
          </Transition>
          <Transition
            {...motionProps}
            onAfterEnter={onAfterVisibleChange}
            onAfterLeave={onAfterVisibleChange}
          >
            <div
              v-show={open}
              class={`${prefixCls}-content-wrapper`}
              style={[contentWrapperStyle]}
              ref={contentWrapper}
            >
              <div class={[`${prefixCls}-content`, className]} style={style} ref={contentDom}>
                {slots.default?.()}
              </div>
              {slots.handler ? (
                <div onClick={onHandleClick} ref={handlerDom}>
                  {slots.handler?.()}
                </div>
              ) : null}
            </div>
          </Transition>
        </div>
      );
    };
  },
});

export default DrawerChild;
