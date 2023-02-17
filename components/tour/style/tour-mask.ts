import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import { TourToken } from '.';

const genTourMaskStyle: GenerateStyle<TourToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [`&${componentCls}-mask`]: {},
  };
};

export default genTourMaskStyle;
