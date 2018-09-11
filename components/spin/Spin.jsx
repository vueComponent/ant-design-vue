
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import { filterEmpty, initDefaultProps, isValidElement, getComponentFromProp } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'
import { cloneElement } from '../_util/vnode'

export const SpinSize = PropTypes.oneOf(['small', 'default', 'large'])

export const SpinProps = () => ({
  prefixCls: PropTypes.string,
  spinning: PropTypes.bool,
  size: SpinSize,
  wrapperClassName: PropTypes.string,
  tip: PropTypes.string,
  delay: PropTypes.number,
  indicator: PropTypes.any,
})

// Render indicator
let defaultIndicator

export function setDefaultIndicator (content) {
  defaultIndicator = typeof content.indicator === 'function' ? content.indicator : (h) => {
    return <content.indicator />
  }
}

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
    }
  },
  methods: {
    getChildren () {
      if (this.$slots && this.$slots.default) {
        return filterEmpty(this.$slots.default)
      }
      return null
    },
    renderIndicator (h, props) {
      // const h = this.$createElement
      const { prefixCls } = props
      const dotClassName = `${prefixCls}-dot`
      let indicator = getComponentFromProp(this, 'indicator')
      if (Array.isArray(indicator)) {
        indicator = filterEmpty(indicator)
        indicator = indicator.length === 1 ? indicator[0] : indicator
      }
      if (isValidElement(indicator)) {
        return cloneElement(indicator, { class: dotClassName })
      }

      if (defaultIndicator && isValidElement(defaultIndicator(h))) {
        return cloneElement(defaultIndicator(h), { class: dotClassName })
      }

      return (
        <span class={`${dotClassName} ${prefixCls}-dot-spin`}>
          <i />
          <i />
          <i />
          <i />
        </span>
      )
    },
  },
  mounted () {
    this.$nextTick(() => {
      const { spinning, delay } = this
      if (spinning && delay && !isNaN(Number(delay))) {
        this.setState({ stateSpinning: false })
        this.delayTimeout = window.setTimeout(() => this.setState({ stateSpinning: spinning }), delay)
      }
    })
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
  render (h) {
    const { size, prefixCls, tip, wrapperClassName, ...restProps } = this.$props
    const { stateSpinning } = this
    const spinClassName = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning`]: stateSpinning,
      [`${prefixCls}-show-text`]: !!tip,
    }

    const spinElement = (
      <div {...restProps} class={spinClassName} >
        {this.renderIndicator(h, this.$props)}
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
          {...getTransitionProps('fade', { appear: false })}
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

