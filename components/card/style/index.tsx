import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, clearFix } from '../../_style';
// import type { GlobalToken } from '../../theme/interface';
/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  //   sizePaddingEdgeHorizontal: number;
}
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
  cardHeadFontSizeSm:string;
}
// ============================== Shared ==============================
const genSharedDividerStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  //   const { componentCls, sizePaddingEdgeHorizontal, colorSplit, lineWidth } = token;
  const {
    cardHeadFontSize,
    CardHeadPadding,
    cardPaddingBase,
    cardPaddingBaseSm,
    cardHeadHeightSm,
    cardHeadPaddingSm,
    cardActionsLiMargin,
    cardHeadFontSizeSm,
    cardHeadTabsMarginBottom,
    cardHeadHeight,
    componentCls,
  } = token;
  return {
    [`${componentCls}-small`]:{
      [`  > ${componentCls}-head`]:{
        minHeight: `${cardHeadHeightSm}`,
        padding:  `0 ${cardPaddingBaseSm}`,
        fontSize: `${cardHeadFontSizeSm}`,
         [`> ${componentCls}-head-wrapper`]: {
         [`> ${componentCls}-head-title`]: {
            padding:`${cardHeadPaddingSm}  0`,
          },
        [`> ${componentCls}-head-extra`]:{
          padding:`${cardHeadPaddingSm}  0`,
          fontSize: `${cardHeadFontSizeSm}`,
          }
        }
      },
     [`> ${componentCls}-body`]:{
        padding: `${cardPaddingBaseSm}`
      }
    },
    [componentCls]: {
      ...resetComponent(token),
      position: `relative`,
      background: `${token.colorBgBase}`,
      borderRadius: `${token.borderRadiusXS}px`,
      '&-bordered': {
        border: `1px solid #f0f0f0`,
      },
       [`${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&-hoverable`]: {
        cursor: 'pointer',
        transition: ` box-shadow 0.3s, border-color 0.3s`,
        '&:hover': {
          borderColor: `${token.colorBgBase}`,
          // boxShadow: `${token.boxShadow}`,
          boxShadow: `0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)`,

          
        },
      },
      [`${componentCls}-head`]: {
        minHeight: `${cardHeadHeight}`,
        marginBottom: `-1px`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: ` 0 ${token.cardPaddingBase} `,
        fontWeight: 500,
        fontSize: `${cardHeadFontSize}px`,
        background: `transparent`,
        borderBottom: '1px solid #f0f0f0',
        border: `${token.borderRadiusXS}px ${token.borderRadiusXS}px 0 0 `,
        ...clearFix(),
        // &-bordered {
        //   border: @border-width-base @border-style-base @border-color-split;
        // }
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
          [`> ${componentCls}-typography  ${componentCls}-typography-edit-content `]: {
            left: 0,
            marginTop: 0,
            marginBottom: 0,
          },
        },

        [`${componentCls}-prefix-tabs-top`]: {
          clear: 'both',
          marginBottom: `${token.margin}`,
          color: `${token.colorText}`,
          // fontWeight: 'normal',
          fontWeight: 400,
          fontSize: `${token.fontSize}`,
          '&-bar': {
            // borderBottom:`${token.cardShadow}`
            //  @border-width-base @border-style-base @border-color-split;
          },
        },
      },
      [`${componentCls}-extra`]: {
        float: 'right',
        // https://stackoverflow.com/a/22429853/3040605
        marginLeft: 'auto',
        padding: `${CardHeadPadding} 0`,
        color: `${token.colorText}`,
        // fontWeight: `${token.}`,
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
      [`${componentCls}-contain-grid:not(${componentCls}-loading) ${componentCls}-body`]: {
        margin: ' -1px 0 0 -1px',
        padding: 0,
      },
      [`${componentCls}-grid`]: {
        float: 'left',
        width: '33.33%',
        padding: `${cardPaddingBase}`,
        border: 0,
        borderRadius: 0,
        boxShadow: `1px 0 0 0 ${token.colorSplit}, 0 1px 0 0 ${token.colorSplit},
          1px 1px 0 0 ${token.colorSplit}, 1px 0 0 0 ${token.colorSplit} inset,
          0 1px 0 0 ${token.colorSplit} inset;
        transition: all 0.3s`,
        [`${componentCls}-cls-rtl &`]: {
          float: 'right',
        },

        '&-hoverable': {
          '&:hover': {
            position: 'relative',
            zIndex: 1,
            boxShadow: `${token.boxShadow}`,
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
          borderRadius: `${token.borderRadius} ${token.borderRadius} 0 0 `,
        },
      },

     [`${componentCls}-actions`]: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        background: `${token.colorBgBase}`,
        //  @card-actions-background;
        borderTop: `${token.BackTop}`,
        // @border-width-base @border-style-base @border-color-split;
        ...clearFix(),

        '& > li': {
          float: 'left',
          margin: `${cardActionsLiMargin}`,
          color: `~@text-color-secondary`,
          textAlign: 'center',

          [` ${componentCls}-rtl &`]: {
            float: 'right',
          },

          ' > span': {
            position: 'relative',
            display: 'block',
            minWidth: ' 32px',
            fontSize: `${token.fontSize}`,
            lineHeight: `${token.lineHeight}`,
            cursor: 'pointer',
            '&:hover': {
              color: ` ${token.colorPrimary}`,
              transition: 'color 0.3s',
            },

            [` a:not( ${componentCls}-btn),
              >  ${componentCls}-css-prefix}`]: {
              display: ' inline-block',
              width: '100%',
              // color: ` $ @text-color-secondary`;
              lineHeight: ' 22px',
              transition: ' color 0.3s',

              '&:hover': {
                color: `${token.colorPrimary}`,
              },
            },

            [`>${token.iconCls}`]: {
              fontSize: `${token.fontSizeIcon}`,
              lineHeight: '22px',
            },
          },

          '  &:not(:last-child)': {
            borderRight: `${token.borderRadius}`,
            //  @border-width-base @border-style-base @border-color-split;

            [` ${componentCls}-rtl &`]: {
              borderRight: 'none',
              borderLeft: `${token.borderRadius}`,
              //  @border-width-base @border-style-base @border-color-split;
            },
          },
        },
      },
      '&-type-inner &-head': {
        padding: `0 ${cardPaddingBase}`,
        color: 'red',
        background: `${token.colorBgBase}`,

        ' &-title': {
          padding: `${cardHeadPaddingSm} 0`,
          fontSize: `${token.fontSize}`,
        },
      },
      '&-type-inner &-body': {
        padding: `16px ${cardPaddingBase}`,
      },
      ' &-type-inner &-extra': {
        padding: `${cardHeadPaddingSm} + 1.5px 0`,
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

        '  &-detail ': {
          overflow: 'hidden',

          ' > div:not(:last-child)': {
            marginBottom: `${token.marginXS}`,
          },
        },

        ' &-title': {
          overflow: 'hidden',
          color: `${token.colorBgBase}`,
          fontWeight: '500',
          fontSize: `${token.fontSizeLG}`,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },

        ' &-description': {
          color: ' @text-color-secondary',
        },
      },
      '&-loading': {
        overflow: 'hidden',
      },
      '&-loading &-body': {
        userSelect: 'none',
      },

      ' &-loading-content': {
        p: {
          margin: 0,
        },
      },
     [` ${componentCls}-loading-block`]: {
        height: '14px',
        margin: ' 4px 0',
        background: 'linear-gradient(90deg, @gradient-min, @gradient-max, @gradient-min)',
        backgroundSize: '600% 600%',
        borderRadius: `${token.borderRadius}`,
        animationName:"card-loading",
        animationDuration:'1.4s',
        animationTimingFunction:'ease',
        animationIterationCount:'infinite'

        // animation: ' 1.4s ease infinite',
      },
     '@keyframes card-loading': {
      '  0%,100% ':{
          backgroundPosition: '0 50%',
        },
        '50%':{
          backgroundPosition: '100% 50%',
        }
      }
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
      cardActionsLiMargin: '4px 0',
      cardHeadTabsMarginBottom: '-9px',
      cardShadow:
        '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)',
    });
    return [genSharedDividerStyle(cardToken)];
  },
  {
    sizePaddingEdgeHorizontal: 0,
  },
);
