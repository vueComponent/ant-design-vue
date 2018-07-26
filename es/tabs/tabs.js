import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';

import Tabs from '../vc-tabs/src/Tabs';
import isFlexSupported from '../_util/isFlexSupported';
import { hasProp, getComponentFromProp, isEmptyElement, getSlotOptions } from '../_util/props-util';
import warning from '../_util/warning';
export default {
  name: 'ATabs',
  props: {
    prefixCls: { type: String, 'default': 'ant-tabs' },
    activeKey: String,
    defaultActiveKey: String,
    hideAdd: { type: Boolean, 'default': false },
    tabBarStyle: Object,
    tabBarExtraContent: [String, Number, Function],
    destroyInactiveTabPane: { type: Boolean, 'default': false },
    type: {
      validator: function validator(value) {
        return ['line', 'card', 'editable-card'].includes(value);
      }
    },
    tabPosition: {
      validator: function validator(value) {
        return ['top', 'right', 'bottom', 'left'].includes(value);
      }
    },
    size: {
      validator: function validator(value) {
        return ['default', 'small', 'large'].includes(value);
      }
    },
    animated: { type: [Boolean, Object], 'default': undefined },
    tabBarGutter: Number
  },
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  methods: {
    createNewTab: function createNewTab(targetKey) {
      this.$emit('edit', targetKey, 'add');
    },
    removeTab: function removeTab(targetKey, e) {
      e.stopPropagation();
      if (!targetKey) {
        return;
      }
      this.$emit('edit', targetKey, 'remove');
    },
    handleChange: function handleChange(activeKey) {
      this.$emit('change', activeKey);
    },
    onTabClick: function onTabClick(val) {
      this.$emit('tabClick', val);
    },
    onPrevClick: function onPrevClick(val) {
      this.$emit('prevClick', val);
    },
    onNextClick: function onNextClick(val) {
      this.$emit('nextClick', val);
    }
  },

  mounted: function mounted() {
    var NO_FLEX = ' no-flex';
    var tabNode = this.$el;
    if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX;
    }
  },
  render: function render(createElement) {
    var _cls;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        size = this.size,
        _type = this.type,
        type = _type === undefined ? 'line' : _type,
        tabPosition = this.tabPosition,
        tabBarStyle = this.tabBarStyle,
        hideAdd = this.hideAdd,
        onTabClick = this.onTabClick,
        onPrevClick = this.onPrevClick,
        onNextClick = this.onNextClick,
        animated = this.animated,
        _destroyInactiveTabPa = this.destroyInactiveTabPane,
        destroyInactiveTabPane = _destroyInactiveTabPa === undefined ? false : _destroyInactiveTabPa,
        activeKey = this.activeKey,
        defaultActiveKey = this.defaultActiveKey,
        $slots = this.$slots,
        tabBarGutter = this.tabBarGutter;

    var _ref = (typeof animated === 'undefined' ? 'undefined' : _typeof(animated)) === 'object' ? { // eslint-disable-line
      inkBarAnimated: !!animated.inkBar, tabPaneAnimated: !!animated.tabPane
    } : {
      inkBarAnimated: animated === undefined || animated, tabPaneAnimated: animated === undefined || animated

      // card tabs should not have animation
    },
        inkBarAnimated = _ref.inkBarAnimated,
        tabPaneAnimated = _ref.tabPaneAnimated;

    if (type !== 'line') {
      tabPaneAnimated = animated === undefined ? false : tabPaneAnimated;
    }
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-small', size === 'small'), _defineProperty(_cls, prefixCls + '-large', size === 'large'), _defineProperty(_cls, prefixCls + '-default', size === 'default'), _defineProperty(_cls, prefixCls + '-vertical', tabPosition === 'left' || tabPosition === 'right'), _defineProperty(_cls, prefixCls + '-card', type.indexOf('card') >= 0), _defineProperty(_cls, prefixCls + '-' + type, true), _defineProperty(_cls, prefixCls + '-no-animation', !tabPaneAnimated), _cls);
    var tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent');
    var children = [];
    $slots['default'] && $slots['default'].forEach(function (child) {
      if (isEmptyElement(child)) {
        return;
      }
      var componentOptions = child.componentOptions;

      var __ANT_TAB_PANE = getSlotOptions(child).__ANT_TAB_PANE;
      warning(__ANT_TAB_PANE, '`Tabs children just support TabPane');
      if (componentOptions && __ANT_TAB_PANE) {
        componentOptions.propsData = componentOptions.propsData || {};
        if (componentOptions.propsData.tab === undefined) {
          var tab = (componentOptions.children || []).filter(function (_ref2) {
            var _ref2$data = _ref2.data,
                data = _ref2$data === undefined ? {} : _ref2$data;
            return data.slot === 'tab';
          });
          componentOptions.propsData.tab = tab;
        }
        children.push(child);
      }
    });
    var tabBarProps = {
      props: {
        hideAdd: hideAdd,
        removeTab: this.removeTab,
        createNewTab: this.createNewTab,
        inkBarAnimated: inkBarAnimated,
        tabBarGutter: tabBarGutter
      },
      on: {
        tabClick: onTabClick,
        prevClick: onPrevClick,
        nextClick: onNextClick
      },
      style: tabBarStyle
    };
    var tabContentProps = {
      props: {
        animated: tabPaneAnimated,
        animatedWithMargin: true
      }
    };
    var tabsProps = {
      props: {
        prefixCls: prefixCls,
        tabBarPosition: tabPosition,
        tabBarProps: tabBarProps,
        tabContentProps: tabContentProps,
        destroyInactiveTabPane: destroyInactiveTabPane,
        defaultActiveKey: defaultActiveKey,
        type: type
      },
      on: {
        change: this.handleChange,
        tabClick: this.onTabClick
      }
    };
    if (hasProp(this, 'activeKey')) {
      tabsProps.props.activeKey = activeKey;
    }
    return h(
      Tabs,
      _mergeJSXProps([{
        'class': cls
      }, tabsProps]),
      [children, tabBarExtraContent ? h(
        'template',
        { slot: 'tabBarExtraContent' },
        [tabBarExtraContent]
      ) : null]
    );
  }
};