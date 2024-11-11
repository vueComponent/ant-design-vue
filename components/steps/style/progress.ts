import type { CSSObject } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsProgressStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const {
    antCls,
    componentCls,
    iconSize,
    iconSizeSM,
    processIconColor,
    marginXXS,
    lineWidthBold,
    lineWidth,
    paddingXXS,
  } = token;

  const progressSize = iconSize + lineWidthBold * 4;
  const progressSizeSM = iconSizeSM + lineWidth * 4;

  return {
    [`&${componentCls}-with-progress`]: {
      [`${componentCls}-item`]: {
        paddingTop: paddingXXS,

        [`&-process ${componentCls}-item-container ${componentCls}-item-icon ${componentCls}-icon`]:
          {
            color: processIconColor,
          },
      },

      [`&${componentCls}-vertical > ${componentCls}-item `]: {
        paddingInlineStart: paddingXXS,
        [`> ${componentCls}-item-container > ${componentCls}-item-tail`]: {
          top: marginXXS,
          insetInlineStart: iconSize / 2 - lineWidth + paddingXXS,
        },
      },

      [`&, &${componentCls}-small`]: {
        [`&${componentCls}-horizontal ${componentCls}-item:first-child`]: {
          paddingBottom: paddingXXS,
          paddingInlineStart: paddingXXS,
        },
      },

      [`&${componentCls}-small${componentCls}-vertical > ${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-tail`]:
        {
          insetInlineStart: iconSizeSM / 2 - lineWidth + paddingXXS,
        },

      [`&${componentCls}-label-vertical`]: {
        [`${componentCls}-item ${componentCls}-item-tail`]: {
          top: iconSize / 2 + paddingXXS,
        },
      },

      [`${componentCls}-item-icon`]: {
        position: 'relative',

        [`${antCls}-progress`]: {
          position: 'absolute',
          insetInlineStart: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',

          '&-inner': {
            width: `${progressSize}px !important`,
            height: `${progressSize}px !important`,
          },
        },
      },

      // ============================== Small size ==============================
      [`&${componentCls}-small`]: {
        [`&${componentCls}-label-vertical ${componentCls}-item ${componentCls}-item-tail`]: {
          top: iconSizeSM / 2 + paddingXXS,
        },

        [`${componentCls}-item-icon ${antCls}-progress-inner`]: {
          width: `${progressSizeSM}px !important`,
          height: `${progressSizeSM}px !important`,
        },
      },
    },
  };
};

export default genStepsProgressStyle;
