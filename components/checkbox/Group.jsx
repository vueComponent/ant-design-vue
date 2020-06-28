import { inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import Checkbox from './Checkbox';
import hasProp, { getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

function noop() {}
export default {
  name: 'ACheckboxGroup',
  props: {
    name: PropTypes.string,
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    options: PropTypes.array.def([]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
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
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  created() {
    provide('checkboxGroupContext', this);
  },
  methods: {
    getOptions() {
      const { options, $slots } = this;
      return options.map(option => {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option,
          };
        }
        let label = option.label;
        if (label === undefined && $slots.label) {
          label = $slots.label(option);
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
      // this.$emit('input', val);
      this.$emit('update:value', val);
      this.$emit('change', val);
    },
  },
  render() {
    const { $props: props, $data: state } = this;
    const { prefixCls: customizePrefixCls, options } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
    let children = getSlot(this);
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
