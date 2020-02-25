import omit from 'omit.js';
import BaseMixin from '../../_util/BaseMixin';
import PropTypes from '../../_util/vue-types';
import raf from 'raf';
import KeyCode from './KeyCode';
import { getOptionProps, getListeners } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import Sentinel from './Sentinel';

function getDefaultActiveKey(props) {
  let activeKey;
  const children = props.children;
  children.forEach(child => {
    if (child && !activeKey && !child.disabled) {
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

export default {
  name: 'Tabs',
  mixins: [BaseMixin],
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: {
    destroyInactiveTabPane: PropTypes.bool,
    renderTabBar: PropTypes.func.isRequired,
    renderTabContent: PropTypes.func.isRequired,
    navWrapper: PropTypes.func.def(arg => arg),
    children: PropTypes.any.def([]),
    prefixCls: PropTypes.string.def('ant-tabs'),
    tabBarPosition: PropTypes.string.def('top'),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    __propsSymbol__: PropTypes.any,
  },
  data() {
    const props = getOptionProps(this);
    let activeKey;
    if ('activeKey' in props) {
      activeKey = props.activeKey;
    } else if ('defaultActiveKey' in props) {
      activeKey = props.defaultActiveKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }
    return {
      _activeKey: activeKey,
    };
  },
  provide() {
    return {
      sentinelContext: this,
    };
  },
  watch: {
    __propsSymbol__() {
      const nextProps = getOptionProps(this);
      if ('activeKey' in nextProps) {
        this.setState({
          _activeKey: nextProps.activeKey,
        });
      } else if (!activeKeyIsValid(nextProps, this.$data._activeKey)) {
        // https://github.com/ant-design/ant-design/issues/7093
        this.setState({
          _activeKey: getDefaultActiveKey(nextProps),
        });
      }
    },
  },
  beforeDestroy() {
    this.destroy = true;
    raf.cancel(this.sentinelId);
  },
  methods: {
    onTabClick(activeKey, e) {
      if (
        this.tabBar.componentOptions &&
        this.tabBar.componentOptions.listeners &&
        this.tabBar.componentOptions.listeners.tabClick
      ) {
        this.tabBar.componentOptions.listeners.tabClick(activeKey, e);
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
      if (this.$data._activeKey !== activeKey) {
        const props = getOptionProps(this);
        if (!('activeKey' in props)) {
          this.setState({
            _activeKey: activeKey,
          });
        }
        this.__emit('change', activeKey);
      }
    },

    getNextActiveKey(next) {
      const activeKey = this.$data._activeKey;
      const children = [];
      this.$props.children.forEach(c => {
        if (c && !c.disabled && c.disabled !== '') {
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

      raf.cancel(this.sentinelId);
      this.sentinelId = raf(() => {
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
    } = props;
    const cls = {
      [prefixCls]: 1,
      [`${prefixCls}-${tabBarPosition}`]: 1,
    };

    this.tabBar = renderTabBar();
    const tabBar = cloneElement(this.tabBar, {
      props: {
        prefixCls,
        navWrapper,
        tabBarPosition,
        panels: props.children,
        activeKey: this.$data._activeKey,
      },
      on: {
        keydown: this.onNavKeyDown,
        tabClick: this.onTabClick,
      },
      key: 'tabBar',
    });
    const tabContent = cloneElement(renderTabContent(), {
      props: {
        prefixCls,
        tabBarPosition,
        activeKey: this.$data._activeKey,
        destroyInactiveTabPane,
      },
      on: {
        change: this.setActiveKey,
      },
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
    const listeners = {
      ...omit(getListeners(this), ['change']),
      scroll: this.onScroll,
    };
    return <div {...{ on: listeners, class: cls }}>{contents}</div>;
  },
};
