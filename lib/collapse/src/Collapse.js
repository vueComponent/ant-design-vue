'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _openAnimationFactory = require('./openAnimationFactory');

var _openAnimationFactory2 = _interopRequireDefault(_openAnimationFactory);

var _commonProps = require('./commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(activeKey) {
  var currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey;
}

exports['default'] = {
  name: 'Collapse',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: (0, _extends3['default'])({}, _commonProps.collapseProps, {
    openAnimation: _vueTypes2['default'].object
  }),
  data: function data() {
    var _$props = this.$props,
        activeKey = _$props.activeKey,
        defaultActiveKey = _$props.defaultActiveKey,
        openAnimation = _$props.openAnimation,
        prefixCls = _$props.prefixCls;

    var currentActiveKey = defaultActiveKey;
    if ((0, _propsUtil.hasProp)(this, 'activeKey')) {
      currentActiveKey = activeKey;
    }
    var currentOpenAnimations = openAnimation || (0, _openAnimationFactory2['default'])(prefixCls);
    return {
      currentOpenAnimations: currentOpenAnimations,
      stateActiveKey: _toArray(currentActiveKey)
    };
  },

  methods: {
    onClickItem: function onClickItem(key) {
      var activeKey = this.stateActiveKey;
      if (this.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [].concat((0, _toConsumableArray3['default'])(activeKey));
        var index = activeKey.indexOf(key);
        var isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      this.setActiveKey(activeKey);
    },
    getItems: function getItems() {
      var _this = this;

      var activeKey = this.stateActiveKey;
      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          accordion = _$props2.accordion,
          destroyInactivePanel = _$props2.destroyInactivePanel;

      var newChildren = [];
      this.$slots['default'].forEach(function (child, index) {
        if ((0, _propsUtil.isEmptyElement)(child)) return;

        var _getPropsData = (0, _propsUtil.getPropsData)(child),
            header = _getPropsData.header,
            headerClass = _getPropsData.headerClass,
            disabled = _getPropsData.disabled;

        var isActive = false;
        var key = child.key || String(index);
        if (accordion) {
          isActive = activeKey[0] === key;
        } else {
          isActive = activeKey.indexOf(key) > -1;
        }

        var panelEvents = {};
        if (!disabled && disabled !== '') {
          panelEvents = {
            itemClick: function itemClick() {
              _this.onClickItem(key);
            }
          };
        }

        var props = {
          props: {
            header: header,
            headerClass: headerClass,
            isActive: isActive,
            prefixCls: prefixCls,
            destroyInactivePanel: destroyInactivePanel,
            openAnimation: _this.currentOpenAnimations
          },
          on: (0, _extends3['default'])({}, panelEvents)
        };

        newChildren.push((0, _vnode.cloneElement)(child, props));
      });
      return newChildren;
    },
    setActiveKey: function setActiveKey(activeKey) {
      this.setState({ stateActiveKey: activeKey });
      this.$emit('change', this.accordion ? activeKey[0] : activeKey);
    }
  },
  watch: {
    activeKey: function activeKey(val) {
      this.setState({
        stateActiveKey: _toArray(val)
      });
    },
    openAnimation: function openAnimation(val) {
      this.setState({
        currentOpenAnimations: val
      });
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.$props.prefixCls;

    var collapseClassName = (0, _defineProperty3['default'])({}, prefixCls, true);
    return h(
      'div',
      { 'class': collapseClassName },
      [this.getItems()]
    );
  }
};
module.exports = exports['default'];