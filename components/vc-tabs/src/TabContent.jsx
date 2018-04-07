
import {
  getTransformByIndex,
  getActiveIndex,
  getTransformPropValue,
  getMarginStyle,
} from './utils'
export default {
  name: 'TabContent',
  props: {
    animated: { type: Boolean, default: true },
    animatedWithMargin: { type: Boolean, default: true },
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    activeKey: String,
    tabBarPosition: String,
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      const { animated, prefixCls } = this
      return {
        [`${prefixCls}-content`]: true,
        [animated
          ? `${prefixCls}-content-animated`
          : `${prefixCls}-content-no-animated`]: true,
      }
    },
  },
  methods: {
  },
  render () {
    const {
      activeKey,
      tabBarPosition, animated, animatedWithMargin, classes,
    } = this
    let style = {}
    if (animated && this.$slots.default) {
      const activeIndex = getActiveIndex(this.$slots.default, activeKey)
      if (activeIndex !== -1) {
        const animatedStyle = animatedWithMargin
          ? getMarginStyle(activeIndex, tabBarPosition)
          : getTransformPropValue(getTransformByIndex(activeIndex, tabBarPosition))
        style = animatedStyle
      } else {
        style = {
          display: 'none',
        }
      }
    }
    return (
      <div
        class={classes}
        style={style}
      >
        {this.$slots.default}
      </div>
    )
  },
}

