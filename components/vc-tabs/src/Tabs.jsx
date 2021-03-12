import { defineComponent, provide, reactive, watchEffect } from 'vue';
import BaseMixin from '../../_util/BaseMixin';
import PropTypes from '../../_util/vue-types';
import KeyCode from './KeyCode';
import { cloneElement } from '../../_util/vnode';
import Sentinel from './Sentinel';
import isValid from '../../_util/isValid';
import { getDataAttr } from './utils';

function getDefaultActiveKey(props) {
  let activeKey;
  const children = props.children;
  children.forEach(child => {
    if (child && !isValid(activeKey) && !child.disabled) {
      activeKey = child.key;
    }
  });
  return activeKey;
}

function activeKeyIsValid(props, key) {
  const children = props.children;
  const keys = children.map(child => child && child.key);
  return keys.indexOf(key) >= 0;
}

export default defineComponent({
  name: 'Tabs',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    destroyInactiveTabPane: PropTypes.looseBool,
    renderTabBar: PropTypes.func.isRequired,
    renderTabContent: PropTypes.func.isRequired,
    navWrapper: PropTypes.func.def(arg => arg),
    children: PropTypes.any.def([]),
    prefixCls: PropTypes.string.def('ant-tabs'),
    tabBarPosition: PropTypes.string.def('top'),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    direction: PropTypes.string.def('ltr'),
    tabBarGutter: PropTypes.number,
  },
  setup(props) {
    let activeKey;
    if (props.activeKey !== undefined) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      activeKey = props.activeKey;
    } else if (props.defaultActiveKey !== undefined) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      activeKey = props.defaultActiveKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }
    const state = reactive({
      _activeKey: activeKey,
    });
    watchEffect(
      () => {
        if (props.activeKey !== undefined) {
          state._activeKey = props.activeKey;
        } else if (!activeKeyIsValid(props, state._activeKey)) {
          // https://github.com/ant-design/ant-design/issues/7093
          state._activeKey = getDefaultActiveKey(props);
        }
      },
      {
        flush: 'sync',
      },
    );
    return { state };
  },
  created() {
    this.panelSentinelStart = undefined;
    this.panelSentinelEnd = undefined;
    this.sentinelStart = undefined;
    this.sentinelEnd = undefined;
    provide('sentinelContext', this);
  },
  beforeUnmount() {
    this.destroy = true;
    cancelAnimationFrame(this.sentinelId);
  },
  methods: {
    onTabClick(activeKey, e) {
      if (this.tabBar.props && this.tabBar.props.onTabClick) {
        this.tabBar.props.onTabClick(activeKey, e);
      }
      this.setActiveKey(activeKey);
    },

    onNavKeyDown(e) {
      const eventKeyCode = e.keyCode;
      if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
        e.preventDefault();
        const nextKey = this.getNextActiveKey(true);
        this.onTabClick(nextKey);
      } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
        e.preventDefault();
        const previousKey = this.getNextActiveKey(false);
        this.onTabClick(previousKey);
      }
    },

    onScroll({ target, currentTarget }) {
      if (target === currentTarget && target.scrollLeft > 0) {
        target.scrollLeft = 0;
      }
    },

    // Sentinel for tab index
    setSentinelStart(node) {
      this.sentinelStart = node;
    },

    setSentinelEnd(node) {
      this.sentinelEnd = node;
    },

    setPanelSentinelStart(node) {
      if (node !== this.panelSentinelStart) {
        this.updateSentinelContext();
      }
      this.panelSentinelStart = node;
    },

    setPanelSentinelEnd(node) {
      if (node !== this.panelSentinelEnd) {
        this.updateSentinelContext();
      }
      this.panelSentinelEnd = node;
    },

    setActiveKey(activeKey) {
      if (this.state._activeKey !== activeKey) {
        const props = this.$props;
        if (props.activeKey === undefined) {
          this.state._activeKey = activeKey;
        }
        this.__emit('update:activeKey', activeKey);
        this.__emit('change', activeKey);
      }
    },

    getNextActiveKey(next) {
      const activeKey = this.state._activeKey;
      const children = [];
      this.$props.children.forEach(c => {
        if (c && !c.props?.disabled && c.props?.disabled !== '') {
          if (next) {
            children.push(c);
          } else {
            children.unshift(c);
          }
        }
      });
      const length = children.length;
      let ret = length && children[0].key;
      children.forEach((child, i) => {
        if (child.key === activeKey) {
          if (i === length - 1) {
            ret = children[0].key;
          } else {
            ret = children[i + 1].key;
          }
        }
      });
      return ret;
    },
    updateSentinelContext() {
      if (this.destroy) return;

      cancelAnimationFrame(this.sentinelId);
      this.sentinelId = requestAnimationFrame(() => {
        if (this.destroy) return;
        this.$forceUpdate();
      });
    },
  },
  render() {
    const props = this.$props;
    const {
      prefixCls,
      navWrapper,
      tabBarPosition,
      renderTabContent,
      renderTabBar,
      destroyInactiveTabPane,
      direction,
      tabBarGutter,
    } = props;
    const { class: className, onChange, style, ...restProps } = this.$attrs;
    const cls = {
      [className]: className,
      [prefixCls]: 1,
      [`${prefixCls}-${tabBarPosition}`]: 1,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    };

    this.tabBar = renderTabBar();
    const tabBar = cloneElement(this.tabBar, {
      prefixCls,
      navWrapper,
      tabBarPosition,
      panels: props.children,
      activeKey: this.state._activeKey,
      direction,
      tabBarGutter,
      onKeydown: this.onNavKeyDown,
      onTabClick: this.onTabClick,
      key: 'tabBar',
    });
    const tabContent = cloneElement(renderTabContent(), {
      prefixCls,
      tabBarPosition,
      activeKey: this.state._activeKey,
      destroyInactiveTabPane,
      direction,
      onChange: this.setActiveKey,
      children: props.children,
      key: 'tabContent',
    });

    const sentinelStart = (
      <Sentinel
        key="sentinelStart"
        setRef={this.setSentinelStart}
        nextElement={this.panelSentinelStart}
      />
    );
    const sentinelEnd = (
      <Sentinel
        key="sentinelEnd"
        setRef={this.setSentinelEnd}
        prevElement={this.panelSentinelEnd}
      />
    );

    const contents = [];

    if (tabBarPosition === 'bottom') {
      contents.push(sentinelStart, tabContent, sentinelEnd, tabBar);
    } else {
      contents.push(tabBar, sentinelStart, tabContent, sentinelEnd);
    }
    const p = {
      ...getDataAttr(restProps),
      style,
      onScroll: this.onScroll,
      class: cls,
    };
    return <div {...p}>{contents}</div>;
  },
});
