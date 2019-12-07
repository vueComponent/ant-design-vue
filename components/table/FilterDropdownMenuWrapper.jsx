export default {
  methods: {
    handelClick(e) {
      e.stopPropagation();
      //this.$emit('click', e);
    },
  },
  render() {
    const { $slots, handelClick } = this;
    return <div onClick={handelClick}>{$slots.default}</div>;
  },
};
