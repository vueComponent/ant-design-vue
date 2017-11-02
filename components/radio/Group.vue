<template>
  <div :class="`${prefixCls}`">
    <Radio v-for="item in options" :key="item.value" :checked="item.value === stateValue"
      :value="item.value" :disabled="item.disabled" @change="handleChange">{{item.label}}</Radio>
    <slot v-if="options.length === 0"></slot>
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
  computed: {

  },
  created () {
    this.setChildRadio(this.$slots.default)
  },
  methods: {
    handleChange (event) {
      if (this.disabled) {
        return false
      }
      const target = event.target
      const { value: targetValue } = target
      if (this.value === undefined) {
        this.stateValue = targetValue
      }
      this.$emit('input', targetValue)
      this.$emit('change', targetValue)
    },
    setChildRadio (children = []) {
      const { options, $slots, stateValue } = this
      if (options.length === 0 && $slots.default) {
        children.forEach(({ componentOptions = {}, children: newChildren }) => {
          const { Ctor, propsData } = componentOptions
          if (Ctor && Ctor.options.name === 'Radio') {
            propsData.isGroup = true
            propsData.onGroupChange = this.handleChange
            propsData.checked = propsData.value === stateValue
          } else {
            this.setChildRadio(newChildren)
          }
        }, this)
      }
    },
  },
  beforeUpdate () {
    this.setChildRadio(this.$slots.default)
  },
  watch: {
    value (val) {
      this.stateValue = val
      this.setChildRadio(this.$slots.default)
    },
  },
  components: {
    Radio,
  },
}
</script>
