import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import omit from 'omit.js';
export default {
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

      return _defineProperty({}, hiddenClassName, !visible);
    }
  },
  render: function render() {
    var h = arguments[0];

    var otherProps = omit(this.$props, ['tag', 'hiddenClassName', 'visible']);
    var Tag = this.$props.tag;
    var tagProps = {
      attr: _extends({}, otherProps, this.$attrs),
      on: this.$listeners
    };
    return h(
      Tag,
      _mergeJSXProps([tagProps, { 'class': this['class'] }]),
      [this.$slots['default']]
    );
  }
};