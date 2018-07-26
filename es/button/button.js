import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import Icon from '../icon';
var rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
var isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
import buttonTypes from './buttonTypes';
var props = buttonTypes();
export default {
  name: 'AButton',
  __ANT_BUTTON: true,
  props: _extends({}, props),
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      },
      clicked: false,
      sLoading: !!this.loading,
      hasTwoCNChar: false
    };
  },
  mounted: function mounted() {
    this.fixTwoCNChar();
  },
  updated: function updated() {
    this.fixTwoCNChar();
  },

  watch: {
    loading: function loading(val) {
      var _this = this;

      clearTimeout(this.delayTimeout);
      if (typeof val !== 'boolean' && val && val.delay) {
        this.delayTimeout = setTimeout(function () {
          _this.sLoading = !!val;
        }, val.delay);
      } else {
        this.sLoading = !!val;
      }
    }
  },
  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          type = this.type,
          shape = this.shape,
          size = this.size,
          hasTwoCNChar = this.hasTwoCNChar,
          sLoading = this.sLoading,
          ghost = this.ghost,
          clicked = this.clicked,
          sizeMap = this.sizeMap;

      var sizeCls = sizeMap[size] || '';
      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + type, type), _defineProperty(_ref, prefixCls + '-' + shape, shape), _defineProperty(_ref, prefixCls + '-' + sizeCls, sizeCls), _defineProperty(_ref, prefixCls + '-loading', sLoading), _defineProperty(_ref, prefixCls + '-clicked', clicked), _defineProperty(_ref, prefixCls + '-background-ghost', ghost || type === 'ghost'), _defineProperty(_ref, prefixCls + '-two-chinese-chars', hasTwoCNChar), _ref;
    },
    iconType: function iconType() {
      var sLoading = this.sLoading,
          icon = this.icon;

      return sLoading ? 'loading' : icon;
    }
  },
  methods: {
    fixTwoCNChar: function fixTwoCNChar() {
      // Fix for HOC usage like <FormatMessage />
      var node = this.$el;
      var buttonText = node.textContent || node.innerText;
      if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
        if (!this.hasTwoCNChar) {
          this.hasTwoCNChar = true;
        }
      } else if (this.hasTwoCNChar) {
        this.hasTwoCNChar = false;
      }
    },
    handleClick: function handleClick(event) {
      var _this2 = this;

      this.clicked = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        return _this2.clicked = false;
      }, 500);
      this.$emit('click', event);
    },
    insertSpace: function insertSpace(child, needInserted) {
      var h = this.$createElement;

      var SPACE = needInserted ? ' ' : '';
      if (typeof child.text === 'string') {
        var text = child.text.trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return h('span', [text]);
      }
      return child;
    },
    isNeedInserted: function isNeedInserted() {
      var loading = this.loading,
          icon = this.icon,
          $slots = this.$slots;

      var iconType = loading ? 'loading' : icon;
      return $slots['default'] && $slots['default'].length === 1 && (!iconType || iconType === 'loading');
    }
  },
  render: function render() {
    var h = arguments[0];
    var htmlType = this.htmlType,
        classes = this.classes,
        disabled = this.disabled,
        handleClick = this.handleClick,
        iconType = this.iconType,
        $slots = this.$slots,
        $attrs = this.$attrs,
        $listeners = this.$listeners;

    var buttonProps = {
      props: {},
      attrs: _extends({}, $attrs, {
        type: htmlType,
        disabled: disabled
      }),
      'class': classes,
      on: _extends({}, $listeners, {
        click: handleClick
      })
    };
    var kids = $slots['default'] && $slots['default'].length === 1 ? this.insertSpace($slots['default'][0], this.isNeedInserted()) : $slots['default'];
    return h(
      'button',
      buttonProps,
      [iconType ? h(Icon, {
        attrs: { type: iconType }
      }) : null, kids]
    );
  },
  beforeDestroy: function beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }
};