'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  inheritAttrs: false,
  name: 'ACheckbox',
  props: {
    prefixCls: {
      'default': 'ant-checkbox',
      type: String
    },
    defaultChecked: _vueTypes2['default'].bool,
    checked: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    id: String,
    indeterminate: Boolean,
    type: _vueTypes2['default'].string.def('checkbox'),
    autoFocus: Boolean
  },
  model: {
    prop: 'checked'
  },
  inject: {
    checkboxGroupContext: { 'default': null }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.$refs.input.focus();
      }
    });
  },
  data: function data() {
    var checkboxGroupContext = this.checkboxGroupContext,
        checked = this.checked,
        defaultChecked = this.defaultChecked,
        value = this.value;

    var sChecked = void 0;
    if (checkboxGroupContext) {
      sChecked = checkboxGroupContext.sValue.indexOf(value) !== -1;
    } else {
      sChecked = !(0, _propsUtil2['default'])(this, 'checked') ? defaultChecked : checked;
    }
    return {
      sChecked: sChecked
    };
  },

  computed: {
    checkboxClass: function checkboxClass() {
      var _ref;

      var prefixCls = this.prefixCls,
          indeterminate = this.indeterminate,
          sChecked = this.sChecked,
          $props = this.$props,
          checkboxGroupContext = this.checkboxGroupContext;

      var disabled = $props.disabled;
      if (checkboxGroupContext) {
        disabled = disabled || checkboxGroupContext.disabled;
      }
      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-checked', sChecked), (0, _defineProperty3['default'])(_ref, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_ref, prefixCls + '-indeterminate', indeterminate), _ref;
    }
  },
  methods: {
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      var checked = this.checked,
          checkboxGroupContext = this.checkboxGroupContext;

      if (checked === undefined && !checkboxGroupContext || checkboxGroupContext && checkboxGroupContext.sValue === undefined) {
        this.sChecked = targetChecked;
      }
      var target = (0, _extends3['default'])({}, this.$props, {
        checked: targetChecked
      });
      this.$emit('change', {
        target: target,
        stopPropagation: function stopPropagation() {
          event.stopPropagation();
        },
        preventDefault: function preventDefault() {
          event.preventDefault();
        }
      });
    },
    onMouseEnter: function onMouseEnter(e) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.$emit('mouseleave', e);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    onFocus: function onFocus(e) {
      this.$emit('focus', e);
    },
    onBlur: function onBlur(e) {
      this.$emit('blur', e);
    }
  },
  watch: {
    checked: function checked(val) {
      this.sChecked = val;
    },

    'checkboxGroupContext.sValue': function checkboxGroupContextSValue(val) {
      this.sChecked = val.indexOf(this.value) !== -1;
    }
  },
  render: function render() {
    var h = arguments[0];
    var props = this.$props,
        checkboxGroupContext = this.checkboxGroupContext,
        checkboxClass = this.checkboxClass,
        name = this.name,
        $slots = this.$slots,
        sChecked = this.sChecked,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        id = this.id;
    var prefixCls = props.prefixCls;

    var disabled = props.disabled;
    var onChange = this.handleChange;
    if (checkboxGroupContext) {
      onChange = function onChange() {
        return checkboxGroupContext.toggleOption({ value: props.value });
      };
      disabled = props.disabled || checkboxGroupContext.disabled;
    }
    var classString = (0, _classnames2['default'])((0, _propsUtil.getClass)(this), (0, _defineProperty3['default'])({}, prefixCls + '-wrapper', true));
    return h(
      'label',
      {
        'class': classString,
        style: (0, _propsUtil.getStyle)(this),
        on: {
          'mouseenter': this.onMouseEnter,
          'mouseleave': this.onMouseLeave
        }
      },
      [h(
        'span',
        { 'class': checkboxClass },
        [h('input', {
          attrs: { name: name, type: 'checkbox', disabled: disabled,
            id: id
          },
          'class': prefixCls + '-input', domProps: {
            'checked': sChecked
          },
          on: {
            'change': onChange,
            'focus': onFocus,
            'blur': onBlur
          },
          ref: 'input' }), h('span', { 'class': prefixCls + '-inner' })]
      ), $slots['default'] ? h('span', [$slots['default']]) : null]
    );
  }
};
module.exports = exports['default'];