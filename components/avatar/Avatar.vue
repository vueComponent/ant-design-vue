<template>
  <span :class="classes">
    <img v-if="src" :src="src"/>
    <icon v-else-if="icon" :type="icon" />
    <span
      v-else
      ref="avatorChildren"
      :class="[prefixCls+'-string']"
      :style="childrenStyle">
      <slot></slot>
    </span>
  </span>
</template>
<script>
import Icon from '../icon'

export default {
  name: 'Avatar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-avatar',
    },
    shape: {
      validator: (val) => (['circle', 'square'].includes(val)),
      default: 'circle',
    },
    size: {
      validator: (val) => (['small', 'large', 'default'].includes(val)),
      default: 'default',
    },
    src: String,
    icon: String,
  },
  data () {
    this.isExistSlot = false
    this.childrenWidth = 0
    return {
      scale: 1,
    }
  },
  computed: {
    classes () {
      const { prefixCls, shape, size, src, icon } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-image`]: !!src && this.state.isImgExist,
        [`${prefixCls}-icon`]: !!icon,
        [`${prefixCls}-${shape}`]: true,
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      }
    },
    childrenStyle () {
      let style = {}
      const { scale, isExistSlot, childrenWidth } = this
      if (isExistSlot) {
        style = {
          msTransform: `scale(${scale})`,
          WebkitTransform: `scale(${scale})`,
          transform: `scale(${scale})`,
          position: 'absolute',
          display: 'inline-block',
          left: `calc(50% - ${Math.round(childrenWidth / 2)}px)`,
        }
      }
      return style
    },
  },
  methods: {
    setScale () {
      const { src, icon, $refs, $el } = this
      const children = $refs.avatorChildren
      this.isExistSlot = !src && !icon
      if (children) {
        this.childrenWidth = children.offsetWidth
        const avatarWidth = $el.getBoundingClientRect().width
        if (avatarWidth - 8 < this.childrenWidth) {
          this.scale = (avatarWidth - 8) / this.childrenWidth
        } else {
          this.scale = 1
        }
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.setScale()
    })
  },
  updated () {
    this.$nextTick(() => {
      this.setScale()
    })
  },
  components: {
    Icon,
  },
}
</script>
