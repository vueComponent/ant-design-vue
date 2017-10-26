<template>
  <div>
    <div v-if="showMask" :class="maskClasses"></div>
    <transition name="vc-fade">
      <div v-show="visible" :class="classes">
        <slot></slot>
        <h1>{{visible}}</h1>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    prefixCls: {
      default: 'vc-dialog',
      type: String,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    showMask: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
    }
  },
  computed: {
    maskClasses () {
      const { prefixCls } = this
      return [
        {
          [`${prefixCls}-mask`]: true,
        },
      ]
    },
    classes () {
      const { prefixCls } = this
      return [
        {
          [`${prefixCls}-wrap`]: true,
        },
      ]
    },
  },
  created () {

  },
  mounted () {
    document.body.appendChild(this.$el)
  },
}
</script>
