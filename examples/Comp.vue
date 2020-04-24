<script>
/* eslint-disable no-console */
export default {
  mounted() {
    console.log(this.$scopedSlots, this.$slots);
  },
  render() {
    // return <div><h1>{this.$scopedSlots.default({ age: 25 })}</h1>{this.$scopedSlots.name('bao')}</div>;
    return (
      <div>
        {Object.keys(this.$scopedSlots).map(name => {
          console.log(name);
          return this.$scopedSlots[name] && this.$scopedSlots[name]();
        })}
      </div>
    );
  },
};
</script>

<style></style>
