import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, clearFix } from '../../_style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {}
interface CardToken extends FullToken<'Card'> {
  cardHeadFontSize: string;
  CardHeadPadding: string;
  cardPaddingBase: string;
  cardPaddingBaseSm: string;
  cardHeadHeightSm: string;
  cardHeadPaddingSm: string;
  cardActionsLiMargin: string;
  cardHeadTabsMarginBottom: string;
  cardHeadHeight: string;
  cardShadow: string;
  cardHeadFontSizeSm: string;
  cardHeadColor: string;
  gradientMin: string;
  gradientMax: string;
  cardInnerHeadPadding: string;
  transitionTime: string;
}
// ============================== Shared ==============================
export const genCardSmallStyle = (token: CardToken): CSSObject => {

  const {
    cardPaddingBaseSm,
    cardHeadHeightSm,
    cardHeadPaddingSm,
    cardHeadFontSizeSm,
    componentCls,
  } = token;

  return {
    [`> ${componentCls}-head`]: {
      minHeight: `${cardHeadHeightSm}`,
      padding: `0 ${cardPaddingBaseSm}`,
      fontSize: `${cardHeadFontSizeSm}px`,
      [`> ${componentCls}-head-wrapper`]: {
        [`> ${componentCls}-head-title`]: {
          padding: `${cardHeadPaddingSm}  0`,
        },
        [`> ${componentCls}-head-extra`]: {
          padding: `${cardHeadPaddingSm}  0`,
          fontSize: `${cardHeadFontSizeSm}px`,
        },
      },
    },
    [`> ${componentCls}-body`]: {
      padding: `${cardPaddingBaseSm}`,
    },
  };
};

const genSharedCardStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const {
    cardHeadFontSize,
    CardHeadPadding,
    cardPaddingBase,
    cardHeadPaddingSm,
    cardActionsLiMargin,
    cardHeadTabsMarginBottom,
    cardHeadHeight,
    componentCls,
    cardHeadColor,
    cardShadow,
    transitionTime,
    antCls
  } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      position: `relative`,
      background: `${token.colorBgBase}`,
      borderRadius: `${token.borderRadiusXS}px`,
      '&-bordered': {
        border: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
      },
     [`&${componentCls}-small`]: {
        ...genCardSmallStyle(token),
      },
      [`&-rtl`]: {
        direction: 'rtl',
      },
      [`&-hoverable`]: {
        cursor: 'pointer',
        transition: ` box-shadow  ${transitionTime}, border-color ${transitionTime}`,
        '&:hover': {
          borderColor: `${token.colorBgBase}`,
          boxShadow: `${cardShadow}`,
        },
      },
      [`${componentCls}-head`]: {
        minHeight: `${cardHeadHeight}`,
        marginBottom: `-1px`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: `${cardHeadColor}`,
        textOverflow: 'ellipsis',
        padding: ` 0 ${token.cardPaddingBase} `,
        fontWeight: 500,
        fontSize: `${cardHeadFontSize}px`,
        background: `transparent`,
        borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
        ...clearFix(),
        '&-wrapper': {
          display: 'flex',
          alignItems: 'center',
        },
        '&-title': {
          display: 'inline-block',
          flex: 1,
          padding: `${CardHeadPadding} 0`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          [`> ${antCls}-typography  ${antCls}-typography-edit-content `]: {
            left: 0,
            marginTop: 0,
            marginBottom: 0,
          },
        },

        [`${antCls}-tabs-top`]: {
          clear: 'both',
          marginBottom: `${cardHeadTabsMarginBottom}`,
          color: `${token.colorText}`,
          fontWeight: 400,
          fontSize: `${token.fontSize}`,
          '&-bar': {
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
          },
        },
      },
      [`${componentCls}-extra`]: {
        float: 'right',
        // https://stackoverflow.com/a/22429853/3040605
        marginLeft: 'auto',
        padding: `${CardHeadPadding} 0`,
        color: `${token.colorText}`,
        fontWeight: 400,
        fontSize: `${token.fontSize}`,
        [`${componentCls}-prefix-rtl &`]: {
          marginRight: 'auto',
          marginLeft: 0,
        },
      },
      [`${componentCls}-body`]: {
        padding: `${cardPaddingBase}`,
        ...clearFix(),
      },
      [`${componentCls}-contain-grid:not(&-loading)  ${componentCls}-body`]: {
        margin: ' -1px 0 0 -1px',
        padding: 0,
      },
      [`${componentCls}-grid`]: {
        float: 'left',
        width: '33.33%',
        padding: `${cardPaddingBase}`,
        border: 'none',
        borderRadius: 0,
        boxShadow: `1px 0 0 0 ${token.colorSplit}, 0 1px 0 0 ${token.colorSplit},
          1px 1px 0 0 ${token.colorSplit}, 1px 0 0 0 ${token.colorSplit} inset,
          0 1px 0 0 ${token.colorSplit} inset`,
        transition: `all ${transitionTime}`,
        [`${componentCls}-cls-rtl &`]: {
          float: 'right',
        },

        '&-hoverable': {
          '&:hover': {
            position: 'relative',
            zIndex: `${token.zIndexBase}`,
            boxShadow: `${cardShadow}`,
          },
        },
      },
      [` ${componentCls}-contain-tabs > ${componentCls}-head ${componentCls}-head-title`]: {
        minHeight: ` ${cardHeadHeight}- ${cardPaddingBase}`,
        paddingBottom: 0,
      },
      [` ${componentCls}-contain-tabs > ${componentCls}-head ${componentCls}-extra`]: {
        paddingBottom: 0,
      },
      [` ${componentCls}-bordered > ${componentCls}-cover `]: {
        marginTop: '-1px',
        marginRight: '-1px',
        marginLeft: '-1px',
      },
      [`${componentCls}-cover`]: {
        ' > *': {
          display: 'block',
          width: '100%',
        },

        img: {
          borderRadius: `${token.borderRadiusXS}px ${token.borderRadiusXS}px 0 0 `,
        },
      },

      [`${componentCls}-actions`]: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        background: `${token.colorBgBase}`,
        borderTop: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
        ...clearFix(),

        '& > li': {
          float: 'left',
          margin: `${cardActionsLiMargin} `,
          color: `${token.colorTextSecondary}`,
          textAlign: 'center',
          [` ${componentCls}-rtl &`]: {
            float: 'right',
          },

          ' > span': {
            position: 'relative',
            display: 'block',
            minWidth: ' 32px',
            fontSize: `${token.fontSize}px`,
            lineHeight: `${token.lineHeight}`,
            cursor: 'pointer',
            '&:hover': {
              color: ` ${token.colorPrimary}`,
              transition: `color ${transitionTime}`,
            },

            [`a:not(${antCls}-btn), >${token.iconCls}-css-prefix}`]: {
              display: ' inline-block',
              width: '100%',
              color: `${token.colorTextSecondary}`,
              lineHeight: ' 22px',
              transition: `color ${transitionTime}`,

              '&:hover': {
                color: `${token.colorPrimary}`,
              },
            },

            [`>${token.iconCls}`]: {
              fontSize: `${token.fontSizeIcon}`,
              lineHeight: '22px',
            },
          },

          [`li:not(:last-child)`]: {
            borderRight: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
            [`${componentCls}-rtl &`]: {
              borderRight: 'none',
              borderLeft: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
            },
          },
        },
      },
      [`${componentCls}-type-inner ${componentCls}-head`]: {
        padding: `0 ${cardPaddingBase}`,
        background: `${token.colorBgBase}`,
        ' &-title': {
          padding: `${cardHeadPaddingSm} 0`,
          fontSize: `${token.fontSize}px`,
        },
      },
      [`${componentCls}-type-inner ${componentCls}-body`]: {
        padding: `16px ${cardPaddingBase}`,
      },
      ' &-type-inner &-extra': {
        padding: `${token.cardInnerHeadPadding} + 1.5px 0`,
      },
      [`${componentCls}-meta`]: {
        margin: ' -4px 0',
        ...clearFix(),

        '&-avatar': {
          float: 'left',
          paddingRight: '16px',

          [` ${componentCls}-rtl &`]: {
            float: 'right',
            paddingRight: 0,
            paddingLeft: ' 16px',
          },
        },

        '&-detail ': {
          overflow: 'hidden',
          '> div:not(:last-child)': {
            marginBottom: `${token['magenta-8']}`,
          },
        },

        '&-title': {
          overflow: 'hidden',
          color: `${cardHeadColor}`,
          fontWeight: '500',
          fontSize: `${token.fontSizeLG}px`,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },

        ' &-description': {
          color: `${token.colorTextSecondary}`,
        },
      },
      [` ${componentCls}-loading`]: {
        overflow: 'hidden',
      },
      [` ${componentCls}-loading ${componentCls}-body`]: {
        userSelect: 'none',
      },

      [` ${componentCls}-loading-content`]: {
        p: {
          margin: 0,
        },
      },
      [` ${componentCls}-loading-block`]: {
        height: '14px',
        margin: ' 4px 0',
        background: `linear-gradient(90deg,${token.gradientMin},${token.gradientMax}, ${token.gradientMin})`,
        backgroundSize: '600% 600%',
        borderRadius: `${token.borderRadiusXS}px`,
        animationName: 'card-loading',
        animationDuration: '1.4s',
        animationTimingFunction: 'ease',
        animationIterationCount: 'infinite',
      },
      '@keyframes card-loading': {
        '0%,100% ': {
          backgroundPosition: '0 50%',
        },
        '50%': {
          backgroundPosition: '100% 50%',
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Card',
  token => {
    const cardToken = mergeToken<CardToken>(token, {
      cardPaddingBase: '16px',
      cardHeadHeight: ' 36px',
      cardHeadFontSize: `${token.fontSizeHeading5}`,
      cardHeadFontSizeSm: `${token.fontSize}`,
      CardHeadPadding: '8.5px',
      cardPaddingBaseSm: '12px',
      cardHeadHeightSm: '30px',
      cardHeadPaddingSm: '6px',
      cardActionsLiMargin: '12px 0',
      cardHeadTabsMarginBottom: '-17px',
      cardShadow: `0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
      0 5px 12px 4px rgba(0, 0, 0, 0.09)`,
      cardHeadColor: 'rgba(0,0,0,.85)',
      gradientMin: 'rgba(207,216,220,.2)',
      gradientMax: 'rgba(207,216,220,.4)',
      cardInnerHeadPadding: '12px',
      transitionTime: '0.3s',
    });
    return [genSharedCardStyle(cardToken)];
  },
  {},
);
