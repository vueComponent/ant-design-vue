import PropTypes from '../_util/vue-types';
import Checkbox from './Checkbox';
import hasProp from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function noop() {}
export default {
  name: 'ACheckboxGroup',
  model: {
    prop: 'value',
  },
  props: {
    name: PropTypes.string,
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
      registeredValues: [],
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
    cancelValue(value) {
      this.registeredValues = this.registeredValues.filter(val => val !== value);
    },

    registerValue(value) {
      this.registeredValues = [...this.registeredValues, value];
    },
    toggleOption(option) {
      const { registeredValues } = this;
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
      const options = this.getOptions();
      const val = value
        .filter(val => registeredValues.indexOf(val) !== -1)
        .sort((a, b) => {
          const indexA = options.findIndex(opt => opt.value === a);
          const indexB = options.findIndex(opt => opt.value === b);
          return indexA - indexB;
        });
      this.$emit('input', val);
      this.$emit('change', val);
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
          indeterminate={option.indeterminate}
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
