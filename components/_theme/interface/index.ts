import type { CSSInterpolation, DerivativeFunc } from '../../_util/_cssinjs';
import type { AliasToken } from './alias';
import type { ComponentTokenMap } from './components';
import type { MapToken } from './maps';
import type { SeedToken } from './seeds';
import type { VueNode } from '../..//_util/type';
import type { Ref } from 'vue';

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;

export type OverrideToken = {
  [key in keyof ComponentTokenMap]: Partial<ComponentTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken = AliasToken & ComponentTokenMap;

export type { AliasToken } from './alias';
export type { ComponentTokenMap } from './components';
export type {
  ColorMapToken,
  ColorNeutralMapToken,
  CommonMapToken,
  FontMapToken,
  HeightMapToken,
  MapToken,
  SizeMapToken,
  StyleMapToken,
} from './maps';
export { PresetColors } from './presetColors';
export type {
  LegacyColorPalettes,
  ColorPalettes,
  PresetColorKey,
  PresetColorType,
} from './presetColors';
export type { SeedToken } from './seeds';

export type UseComponentStyleResult = [(node: VueNode) => VueNode, Ref<string>];

export type GenerateStyle<
  ComponentToken extends object = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
