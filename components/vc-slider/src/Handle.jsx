
import classNames from 'classnames'
import PropTypes from '../../../_util/vue-types'
import addEventListener from '../../../_util/Dom/addEventListener'
import BaseMixin from '../../../_util/BaseMixin'

export default {
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
  },
  data () {
    return {
      clickFocused: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp)
    })
  },
  beforeDestroy () {
    this.$nextTick(() => {
      if (this.onMouseUpListener) {
        this.onMouseUpListener.remove()
      }
    })
  },
  methods: {
    setClickFocus (focused) {
      this.setState({ clickFocused: focused })
    },
    handleMouseUp () {
      if (document.activeElement === this.$refs.handle) {
        this.setClickFocus(true)
      }
    },
    handleBlur () {
      this.setClickFocus(false)
    },
    handleKeyDown () {
      this.setClickFocus(false)
    },
    clickFocus () {
      this.setClickFocus(true)
      this.focus()
    },
    focus () {
      this.$refs.handle.focus()
    },
    blur () {
      this.$refs.handle.blur()
    },
  },
  render () {
    const {
      prefixCls, vertical, offset, disabled, min, max, value, tabIndex, ...restProps
    } = this.$props

    const className = classNames(
      {
        [`${prefixCls}-handle-click-focused`]: this.clickFocused,
      }
    )

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

    return (
      <div
        ref='handle'
        role='slider'
        tabIndex= {disabled ? null : (tabIndex || 0)}
        {...ariaProps}
        {...restProps}
        class={className}
        style={elStyle}
        onBlur={this.handleBlur}
        onKeydown={this.handleKeyDown}
      />
    )
  },
}
