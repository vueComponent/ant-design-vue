<template>
  <div :class="`${prefixCls}`">
    <Radio v-for="item in options" :key="item.value" :checked="item.value === value"
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
    value: [String, Number],
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
    return {
      curValue: this.value,
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
      const { value } = target
      this.$emit('input', value)
      this.$emit('change', value)
    },
    setChildRadio (children = []) {
      const { options, $slots, value } = this
      if (options.length === 0 && $slots.default) {
        children.forEach(({ componentOptions = {}, children: newChildren }) => {
          const { tag, propsData } = componentOptions
          if (tag === 'Radio') {
            propsData.isGroup = true
            propsData.onGroupChange = this.handleChange
            propsData.checked = propsData.value === value
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
      this.setChildRadio(this.$slots.default)
    },
  },
  components: {
    Radio,
  },
}
</script>
