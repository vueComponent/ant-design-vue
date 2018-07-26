import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import hasProp, { getClass, getStyle } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
export default {
  inheritAttrs: false,
  name: 'ACheckbox',
  props: {
    prefixCls: {
      'default': 'ant-checkbox',
      type: String
    },
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    id: String,
    indeterminate: Boolean,
    type: PropTypes.string.def('checkbox'),
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
      sChecked = !hasProp(this, 'checked') ? defaultChecked : checked;
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
      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-checked', sChecked), _defineProperty(_ref, prefixCls + '-disabled', disabled), _defineProperty(_ref, prefixCls + '-indeterminate', indeterminate), _ref;
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
      var target = _extends({}, this.$props, {
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
    var classString = classNames(getClass(this), _defineProperty({}, prefixCls + '-wrapper', true));
    return h(
      'label',
      {
        'class': classString,
        style: getStyle(this),
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