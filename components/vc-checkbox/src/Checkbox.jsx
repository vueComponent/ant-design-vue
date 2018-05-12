
import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import { getOptionProps, hasProp, initDefaultProps } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'

export default {
  name: 'Checkbox',
  mixins: [BaseMixin],
  props: initDefaultProps({
    prefixCls: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
    // onChange: PropTypes.func,
    // onClick: PropTypes.func,
    // tabIndex: PropTypes.string,
    // readOnly: PropTypes.bool,
    // autoFocus: PropTypes.bool,
    value: PropTypes.any,
  }, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false,
  }),
  data () {
    const checked = hasProp(this, 'checked') ? this.checked : this.defaultChecked
    return {
      sChecked: checked,
    }
  },
  watch: {
    checked (val) {
      this.sChecked = val
    },
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },

    handleChange (e) {
      const props = getOptionProps(this)
      if (props.disabled) {
        return
      }
      if (!('checked' in props)) {
        this.sChecked = e.target.checked
      }

      props.onChange({
        target: {
          ...props,
          checked: e.target.checked,
        },
        stopPropagation () {
          e.stopPropagation()
        },
        preventDefault () {
          e.preventDefault()
        },
        nativeEvent: e.nativeEvent,
      })
    },
  },

  render () {
    const {
      prefixCls,
      name,
      id,
      type,
      disabled,
      readOnly,
      tabIndex,
      onClick,
      onFocus,
      onBlur,
      autoFocus,
      value,
      ...others
    } = this

    const globalProps = Object.keys(others).reduce((prev, key) => {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key]
      }
      return prev
    }, {})

    const { checked } = this.state
    const classString = classNames(prefixCls, {
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
    })

    return (
      <span class={classString}>
        <input
          name={name}
          id={id}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={tabIndex}
          class={`${prefixCls}-input`}
          checked={!!checked}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={this.handleChange}
          autoFocus={autoFocus}
          ref={this.saveInput}
          value={value}
          {...globalProps}
        />
        <span class={`${prefixCls}-inner`} />
      </span>
    )
  },
}
