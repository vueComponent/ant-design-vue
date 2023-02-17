import { FullToken, genComponentStyleHook, GenerateStyle, mergeToken } from '../../theme/internal';
import { CSSObject } from '../../_util/cssinjs';
import genTourMaskStyle from './tour-mask';

export interface ComponentToken {}

export interface TourToken extends FullToken<'Tour'> {
  tourDefault: string;
}

const getTourStyle: GenerateStyle<TourToken> = (token: TourToken): CSSObject => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      ...genTourMaskStyle(token),
    },
  };
};

export default genComponentStyleHook('Tour', token => {
  const tourToken = mergeToken<TourToken>(token, {});
  return [getTourStyle(tourToken)];
});
