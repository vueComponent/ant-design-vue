import type { PropType } from 'vue';
import { defineComponent, inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import Checkbox from './Checkbox';
import hasProp, { getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import type { VueNode } from '../_util/type';
import { useInjectFormItemContext } from '../form/FormItemContext';

export type CheckboxValueType = string | number | boolean;
export interface CheckboxOptionType {
  label: VueNode;
  value: CheckboxValueType;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (e: Event) => void;
}
function noop() {}
export default defineComponent({
  name: 'ACheckboxGroup',
  props: {
    name: PropTypes.string,
    prefixCls: PropTypes.string,
    defaultValue: { type: Array as PropType<Array<CheckboxValueType>> },
    value: { type: Array as PropType<Array<CheckboxValueType>> },
    options: { type: Array as PropType<Array<CheckboxOptionType | string>> },
    disabled: PropTypes.looseBool,
    onChange: PropTypes.func,
    id: PropTypes.string,
  },
  emits: ['change', 'update:value'],
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      formItemContext,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
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
  created() {
    provide('checkboxGroupContext', this);
  },
  methods: {
    getOptions() {
      const { options = [], $slots } = this;
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
    cancelValue(value: CheckboxValueType) {
      this.registeredValues = this.registeredValues.filter(val => val !== value);
    },

    registerValue(value: CheckboxValueType) {
      this.registeredValues = [...this.registeredValues, value];
    },
    toggleOption(option: CheckboxOptionType) {
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
      this.formItemContext.onFieldChange();
    },
  },
  render() {
    const { $props: props, $data: state } = this;
    const { prefixCls: customizePrefixCls, options, id = this.formItemContext.id.value } = props;
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
    return (
      <div class={groupPrefixCls} id={id}>
        {children}
      </div>
    );
  },
});
