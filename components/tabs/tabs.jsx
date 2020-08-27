import { inject } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import VcTabs, { TabPane } from '../vc-tabs/src';
import TabContent from '../vc-tabs/src/TabContent';
import { isFlexSupported } from '../_util/styleChecker';
import PropTypes from '../_util/vue-types';
import {
  getComponent,
  getOptionProps,
  filterEmpty,
  findDOMNode,
  getPropsData,
  getSlot,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import isValid from '../_util/isValid';
import { ConfigConsumerProps } from '../config-provider';
import TabBar from './TabBar';

export default {
  TabPane,
  name: 'ATabs',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideAdd: PropTypes.bool.def(false),
    tabBarStyle: PropTypes.object,
    tabBarExtraContent: PropTypes.any,
    destroyInactiveTabPane: PropTypes.bool.def(false),
    type: PropTypes.oneOf(['line', 'card', 'editable-card']),
    tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('top'),
    size: PropTypes.oneOf(['default', 'small', 'large']),
    animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    tabBarGutter: PropTypes.number,
    renderTabBar: PropTypes.func,
    onChange: PropTypes.func,
    onTabClick: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func,
    onEdit: PropTypes.func,
    'onUpdate:activeKey': PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  mounted() {
    const NO_FLEX = ' no-flex';
    const tabNode = findDOMNode(this);
    if (tabNode && !isFlexSupported && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX;
    }
  },
  methods: {
    removeTab(targetKey, e) {
      e.stopPropagation();
      if (isValid(targetKey)) {
        this.$emit('edit', targetKey, 'remove');
      }
    },
    handleChange(activeKey) {
      this.$emit('update:activeKey', activeKey);
      this.$emit('change', activeKey);
    },
    createNewTab(targetKey) {
      this.$emit('edit', targetKey, 'add');
    },
  },

  render() {
    const props = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      size,
      type = 'line',
      tabPosition,
      animated = true,
      hideAdd,
      renderTabBar,
    } = props;
    const { class: className, ...restProps } = this.$attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tabs', customizePrefixCls);
    const children = filterEmpty(getSlot(this));

    let tabBarExtraContent = getComponent(this, 'tabBarExtraContent');
    let tabPaneAnimated = typeof animated === 'object' ? animated.tabPane : animated;

    // card tabs should not have animation
    if (type !== 'line') {
      tabPaneAnimated = 'animated' in props ? tabPaneAnimated : false;
    }
    const cls = {
      [className]: className,
      [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
      [`${prefixCls}-${size}`]: !!size,
      [`${prefixCls}-card`]: type.indexOf('card') >= 0,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-no-animation`]: !tabPaneAnimated,
    };
    // only card type tabs can be added and closed
    let childrenWithClose = [];
    if (type === 'editable-card') {
      childrenWithClose = [];
      children.forEach((child, index) => {
        const props = getPropsData(child);
        let closable = props.closable;
        closable = typeof closable === 'undefined' ? true : closable;
        const closeIcon = closable ? (
          <CloseOutlined
            class={`${prefixCls}-close-x`}
            onClick={e => this.removeTab(child.key, e)}
          />
        ) : null;
        childrenWithClose.push(
          cloneElement(child, {
            tab: (
              <div class={closable ? undefined : `${prefixCls}-tab-unclosable`}>
                {getComponent(child, 'tab')}
                {closeIcon}
              </div>
            ),
            key: child.key || index,
          }),
        );
      });
      // Add new tab handler
      if (!hideAdd) {
        tabBarExtraContent = (
          <span>
            <PlusOutlined class={`${prefixCls}-new-tab`} onClick={this.createNewTab} />
            {tabBarExtraContent}
          </span>
        );
      }
    }

    tabBarExtraContent = tabBarExtraContent ? (
      <div class={`${prefixCls}-extra-content`}>{tabBarExtraContent}</div>
    ) : null;

    const renderTabBarSlot = renderTabBar || this.$slots.renderTabBar;
    const tabBarProps = {
      ...props,
      prefixCls,
      tabBarExtraContent,
      renderTabBar: renderTabBarSlot,
      ...restProps,
      children,
    };
    const contentCls = {
      [`${prefixCls}-${tabPosition}-content`]: true,
      [`${prefixCls}-card-content`]: type.indexOf('card') >= 0,
    };
    const tabsProps = {
      ...props,
      prefixCls,
      tabBarPosition: tabPosition,
      // https://github.com/vueComponent/ant-design-vue/issues/2030
      // 如仅传递 tabBarProps 会导致，第二次执行 renderTabBar 时，丢失 on 属性，
      // 添加key之后，会在babel jsx 插件中做一次merge，最终TabBar接收的是一个新的对象，而不是 tabBarProps
      renderTabBar: () => <TabBar key="tabBar" {...tabBarProps} />,
      renderTabContent: () => (
        <TabContent class={contentCls} animated={tabPaneAnimated} animatedWithMargin />
      ),
      children: childrenWithClose.length > 0 ? childrenWithClose : children,
      ...restProps,
      onChange: this.handleChange,
      class: cls,
    };
    return <VcTabs {...tabsProps} />;
  },
};
