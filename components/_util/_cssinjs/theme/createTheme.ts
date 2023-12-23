import ThemeCache from './ThemeCache';
import Theme from './Theme';
import type { DerivativeFunc, TokenType } from './interface';

const cacheThemes = new ThemeCache();

/**
 * Same as new Theme, but will always return same one if `derivative` not changed.
 */
export default function createTheme<
  DesignToken extends TokenType,
  DerivativeToken extends TokenType,
>(
  derivatives:
    | DerivativeFunc<DesignToken, DerivativeToken>[]
    | DerivativeFunc<DesignToken, DerivativeToken>,
) {
  const derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
  // Create new theme if not exist
  if (!cacheThemes.has(derivativeArr)) {
    cacheThemes.set(derivativeArr, new Theme(derivativeArr));
  }

  // Get theme from cache and return
  return cacheThemes.get(derivativeArr)!;
}
