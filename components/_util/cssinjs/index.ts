import useCacheToken from './hooks/useCacheToken';
import type { CSSInterpolation, CSSObject } from './hooks/useStyleRegister';
import useStyleRegister, { extractStyle } from './hooks/useStyleRegister';
import Keyframes from './Keyframes';
import type { Linter } from './linters';
import { legacyNotSelectorLinter, logicalPropertiesLinter } from './linters';
import { createCache, useStyleInject, useStyleProvider } from './StyleContext';
import type { DerivativeFunc, TokenType } from './theme';
import { createTheme, Theme } from './theme';
import type { Transformer } from './transformers/interface';
import legacyLogicalPropertiesTransformer from './transformers/legacyLogicalProperties';

export {
  Theme,
  createTheme,
  useStyleRegister,
  useCacheToken,
  createCache,
  useStyleInject,
  useStyleProvider,
  Keyframes,
  extractStyle,

  // Transformer
  legacyLogicalPropertiesTransformer,

  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
};
export type { TokenType, CSSObject, CSSInterpolation, DerivativeFunc, Transformer, Linter };
