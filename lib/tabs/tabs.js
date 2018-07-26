'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _Tabs = require('../vc-tabs/src/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _isFlexSupported = require('../_util/isFlexSupported');

var _isFlexSupported2 = _interopRequireDefault(_isFlexSupported);

var _propsUtil = require('../_util/props-util');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
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
    if (tabNode && !(0, _isFlexSupported2['default'])() && tabNode.className.indexOf(NO_FLEX) === -1) {
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

    var _ref = (typeof animated === 'undefined' ? 'undefined' : (0, _typeof3['default'])(animated)) === 'object' ? { // eslint-disable-line
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
    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-small', size === 'small'), (0, _defineProperty3['default'])(_cls, prefixCls + '-large', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-default', size === 'default'), (0, _defineProperty3['default'])(_cls, prefixCls + '-vertical', tabPosition === 'left' || tabPosition === 'right'), (0, _defineProperty3['default'])(_cls, prefixCls + '-card', type.indexOf('card') >= 0), (0, _defineProperty3['default'])(_cls, prefixCls + '-' + type, true), (0, _defineProperty3['default'])(_cls, prefixCls + '-no-animation', !tabPaneAnimated), _cls);
    var tabBarExtraContent = (0, _propsUtil.getComponentFromProp)(this, 'tabBarExtraContent');
    var children = [];
    $slots['default'] && $slots['default'].forEach(function (child) {
      if ((0, _propsUtil.isEmptyElement)(child)) {
        return;
      }
      var componentOptions = child.componentOptions;

      var __ANT_TAB_PANE = (0, _propsUtil.getSlotOptions)(child).__ANT_TAB_PANE;
      (0, _warning2['default'])(__ANT_TAB_PANE, '`Tabs children just support TabPane');
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
    if ((0, _propsUtil.hasProp)(this, 'activeKey')) {
      tabsProps.props.activeKey = activeKey;
    }
    return h(
      _Tabs2['default'],
      (0, _babelHelperVueJsxMergeProps2['default'])([{
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
module.exports = exports['default'];