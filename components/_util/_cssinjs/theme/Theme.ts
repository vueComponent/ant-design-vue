import warning from '../../warning';
import type { DerivativeFunc, TokenType } from './interface';

let uuid = 0;

/**
 * Theme with algorithms to derive tokens from design tokens.
 * Use `createTheme` first which will help to manage the theme instance cache.
 */
export default class Theme<DesignToken extends TokenType, DerivativeToken extends TokenType> {
  private derivatives: DerivativeFunc<DesignToken, DerivativeToken>[];
  public readonly id: number;

  constructor(
    derivatives:
      | DerivativeFunc<DesignToken, DerivativeToken>
      | DerivativeFunc<DesignToken, DerivativeToken>[],
  ) {
    this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
    this.id = uuid;

    if (derivatives.length === 0) {
      warning(
        derivatives.length > 0,
        '[Ant Design Vue CSS-in-JS] Theme should have at least one derivative function.',
      );
    }

    uuid += 1;
  }

  getDerivativeToken(token: DesignToken): DerivativeToken {
    return this.derivatives.reduce<DerivativeToken>(
      (result, derivative) => derivative(token, result),
      undefined as any,
    );
  }
}
