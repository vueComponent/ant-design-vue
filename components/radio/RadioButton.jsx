import { inject } from 'vue';
import Radio from './Radio';
import { getOptionProps, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ARadioButton',
  props: {
    ...Radio.props,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
      radioGroupContext: inject('radioGroupContext', {}),
    };
  },
  render() {
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, ...otherProps } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    const radioProps = {
      prefixCls,
      ...otherProps,
    };
    if (this.radioGroupContext) {
      radioProps.onChange = this.radioGroupContext.onRadioChange;
      radioProps.checked = props.value === this.radioGroupContext.stateValue;
      radioProps.disabled = props.disabled || this.radioGroupContext.disabled;
    }
    return <Radio {...radioProps}>{getSlot(this)}</Radio>;
  },
};
