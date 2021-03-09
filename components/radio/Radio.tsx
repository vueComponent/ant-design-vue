import type { ExtractPropTypes } from 'vue';
import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from '../_util/classNames';
import { getOptionProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import type { RadioChangeEvent } from './interface';

export const radioProps = {
  prefixCls: PropTypes.string,
  defaultChecked: PropTypes.looseBool,
  checked: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  isGroup: PropTypes.looseBool,
  value: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
  autofocus: PropTypes.looseBool,
  type: PropTypes.string.def('radio'),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export type RadioProps = Partial<ExtractPropTypes<typeof radioProps>>;

export default defineComponent({
  name: 'ARadio',
  props: radioProps,
  emits: ['update:checked', 'update:value', 'change', 'blur', 'focus'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      radioGroupContext: inject('radioGroupContext', null),
    };
  },
  methods: {
    focus() {
      (this.$refs.vcCheckbox as HTMLInputElement).focus();
    },
    blur() {
      (this.$refs.vcCheckbox as HTMLInputElement).blur();
    },
    handleChange(event: RadioChangeEvent) {
      const targetChecked = event.target.checked;
      this.$emit('update:checked', targetChecked);
      this.$emit('update:value', targetChecked);
      this.$emit('change', event);
    },
    onChange2(e: RadioChangeEvent) {
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
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

    const rProps: RadioProps = {
      prefixCls,
      ...restProps,
    };

    if (radioGroup) {
      rProps.name = radioGroup.name;
      rProps.onChange = this.onChange2;
      rProps.checked = props.value === radioGroup.stateValue;
      rProps.disabled = props.disabled || radioGroup.disabled;
    } else {
      rProps.onChange = this.handleChange;
    }
    const wrapperClassString = classNames({
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: rProps.checked,
      [`${prefixCls}-wrapper-disabled`]: rProps.disabled,
    });

    return (
      <label class={wrapperClassString}>
        <VcCheckbox {...rProps} ref="vcCheckbox" />
        {$slots.default && <span>{$slots.default()}</span>}
      </label>
    );
  },
});
