import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from 'classnames';
import { getOptionProps, getAttrs } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

function noop() {}

export default {
  name: 'ARadio',
  model: {
    prop: 'checked',
  },
  props: {
    prefixCls: PropTypes.string,
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
    configProvider: { default: () => ConfigConsumerProps },
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
    onChange(e) {
      this.$emit('change', e);
      if (this.radioGroupContext && this.radioGroupContext.onRadioChange) {
        this.radioGroupContext.onRadioChange(e);
      }
    },
  },

  render() {
    const { $slots, $listeners, radioGroupContext: radioGroup } = this;
    const props = getOptionProps(this);
    const children = $slots.default;
    const { mouseenter = noop, mouseleave = noop, ...restListeners } = $listeners;
    const { prefixCls: customizePrefixCls, ...restProps } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

    const radioProps = {
      props: { ...restProps, prefixCls },
      on: restListeners,
      attrs: getAttrs(this),
    };

    if (radioGroup) {
      radioProps.props.name = radioGroup.name;
      radioProps.on.change = this.onChange;
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
