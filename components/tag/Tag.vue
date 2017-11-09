<template>
  <transition
    :name="`${prefixCls}-zoom`"
    appear
    @after-leave="animationEnd"
  >
    <div
      v-if="!closed"
      :class="classes"
      :style="tagStyle"
    >
      <span :class="`${prefixCls}-text`">
        <slot></slot>
      </span>
      <Icon v-if="closable" type="cross" @click="close" />
    </div>
  </transition>
</template>
<script>
import Icon from '../icon'

export default {
  name: 'Tag',
  components: { Icon },
  props: {
    prefixCls: {
      default: 'ant-tag',
      type: String,
    },
    color: String,
    closable: Boolean,
    styles: {
      default: () => ({}),
      type: Object,
    },
  },
  data () {
    const isPresetColor = (color) => {
      if (!color) { return false }
      return /^(pink|red|yellow|orange|cyan|green|blue|purple)(-inverse)?$/.test(color)
    }
    return {
      closed: false,
      isPresetColor: isPresetColor(this.color),
    }
  },
  computed: {
    classes () {
      const { prefixCls, color, isPresetColor } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${color}`]: isPresetColor,
        [`${prefixCls}-has-color`]: (color && !isPresetColor),
      }
    },
    tagStyle () {
      const { color, styles, isPresetColor } = this
      return {
        backgroundColor: (color && !isPresetColor) ? color : null,
        ...styles,
      }
    },
  },
  methods: {
    animationEnd () {
      this.$emit('after-close')
    },
    close (e) {
      this.$emit('close', e)
      if (e.defaultPrevented) {
        return
      }
      this.closed = true
    },
  },
}
</script>
