<template>
  <div :class="`${prefixCls}`">
    <Checkbox v-for="item in options" :key="item.value" :checked="checkedStatus.has(item.value)"
      :value="item.value" :disabled="item.disabled" @change="handleChange">{{item.label}}</Checkbox>
    <slot v-if="options.length === 0"></slot>
  </div>
</template>
<script>
import Checkbox from './Checkbox.vue'
export default {
  name: 'CheckboxGroup',
  props: {
    prefixCls: {
      default: 'ant-checkbox-group',
      type: String,
    },
    value: {
      default: () => [],
      type: Array,
    },
    options: {
      default: () => [],
      type: Array,
    },
  },
  model: {
    prop: 'value',
  },
  computed: {
    checkedStatus () {
      return new Set(this.value)
    },
  },
  created () {
    this.setChildCheckbox(this.$slots.default)
  },
  methods: {
    handleChange (event) {
      if (this.disabled) {
        return false
      }
      const target = event.target
      const { value, checked } = target
      let newVal = []
      if (checked) {
        newVal = [...this.value, value]
      } else {
        newVal = [...this.value]
        const index = newVal.indexOf(value)
        index >= 0 && newVal.splice(index, 1)
      }
      this.$emit('input', [...new Set(newVal)])
      this.$emit('change', [...new Set(newVal)])
    },
    setChildCheckbox (children = []) {
      const { options, $slots, checkedStatus } = this
      if (options.length === 0 && $slots.default) {
        children.forEach(({ componentOptions = {}, children: newChildren }) => {
          const { tag, propsData } = componentOptions
          if (tag === 'Checkbox') {
            propsData.isGroup = true
            propsData.onGroupChange = this.handleChange
            propsData.checked = checkedStatus.has(propsData.value)
          } else {
            this.setChildCheckbox(newChildren)
          }
        }, this)
      }
    },
  },
  mounted () {
  },
  beforeUpdate () {
    this.setChildCheckbox(this.$slots.default)
  },
  watch: {
    value (val) {
      this.setChildCheckbox(this.$slots.default)
    },
  },
  components: {
    Checkbox,
  },
}
</script>
