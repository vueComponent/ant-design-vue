export default {
  name: 'SortableItem',
  mounted() {
    this.$el.classList.add(this.itemClass);
  },
  render() {
    return this.$slots.default[0];
  },
  inject: ['itemClass'],
};
