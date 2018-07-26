import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

// based on rc-tabs 9.2.4 e16ee09531476757b18b7bc0ec1daddcc0d40d65
import Icon from '../../icon';
import KeyCode from './KeyCode';
import TabContent from './TabContent';
import ScrollableInkTabBar from './ScrollableInkTabBar';
import hasProp from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
function getDefaultActiveKey(t) {
  var activeKey = void 0;
  t.$slots['default'] && t.$slots['default'].forEach(function (_ref) {
    var _ref$componentOptions = _ref.componentOptions,
        componentOptions = _ref$componentOptions === undefined ? {} : _ref$componentOptions,
        tabKey = _ref.key;

    var child = componentOptions.propsData;
    if (child && !activeKey && !child.disabled) {
      activeKey = tabKey;
    }
  });
  return activeKey;
}
function activeKeyIsValid(t, key) {
  var keys = t.$slots['default'] && t.$slots['default'].map(function (_ref2) {
    var _ref2$componentOption = _ref2.componentOptions,
        componentOptions = _ref2$componentOption === undefined ? {} : _ref2$componentOption,
        tabKey = _ref2.key;

    var child = componentOptions.propsData;
    if (child) {
      return tabKey;
    }
  });
  return key !== undefined && keys.indexOf(key) >= 0;
}

export default {
  name: 'Tabs',
  components: { Icon: Icon },
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  mixins: [BaseMixin],
  props: {
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    tabBarPosition: {
      'default': 'top',
      validator: function validator(value) {
        return ['top', 'bottom', 'left', 'right'].includes(value);
      }
    },
    tabBarProps: Object,
    tabContentProps: Object,
    destroyInactiveTabPane: Boolean,
    activeKey: String,
    defaultActiveKey: String,
    type: {
      validator: function validator(value) {
        return ['line', 'card', 'editable-card'].includes(value);
      }
    }
  },
  data: function data() {
    return {
      stateActiveKey: this.getStateActiveKey()
    };
  },

  computed: {
    classes: function classes() {
      var _ref3;

      var prefixCls = this.prefixCls,
          tabBarPosition = this.tabBarPosition;

      return _ref3 = {}, _defineProperty(_ref3, '' + prefixCls, true), _defineProperty(_ref3, prefixCls + '-' + tabBarPosition, true), _ref3;
    }
  },
  beforeUpdate: function beforeUpdate() {
    if (this.activeKey) {
      this.stateActiveKey = this.activeKey;
    } else if (!activeKeyIsValid(this, this.stateActiveKey)) {
      this.stateActiveKey = getDefaultActiveKey(this);
    }
  },

  methods: {
    getStateActiveKey: function getStateActiveKey() {
      var activeKey = void 0;
      if (this.activeKey) {
        activeKey = this.activeKey;
      } else if (this.defaultActiveKey) {
        activeKey = this.defaultActiveKey;
      } else {
        activeKey = getDefaultActiveKey(this);
      }
      return activeKey;
    },
    handleTabClick: function handleTabClick(activeKey, e) {
      this.__emit('tabClick', activeKey, e);
      this.setActiveKey(activeKey);
    },
    onNavKeyDown: function onNavKeyDown(e) {
      var eventKeyCode = e.keyCode;
      if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
        e.preventDefault();
        var nextKey = this.getNextActiveKey(true);
        this.handleTabClick(nextKey);
      } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
        e.preventDefault();
        var previousKey = this.getNextActiveKey(false);
        this.handleTabClick(previousKey);
      }
    },
    setActiveKey: function setActiveKey(activeKey) {
      if (this.stateActiveKey !== activeKey) {
        if (!hasProp(this, 'activeKey')) {
          this.stateActiveKey = activeKey;
        }
        this.__emit('change', activeKey);
      }
    },
    getNextActiveKey: function getNextActiveKey(next) {
      var activeKey = this.stateActiveKey;
      var children = [];
      this.$slots['default'] && this.$slots['default'].forEach(function (_ref4) {
        var _ref4$componentOption = _ref4.componentOptions,
            componentOptions = _ref4$componentOption === undefined ? {} : _ref4$componentOption,
            tabKey = _ref4.key;

        var c = componentOptions.propsData;

        if (c && !c.disabled && c.disabled !== '') {
          if (next) {
            children.push(_extends({}, c, { tabKey: tabKey }));
          } else {
            children.unshift(_extends({}, c, { tabKey: tabKey }));
          }
        }
      });
      var length = children.length;
      var ret = length && children[0].tabKey;
      children.forEach(function (child, i) {
        if (child.tabKey === activeKey) {
          if (i === length - 1) {
            ret = children[0].tabKey;
          } else {
            ret = children[i + 1].tabKey;
          }
        }
      });
      return ret;
    }
  },
  beforeDestroy: function beforeDestroy() {},
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        tabBarPosition = this.tabBarPosition,
        destroyInactiveTabPane = this.destroyInactiveTabPane,
        onNavKeyDown = this.onNavKeyDown,
        handleTabClick = this.handleTabClick,
        stateActiveKey = this.stateActiveKey,
        classes = this.classes,
        setActiveKey = this.setActiveKey,
        $slots = this.$slots;

    var panels = [];

    $slots['default'] && $slots['default'].forEach(function (_ref5) {
      var componentOptions = _ref5.componentOptions,
          tabKey = _ref5.key;

      if (componentOptions) {
        if (componentOptions.propsData.tab === undefined) {
          var tab = (componentOptions.children || []).filter(function (_ref6) {
            var _ref6$data = _ref6.data,
                data = _ref6$data === undefined ? {} : _ref6$data;
            return data.slot === 'tab';
          });
          componentOptions.propsData.tab = tab;
        }
        panels.push(_extends({}, componentOptions.propsData, { tabKey: tabKey }));
      }
    });
    var tabContentProps = {
      props: _extends({}, this.tabContentProps.props, {
        prefixCls: prefixCls,
        tabBarPosition: tabBarPosition,
        activeKey: stateActiveKey,
        destroyInactiveTabPane: destroyInactiveTabPane
        // onChange: setActiveKey,
      }),
      on: {
        change: setActiveKey
      }
    };
    var tabBarProps = {
      props: _extends({}, this.tabBarProps.props, {
        panels: panels,
        prefixCls: prefixCls,
        tabBarPosition: tabBarPosition,
        activeKey: stateActiveKey
      }),
      style: this.tabBarProps.style || {},
      on: _extends({}, this.tabBarProps.on, {
        keydown: onNavKeyDown,
        tabClick: handleTabClick
      })
    };
    var contents = [h(
      ScrollableInkTabBar,
      _mergeJSXProps([tabBarProps, {
        key: 'tabBar'
      }]),
      [$slots.tabBarExtraContent ? h(
        'template',
        { slot: 'extraContent' },
        [$slots.tabBarExtraContent]
      ) : null]
    ), h(
      TabContent,
      _mergeJSXProps([tabContentProps, {
        key: 'tabContent'
      }]),
      [$slots['default']]
    )];
    if (tabBarPosition === 'bottom') {
      contents.reverse();
    }
    return h(
      'div',
      {
        'class': classes
      },
      [contents]
    );
  }
};