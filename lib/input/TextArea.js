'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _calculateNodeHeight = require('./calculateNodeHeight');

var _calculateNodeHeight2 = _interopRequireDefault(_calculateNodeHeight);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

exports['default'] = {
  name: 'ATextarea',
  props: (0, _extends3['default'])({}, _inputProps2['default'], {
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
      stateValue: fixControlledValue(!(0, _propsUtil2['default'])(this, 'value') ? defaultValue : value),
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
      var textareaStyles = (0, _calculateNodeHeight2['default'])(this.$refs.textArea, false, minRows, maxRows);
      this.textareaStyles = textareaStyles;
    },
    getTextAreaClassName: function getTextAreaClassName() {
      var _ref;

      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          disabled = _$props2.disabled;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-disabled', disabled), _ref;
    },
    handleTextareaChange: function handleTextareaChange(e) {
      var _this2 = this;

      if (!(0, _propsUtil2['default'])(this, 'value')) {
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

    var otherProps = (0, _omit2['default'])(this.$props, ['prefixCls', 'autosize', 'type']);
    var textareaProps = {
      attrs: (0, _extends3['default'])({}, otherProps, $attrs),
      on: (0, _extends3['default'])({}, $listeners, {
        keydown: handleKeyDown,
        input: handleTextareaChange
      })
    };
    return h('textarea', (0, _babelHelperVueJsxMergeProps2['default'])([textareaProps, {
      domProps: {
        'value': stateValue
      },

      'class': getTextAreaClassName(),
      style: textareaStyles,
      ref: 'textArea'
    }]));
  }
};
module.exports = exports['default'];