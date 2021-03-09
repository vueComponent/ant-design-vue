import type { FunctionalComponent } from 'vue';

export interface FilterDropdownMenuWrapperProps {
  class?: string;
}

const FilterDropdownMenuWrapper: FunctionalComponent<FilterDropdownMenuWrapperProps> = (
  props,
  { slots },
) => {
  return (
    <div class={props.class} onClick={e => e.stopPropagation()}>
      {slots.default?.()}
    </div>
  );
};

FilterDropdownMenuWrapper.inheritAttrs = false;

export default FilterDropdownMenuWrapper;
