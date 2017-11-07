<template>
  <label :class="classes">
    <span :class="checkboxClass">
      <input :name="name" type="checkbox" :disabled="disabled"
        :class="`${prefixCls}-input`" :checked="stateChecked"
        @change="handleChange"
        />
      <span :class="`${prefixCls}-inner`" />
    </span>
    <span v-if="hasDefaultSlot">
      <slot></slot>
    </span>
  </label>
</template>
<script>
export default {
  name: 'Checkbox',
  props: {
    prefixCls: {
      default: 'ant-checkbox',
      type: String,
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    indeterminate: Boolean,
  },
  model: {
    prop: 'checked',
  },
  inject: {
    context: { default: undefined },
  },
  data () {
    const { context, checked, defaultChecked, value } = this
    let stateChecked
    if (context && context.checkedStatus) {
      stateChecked = context.checkedStatus.has(value)
    }
    return {
      stateChecked: stateChecked === undefined
        ? checked === undefined ? defaultChecked : checked
        : stateChecked,
    }
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    },
    classes () {
      const { prefixCls } = this
      return {
        [`${prefixCls}-wrapper`]: true,
      }
    },
    checkboxClass () {
      const { prefixCls, indeterminate, stateChecked, disabled } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: stateChecked,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-indeterminate`]: indeterminate,
      }
    },
  },
  mounted () {
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      this.$emit('input', targetChecked)
      const { name, value, checked, context, stateChecked } = this
      if ((checked === undefined && !context) || (context && context.value === undefined)) {
        this.stateChecked = targetChecked
      }
      const target = {
        name,
        value,
        checked: !stateChecked,
      }
      if (this.context) {
        this.context.handleChange({ target })
      } else {
        this.$emit('change', {
          target,
          stopPropagation () {
            event.stopPropagation()
          },
          preventDefault () {
            event.preventDefault()
          },
        })
      }
    },
  },
  watch: {
    checked (val) {
      this.stateChecked = val
    },
    'context.checkedStatus': function (checkedStatus) {
      this.stateChecked = checkedStatus.has(this.value)
    },
  },
}
</script>
