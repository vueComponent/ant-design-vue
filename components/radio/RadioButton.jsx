import Radio from './Radio';
import { getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ARadioButton',
  props: {
    ...Radio.props,
    prefixCls: {
      type: String,
    },
  },
  inject: {
    radioGroupContext: { default: undefined },
    configProvider: { default: () => ({}) },
  },
  render() {
    const {prefixCls: customizePrefixCls, ...otherProps} = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls || ConfigConsumerProps.getPrefixCls;
    const prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    const radioProps = { props: {
      ...otherProps,
      prefixCls,
    }, on: { ...this.$listeners } };
    if (this.radioGroupContext) {
      radioProps.on.change = this.radioGroupContext.onRadioChange;
      radioProps.props.checked = props.value === this.radioGroupContext.stateValue;
      radioProps.props.disabled = props.disabled || this.radioGroupContext.disabled;
    }
    return <Radio {...radioProps}>{this.$slots.default}</Radio>;
  },
};
