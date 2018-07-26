'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _Checkbox = require('./Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACheckboxGroup',
  props: {
    prefixCls: {
      'default': 'ant-checkbox-group',
      type: String
    },
    defaultValue: {
      'default': function _default() {
        return [];
      },
      type: Array
    },
    value: {
      'default': undefined,
      type: Array
    },
    options: {
      'default': function _default() {
        return [];
      },
      type: Array
    },
    disabled: Boolean
  },
  model: {
    prop: 'value'
  },
  provide: function provide() {
    return {
      checkboxGroupContext: this
    };
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue;

    return {
      sValue: value || defaultValue
    };
  },

  methods: {
    handleChange: function handleChange(event) {
      var target = event.target;
      var targetValue = target.value,
          checked = target.checked;
      var sValue = this.sValue;

      var newVal = [];
      if (checked) {
        newVal = [].concat((0, _toConsumableArray3['default'])(sValue), [targetValue]);
      } else {
        newVal = [].concat((0, _toConsumableArray3['default'])(sValue));
        var index = newVal.indexOf(targetValue);
        index >= 0 && newVal.splice(index, 1);
      }
      newVal = [].concat((0, _toConsumableArray3['default'])(new Set(newVal)));
      if (!(0, _propsUtil2['default'])(this, 'value')) {
        this.sValue = newVal;
      }
      this.$emit('input', newVal);
      this.$emit('change', newVal);
    },
    getOptions: function getOptions() {
      var options = this.$props.options;

      return options.map(function (option) {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option
          };
        }
        return option;
      });
    },
    toggleOption: function toggleOption(option) {
      var optionIndex = this.sValue.indexOf(option.value);
      var value = [].concat((0, _toConsumableArray3['default'])(this.sValue));
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (!(0, _propsUtil2['default'])(this, 'value')) {
        this.sValue = value;
      }
      this.$emit('input', value);
      this.$emit('change', value);
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var props = this.$props,
        state = this.$data,
        $slots = this.$slots;
    var prefixCls = props.prefixCls,
        options = props.options;

    var children = $slots['default'];
    if (options && options.length > 0) {
      children = this.getOptions().map(function (option) {
        return h(
          _Checkbox2['default'],
          {
            key: option.value,
            attrs: { disabled: 'disabled' in option ? option.disabled : props.disabled,
              value: option.value,
              checked: state.sValue.indexOf(option.value) !== -1
            },
            on: {
              'change': function change() {
                return _this.toggleOption(option);
              }
            },

            'class': prefixCls + '-item'
          },
          [option.label]
        );
      });
    }
    return h(
      'div',
      { 'class': prefixCls },
      [children]
    );
  },

  watch: {
    value: function value(val) {
      this.sValue = val;
    }
  }
};
module.exports = exports['default'];