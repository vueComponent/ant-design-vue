import { useStyleRegister } from '../_util/_cssinjs';

import type {
  AliasToken,
  GenerateStyle,
  PresetColorKey,
  PresetColorType,
  SeedToken,
  UseComponentStyleResult,
} from './interface';
import { PresetColors } from './interface';
import useToken from './useToken';
import type { FullToken, GetDefaultToken } from './util/genComponentStyleHook';
import genComponentStyleHook, {
  genSubStyleComponent,
  genStyleHooks,
} from './util/genComponentStyleHook';
import genPresetColor from './util/genPresetColor';
import statisticToken, { merge as mergeToken } from './util/statistic';
import useResetIconStyle from './util/useResetIconStyle';
import calc from './util/calc';
import { getLineHeight } from './themes/shared/genFontSizes';

export { defaultConfig, DesignTokenProvider } from './context';
export {
  PresetColors,
  genComponentStyleHook,
  genSubStyleComponent,
  genPresetColor,
  genStyleHooks,
  mergeToken,
  statisticToken,
  calc,
  getLineHeight,
  // hooks
  useResetIconStyle,
  useStyleRegister,
  useToken,
};
export type {
  AliasToken,
  // FIXME: Remove this type
  AliasToken as DerivativeToken,
  FullToken,
  GenerateStyle,
  PresetColorKey,
  PresetColorType,
  SeedToken,
  UseComponentStyleResult,
  GetDefaultToken,
};
