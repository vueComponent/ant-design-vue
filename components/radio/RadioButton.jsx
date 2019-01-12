import Radio from './Radio';
import { getOptionProps } from '../_util/props-util';

export default {
  name: 'ARadioButton',
  props: {
    ...Radio.props,
    prefixCls: {
      default: 'ant-radio-button',
      type: String,
    },
  },
  inject: {
    radioGroupContext: { default: undefined },
  },
  render() {
    const props = getOptionProps(this);
    const radioProps = { props, on: { ...this.$listeners } };
    if (this.radioGroupContext) {
      radioProps.on.change = this.radioGroupContext.onRadioChange;
      radioProps.props.checked = props.value === this.radioGroupContext.stateValue;
      radioProps.props.disabled = props.disabled || this.radioGroupContext.disabled;
    }
    return <Radio {...radioProps}>{this.$slots.default}</Radio>;
  },
};
