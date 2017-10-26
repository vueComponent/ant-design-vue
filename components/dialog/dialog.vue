<template>
  <div :class="classes">
    <slot></slot>
    <h1>{{visible}}</h1>
  </div>
</template>
<script>

export default {
  name: 'Dialog',
  props: {
    prefixCls: {
      default: 'ant-btn-dialog',
      type: String,
    },
    visible: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    console.log(this.visible)
    return {
    }
  },
  computed: {
    classes () {
      const { prefixCls } = this
      return [
        {
          [`${prefixCls}`]: true,
        },
      ]
    },
  },
}
</script>
