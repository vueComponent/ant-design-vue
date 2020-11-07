import PropTypes from './vue-types';
import switchScrollingEffect from './switchScrollingEffect';
import setStyle from './setStyle';
import Portal from './Portal';
import { defineComponent } from 'vue';

let openCount = 0;
const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
let cacheOverflow = {};

export default defineComponent({
  name: 'PortalWrapper',
  props: {
    wrapperClassName: PropTypes.string,
    forceRender: PropTypes.looseBool,
    getContainer: PropTypes.any,
    children: PropTypes.func,
    visible: PropTypes.looseBool,
  },
  data() {
    this._component = null;
    const { visible } = this.$props;
    openCount = visible ? openCount + 1 : openCount;
    return {};
  },
  watch: {
    visible(val) {
      openCount = val ? openCount + 1 : openCount - 1;
    },
    getContainer(getContainer, prevGetContainer) {
      const getContainerIsFunc =
        typeof getContainer === 'function' && typeof prevGetContainer === 'function';
      if (
        getContainerIsFunc
          ? getContainer.toString() !== prevGetContainer.toString()
          : getContainer !== prevGetContainer
      ) {
        this.removeCurrentContainer(false);
      }
    },
  },
  updated() {
    this.setWrapperClassName();
  },
  beforeUnmount() {
    const { visible } = this.$props;
    // 离开时不会 render， 导到离开时数值不变，改用 func 。。
    openCount = visible && openCount ? openCount - 1 : openCount;
    this.removeCurrentContainer(visible);
  },
  methods: {
    getParent() {
      const { getContainer } = this.$props;
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
    },

    getDomContainer() {
      if (windowIsUndefined) {
        return null;
      }
      if (!this.container) {
        this.container = document.createElement('div');
        const parent = this.getParent();
        if (parent) {
          parent.appendChild(this.container);
        }
      }
      this.setWrapperClassName();
      return this.container;
    },

    setWrapperClassName() {
      const { wrapperClassName } = this.$props;
      if (this.container && wrapperClassName && wrapperClassName !== this.container.className) {
        this.container.className = wrapperClassName;
      }
    },

    savePortal(c) {
      // Warning: don't rename _component
      // https://github.com/react-component/util/pull/65#discussion_r352407916
      this._component = c;
    },

    removeCurrentContainer() {
      this.container = null;
      this._component = null;
    },

    /**
     * Enhance ./switchScrollingEffect
     * 1. Simulate document body scroll bar with
     * 2. Record body has overflow style and recover when all of PortalWrapper invisible
     * 3. Disable body scroll when PortalWrapper has open
     *
     * @memberof PortalWrapper
     */
    switchScrollingEffect() {
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
    },
  },

  render() {
    const { children, forceRender, visible } = this.$props;
    let portal = null;
    const childProps = {
      getOpenCount: () => openCount,
      getContainer: this.getDomContainer,
      switchScrollingEffect: this.switchScrollingEffect,
    };
    if (forceRender || visible || this._component) {
      portal = (
        <Portal
          getContainer={this.getDomContainer}
          children={children(childProps)}
          ref={this.savePortal}
        ></Portal>
      );
    }
    return portal;
  },
});
