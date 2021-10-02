import {
  defineComponent,
  reactive,
  onMounted,
  computed,
  onUnmounted,
  nextTick,
  watch,
  ref,
} from 'vue';
import classnames from '../../_util/classNames';
import getScrollBarSize from '../../_util/getScrollBarSize';
import KeyCode from '../../_util/KeyCode';
import omit from '../../_util/omit';
import supportsPassive from '../../_util/supportsPassive';
import { drawerChildProps } from './IDrawerPropTypes';

import {
  addEventListener,
  dataToArray,
  getTouchParentScroll,
  isNumeric,
  removeEventListener,
  transformArguments,
  transitionEndFun,
  windowIsUndefined,
} from './utils';

const currentDrawer: Record<string, boolean> = {};

export interface scrollLockOptions {
  container: HTMLElement;
}

const DrawerChild = defineComponent({
  inheritAttrs: false,
  props: drawerChildProps(),
  emits: ['close', 'handleClick', 'change'],
  setup(props, { emit, slots }) {
    const state = reactive({
      startPos: {
        x: null,
        y: null,
      },
    });
    let timeout;
    const contentWrapper = ref<HTMLElement>();
    const dom = ref<HTMLElement>();
    const maskDom = ref<HTMLElement>();
    const handlerDom = ref<HTMLElement>();
    const contentDom = ref<HTMLElement>();
    let levelDom = [];
    const drawerId = `drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`;

    const passive = !windowIsUndefined && supportsPassive ? { passive: false } : false;

    onMounted(() => {
      nextTick(() => {
        const { open, getContainer, showMask, autofocus } = props;
        const container = getContainer?.();
        getLevelDom(props);
        if (open) {
          if (container && container.parentNode === document.body) {
            currentDrawer[drawerId] = open;
          }
          // 默认打开状态时推出 level;
          openLevelTransition();
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
        openLevelTransition();
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
        setLevelTransform(false);
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

    const removeStartHandler = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        return;
      }
      state.startPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const removeMoveHandler = (e: TouchEvent) => {
      if (e.changedTouches.length > 1) {
        return;
      }
      const currentTarget = e.currentTarget as HTMLElement;
      const differX = e.changedTouches[0].clientX - state.startPos.x;
      const differY = e.changedTouches[0].clientY - state.startPos.y;
      if (
        (currentTarget === maskDom.value ||
          currentTarget === handlerDom.value ||
          (currentTarget === contentDom.value &&
            getTouchParentScroll(currentTarget, e.target as HTMLElement, differX, differY))) &&
        e.cancelable
      ) {
        e.preventDefault();
      }
    };

    const transitionEnd = (e: TransitionEvent) => {
      const dom: HTMLElement = e.target as HTMLElement;
      removeEventListener(dom, transitionEndFun, transitionEnd);
      dom.style.transition = '';
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

    const onWrapperTransitionEnd = (e: TransitionEvent) => {
      const { open, afterVisibleChange } = props;
      if (e.target === contentWrapper.value && e.propertyName.match(/transform$/)) {
        dom.value.style.transition = '';
        if (!open && getCurrentDrawerSome()) {
          document.body.style.overflowX = '';
          if (maskDom.value) {
            maskDom.value.style.left = '';
            maskDom.value.style.width = '';
          }
        }
        if (afterVisibleChange) {
          afterVisibleChange(!!open);
        }
      }
    };

    const horizontalBoolAndPlacementName = computed(() => {
      const { placement } = props;
      const isHorizontal = placement === 'left' || placement === 'right';
      const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
      return {
        isHorizontal,
        placementName,
      };
    });

    const openLevelTransition = () => {
      const { open, width, height } = props;
      const { isHorizontal, placementName } = horizontalBoolAndPlacementName.value;
      const contentValue = contentDom.value
        ? contentDom.value.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
        : 0;
      const value = (isHorizontal ? width : height) || contentValue;
      setLevelAndScrolling(open, placementName, value);
    };

    const setLevelTransform = (
      open?: boolean,
      placementName?: string,
      value?: string | number,
      right?: number,
    ) => {
      const { placement, levelMove, duration, ease, showMask } = props;
      // router 切换时可能会导至页面失去滚动条，所以需要时时获取。
      levelDom.forEach(dom => {
        dom.style.transition = `transform ${duration} ${ease}`;
        addEventListener(dom, transitionEndFun, transitionEnd);
        let levelValue = open ? value : 0;
        if (levelMove) {
          const $levelMove = transformArguments(levelMove, { target: dom, open });
          levelValue = open ? $levelMove[0] : $levelMove[1] || 0;
        }
        const $value = typeof levelValue === 'number' ? `${levelValue}px` : levelValue;
        let placementPos = placement === 'left' || placement === 'top' ? $value : `-${$value}`;
        placementPos =
          showMask && placement === 'right' && right
            ? `calc(${placementPos} + ${right}px)`
            : placementPos;
        dom.style.transform = levelValue ? `${placementName}(${placementPos})` : '';
      });
    };

    const setLevelAndScrolling = (
      open?: boolean,
      placementName?: string,
      value?: string | number,
    ) => {
      if (!windowIsUndefined) {
        const right =
          document.body.scrollHeight >
            (window.innerHeight || document.documentElement.clientHeight) &&
          window.innerWidth > document.body.offsetWidth
            ? getScrollBarSize(true)
            : 0;
        setLevelTransform(open, placementName, value, right);
        toggleScrollingToDrawerAndBody(right);
      }
      emit('change', open);
    };

    const toggleScrollingToDrawerAndBody = (right: number) => {
      const { getContainer, showMask, open } = props;
      const container = getContainer?.();
      // 处理 body 滚动
      if (container && container.parentNode === document.body && showMask) {
        const eventArray = ['touchstart'];
        const domArray = [document.body, maskDom.value, handlerDom.value, contentDom.value];
        if (open && document.body.style.overflow !== 'hidden') {
          if (right) {
            addScrollingEffect(right);
          }
          document.body.style.touchAction = 'none';
          // 手机禁滚
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            addEventListener(
              item,
              eventArray[i] || 'touchmove',
              i ? removeMoveHandler : removeStartHandler,
              passive,
            );
          });
        } else if (getCurrentDrawerSome()) {
          document.body.style.touchAction = '';
          if (right) {
            remScrollingEffect(right);
          }
          // 恢复事件
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            removeEventListener(
              item,
              eventArray[i] || 'touchmove',
              i ? removeMoveHandler : removeStartHandler,
              passive,
            );
          });
        }
      }
    };

    const addScrollingEffect = (right: number) => {
      const { placement, duration, ease } = props;
      const widthTransition = `width ${duration} ${ease}`;
      const transformTransition = `transform ${duration} ${ease}`;
      dom.value.style.transition = 'none';
      switch (placement) {
        case 'right':
          dom.value.style.transform = `translateX(-${right}px)`;
          break;
        case 'top':
        case 'bottom':
          dom.value.style.width = `calc(100% - ${right}px)`;
          dom.value.style.transform = 'translateZ(0)';
          break;
        default:
          break;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (dom.value) {
          dom.value.style.transition = `${transformTransition},${widthTransition}`;
          dom.value.style.width = '';
          dom.value.style.transform = '';
        }
      });
    };

    const remScrollingEffect = (right: number) => {
      const { placement, duration, ease } = props;

      dom.value.style.transition = 'none';
      let heightTransition: string;
      let widthTransition = `width ${duration} ${ease}`;
      const transformTransition = `transform ${duration} ${ease}`;
      switch (placement) {
        case 'left': {
          dom.value.style.width = '100%';
          widthTransition = `width 0s ${ease} ${duration}`;
          break;
        }
        case 'right': {
          dom.value.style.transform = `translateX(${right}px)`;
          dom.value.style.width = '100%';
          widthTransition = `width 0s ${ease} ${duration}`;
          if (maskDom.value) {
            maskDom.value.style.left = `-${right}px`;
            maskDom.value.style.width = `calc(100% + ${right}px)`;
          }
          break;
        }
        case 'top':
        case 'bottom': {
          dom.value.style.width = `calc(100% + ${right}px)`;
          dom.value.style.height = '100%';
          dom.value.style.transform = 'translateZ(0)';
          heightTransition = `height 0s ${ease} ${duration}`;
          break;
        }
        default:
          break;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (dom.value) {
          dom.value.style.transition = `${transformTransition},${
            heightTransition ? `${heightTransition},` : ''
          }${widthTransition}`;
          dom.value.style.transform = '';
          dom.value.style.width = '';
          dom.value.style.height = '';
        }
      });
    };

    const getCurrentDrawerSome = () => !Object.keys(currentDrawer).some(key => currentDrawer[key]);

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

    const canOpen = ref(false);
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
        ...otherProps
      } = props;
      // 首次渲染都将是关闭状态。
      const open = $open && canOpen.value;
      const wrapperClassName = classnames(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        [className]: !!className,
        'no-mask': !showMask,
      });

      const { placementName } = horizontalBoolAndPlacementName.value;
      // 百分比与像素动画不同步，第一次打用后全用像素动画。
      // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
      const placementPos = placement === 'left' || placement === 'top' ? '-100%' : '100%';
      const transform = open ? '' : `${placementName}(${placementPos})`;

      return (
        <div
          {...omit(otherProps, ['switchScrollingEffect', 'autofocus'])}
          tabindex={-1}
          class={wrapperClassName}
          style={style}
          ref={dom}
          onKeydown={open && keyboard ? onKeyDown : undefined}
          onTransitionend={onWrapperTransitionEnd}
        >
          {showMask && (
            <div
              class={`${prefixCls}-mask`}
              onClick={maskClosable ? onClose : undefined}
              style={maskStyle}
              ref={maskDom}
            />
          )}
          <div
            class={`${prefixCls}-content-wrapper`}
            style={{
              transform,
              msTransform: transform,
              width: isNumeric(width) ? `${width}px` : width,
              height: isNumeric(height) ? `${height}px` : height,
              ...contentWrapperStyle,
            }}
            ref={contentWrapper}
          >
            <div class={`${prefixCls}-content`} ref={contentDom}>
              {slots.default?.()}
            </div>
            {slots.handler ? (
              <div onClick={onHandleClick} ref={handlerDom}>
                {slots.handler?.()}
              </div>
            ) : null}
          </div>
        </div>
      );
    };
  },
});

export default DrawerChild;
