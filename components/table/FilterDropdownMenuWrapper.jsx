// export default {
//   name: 'FilterDropdownMenuWrapper',
//   methods: {
//     handelClick(e) {
//       e.stopPropagation();
//       //this.$emit('click', e);
//     },
//   },
//   render() {
//     const { $slots, handelClick } = this;
//     return <div onClick={handelClick}>{$slots.default}</div>;
//   },
// };

const FilterDropdownMenuWrapper = (_, { attrs, slots }) => {
  return (
    <div class={attrs.class} onClick={e => e.stopPropagation()}>
      {slots.default?.()}
    </div>
  );
};

FilterDropdownMenuWrapper.inheritAttrs = false;

export default FilterDropdownMenuWrapper;
