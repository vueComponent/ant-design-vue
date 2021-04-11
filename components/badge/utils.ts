import { PresetColorTypes } from '../_util/colors';

export function isPresetColor(color?: string): boolean {
  return (PresetColorTypes as string[]).indexOf(color) !== -1;
}
