<template>
  <li
    :class="classes"
    @click="handleClick"
    @keyPress="handleKeyPress"
    :title="showTitle ? 'page' : null">
    <a>{{page}}</a>
  </li>
</template>
<script>
export default {
  name: 'Page',
  props: {
    rootPrefixCls: String,
    page: Number,
    active: Boolean,
    showTitle: Boolean,
  },
  data () {
    return {}
  },
  computed: {
    classes () {
      const prefixCls = `${this.rootPrefixCls}-item`
      let cls = `${prefixCls} ${prefixCls}-${this.page}`
      if (this.active) {
        cls = `${cls} ${prefixCls}-active`
      }
      if (this.className) {
        cls = `${cls} ${this.className}`
      }
      return cls
    },
  },
  methods: {
    handleClick () {
      this.$emit('click', this.page)
    },
    handleKeyPress (event) {
      this.$emit('keyPress', event, this.handleClick, this.page)
    },
  },
}
</script>
