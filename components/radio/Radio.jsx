import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from 'classnames';
import { getOptionProps, getAttrs } from '../_util/props-util';

function noop() {}

export default {
  name: 'ARadio',
  model: {
    prop: 'checked',
  },
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    autoFocus: Boolean,
    type: PropTypes.string.def('radio'),
  },
  inject: {
    radioGroupContext: { default: undefined },
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
    const { $slots, $listeners, radioGroupContext: radioGroup } = this;
    const props = getOptionProps(this);
    const children = $slots.default;
    const { mouseenter = noop, mouseleave = noop, ...restListeners } = $listeners;
    const { prefixCls, ...restProps } = props;
    const radioProps = {
      props: { ...restProps, prefixCls },
      on: restListeners,
      attrs: getAttrs(this),
    };

    if (radioGroup) {
      radioProps.props.name = radioGroup.name;
      radioProps.on.change = radioGroup.onRadioChange;
      radioProps.props.checked = props.value === radioGroup.stateValue;
      radioProps.props.disabled = props.disabled || radioGroup.disabled;
    } else {
      radioProps.on.change = this.handleChange;
    }
    const wrapperClassString = classNames({
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: radioProps.props.checked,
      [`${prefixCls}-wrapper-disabled`]: radioProps.props.disabled,
    });

    return (
      <label class={wrapperClassString} onMouseenter={mouseenter} onMouseleave={mouseleave}>
        <VcCheckbox {...radioProps} ref="vcCheckbox" />
        {children !== undefined ? <span>{children}</span> : null}
      </label>
    );
  },
};
