import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import Icon from '../icon';
import getTransitionProps from '../_util/getTransitionProps';
import omit from 'omit.js';

export default {
  name: 'ATag',
  props: {
    prefixCls: {
      'default': 'ant-tag',
      type: String
    },
    color: String,
    closable: Boolean
  },
  data: function data() {
    return {
      closed: false
    };
  },

  computed: {
    isPresetColor: function isPresetColor() {
      var isPresetColor = function isPresetColor(color) {
        if (!color) {
          return false;
        }
        return (/^(pink|red|yellow|orange|cyan|green|blue|purple)(-inverse)?$/.test(color)
        );
      };
      return isPresetColor(this.color);
    },
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          color = this.color,
          isPresetColor = this.isPresetColor;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + color, isPresetColor), _defineProperty(_ref, prefixCls + '-has-color', color && !isPresetColor), _ref;
    },
    tagStyle: function tagStyle() {
      var color = this.color,
          isPresetColor = this.isPresetColor;

      return {
        backgroundColor: color && !isPresetColor ? color : null
      };
    }
  },
  methods: {
    animationEnd: function animationEnd() {
      this.$emit('afterClose');
    },
    close: function close(e) {
      this.$emit('close', e);
      if (e.defaultPrevented) {
        return;
      }
      this.closed = true;
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        animationEnd = this.animationEnd,
        classes = this.classes,
        tagStyle = this.tagStyle,
        closable = this.closable,
        close = this.close,
        closed = this.closed,
        $slots = this.$slots,
        $listeners = this.$listeners;

    var transitionProps = getTransitionProps(prefixCls + '-zoom', {
      afterLeave: animationEnd
    });
    // const tagProps = {
    //   on
    // }
    return h(
      'transition',
      transitionProps,
      [!closed ? h(
        'div',
        _mergeJSXProps([{

          'class': classes,
          style: tagStyle
        }, { on: omit($listeners, ['close', 'afterClose']) }]),
        [$slots['default'], closable ? h(Icon, {
          attrs: { type: 'cross' },
          on: {
            'click': close
          }
        }) : null]
      ) : null]
    );
  }
};