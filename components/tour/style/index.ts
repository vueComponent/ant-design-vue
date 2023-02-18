import { FullToken, genComponentStyleHook, GenerateStyle, mergeToken } from '../../theme/internal';
import type { CSSObject } from '../../_util/cssinjs';
import genTourStyle from './tour';

export interface ComponentToken {}

export interface TourToken extends FullToken<'Tour'> {
  tourDefault: string;
}

const getTourStyle: GenerateStyle<TourToken> = (token: TourToken): CSSObject => {
  const { componentCls } = token;
  return {
    ...genTourStyle(token),
    [componentCls]: {
      [`${componentCls}-mask`]: {
        [`${componentCls}-placeholder-animated`]: {
          transition: 'all 0.15s',
        },
      },
    },
  };
};

export default genComponentStyleHook('Tour', token => {
  const tourToken = mergeToken<TourToken>(token, {});
  return [getTourStyle(tourToken)];
});
