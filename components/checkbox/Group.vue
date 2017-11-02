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
  },
  model: {
    prop: 'value',
  },
  data () {
    const { value, defaultValue } = this
    return {
      stateValue: value || defaultValue,
    }
  },
  computed: {
    checkedStatus () {
      return new Set(this.stateValue)
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
      const { value: targetValue, checked } = target
      const { stateValue, value } = this
      let newVal = []
      if (checked) {
        newVal = [...stateValue, targetValue]
      } else {
        newVal = [...stateValue]
        const index = newVal.indexOf(targetValue)
        index >= 0 && newVal.splice(index, 1)
      }
      newVal = [...new Set(newVal)]
      if (value === undefined) {
        this.stateValue = newVal
      }
      this.$emit('input', newVal)
      this.$emit('change', newVal)
    },
    setChildCheckbox (children = []) {
      const { options, $slots, checkedStatus } = this
      if (options.length === 0 && $slots.default) {
        children.forEach(({ componentOptions = {}, children: newChildren }) => {
          const { Ctor, propsData } = componentOptions
          if (Ctor && Ctor.options.name === 'Checkbox') {
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
      this.stateValue = val
      this.setChildCheckbox(this.$slots.default)
    },
  },
  components: {
    Checkbox,
  },
}
</script>
