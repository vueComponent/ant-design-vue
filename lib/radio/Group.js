'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ARadioGroup',
  props: {
    prefixCls: {
      'default': 'ant-radio-group',
      type: String
    },
    defaultValue: _vueTypes2['default'].any,
    value: _vueTypes2['default'].any,
    size: {
      'default': 'default',
      validator: function validator(value) {
        return ['large', 'default', 'small'].includes(value);
      }
    },
    options: {
      'default': function _default() {
        return [];
      },
      type: Array
    },
    disabled: Boolean,
    name: String
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue;

    return {
      stateValue: value || defaultValue
    };
  },

  model: {
    prop: 'value'
  },
  provide: function provide() {
    return {
      radioGroupContext: this
    };
  },

  computed: {
    radioOptions: function radioOptions() {
      var disabled = this.disabled;

      return this.options.map(function (option) {
        return typeof option === 'string' ? { label: option, value: option } : (0, _extends3['default'])({}, option, { disabled: option.disabled === undefined ? disabled : option.disabled });
      });
    },
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + size, size), _ref;
    }
  },
  methods: {
    handleChange: function handleChange(event) {
      var target = event.target;
      var targetValue = target.value;

      if (this.value === undefined) {
        this.stateValue = targetValue;
      }
      this.$emit('input', targetValue);
      this.$emit('change', event);
    },
    onMouseEnter: function onMouseEnter(e) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.$emit('mouseleave', e);
    }
  },
  watch: {
    value: function value(val) {
      this.stateValue = val;
    }
  },
  render: function render() {
    var h = arguments[0];
    var radioOptions = this.radioOptions,
        classes = this.classes,
        $slots = this.$slots,
        name = this.name,
        onMouseEnter = this.onMouseEnter,
        onMouseLeave = this.onMouseLeave;

    return h(
      'div',
      {
        'class': classes,
        on: {
          'mouseenter': onMouseEnter,
          'mouseleave': onMouseLeave
        }
      },
      [radioOptions.map(function (_ref2) {
        var value = _ref2.value,
            disabled = _ref2.disabled,
            label = _ref2.label;
        return h(
          _Radio2['default'],
          { key: value, attrs: { value: value, disabled: disabled, name: name }
          },
          [label]
        );
      }), radioOptions.length === 0 && ($slots['default'] || []).filter(function (c) {
        return c.tag || c.text.trim() !== '';
      })]
    );
  }
};
module.exports = exports['default'];