import PropTypes from '../_util/vue-types';
import Checkbox from './Checkbox';
import hasProp from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

function noop() {}
export default {
  name: 'ACheckboxGroup',
  model: {
    prop: 'value',
  },
  props: {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    options: PropTypes.array.def([]),
    disabled: PropTypes.bool,
  },
  provide() {
    return {
      checkboxGroupContext: this,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const { value, defaultValue } = this;
    return {
      sValue: value || defaultValue || [],
    };
  },
  watch: {
    value(val) {
      this.sValue = val || [];
    },
  },
  methods: {
    getOptions() {
      const { options, $scopedSlots } = this;
      return options.map(option => {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option,
          };
        }
        let label = option.label;
        if (label === undefined && $scopedSlots.label) {
          label = $scopedSlots.label(option);
        }
        return { ...option, label };
      });
    },
    toggleOption(option) {
      const optionIndex = this.sValue.indexOf(option.value);
      const value = [...this.sValue];
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (!hasProp(this, 'value')) {
        this.sValue = value;
      }
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
  render() {
    const { $props: props, $data: state, $slots } = this;
    const { prefixCls: customizePrefixCls, options } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('checkbox', customizePrefixCls);

    let children = $slots.default;
    const groupPrefixCls = `${prefixCls}-group`;
    if (options && options.length > 0) {
      children = this.getOptions().map(option => (
        <Checkbox
          prefixCls={prefixCls}
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : props.disabled}
          value={option.value}
          checked={state.sValue.indexOf(option.value) !== -1}
          onChange={option.onChange || noop}
          class={`${groupPrefixCls}-item`}
        >
          {option.label}
        </Checkbox>
      ));
    }
    return <div class={groupPrefixCls}>{children}</div>;
  },
};
