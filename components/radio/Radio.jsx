import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from '../_util/classNames';
import { getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

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
    autofocus: Boolean,
    type: PropTypes.string.def('radio'),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    'onUpdate:checked': PropTypes.func,
    'onUpdate:value': PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
      radioGroupContext: inject('radioGroupContext', null),
    };
  },
  methods: {
    focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur() {
      this.$refs.vcCheckbox.blur();
    },
    handleChange(event) {
      const targetChecked = event.target.checked;
      this.$emit('update:checked', targetChecked);
      this.$emit('update:value', targetChecked);
      this.$emit('change', event);
    },
    onChange2(e) {
      this.$emit('change', e);
      if (this.radioGroupContext && this.radioGroupContext.onRadioChange) {
        this.radioGroupContext.onRadioChange(e);
      }
    },
  },

  render() {
    const { $slots, radioGroupContext: radioGroup } = this;
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, ...restProps } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

    const radioProps = {
      prefixCls,
      ...restProps,
    };

    if (radioGroup) {
      radioProps.name = radioGroup.name;
      radioProps.onChange = this.onChange2;
      radioProps.checked = props.value === radioGroup.stateValue;
      radioProps.disabled = props.disabled || radioGroup.disabled;
    } else {
      radioProps.onChange = this.handleChange;
    }
    const wrapperClassString = classNames({
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: radioProps.checked,
      [`${prefixCls}-wrapper-disabled`]: radioProps.disabled,
    });

    return (
      <label class={wrapperClassString}>
        <VcCheckbox {...radioProps} ref="vcCheckbox" />
        {$slots.default && <span>{$slots.default()}</span>}
      </label>
    );
  },
};
