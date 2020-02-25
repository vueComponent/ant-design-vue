import Radio from './Radio';
import { getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ARadioButton',
  props: {
    ...Radio.props,
  },
  inject: {
    radioGroupContext: { default: undefined },
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, ...otherProps } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    const radioProps = {
      props: {
        ...otherProps,
        prefixCls,
      },
      on: getListeners(this),
    };
    if (this.radioGroupContext) {
      radioProps.on.change = this.radioGroupContext.onRadioChange;
      radioProps.props.checked = this.$props.value === this.radioGroupContext.stateValue;
      radioProps.props.disabled = this.$props.disabled || this.radioGroupContext.disabled;
    }
    return <Radio {...radioProps}>{this.$slots.default}</Radio>;
  },
};
