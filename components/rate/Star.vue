<template>
  <li
    :class="getClassName()"
    @click="onClick"
    @mousemove="onHover">
    <div :class="`${this.prefixCls}-first`"><slot></slot></div>
    <div :class="`${this.prefixCls}-second`"><slot></slot></div>
  </li>
</template>
<script>
export default {
  name: 'Star',
  props: {
    index: Number,
    disabled: Boolean,
    prefixCls: String,
    allowHalf: Boolean,
    value: Number,
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {

  },
  methods: {
    getClassName() {
      const { prefixCls, index, value, allowHalf } = this;
      const starValue = index;
      if (allowHalf && value + 0.5 === starValue) {
        return `${prefixCls} ${prefixCls}-half ${prefixCls}-active`;
      }
      return starValue <= value ? `${prefixCls} ${prefixCls}-full` : `${prefixCls} ${prefixCls}-zero`;
    },
    onClick(e) {
      if(this.disabled) return;
      this.$emit("onClick", e, this.index);
    },
    onHover(e) {
      if(this.disabled) return;
      this.$emit("onHover", e, this.index);
    },
  },
  watch: {
  },
  components: {
  }
}
</script>
