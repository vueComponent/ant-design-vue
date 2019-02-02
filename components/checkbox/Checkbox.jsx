import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import VcCheckbox from '../vc-checkbox';
import { getOptionProps, getAttrs } from '../_util/props-util';
function noop() {}

export default {
  name: 'ACheckbox',
  inheritAttrs: false,
  model: {
    prop: 'checked',
  },
  props: {
    prefixCls: {
      default: 'ant-checkbox',
      type: String,
    },
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    indeterminate: Boolean,
    type: PropTypes.string.def('checkbox'),
    autoFocus: Boolean,
  },
  inject: {
    checkboxGroupContext: { default: () => null },
  },
  methods: {
    handleChange(event) {
      const targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur() {
      this.$refs.vcCheckbox.blur();
    },
  },

  render() {
    const { checkboxGroupContext: checkboxGroup, $listeners, $slots } = this;
    const props = getOptionProps(this);
    const children = $slots.default;
    const { mouseenter = noop, mouseleave = noop, ...restListeners } = $listeners;
    const { prefixCls, indeterminate, ...restProps } = props;
    const checkboxProps = {
      props: { ...restProps, prefixCls },
      on: restListeners,
      attrs: getAttrs(this),
    };
    if (checkboxGroup) {
      checkboxProps.on.change = (...args) => {
        this.$emit('change', ...args);
        checkboxGroup.toggleOption({ label: children, value: props.value });
      };
      checkboxProps.props.checked = checkboxGroup.sValue.indexOf(props.value) !== -1;
      checkboxProps.props.disabled = props.disabled || checkboxGroup.disabled;
    } else {
      checkboxProps.on.change = this.handleChange;
    }
    const classString = classNames({
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: checkboxProps.props.checked,
      [`${prefixCls}-wrapper-disabled`]: checkboxProps.props.disabled,
    });
    const checkboxClass = classNames({
      [`${prefixCls}-indeterminate`]: indeterminate,
    });
    return (
      <label class={classString} onMouseenter={mouseenter} onMouseleave={mouseleave}>
        <VcCheckbox {...checkboxProps} class={checkboxClass} ref="vcCheckbox" />
        {children !== undefined && <span>{children}</span>}
      </label>
    );
  },
};
