const FilterDropdownMenuWrapper = (_, { attrs, slots }) => {
  return (
    <div class={attrs.class} onClick={e => e.stopPropagation()}>
      {slots.default?.()}
    </div>
  );
};

FilterDropdownMenuWrapper.inheritAttrs = false;

export default FilterDropdownMenuWrapper;
