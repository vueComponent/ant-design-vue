<script>
export default {
  props: {
    transitionProps: Object,
  },
  render () {
    return (
      <transition
        {...this.transitionProps}
      >
        {this.$slots.default}
      </transition>
    )
  },
}
</script>
