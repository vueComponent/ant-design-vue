import type { PanelMode, PickerMode } from '../interface';

export function useShowNow(
  picker: PickerMode,
  mode: PanelMode,
  showNow?: boolean,
  rangePicker?: boolean,
) {
  if (mode !== 'date' && mode !== 'time') {
    return false;
  }

  if (showNow !== undefined) {
    return showNow;
  }

  return !rangePicker && (picker === 'date' || picker === 'time');
}
