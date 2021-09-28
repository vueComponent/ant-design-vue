import { defineComponent, reactive, onMounted, onUpdated, onUnmounted, nextTick, watch } from 'vue';
import classnames from '../../_util/classNames';
import getScrollBarSize from '../../_util/getScrollBarSize';
import KeyCode from '../../_util/KeyCode';
import omit from '../../_util/omit';
import supportsPassive from '../../_util/supportsPassive';
import { DrawerChildProps } from './IDrawerPropTypes';
import type { IDrawerChildProps } from './IDrawerPropTypes';
import setStyle from '../../_util/setStyle';

import {
  addEventListener,
  dataToArray,
  getTouchParentScroll,
  isNumeric,
  removeEventListener,
  transformArguments,
  transitionEndFun,
  transitionStr,
  windowIsUndefined,
} from './utils';

const currentDrawer: Record<string, boolean> = {};

export interface scrollLockOptions {
  container: HTMLElement;
}

const createScrollLocker = (options: scrollLockOptions) => {
  let scrollBarSize = 0;
  let cacheStyleMap = new Map();
  return {
    getContainer: () => {
      return options?.container;
    },
    getCacheStyleMap: () => {
      return cacheStyleMap;
    },
    lock: () => {
      cacheStyleMap.set(
        options.container,
        setStyle(
          {
            width: scrollBarSize !== 0 ? `calc(100% - ${scrollBarSize}px)` : undefined,
            overflow: 'hidden',
            overflowX: 'hidden',
            overflowY: 'hidden',
          },
          {
            element: options.container || document.body,
          },
        ),
      );
    },
    unLock: () => {
      setStyle(cacheStyleMap.get(options.container) || {}, { element: options.container });
      cacheStyleMap.delete(options.container);
    },
  };
};

const DrawerChild = defineComponent({
  inheritAttrs: false,
  props: DrawerChildProps,
  emits: ['close', 'handleClick', 'change'],
  setup(props, { emit, slots }) {
    const state = reactive({
      levelDom: [],
      dom: null,
      contentWrapper: null,
      contentDom: null,
      maskDom: null,
      handlerDom: null,
      drawerId: null,
      timeout: null,
      passive: null,
      startPos: {
        x: null,
        y: null,
      },
      scrollLocker: null,
    });

    onMounted(() => {
      nextTick(() => {
        if (!windowIsUndefined) {
          state.passive = supportsPassive ? { passive: false } : false;
        }
        const { open, getContainer, showMask, autoFocus } = props;
        const container = getContainer?.();
        state.drawerId = `drawer_id_${Number(
          (Date.now() + Math.random())
            .toString()
            .replace('.', Math.round(Math.random() * 9).toString()),
        ).toString(16)}`;
        getLevelDom(props);

        if (container) {
          state.scrollLocker = createScrollLocker({
            container: container.parentNode,
          });
        }

        if (open) {
          if (container && container.parentNode === document.body) {
            currentDrawer[state.drawerId] = open;
          }
          // 默认打开状态时推出 level;
          openLevelTransition();
          nextTick(() => {
            if (autoFocus) {
              domFocus();
            }
          });
          if (showMask) {
            state.scrollLocker?.lock();
          }
        }
      });
    });

    onUpdated(() => {
      const { open, getContainer, showMask, autoFocus } = props;

      const container = getContainer?.();
      if (container && container.parentNode === document.body) {
        currentDrawer[state.drawerId] = !!open;
      }
      openLevelTransition();
      if (open) {
        if (autoFocus) {
          domFocus();
        }
        if (showMask) {
          state.scrollLocker?.lock();
        }
      } else {
        state.scrollLocker?.unLock();
      }
    });

    onUnmounted(() => {
      const { open } = props;
      delete currentDrawer[state.drawerId];
      if (open) {
        setLevelTransform(false);
        document.body.style.touchAction = '';
      }
      state.scrollLocker?.unLock();
    });

    watch(
      () => props.placement,
      val => {
        if (val) {
          // test 的 bug, 有动画过场，删除 dom
          state.contentDom = null;
          if (state.contentWrapper) {
            state.contentWrapper.style.transition = `none`;
            setTimeout(() => {
              state.contentWrapper.style.transition = ``;
            });
          }
        }
      },
    );

    const domFocus = () => {
      state.dom?.focus?.();
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
        (currentTarget === state.maskDom ||
          currentTarget === state.handlerDom ||
          (currentTarget === state.contentDom &&
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        onClose(e);
      }
    };

    const onClose = (e: Event) => {
      emit('close', e);
    };

    const onWrapperTransitionEnd = (e: TransitionEvent) => {
      const { open, afterVisibleChange } = props;
      if (e.target === state.contentWrapper && e.propertyName.match(/transform$/)) {
        state.dom.style.transition = '';
        if (!open && getCurrentDrawerSome()) {
          document.body.style.overflowX = '';
          if (state.maskDom) {
            state.maskDom.style.left = '';
            state.maskDom.style.width = '';
          }
        }
        if (afterVisibleChange) {
          afterVisibleChange(!!open);
        }
      }
    };

    const openLevelTransition = () => {
      const { open, width, height } = props;
      const { isHorizontal, placementName } = getHorizontalBoolAndPlacementName();
      const contentValue = state.contentDom
        ? state.contentDom.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
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
      state.levelDom.forEach(dom => {
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
        const domArray = [document.body, state.maskDom, state.handlerDom, state.contentDom];
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
              state.passive,
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
              state.passive,
            );
          });
        }
      }
    };

    const addScrollingEffect = (right: number) => {
      const { placement, duration, ease } = props;
      const widthTransition = `width ${duration} ${ease}`;
      const transformTransition = `transform ${duration} ${ease}`;
      state.dom.style.transition = 'none';
      switch (placement) {
        case 'right':
          state.dom.style.transform = `translateX(-${right}px)`;
          break;
        case 'top':
        case 'bottom':
          state.dom.style.width = `calc(100% - ${right}px)`;
          state.dom.style.transform = 'translateZ(0)';
          break;
        default:
          break;
      }
      clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        if (state.dom) {
          state.dom.style.transition = `${transformTransition},${widthTransition}`;
          state.dom.style.width = '';
          state.dom.style.transform = '';
        }
      });
    };

    const remScrollingEffect = (right: number) => {
      const { placement, duration, ease } = props;

      if (transitionStr) {
        document.body.style.overflowX = 'hidden';
      }
      state.dom.style.transition = 'none';
      let heightTransition: string;
      let widthTransition = `width ${duration} ${ease}`;
      const transformTransition = `transform ${duration} ${ease}`;
      switch (placement) {
        case 'left': {
          state.dom.style.width = '100%';
          widthTransition = `width 0s ${ease} ${duration}`;
          break;
        }
        case 'right': {
          state.dom.style.transform = `translateX(${right}px)`;
          state.dom.style.width = '100%';
          widthTransition = `width 0s ${ease} ${duration}`;
          if (state.maskDom) {
            state.maskDom.style.left = `-${right}px`;
            state.maskDom.style.width = `calc(100% + ${right}px)`;
          }
          break;
        }
        case 'top':
        case 'bottom': {
          state.dom.style.width = `calc(100% + ${right}px)`;
          state.dom.style.height = '100%';
          state.dom.style.transform = 'translateZ(0)';
          heightTransition = `height 0s ${ease} ${duration}`;
          break;
        }
        default:
          break;
      }
      clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        if (state.dom) {
          state.dom.style.transition = `${transformTransition},${
            heightTransition ? `${heightTransition},` : ''
          }${widthTransition}`;
          state.dom.style.transform = '';
          state.dom.style.width = '';
          state.dom.style.height = '';
        }
      });
    };

    const getCurrentDrawerSome = () => !Object.keys(currentDrawer).some(key => currentDrawer[key]);

    const getLevelDom = ({ level, getContainer }: IDrawerChildProps) => {
      if (windowIsUndefined) {
        return;
      }
      const container = getContainer?.();
      const parent = container ? (container.parentNode as HTMLElement) : null;
      state.levelDom = [];
      if (level === 'all') {
        const children: HTMLElement[] = parent ? Array.prototype.slice.call(parent.children) : [];
        children.forEach((child: HTMLElement) => {
          if (
            child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== container
          ) {
            state.levelDom.push(child);
          }
        });
      } else if (level) {
        dataToArray(level).forEach(key => {
          document.querySelectorAll(key).forEach(item => {
            state.levelDom.push(item);
          });
        });
      }
    };

    const getHorizontalBoolAndPlacementName = () => {
      const { placement } = props;
      const isHorizontal = placement === 'left' || placement === 'right';
      const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
      return {
        isHorizontal,
        placementName,
      };
    };

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
        ...otherProps
      } = props;
      // 首次渲染都将是关闭状态。
      const open = state.dom ? $open : false;
      const wrapperClassName = classnames(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        'no-mask': !showMask,
      });

      const { placementName } = getHorizontalBoolAndPlacementName();
      // 百分比与像素动画不同步，第一次打用后全用像素动画。
      // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
      const placementPos = placement === 'left' || placement === 'top' ? '-100%' : '100%';
      const transform = open ? '' : `${placementName}(${placementPos})`;

      return (
        <div
          {...omit(otherProps, ['switchScrollingEffect', 'autoFocus'])}
          tabindex={-1}
          class={wrapperClassName}
          style={style}
          ref={(c: HTMLElement | null) => {
            state.dom = c as HTMLElement;
          }}
          onKeydown={open && keyboard ? onKeyDown : undefined}
          onTransitionend={onWrapperTransitionEnd}
        >
          {showMask && (
            <div
              class={`${prefixCls}-mask`}
              onClick={maskClosable ? onClose : undefined}
              style={maskStyle}
              ref={c => {
                state.maskDom = c as HTMLElement;
              }}
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
            ref={c => {
              state.contentWrapper = c as HTMLElement;
            }}
          >
            <div
              class={`${prefixCls}-content`}
              ref={c => {
                state.contentDom = c as HTMLElement;
              }}
            >
              {slots.children?.()}
            </div>
          </div>
        </div>
      );
    };
  },
});

export default DrawerChild;
