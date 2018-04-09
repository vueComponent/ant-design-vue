import PropTypes from '../_util/vue-types'
import hasProp from '../_util/props-util'
export default {
  name: 'ARadio',
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
  },
  model: {
    prop: 'checked',
  },
  inject: {
    radioGroupContext: { default: undefined },
  },
  data () {
    const { radioGroupContext, checked, defaultChecked, value } = this
    let stateChecked
    if (radioGroupContext && radioGroupContext.stateValue !== undefined) {
      stateChecked = radioGroupContext.stateValue === value
    }
    return {
      stateChecked: stateChecked === undefined
        ? !hasProp(this, 'checked') ? defaultChecked : checked
        : stateChecked,
    }
  },
  computed: {
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
      this.$emit('input', targetChecked)
      const { name, value, radioGroupContext, stateChecked } = this
      if ((!hasProp(this, 'checked') && !radioGroupContext) || (radioGroupContext && radioGroupContext.value === undefined)) {
        this.stateChecked = targetChecked
      }
      const target = {
        name,
        value,
        checked: !stateChecked,
      }
      if (this.radioGroupContext) {
        this.radioGroupContext.handleChange({ target })
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
    'radioGroupContext.stateValue': function (stateValue) {
      this.stateChecked = stateValue === this.value
    },
  },
  render () {
    const { classes, checkboxClass, disabled, prefixCls, stateChecked, handleChange, name, $slots } = this
    return (
      <label class={classes}>
        <span class={checkboxClass}>
          <input name={name} type='radio' disabled={disabled}
            class={`${prefixCls}-input`} checked={stateChecked}
            onChange={handleChange}
          />
          <span class={`${prefixCls}-inner`} />
        </span>
        {$slots.default ? <span>
          {$slots.default}
        </span> : null}
      </label>
    )
  },
}

