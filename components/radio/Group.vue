<template>
  <div :class="classes">
    <Radio v-for="item in radioOptions" :key="item.value"
      :value="item.value" :disabled="item.disabled" :name="name">{{item.label}}</Radio>
    <slot v-if="radioOptions.length === 0"></slot>
  </div>
</template>
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
  components: {
    Radio,
  },
}
</script>
