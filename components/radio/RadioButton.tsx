import { defineComponent, inject } from 'vue';
import type { RadioProps } from './Radio';
import Radio, { radioProps } from './Radio';
import { getOptionProps, getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';

export default defineComponent({
  name: 'ARadioButton',
  props: {
    ...radioProps,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      radioGroupContext: inject<any>('radioGroupContext', {}),
    };
  },
  render() {
    const props = getOptionProps(this) as RadioProps;
    const { prefixCls: customizePrefixCls, ...otherProps } = props;
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    const rProps: RadioProps = {
      prefixCls,
      ...otherProps,
    };
    if (this.radioGroupContext) {
      rProps.onChange = this.radioGroupContext.onRadioChange;
      rProps.checked = props.value === this.radioGroupContext.stateValue;
      rProps.disabled = props.disabled || this.radioGroupContext.disabled;
    }
    return <Radio {...rProps}>{getSlot(this)}</Radio>;
  },
});
