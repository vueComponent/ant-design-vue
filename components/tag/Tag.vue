<script>
import Icon from '../icon'
import getTransitionProps from '../_util/getTransitionProps'
import omit from 'omit.js'

export default {
  name: 'Tag',
  props: {
    prefixCls: {
      default: 'ant-tag',
      type: String,
    },
    color: String,
    closable: Boolean,
  },
  data () {
    return {
      closed: false,
    }
  },
  computed: {
    isPresetColor () {
      const isPresetColor = (color) => {
        if (!color) { return false }
        return /^(pink|red|yellow|orange|cyan|green|blue|purple)(-inverse)?$/.test(color)
      }
      return isPresetColor(this.color)
    },
    classes () {
      const { prefixCls, color, isPresetColor } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${color}`]: isPresetColor,
        [`${prefixCls}-has-color`]: (color && !isPresetColor),
      }
    },
    tagStyle () {
      const { color, isPresetColor } = this
      return {
        backgroundColor: (color && !isPresetColor) ? color : null,
      }
    },
  },
  methods: {
    animationEnd () {
      this.$emit('afterClose')
    },
    close (e) {
      this.$emit('close', e)
      if (e.defaultPrevented) {
        return
      }
      this.closed = true
    },
  },
  render () {
    const { prefixCls, animationEnd, classes, tagStyle, closable, close, closed, $slots, $listeners } = this
    const transitionProps = getTransitionProps(`${prefixCls}-zoom`, {
      afterLeave: animationEnd,
    })
    // const tagProps = {
    //   on
    // }
    return (
      <transition
        {...transitionProps}
      >
        {!closed
          ? <div

            class={classes}
            style={tagStyle}
            {...{ on: omit($listeners, ['close', 'afterClose']) }}
          >
            {$slots.default}
            {closable ? <Icon type='cross' onClick={close} /> : null}
          </div> : null
        }
      </transition>
    )
  },
}
</script>
