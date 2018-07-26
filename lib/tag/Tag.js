'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
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

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + color, isPresetColor), (0, _defineProperty3['default'])(_ref, prefixCls + '-has-color', color && !isPresetColor), _ref;
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

    var transitionProps = (0, _getTransitionProps2['default'])(prefixCls + '-zoom', {
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
        (0, _babelHelperVueJsxMergeProps2['default'])([{

          'class': classes,
          style: tagStyle
        }, { on: (0, _omit2['default'])($listeners, ['close', 'afterClose']) }]),
        [$slots['default'], closable ? h(_icon2['default'], {
          attrs: { type: 'cross' },
          on: {
            'click': close
          }
        }) : null]
      ) : null]
    );
  }
};
module.exports = exports['default'];