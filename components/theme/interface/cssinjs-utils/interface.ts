import type { CSSInterpolation, TokenType } from '../../../_util/cssinjs';
import type { StyleInfo, TokenWithCommonCls } from '../../util/genComponentStyleHook';

/** Override the some definition of the @ant-design/cssinjs-utils https://github.com/ant-design/cssinjs-utils */
export type TokenMap = Record<PropertyKey, any>;

export type TokenMapKey<CompTokenMap extends TokenMap> = Extract<keyof CompTokenMap, string>;

export type GlobalToken<CompTokenMap extends TokenMap, AliasToken extends TokenType> = AliasToken &
  CompTokenMap;

export type OverrideTokenMap<CompTokenMap extends TokenMap, AliasToken extends TokenType> = {
  [key in keyof CompTokenMap]: Partial<CompTokenMap[key]> & Partial<AliasToken>;
};

export type GlobalTokenWithComponent<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = GlobalToken<CompTokenMap, AliasToken> & CompTokenMap[C];

export type ComponentToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = Exclude<OverrideTokenMap<CompTokenMap, AliasToken>[C], undefined>;

export type ComponentTokenKey<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = keyof ComponentToken<CompTokenMap, AliasToken, C>;

export type FullToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = TokenWithCommonCls<GlobalTokenWithComponent<CompTokenMap, AliasToken, C>>;

export type GenStyleFn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = (token: FullToken<CompTokenMap, AliasToken, C>, info: StyleInfo) => CSSInterpolation;

export type GetDefaultTokenFn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = (token: AliasToken & Partial<CompTokenMap[C]>) => CompTokenMap[C];

export type GetDefaultToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = null | CompTokenMap[C] | GetDefaultTokenFn<CompTokenMap, AliasToken, C>;
