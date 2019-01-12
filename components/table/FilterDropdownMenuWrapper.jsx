export default {
  methods: {
    handelClick(e) {
      this.$emit('click', e);
    },
  },
  render() {
    const { $slots, handelClick } = this;
    return <div onClick={handelClick}>{$slots.default}</div>;
  },
};
