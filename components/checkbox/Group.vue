<template>
  <div :class="`${prefixCls}`">
    <Checkbox v-for="item in checkOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
      {{item.label}}
    </Checkbox>
    <slot v-if="checkOptions.length === 0"></slot>
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
      stateValue: value || defaultValue,
    }
  },
  computed: {
    checkedStatus () {
      return new Set(this.stateValue)
    },
    checkOptions () {
      const { disabled } = this
      return this.options.map(option => {
        return typeof option === 'string'
          ? { label: option, value: option }
          : { ...option, disabled: option.disabled === undefined ? disabled : option.disabled }
      })
    },
  },
  methods: {
    handleChange (event) {
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
  },
  mounted () {
  },
  watch: {
    value (val) {
      this.stateValue = val
    },
  },
  components: {
    Checkbox,
  },
}
</script>
