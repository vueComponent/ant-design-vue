/**
 * respect https://github.com/cuth/postcss-pxtorem
 */
import unitless from '@emotion/unitless';
import type { CSSObject } from '..';
import type { Transformer } from './interface';

export interface Options {
  /**
   * The root font size.
   * @default 16
   */
  rootValue?: number;
  /**
   * The decimal numbers to allow the REM units to grow to.
   * @default 5
   */
  precision?: number;
  /**
   * Whether to allow px to be converted in media queries.
   * @default false
   */
  mediaQuery?: boolean;
}

const pxRegex = /url\([^)]+\)|var\([^)]+\)|(\d*\.?\d+)px/g;

function toFixed(number: number, precision: number) {
  const multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

const transform = (options: Options = {}): Transformer => {
  const { rootValue = 16, precision = 5, mediaQuery = false } = options;

  const pxReplace = (m: string, $1: any) => {
    if (!$1) return m;
    const pixels = parseFloat($1);
    // covenant: pixels <= 1, not transform to rem @zombieJ
    if (pixels <= 1) return m;
    const fixedVal = toFixed(pixels / rootValue, precision);
    return `${fixedVal}rem`;
  };

  const visit = (cssObj: CSSObject): CSSObject => {
    const clone: CSSObject = { ...cssObj };

    Object.entries(cssObj).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('px')) {
        const newValue = value.replace(pxRegex, pxReplace);
        clone[key] = newValue;
      }

      // no unit
      if (!unitless[key] && typeof value === 'number' && value !== 0) {
        clone[key] = `${value}px`.replace(pxRegex, pxReplace);
      }

      // Media queries
      const mergedKey = key.trim();
      if (mergedKey.startsWith('@') && mergedKey.includes('px') && mediaQuery) {
        const newKey = key.replace(pxRegex, pxReplace);

        clone[newKey] = clone[key];
        delete clone[key];
      }
    });

    return clone;
  };

  return { visit };
};

export default transform;
