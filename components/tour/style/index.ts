import { FullToken, genComponentStyleHook, GenerateStyle, mergeToken } from '../../theme/internal';
import { CSSObject } from 'ant-design-vue/es/_util/cssinjs';

export interface ComponentToken {}

interface TourToken extends FullToken<'Tour'> {
  tourDefault: string;
}

const getTourStyle: GenerateStyle<TourToken> = (token: TourToken): CSSObject => ({
  [`${token.componentCls}`]: {},
});

export default genComponentStyleHook('Tour', token => {
  const tourToken = mergeToken<TourToken>(token, {});
  return [getTourStyle(tourToken)];
});
