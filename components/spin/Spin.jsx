
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import isCssAnimationSupported from '../_util/isCssAnimationSupported'
import { filterEmpty, initDefaultProps } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'

export const SpinProps = () => ({
  prefixCls: PropTypes.string,
  spinning: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  wrapperClassName: PropTypes.string,
  tip: PropTypes.string,
  delay: PropTypes.number,
})

export default {
  name: 'ASpin',
  mixins: [BaseMixin],
  props: initDefaultProps(SpinProps(), {
    prefixCls: 'ant-spin',
    size: 'default',
    spinning: true,
    wrapperClassName: '',
  }),
  data () {
    const { spinning } = this
    return {
      stateSpinning: spinning,
      debounceTimeout: null,
      delayTimeout: null,
      notCssAnimationSupported: false,
    }
  },
  methods: {
    getChildren () {
      if (this.$slots && this.$slots.default) {
        return filterEmpty(this.$slots.default)
      }
      return null
    },
  },
  mounted () {
    if (!isCssAnimationSupported()) {
      // Show text in IE9
      this.setState({
        notCssAnimationSupported: true,
      })
    }
  },
  beforeDestroy () {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
    }
  },
  watch: {
    spinning () {
      const { delay, spinning } = this

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
      if (!spinning) {
        this.debounceTimeout = window.setTimeout(() => this.setState({ stateSpinning: spinning }), 200)
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout)
        }
      } else {
        if (spinning && delay && !isNaN(Number(delay))) {
          if (this.delayTimeout) {
            clearTimeout(this.delayTimeout)
          }
          this.delayTimeout = window.setTimeout(() => this.setState({ stateSpinning: spinning }), delay)
        } else {
          this.setState({ stateSpinning: spinning })
        }
      }
    },
  },
  render () {
    const { size, prefixCls, tip, wrapperClassName, ...restProps } = this.$props
    const { notCssAnimationSupported, $slots, stateSpinning } = this

    const spinClassName = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning`]: stateSpinning,
      [`${prefixCls}-show-text`]: !!tip || notCssAnimationSupported,
    }
    const spinIndicator = $slots.indicator ? $slots.indicator : (
      <span class={`${prefixCls}-dot`}>
        <i />
        <i />
        <i />
        <i />
      </span>
    )

    const spinElement = (
      <div {...restProps} class={spinClassName} >
        {spinIndicator}
        {tip ? <div class={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    )
    const children = this.getChildren()
    if (children) {
      let animateClassName = prefixCls + '-nested-loading'
      if (wrapperClassName) {
        animateClassName += ' ' + wrapperClassName
      }
      const containerClassName = {
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: stateSpinning,
      }

      return (
        <transition-group
          {...getTransitionProps('fade')}
          tag='div'
          class={animateClassName}
        >
          {stateSpinning && <div key='loading'>{spinElement}</div>}
          <div class={containerClassName} key='container'>
            {children}
          </div>
        </transition-group>
      )
    }
    return spinElement
  },
}

