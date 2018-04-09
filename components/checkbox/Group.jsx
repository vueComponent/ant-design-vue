
import Checkbox from './Checkbox'
import hasProp from '../_util/props-util'
export default {
  name: 'ACheckboxGroup',
  props: {
    prefixCls: {
      default: 'ant-checkbox-group',
      type: String,
    },
    defaultValue: {
      default: () => [],
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
  model: {
    prop: 'value',
  },
  provide () {
    return {
      checkboxGroupContext: this,
    }
  },
  data () {
    const { value, defaultValue } = this
    return {
      sValue: value || defaultValue,
    }
  },
  methods: {
    handleChange (event) {
      const target = event.target
      const { value: targetValue, checked } = target
      const { sValue } = this
      let newVal = []
      if (checked) {
        newVal = [...sValue, targetValue]
      } else {
        newVal = [...sValue]
        const index = newVal.indexOf(targetValue)
        index >= 0 && newVal.splice(index, 1)
      }
      newVal = [...new Set(newVal)]
      if (!hasProp(this, 'value')) {
        this.sValue = newVal
      }
      this.$emit('input', newVal)
      this.$emit('change', newVal)
    },
    getOptions () {
      const { options } = this.$props
      return options.map(option => {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option,
          }
        }
        return option
      })
    },
    toggleOption (option) {
      const optionIndex = this.sValue.indexOf(option.value)
      const value = [...this.sValue]
      if (optionIndex === -1) {
        value.push(option.value)
      } else {
        value.splice(optionIndex, 1)
      }
      if (!hasProp(this, 'value')) {
        this.sValue = value
      }
      this.$emit('input', value)
      this.$emit('change', value)
    },
  },
  render () {
    const { $props: props, $data: state, $slots } = this
    const { prefixCls, options } = props
    let children = $slots.default
    if (options && options.length > 0) {
      children = this.getOptions().map(option => (
        <Checkbox
          key={option.value}
          disabled={'disabled' in option ? option.disabled : props.disabled}
          value={option.value}
          checked={state.sValue.indexOf(option.value) !== -1}
          onChange={() => this.toggleOption(option)}
          class={`${prefixCls}-item`}
        >
          {option.label}
        </Checkbox>
      ))
    }
    return (
      <div class={prefixCls}>
        {children}
      </div>
    )
  },
  watch: {
    value (val) {
      this.sValue = val
    },
  },
}

