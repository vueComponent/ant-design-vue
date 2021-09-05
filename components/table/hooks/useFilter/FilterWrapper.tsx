const FilterDropdownMenuWrapper = (_props, { slots }) => (
  <div onClick={e => e.stopPropagation()}>{slots.default?.()}</div>
);

export default FilterDropdownMenuWrapper;
