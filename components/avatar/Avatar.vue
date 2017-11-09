<template>
  <span :class="classes" :style="style">
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
import Icon from '../icon/index'

export default {
  name: 'Avatar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-avatar',
    },
    shape: {
      validator (val) {
        return ['circle', 'square'].includes(val)
      },
      default: 'circle',
    },
    size: {
      validator (val) {
        return ['small', 'large', 'default'].includes(val)
      },
      default: 'default',
    },
    src: String,
    icon: String,
    style: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      isExitSlot: false,
      scale: 1,
    }
  },
  computed: {
    classes () {
      const { prefixCls, shape, size, src, icon } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${shape}`]: true,
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-image`]: !!src,
        [`${prefixCls}-icon`]: !!icon,
      }
    },
    childrenStyle () {
      const children = this.$refs.avatorChildren
      let style = {}
      if (this.isExitSlot) {
        style = {
          msTransform: `scale(${this.scale})`,
          WebkitTransform: `scale(${this.scale})`,
          transform: `scale(${this.scale})`,
          position: 'absolute',
          display: 'inline-block',
          left: `calc(50% - ${Math.round(children.offsetWidth / 2)}px)`,
        }
      }
      return style
    },
  },
  methods: {
    setScale () {
      this.isExitSlot = !this.src && !this.icon
      const children = this.$refs.avatorChildren
      if (children) {
        const childrenWidth = children.offsetWidth
        const avatarWidth = this.$el.getBoundingClientRect().width
        if (avatarWidth - 8 < childrenWidth) {
          this.scale = (avatarWidth - 8) / childrenWidth
        } else {
          this.scale = 1
        }
      }
    },
  },
  mounted () {
    this.setScale()
  },
  updated () {
    this.setScale()
  },
  components: {
    Icon,
  },
}
</script>
