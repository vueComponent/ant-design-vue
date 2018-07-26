import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import omit from 'omit.js';
import inputProps from './inputProps';
import calculateNodeHeight from './calculateNodeHeight';
import hasProp from '../_util/props-util';

function onNextFrame(cb) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 1);
}

function clearNextFrameAction(nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId);
  } else {
    window.clearTimeout(nextFrameId);
  }
}
function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export default {
  name: 'ATextarea',
  props: _extends({}, inputProps, {
    autosize: [Object, Boolean]
  }),
  model: {
    prop: 'value',
    event: 'change.value'
  },
  data: function data() {
    var _$props = this.$props,
        value = _$props.value,
        defaultValue = _$props.defaultValue;

    return {
      stateValue: fixControlledValue(!hasProp(this, 'value') ? defaultValue : value),
      nextFrameActionId: undefined,
      textareaStyles: {}
    };
  },

  computed: {},
  watch: {
    value: function value(val) {
      this.stateValue = fixControlledValue(val);
      if (this.nextFrameActionId) {
        clearNextFrameAction(this.nextFrameActionId);
      }
      this.nextFrameActionId = onNextFrame(this.resizeTextarea);
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.resizeTextarea();
      if (_this.autoFocus) {
        _this.focus();
      }
    });
  },

  methods: {
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    resizeTextarea: function resizeTextarea() {
      var autosize = this.$props.autosize;

      if (!autosize || !this.$refs.textArea) {
        return;
      }
      var minRows = autosize ? autosize.minRows : null;
      var maxRows = autosize ? autosize.maxRows : null;
      var textareaStyles = calculateNodeHeight(this.$refs.textArea, false, minRows, maxRows);
      this.textareaStyles = textareaStyles;
    },
    getTextAreaClassName: function getTextAreaClassName() {
      var _ref;

      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          disabled = _$props2.disabled;

      return _ref = {}, _defineProperty(_ref, prefixCls, true), _defineProperty(_ref, prefixCls + '-disabled', disabled), _ref;
    },
    handleTextareaChange: function handleTextareaChange(e) {
      var _this2 = this;

      if (!hasProp(this, 'value')) {
        this.stateValue = e.target.value;
        this.$nextTick(function () {
          _this2.resizeTextarea();
        });
      } else {
        this.$forceUpdate();
        this.$emit('change.value', e.target.value);
        this.$emit('change', e);
      }
      this.$emit('input', e);
    },
    focus: function focus() {
      this.$refs.textArea.focus();
    },
    blur: function blur() {
      this.$refs.textArea.blur();
    }
  },
  render: function render() {
    var h = arguments[0];
    var stateValue = this.stateValue,
        getTextAreaClassName = this.getTextAreaClassName,
        handleKeyDown = this.handleKeyDown,
        handleTextareaChange = this.handleTextareaChange,
        textareaStyles = this.textareaStyles,
        $attrs = this.$attrs,
        $listeners = this.$listeners;

    var otherProps = omit(this.$props, ['prefixCls', 'autosize', 'type']);
    var textareaProps = {
      attrs: _extends({}, otherProps, $attrs),
      on: _extends({}, $listeners, {
        keydown: handleKeyDown,
        input: handleTextareaChange
      })
    };
    return h('textarea', _mergeJSXProps([textareaProps, {
      domProps: {
        'value': stateValue
      },

      'class': getTextAreaClassName(),
      style: textareaStyles,
      ref: 'textArea'
    }]));
  }
};