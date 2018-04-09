
import hasProp from '../_util/props-util'
export default {
  name: 'ACheckbox',
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
    checkboxGroupContext: { default: null },
  },
  data () {
    const { checkboxGroupContext, checked, defaultChecked, value } = this
    let sChecked
    if (checkboxGroupContext) {
      sChecked = checkboxGroupContext.sValue.indexOf(value) !== -1
    } else {
      sChecked = !hasProp(this, 'checked') ? defaultChecked : checked
    }
    return {
      sChecked,
    }
  },
  computed: {
    checkboxClass () {
      const { prefixCls, indeterminate, sChecked, $props, checkboxGroupContext } = this
      let disabled = $props.disabled
      if (checkboxGroupContext) {
        disabled = disabled || checkboxGroupContext.disabled
      }
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: sChecked,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-indeterminate`]: indeterminate,
      }
    },
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      this.$emit('input', targetChecked)
      const { name, value, checked, checkboxGroupContext, sChecked } = this
      if ((checked === undefined && !checkboxGroupContext) || (checkboxGroupContext && checkboxGroupContext.sValue === undefined)) {
        this.sChecked = targetChecked
      }
      const target = {
        name,
        value,
        checked: !sChecked,
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
    },
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
  },
  watch: {
    checked (val) {
      this.sChecked = val
    },
    'checkboxGroupContext.sValue': function (val) {
      this.sChecked = val.indexOf(this.value) !== -1
    },
  },
  render () {
    const { $props: props, checkboxGroupContext, checkboxClass, name, $slots, sChecked } = this
    const {
      prefixCls,
    } = props
    let disabled = props.disabled
    let onChange = this.handleChange
    if (checkboxGroupContext) {
      onChange = () => checkboxGroupContext.toggleOption({ value: props.value })
      disabled = props.disabled || checkboxGroupContext.disabled
    }
    return (
      <label
        class={`${prefixCls}-wrapper`}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        <span class={checkboxClass}>
          <input name={name} type='checkbox' disabled={disabled}
            class={`${prefixCls}-input`} checked={sChecked}
            onChange={onChange} ref='input'
          />
          <span class={`${prefixCls}-inner`} />
        </span>
        {$slots.default ? <span>{$slots.default}</span> : null}
      </label>
    )
  },
}

