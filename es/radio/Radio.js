import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import hasProp from '../_util/props-util';
export default {
  name: 'ARadio',
  props: {
    prefixCls: {
      'default': 'ant-radio',
      type: String
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, 'default': undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    autoFocus: Boolean
  },
  model: {
    prop: 'checked'
  },
  inject: {
    radioGroupContext: { 'default': undefined }
  },
  data: function data() {
    var radioGroupContext = this.radioGroupContext,
        checked = this.checked,
        defaultChecked = this.defaultChecked,
        value = this.value;

    var stateChecked = void 0;
    if (radioGroupContext && radioGroupContext.stateValue !== undefined) {
      stateChecked = radioGroupContext.stateValue === value;
    }
    return {
      stateChecked: stateChecked === undefined ? !hasProp(this, 'checked') ? defaultChecked : checked : stateChecked
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.$refs.input.focus();
      }
    });
  },

  methods: {
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      var name = this.name,
          value = this.value,
          radioGroupContext = this.radioGroupContext;

      if (!hasProp(this, 'checked') && !radioGroupContext || radioGroupContext && radioGroupContext.value === undefined) {
        this.stateChecked = targetChecked;
      }
      var target = {
        name: name,
        value: value,
        checked: targetChecked
      };
      if (this.radioGroupContext) {
        this.radioGroupContext.handleChange({ target: target });
      } else {
        this.$emit('change', {
          target: target,
          stopPropagation: function stopPropagation() {
            event.stopPropagation();
          },
          preventDefault: function preventDefault() {
            event.preventDefault();
          }
        });
      }
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
    },
    onMouseEnter: function onMouseEnter(e) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.$emit('mouseleave', e);
    }
  },
  watch: {
    checked: function checked(val) {
      this.stateChecked = val;
    },

    'radioGroupContext.stateValue': function radioGroupContextStateValue(stateValue) {
      this.stateChecked = stateValue === this.value;
    }
  },
  render: function render() {
    var _wrapperClassString, _checkboxClass;

    var h = arguments[0];
    var id = this.id,
        prefixCls = this.prefixCls,
        stateChecked = this.stateChecked,
        handleChange = this.handleChange,
        $slots = this.$slots,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        onMouseEnter = this.onMouseEnter,
        onMouseLeave = this.onMouseLeave,
        radioGroupContext = this.radioGroupContext;
    var name = this.name,
        disabled = this.disabled;

    if (radioGroupContext) {
      name = radioGroupContext.name;
      disabled = disabled || radioGroupContext.disabled;
    }
    var wrapperClassString = (_wrapperClassString = {}, _defineProperty(_wrapperClassString, prefixCls + '-wrapper', true), _defineProperty(_wrapperClassString, prefixCls + '-wrapper-checked', stateChecked), _defineProperty(_wrapperClassString, prefixCls + '-wrapper-disabled', disabled), _wrapperClassString);
    var checkboxClass = (_checkboxClass = {}, _defineProperty(_checkboxClass, '' + prefixCls, true), _defineProperty(_checkboxClass, prefixCls + '-checked', stateChecked), _defineProperty(_checkboxClass, prefixCls + '-disabled', disabled), _checkboxClass);

    return h(
      'label',
      {
        'class': wrapperClassString,
        on: {
          'mouseenter': onMouseEnter,
          'mouseleave': onMouseLeave
        }
      },
      [h(
        'span',
        { 'class': checkboxClass },
        [h('input', {
          attrs: { name: name, type: 'radio', disabled: disabled,
            id: id },
          'class': prefixCls + '-input', domProps: {
            'checked': stateChecked
          },
          on: {
            'change': handleChange,
            'focus': onFocus,
            'blur': onBlur
          },
          ref: 'input'
        }), h('span', { 'class': prefixCls + '-inner' })]
      ), $slots['default'] ? h('span', [$slots['default']]) : null]
    );
  }
};