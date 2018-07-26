'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TabContent',
  props: {
    animated: { type: Boolean, 'default': true },
    animatedWithMargin: { type: Boolean, 'default': true },
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    activeKey: String,
    tabBarPosition: String
  },
  data: function data() {
    return {};
  },

  computed: {
    classes: function classes() {
      var _ref;

      var animated = this.animated,
          prefixCls = this.prefixCls;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls + '-content', true), (0, _defineProperty3['default'])(_ref, animated ? prefixCls + '-content-animated' : prefixCls + '-content-no-animated', true), _ref;
    }
  },
  methods: {},
  render: function render() {
    var h = arguments[0];
    var activeKey = this.activeKey,
        tabBarPosition = this.tabBarPosition,
        animated = this.animated,
        animatedWithMargin = this.animatedWithMargin,
        classes = this.classes;

    var style = {};
    if (animated && this.$slots['default']) {
      var activeIndex = (0, _utils.getActiveIndex)(this.$slots['default'], activeKey);
      if (activeIndex !== -1) {
        var animatedStyle = animatedWithMargin ? (0, _utils.getMarginStyle)(activeIndex, tabBarPosition) : (0, _utils.getTransformPropValue)((0, _utils.getTransformByIndex)(activeIndex, tabBarPosition));
        style = animatedStyle;
      } else {
        style = {
          display: 'none'
        };
      }
    }
    return h(
      'div',
      {
        'class': classes,
        style: style
      },
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];