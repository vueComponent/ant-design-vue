import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps, hasProp, initDefaultProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'Checkbox',
  mixins: [BaseMixin],
  props: initDefaultProps({
    prefixCls: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
    // onChange: PropTypes.func,
    // onClick: PropTypes.func,
    // tabIndex: PropTypes.string,
    // readOnly: PropTypes.bool,
    // autoFocus: PropTypes.bool,
    value: PropTypes.any
  }, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false
  }),
  data: function data() {
    var checked = hasProp(this, 'checked') ? this.checked : this.defaultChecked;
    return {
      sChecked: checked
    };
  },

  watch: {
    checked: function checked(val) {
      this.sChecked = val;
    }
  },
  methods: {
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    handleChange: function handleChange(e) {
      var props = getOptionProps(this);
      if (props.disabled) {
        return;
      }
      if (!('checked' in props)) {
        this.sChecked = e.target.checked;
      }

      props.onChange({
        target: _extends({}, props, {
          checked: e.target.checked
        }),
        stopPropagation: function stopPropagation() {
          e.stopPropagation();
        },
        preventDefault: function preventDefault() {
          e.preventDefault();
        },

        nativeEvent: e.nativeEvent
      });
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var prefixCls = this.prefixCls,
        name = this.name,
        id = this.id,
        type = this.type,
        disabled = this.disabled,
        readOnly = this.readOnly,
        tabIndex = this.tabIndex,
        onClick = this.onClick,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        autoFocus = this.autoFocus,
        value = this.value,
        others = _objectWithoutProperties(this, ['prefixCls', 'name', 'id', 'type', 'disabled', 'readOnly', 'tabIndex', 'onClick', 'onFocus', 'onBlur', 'autoFocus', 'value']);

    var globalProps = Object.keys(others).reduce(function (prev, key) {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    var checked = this.state.checked;

    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-checked', checked), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));

    return h(
      'span',
      { 'class': classString },
      [h('input', _mergeJSXProps([{
        attrs: {
          name: name,
          id: id,
          type: type,
          readOnly: readOnly,
          disabled: disabled,
          tabIndex: tabIndex,

          autoFocus: autoFocus
        },
        'class': prefixCls + '-input',
        domProps: {
          'checked': !!checked,
          'value': value
        },
        on: {
          'click': onClick,
          'focus': onFocus,
          'blur': onBlur,
          'change': this.handleChange
        },
        ref: this.saveInput
      }, globalProps])), h('span', { 'class': prefixCls + '-inner' })]
    );
  }
};