import PropTypes from './vue-types';
import switchScrollingEffect from './switchScrollingEffect';
import setStyle from './setStyle';
import Portal from './Portal';
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  onUpdated,
  getCurrentInstance,
  nextTick,
} from 'vue';
import canUseDom from './canUseDom';
import ScrollLocker from '../vc-util/Dom/scrollLocker';
import wrapperRaf from './raf';

let openCount = 0;
const supportDom = canUseDom();

/** @private Test usage only */
export function getOpenCount() {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}

// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
let cacheOverflow = {};

const getParent = (getContainer: GetContainer) => {
  if (!supportDom) {
    return null;
  }
  if (getContainer) {
    if (typeof getContainer === 'string') {
      return document.querySelectorAll(getContainer)[0];
    }
    if (typeof getContainer === 'function') {
      return getContainer();
    }
    if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
      return getContainer;
    }
  }
  return document.body;
};

export type GetContainer = string | HTMLElement | (() => HTMLElement);

export default defineComponent({
  name: 'PortalWrapper',
  inheritAttrs: false,
  props: {
    wrapperClassName: PropTypes.string,
    forceRender: PropTypes.looseBool,
    getContainer: PropTypes.any,
    visible: PropTypes.looseBool,
  },

  setup(props, { slots }) {
    const container = ref<HTMLElement>();
    const componentRef = ref();
    const rafId = ref<number>();
    const scrollLocker = new ScrollLocker({
      container: getParent(props.getContainer) as HTMLElement,
    });

    const removeCurrentContainer = () => {
      // Portal will remove from `parentNode`.
      // Let's handle this again to avoid refactor issue.
      container.value?.parentNode?.removeChild(container.value);
    };
    const attachToParent = (force = false) => {
      if (force || (container.value && !container.value.parentNode)) {
        const parent = getParent(props.getContainer);
        if (parent) {
          parent.appendChild(container.value);
          return true;
        }

        return false;
      }

      return true;
    };
    // attachToParent();

    const getContainer = () => {
      if (!supportDom) {
        return null;
      }
      if (!container.value) {
        container.value = document.createElement('div');
        attachToParent(true);
      }
      setWrapperClassName();
      return container.value;
    };
    const setWrapperClassName = () => {
      const { wrapperClassName } = props;
      if (container.value && wrapperClassName && wrapperClassName !== container.value.className) {
        container.value.className = wrapperClassName;
      }
    };
    onUpdated(() => {
      setWrapperClassName();
      attachToParent();
    });
    /**
     * Enhance ./switchScrollingEffect
     * 1. Simulate document body scroll bar with
     * 2. Record body has overflow style and recover when all of PortalWrapper invisible
     * 3. Disable body scroll when PortalWrapper has open
     *
     * @memberof PortalWrapper
     */
    const switchScrolling = () => {
      if (openCount === 1 && !Object.keys(cacheOverflow).length) {
        switchScrollingEffect();
        // Must be set after switchScrollingEffect
        cacheOverflow = setStyle({
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
        });
      } else if (!openCount) {
        setStyle(cacheOverflow);
        cacheOverflow = {};
        switchScrollingEffect(true);
      }
    };
    const instance = getCurrentInstance();
    onMounted(() => {
      let init = false;
      watch(
        [() => props.visible, () => props.getContainer],
        ([visible, getContainer], [prevVisible, prevGetContainer]) => {
          // Update count
          if (supportDom && getParent(props.getContainer) === document.body) {
            if (visible && !prevVisible) {
              openCount += 1;
            } else if (init) {
              openCount -= 1;
            }
          }

          if (init) {
            // Clean up container if needed
            const getContainerIsFunc =
              typeof getContainer === 'function' && typeof prevGetContainer === 'function';
            if (
              getContainerIsFunc
                ? getContainer.toString() !== prevGetContainer.toString()
                : getContainer !== prevGetContainer
            ) {
              removeCurrentContainer();
            }
            // updateScrollLocker
            if (
              visible &&
              visible !== prevVisible &&
              supportDom &&
              getParent(getContainer) !== scrollLocker.getContainer()
            ) {
              scrollLocker.reLock({
                container: getParent(getContainer) as HTMLElement,
              });
            }
          }
          init = true;
        },
        { immediate: true, flush: 'post' },
      );

      nextTick(() => {
        if (!attachToParent()) {
          rafId.value = wrapperRaf(() => {
            instance.update();
          });
        }
      });
    });

    onBeforeUnmount(() => {
      const { visible, getContainer } = props;
      if (supportDom && getParent(getContainer) === document.body) {
        // 离开时不会 render， 导到离开时数值不变，改用 func 。。
        openCount = visible && openCount ? openCount - 1 : openCount;
      }
      removeCurrentContainer();
      wrapperRaf.cancel(rafId.value);
    });

    return () => {
      const { forceRender, visible } = props;
      let portal = null;
      const childProps = {
        getOpenCount: () => openCount,
        getContainer,
        switchScrollingEffect: switchScrolling,
        scrollLocker,
      };

      if (forceRender || visible || componentRef.value) {
        portal = (
          <Portal
            getContainer={getContainer}
            ref={componentRef}
            v-slots={{ default: () => slots.default?.(childProps) }}
          ></Portal>
        );
      }
      return portal;
    };
  },
});
