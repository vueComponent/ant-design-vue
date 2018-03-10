<script>
import PropTypes from '../_util/vue-types'
import { getOptionProps } from '../_util/props-util'

function isString (str) {
  return typeof str === 'string'
}

export default {
  name: 'Step',
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    // itemWidth: PropTypes.oneOfType([
    //   PropTypes.number,
    //   PropTypes.string,
    // ]),
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.node,
    // adjustMarginRight: PropTypes.oneOfType([
    //   PropTypes.number,
    //   PropTypes.string,
    // ]),
    stepNumber: PropTypes.string,
    description: PropTypes.any,
    title: PropTypes.any,
    progressDot: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    tailContent: PropTypes.any,
  },
  methods: {
    renderIconNode () {
      const {
        prefixCls, progressDot, stepNumber, status,
        iconPrefix,
      } = getOptionProps(this)
      const icon = this.icon || this.$slots.icon
      const title = this.title || this.$slots.title
      const description = this.description || this.$slots.description
      let iconNode
      const iconClassName = {
        [`${prefixCls}-icon`]: true,
        [`${iconPrefix}icon`]: true,
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish',
        [`${iconPrefix}icon-cross`]: !icon && status === 'error',
      }
      const iconDot = <span class={`${prefixCls}-icon-dot`}></span>
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = (
            <span class={`${prefixCls}-icon`}>
              {progressDot(iconDot, { index: stepNumber - 1, status, title, description })}
            </span>
          )
        } else {
          iconNode = <span class={`${prefixCls}-icon`}>{iconDot}</span>
        }
      } else if (icon && !isString(icon)) {
        iconNode = <span class={`${prefixCls}-icon`}>{icon}</span>
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = <span class={iconClassName} />
      } else {
        iconNode = <span class={`${prefixCls}-icon`}>{stepNumber}</span>
      }
      return iconNode
    },
  },
  render () {
    const {
      prefixCls,
      status = 'wait', icon, tailContent,
      ...restProps
    } = getOptionProps(this)

    const title = this.title || this.$slots.title
    const description = this.description || this.$slots.description

    const classString = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-${status}`]: true,
      [`${prefixCls}-item-custom`]: icon,
    }
    const stepProps = {
      props: {
        ...restProps,
      },
      class: classString,
      on: this.$listeners,
    }

    return (
      <div
        {...stepProps}
      >
        <div class={`${prefixCls}-item-tail`}>
          {tailContent}
        </div>
        <div class={`${prefixCls}-item-icon`}>
          {this.renderIconNode()}
        </div>
        <div class={`${prefixCls}-item-content`}>
          <div class={`${prefixCls}-item-title`}>
            {title}
          </div>
          {description && <div class={`${prefixCls}-item-description`}>{description}</div>}
        </div>
      </div>
    )
  },
}
</script>
