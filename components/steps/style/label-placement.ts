import type { CSSObject } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsLabelPlacementStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const { componentCls, stepsIconSize, lineHeight, stepsSmallIconSize } = token;

  return {
    [`&${componentCls}-label-vertical`]: {
      [`${componentCls}-item`]: {
        overflow: 'visible',

        '&-tail': {
          marginInlineStart: stepsIconSize / 2 + token.controlHeightLG,
          padding: `${token.paddingXXS}px ${token.paddingLG}px`,
        },

        '&-content': {
          display: 'block',
          width: (stepsIconSize / 2 + token.controlHeightLG) * 2,
          marginTop: token.marginSM,
          textAlign: 'center',
        },

        '&-icon': {
          display: 'inline-block',
          marginInlineStart: token.controlHeightLG,
        },

        '&-title': {
          paddingInlineEnd: 0,
          paddingInlineStart: 0,

          '&::after': {
            display: 'none',
          },
        },

        '&-subtitle': {
          display: 'block',
          marginBottom: token.marginXXS,
          marginInlineStart: 0,
          lineHeight,
        },
      },
      [`&${componentCls}-small:not(${componentCls}-dot)`]: {
        [`${componentCls}-item`]: {
          '&-icon': {
            marginInlineStart: token.controlHeightLG + (stepsIconSize - stepsSmallIconSize) / 2,
          },
        },
      },
    },
  };
};
export default genStepsLabelPlacementStyle;
