<template>
  <span>
    <span class={`${prefixCls}-inner`}>
      <component></component>
    </span>
  </span>
</template>
<script>
export default {
  name: 'Radio',
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    onGroupChange: Function,
  },
  model: {
    prop: 'checked',
  },
  data () {
    const { checked, defaultChecked } = this
    return {
      stateChecked: checked === undefined ? defaultChecked : checked,
    }
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    },
    classes () {
      const { prefixCls, disabled, stateChecked } = this
      return {
        [`${prefixCls}-wrapper`]: true,
        [`${prefixCls}-wrapper-checked`]: stateChecked,
        [`${prefixCls}-wrapper-disabled`]: disabled,
      }
    },
    checkboxClass () {
      const { prefixCls, disabled, stateChecked } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: stateChecked,
        [`${prefixCls}-disabled`]: disabled,
      }
    },
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      const { name, value, checked } = this
      if (checked === undefined) {
        this.stateChecked = targetChecked
      }
      this.$emit('input', targetChecked)
      const target = {
        name,
        value,
        checked: targetChecked,
      }
      this.$emit('change', {
        target,
        stopPropagation () {
          event.stopPropagation()
        },
        preventDefault () {
          event.preventDefault()
        },
      })
      if (this.isGroup) {
        this.onGroupChange({ target })
      }
    },
  },
  watch: {
    checked (val) {
      this.stateChecked = val
    },
  },
}
</script>
