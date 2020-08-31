export default {
  name: 'SortableHandle',
  mounted() {
    this.$el.classList.add(this.handleClass);
  },
  render() {
    return this.$slots.default[0];
  },
  inject: ['handleClass'],
};
