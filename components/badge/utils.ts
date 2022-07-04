import { PresetColorTypes, PresetStatusColorTypes } from '../_util/colors';

export function isPresetColor(color?: string): boolean {
  return (
    (PresetColorTypes as any[]).indexOf(color) !== -1 ||
    (PresetStatusColorTypes as any[]).indexOf(color) !== -1
  );
}
