<script>
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import isCssAnimationSupported from '../_util/isCssAnimationSupported'
import animate from '../_util/css-animation'

export default {
  name: 'Spin',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('ant-spin'),
    spinning: PropTypes.bool.def(true),
    size: PropTypes.oneOf(['small', 'default', 'large']).def('default'),
    wrapperClassName: PropTypes.string.def(''),
    tip: PropTypes.string,
    delay: PropTypes.number,
  },
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
    getHasDefaultSlots () {
      return this.$slots && this.$slots.default
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
    spinning (val) {
      const { delay, stateSpinning, spinning } = this

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
      if (stateSpinning && !spinning) {
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

    if (this.getHasDefaultSlots()) {
      let animateClassName = prefixCls + '-nested-loading'
      if (wrapperClassName) {
        animateClassName += ' ' + wrapperClassName
      }
      const containerClassName = {
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: stateSpinning,
      }

      const transitionProps = {
        props: Object.assign({
          appear: true,
          css: false,
        }),
      }
      const transitionEvent = {
        enter: (el, done) => {
          animate(el, 'fade-enter', done)
        },
        leave: (el, done) => {
          animate(el, 'fade-leave', done)
        },
      }

      transitionProps.on = transitionEvent

      return (<transition
        {...transitionProps}
      >
        <div class={animateClassName}>
          {stateSpinning && <div key='loading'>{spinElement}</div>}
          <div class={containerClassName} key='container'>
            {this.$slots.default}
          </div>
        </div>
      </transition>
      )
    }
    return spinElement
  },
}
</script>
