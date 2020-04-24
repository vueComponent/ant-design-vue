<script>
/* eslint-disable no-console */
export default {
  mounted() {
    console.log(this.$scopedSlots, this.$slots.default);
  },
  render() {
    // return <div><h1>{this.$scopedSlots.default({ age: 25 })}</h1>{this.$scopedSlots.name('bao')}</div>;
    return (
      <div>
        {(this.$scopedSlots.deafult && this.$scopedSlots.default()) || []}
        {(this.$scopedSlots.deafult && this.$scopedSlots.default()) || [][0]}
      </div>
    );
  },
};
</script>

<style></style>
