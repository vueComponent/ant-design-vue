export default {
  name: 'FilterDropdownMenuWrapper',
  methods: {
    handelClick(e) {
      e.stopPropagation();
      //this.$emit('click', e);
    },
  },
  render() {
    const { $scopedSlots, handelClick } = this;
    return <div onClick={handelClick}>{$scopedSlots.default && $scopedSlots.default()}</div>;
  },
};
