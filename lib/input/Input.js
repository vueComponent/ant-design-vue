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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TextArea = require('./TextArea');

var _TextArea2 = _interopRequireDefault(_TextArea);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

exports['default'] = {
  inheritAttrs: false,
  name: 'AInput',
  props: (0, _extends3['default'])({}, _inputProps2['default']),
  model: {
    prop: 'value',
    event: 'change.value'
  },
  data: function data() {
    var _$props = this.$props,
        value = _$props.value,
        defaultValue = _$props.defaultValue;

    return {
      stateValue: fixControlledValue(!(0, _propsUtil.hasProp)(this, 'value') ? defaultValue : value)
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.focus();
      }
    });
  },

  watch: {
    value: function value(val) {
      this.stateValue = fixControlledValue(val);
    }
  },
  methods: {
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    handleChange: function handleChange(e) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.stateValue = e.target.value;
      } else {
        this.$forceUpdate();
      }
      this.$emit('change.value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    getInputClassName: function getInputClassName() {
      var _ref;

      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          size = _$props2.size,
          disabled = _$props2.disabled;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_ref, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_ref, prefixCls + '-disabled', disabled), _ref;
    },
    renderLabeledInput: function renderLabeledInput(children) {
      var _className, _classNames;

      var h = this.$createElement;

      var props = this.$props;
      var addonAfter = (0, _propsUtil.getComponentFromProp)(this, 'addonAfter');
      var addonBefore = (0, _propsUtil.getComponentFromProp)(this, 'addonBefore');
      // Not wrap when there is not addons
      if (!addonBefore && !addonAfter) {
        return children;
      }

      var wrapperClassName = props.prefixCls + '-group';
      var addonClassName = wrapperClassName + '-addon';
      addonBefore = addonBefore ? h(
        'span',
        { 'class': addonClassName },
        [addonBefore]
      ) : null;

      addonAfter = addonAfter ? h(
        'span',
        { 'class': addonClassName },
        [addonAfter]
      ) : null;

      var className = (_className = {}, (0, _defineProperty3['default'])(_className, props.prefixCls + '-wrapper', true), (0, _defineProperty3['default'])(_className, wrapperClassName, addonBefore || addonAfter), _className);

      var groupClassName = (0, _classnames2['default'])(props.prefixCls + '-group-wrapper', (_classNames = {}, (0, _defineProperty3['default'])(_classNames, props.prefixCls + '-group-wrapper-sm', props.size === 'small'), (0, _defineProperty3['default'])(_classNames, props.prefixCls + '-group-wrapper-lg', props.size === 'large'), _classNames));
      if (addonBefore || addonAfter) {
        return h(
          'span',
          {
            'class': groupClassName,
            style: (0, _propsUtil.getStyle)(this)
          },
          [h(
            'span',
            { 'class': className },
            [addonBefore, children, addonAfter]
          )]
        );
      }
      return h(
        'span',
        { 'class': className },
        [addonBefore, children, addonAfter]
      );
    },
    renderLabeledIcon: function renderLabeledIcon(children) {
      var _classNames2;

      var h = this.$createElement;
      var _$props3 = this.$props,
          prefixCls = _$props3.prefixCls,
          size = _$props3.size;

      var prefix = (0, _propsUtil.getComponentFromProp)(this, 'prefix');
      var suffix = (0, _propsUtil.getComponentFromProp)(this, 'suffix');
      if (!prefix && !suffix) {
        return children;
      }

      prefix = prefix ? h(
        'span',
        { 'class': prefixCls + '-prefix' },
        [prefix]
      ) : null;

      suffix = suffix ? h(
        'span',
        { 'class': prefixCls + '-suffix' },
        [suffix]
      ) : null;
      var affixWrapperCls = (0, _classnames2['default'])((0, _propsUtil.getClass)(this), prefixCls + '-affix-wrapper', (_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-affix-wrapper-sm', size === 'small'), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-affix-wrapper-lg', size === 'large'), _classNames2));
      return h(
        'span',
        {
          'class': affixWrapperCls,
          style: (0, _propsUtil.getStyle)(this)
        },
        [prefix, children, suffix]
      );
    },
    renderInput: function renderInput() {
      var h = this.$createElement;

      var otherProps = (0, _omit2['default'])(this.$props, ['prefixCls', 'addonBefore', 'addonAfter', 'prefix', 'suffix']);
      var stateValue = this.stateValue,
          getInputClassName = this.getInputClassName,
          handleKeyDown = this.handleKeyDown,
          handleChange = this.handleChange,
          $listeners = this.$listeners;

      var inputProps = {
        domProps: {
          value: stateValue
        },
        attrs: (0, _extends3['default'])({}, otherProps, this.$attrs),
        on: (0, _extends3['default'])({}, $listeners, {
          keydown: handleKeyDown,
          input: handleChange
        }),
        'class': (0, _classnames2['default'])(getInputClassName(), (0, _propsUtil.getClass)(this)),
        ref: 'input'
      };
      return this.renderLabeledIcon(h('input', inputProps));
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.$props.type === 'textarea') {
      var $listeners = this.$listeners;

      var textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: (0, _extends3['default'])({}, $listeners, {
          change: this.handleChange,
          keydown: this.handleKeyDown
        })
      };
      return h(_TextArea2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([textareaProps, { ref: 'input' }]));
    }
    return this.renderLabeledInput(this.renderInput());
  }
};
module.exports = exports['default'];