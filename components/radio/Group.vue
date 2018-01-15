<script>
import Radio from './Radio.vue'
export default {
  name: 'RadioGroup',
  props: {
    prefixCls: {
      default: 'ant-radio-group',
      type: String,
    },
    defaultValue: {
      default: undefined,
      type: [String, Number],
    },
    value: {
      default: undefined,
      type: [String, Number],
    },
    size: {
      default: 'default',
      validator (value) {
        return ['large', 'default', 'small'].includes(value)
      },
    },
    options: {
      default: () => [],
      type: Array,
    },
    disabled: Boolean,
    name: String,
  },
  data () {
    const { value, defaultValue } = this
    return {
      stateValue: value || defaultValue,
    }
  },
  model: {
    prop: 'value',
  },
  provide () {
    return {
      radioGroupContext: this,
    }
  },
  computed: {
    radioOptions () {
      const { disabled } = this
      return this.options.map(option => {
        return typeof option === 'string'
          ? { label: option, value: option }
          : { ...option, disabled: option.disabled === undefined ? disabled : option.disabled }
      })
    },
    classes () {
      const { prefixCls, size } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${size}`]: size,
      }
    },
  },
  methods: {
    handleChange (event) {
      const target = event.target
      const { value: targetValue } = target
      if (this.value === undefined) {
        this.stateValue = targetValue
      }
      this.$emit('input', targetValue)
      this.$emit('change', event)
    },
  },
  watch: {
    value (val) {
      this.stateValue = val
    },
  },
  render () {
    const { radioOptions, classes, $slots, name } = this
    return (
      <div class={classes}>
        {radioOptions.map(({ value, disabled, label }) =>
          <Radio key={value} value={value} disabled={disabled} name={name}>{label}</Radio>)}
        { radioOptions.length === 0 && ($slots.default || []).filter(c => c.tag || c.text.trim() !== '')}
      </div>
    )
  },
}
</script>
