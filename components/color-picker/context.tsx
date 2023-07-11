import type { ComputedRef } from 'vue';
import { inject } from 'vue';
import type { PanelPickerProps } from './components/PanelPicker';
import type { PanelPresetsProps } from './components/PanelPresets';

export const PanelPickerContext = Symbol('PanelPickerContext');

export const usePanelPickerContext = () => {
  return inject<ComputedRef<PanelPickerProps>>(PanelPickerContext);
};

export const PanelPresetsContext = Symbol('PanelPresetsContext');

export const usePanelPresetsContext = () => {
  return inject<ComputedRef<PanelPresetsProps>>(PanelPresetsContext);
};
