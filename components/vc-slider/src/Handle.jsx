import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { getOptionProps } from '../../_util/props-util'

export default {
  name: 'Handle',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.bool,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    // handleFocus: PropTypes.func.def(noop),
    // handleBlur: PropTypes.func.def(noop),
  },
  methods: {
    focus () {
      this.$refs.handle.focus()
    },
    blur () {
      this.$refs.handle.blur()
    },
  },
  render () {
    const {
      className, vertical, offset, disabled, min, max, value, tabIndex,
    } = getOptionProps(this)

    const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` }
    const elStyle = {
      ...postionStyle,
    }
    let ariaProps = {}
    if (value !== undefined) {
      ariaProps = {
        ...ariaProps,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled,
      }
    }
    const handleProps = {
      attrs: {
        role: 'slider',
        tabIndex: disabled ? null : (tabIndex || 0),
        ...ariaProps,
      },
      class: className,
      on: this.$listeners,
      ref: 'handle',
      style: elStyle,
    }
    return (
      <div
        {...handleProps}
      />
    )
  },
}
