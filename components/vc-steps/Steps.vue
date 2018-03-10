<script>
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import debounce from 'lodash/debounce'
import isFlexSupported from '../_util/isFlexSupported'
import {
  getOptionProps,
  filterEmpty,
  getEvents,
  getClass,
  getStyle,
  getValueByProp,
  getPropsData,
  getComponentFromProp,
} from '../_util/props-util'
import Step from './Step'

export default {
  name: 'Steps',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('rc-steps'),
    iconPrefix: PropTypes.string.def('rc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    children: PropTypes.any,
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]).def(false),
    current: PropTypes.number.def(0),
  },
  data () {
    this.calcStepOffsetWidth = debounce(this.calcStepOffsetWidth, 150)
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0,
    }
  },
  mounted () {
    this.calcStepOffsetWidth()
    if (!isFlexSupported()) {
      this.setState({
        flexSupported: false,
      })
    }
  },
  updated () {
    this.calcStepOffsetWidth()
  },
  beforeDestroy () {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout)
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel()
    }
  },
  methods: {
    calcStepOffsetWidth () {
      if (isFlexSupported()) {
        return
      }
      // Just for IE9
      const domNode = this.$refs.vcStepsRef
      if (domNode.children.length > 0) {
        if (this.calcTimeout) {
          clearTimeout(this.calcTimeout)
        }
        this.calcTimeout = setTimeout(() => {
        // +1 for fit edge bug of digit width, like 35.4px
          const lastStepOffsetWidth = (domNode.lastChild.offsetWidth || 0) + 1
          // Reduce shake bug
          if (this.lastStepOffsetWidth === lastStepOffsetWidth ||
            Math.abs(this.lastStepOffsetWidth - lastStepOffsetWidth) <= 3) {
            return
          }
          this.setState({ lastStepOffsetWidth })
        })
      }
    },
  },
  render () {
    const {
      prefixCls, direction,
      labelPlacement, iconPrefix, status, size, current, progressDot,
      ...restProps
    } = getOptionProps(this)
    const { lastStepOffsetWidth, flexSupported } = this
    const filteredChildren = filterEmpty(this.$slots.default)
    const lastIndex = filteredChildren.length - 1
    const adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement
    const classString = {
      [prefixCls]: true,
      [`${prefixCls}-${direction}`]: true,
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-label-${adjustedlabelPlacement}`]: direction === 'horizontal',
      [`${prefixCls}-dot`]: !!progressDot,
    }
    const stepsProps = {
      attrs: {
        ...restProps,
      },
      class: classString,
      ref: 'vcStepsRef',
      on: this.$listeners,
    }
    return (
      <div {...stepsProps}>
        {
          filteredChildren.map((child, index) => {
            const childProps = getPropsData(child)
            let className = getClass(child)
            // fix tail color
            if (status === 'error' && index === current - 1) {
              className += ` ${prefixCls}-next-error`
            }
            let stepStatus = getValueByProp(child, 'status')
            if (!stepStatus) {
              if (index === current) {
                stepStatus = status
              } else if (index < current) {
                stepStatus = 'finish'
              } else {
                stepStatus = 'wait'
              }
            }
            const stepStyle = getStyle(child)
            if (!flexSupported && direction !== 'vertical' && index !== lastIndex) {
              stepStyle.width = `${100 / lastIndex}%`
              stepStyle.marginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1)
            }
            const stepProps = {
              props: {
                ...childProps,
                stepNumber: `${index + 1}`,
                prefixCls,
                iconPrefix,
                progressDot,
                status: stepStatus,
              },
              on: getEvents(child),
              class: className,
              style: stepStyle,
            }
            return (
              <Step {...stepProps}>
                <template slot='icon'>{getComponentFromProp(child, 'icon')}</template>
                <template slot='description'>{getComponentFromProp(child, 'description')}</template>
                <template slot='title'>{getComponentFromProp(child, 'title')}</template>
              </Step>
            )
          })
        }
      </div>
    )
  },
}
</script>
