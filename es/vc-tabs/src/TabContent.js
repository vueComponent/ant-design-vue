import _defineProperty from 'babel-runtime/helpers/defineProperty';

import { getTransformByIndex, getActiveIndex, getTransformPropValue, getMarginStyle } from './utils';
export default {
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

      return _ref = {}, _defineProperty(_ref, prefixCls + '-content', true), _defineProperty(_ref, animated ? prefixCls + '-content-animated' : prefixCls + '-content-no-animated', true), _ref;
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
      var activeIndex = getActiveIndex(this.$slots['default'], activeKey);
      if (activeIndex !== -1) {
        var animatedStyle = animatedWithMargin ? getMarginStyle(activeIndex, tabBarPosition) : getTransformPropValue(getTransformByIndex(activeIndex, tabBarPosition));
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