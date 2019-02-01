import Checkbox from './Checkbox';
import hasProp from '../_util/props-util';
function noop() {}
export default {
  name: 'ACheckboxGroup',
  model: {
    prop: 'value',
  },
  props: {
    prefixCls: {
      default: 'ant-checkbox',
      type: String,
    },
    defaultValue: {
      default: undefined,
      type: Array,
    },
    value: {
      default: undefined,
      type: Array,
    },
    options: {
      default: () => [],
      type: Array,
    },
    disabled: Boolean,
  },
  provide() {
    return {
      checkboxGroupContext: this,
    };
  },
  data() {
    const { value, defaultValue } = this;
    return {
      sValue: value || defaultValue || [],
    };
  },
  watch: {
    value(val) {
      this.sValue = val;
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
    const { prefixCls, options } = props;
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
