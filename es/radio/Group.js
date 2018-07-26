import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
export default {
  name: 'ARadioGroup',
  props: {
    prefixCls: {
      'default': 'ant-radio-group',
      type: String
    },
    defaultValue: PropTypes.any,
    value: PropTypes.any,
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
        return typeof option === 'string' ? { label: option, value: option } : _extends({}, option, { disabled: option.disabled === undefined ? disabled : option.disabled });
      });
    },
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + size, size), _ref;
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
          Radio,
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