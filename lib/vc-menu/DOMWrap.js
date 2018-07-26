'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'DOMWrap',
  props: {
    visible: {
      type: Boolean,
      'default': false
    },
    tag: {
      type: String,
      'default': 'div'
    },
    hiddenClassName: {
      type: String,
      'default': ''
    }
  },
  computed: {
    'class': function _class() {
      var _$props = this.$props,
          visible = _$props.visible,
          hiddenClassName = _$props.hiddenClassName;

      return (0, _defineProperty3['default'])({}, hiddenClassName, !visible);
    }
  },
  render: function render() {
    var h = arguments[0];

    var otherProps = (0, _omit2['default'])(this.$props, ['tag', 'hiddenClassName', 'visible']);
    var Tag = this.$props.tag;
    var tagProps = {
      attr: (0, _extends3['default'])({}, otherProps, this.$attrs),
      on: this.$listeners
    };
    return h(
      Tag,
      (0, _babelHelperVueJsxMergeProps2['default'])([tagProps, { 'class': this['class'] }]),
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];