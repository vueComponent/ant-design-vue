import KeyCode from '../../../_util/KeyCode';
import type { KeyboardEventHandler } from '../../../_util/EventInterface';

const onKeyDown: KeyboardEventHandler = event => {
  const { keyCode } = event;
  if (keyCode === KeyCode.ENTER) {
    event.stopPropagation();
  }
};
const FilterDropdownMenuWrapper = (_props, { slots }) => (
  <div onClick={e => e.stopPropagation()} onKeydown={onKeyDown}>
    {slots.default?.()}
  </div>
);

export default FilterDropdownMenuWrapper;
