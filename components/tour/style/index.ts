import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';
import getArrowStyle, { MAX_VERTICAL_CONTENT_RADIUS } from '../../style/placementArrow';

export interface ComponentToken {}

interface TourToken extends FullToken<'Tour'> {
  tourZIndexPopup: number;
  sliderWidth: number;
  sliderHeight: number;
  tourBorderRadius: number;
  tourCloseSize: number;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<TourToken> = token => {
  const {
    componentCls,
    lineHeight,
    padding,
    paddingXS,
    borderRadius,
    borderRadiusXS,
    colorPrimary,
    colorText,
    colorFill,
    sliderHeight,
    sliderWidth,
    boxShadow,
    tourZIndexPopup,
    fontSize,
    colorBgContainer,
    fontWeightStrong,
    marginXS,
    colorTextLightSolid,
    tourBorderRadius,
    colorWhite,
    colorBgTextHover,
    tourCloseSize,
    motionDurationSlow,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        color: colorText,
        position: 'absolute',
        zIndex: tourZIndexPopup,
        display: 'block',
        visibility: 'visible',
        fontSize,
        lineHeight,
        width: 520,
        '--antd-arrow-background-color': colorBgContainer,

        '&-pure': {
          maxWidth: '100%',
          position: 'relative',
        },

        [`&${componentCls}-hidden`]: {
          display: 'none',
        },

        // ============================= panel content ============================
        [`${componentCls}-content`]: {
          position: 'relative',
        },
        [`${componentCls}-inner`]: {
          textAlign: 'start',
          textDecoration: 'none',
          borderRadius: tourBorderRadius,
          boxShadow,
          position: 'relative',
          backgroundColor: colorBgContainer,
          border: 'none',
          backgroundClip: 'padding-box',

          [`${componentCls}-close`]: {
            position: 'absolute',
            top: padding,
            insetInlineEnd: padding,
            color: token.colorIcon,
            outline: 'none',
            width: tourCloseSize,
            height: tourCloseSize,
            borderRadius: token.borderRadiusSM,
            transition: `background-color ${token.motionDurationMid}, color ${token.motionDurationMid}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '&:hover': {
              color: token.colorIconHover,
              backgroundColor: token.wireframe ? 'transparent' : token.colorFillContent,
            },
          },

          [`${componentCls}-cover`]: {
            textAlign: 'center',
            padding: `${padding + tourCloseSize + paddingXS}px ${padding}px 0`,
            img: {
              width: '100%',
            },
          },
          [`${componentCls}-header`]: {
            padding: `${padding}px ${padding}px ${paddingXS}px`,

            [`${componentCls}-title`]: {
              lineHeight,
              fontSize,
              fontWeight: fontWeightStrong,
            },
          },

          [`${componentCls}-description`]: {
            padding: `0 ${padding}px`,
            lineHeight,
            wordWrap: 'break-word',
          },

          [`${componentCls}-footer`]: {
            padding: `${paddingXS}px ${padding}px ${padding}px`,
            textAlign: 'end',
            borderRadius: `0 0 ${borderRadiusXS}px ${borderRadiusXS}px`,
            display: 'flex',
            justifyContent: 'space-between',

            [`${componentCls}-sliders`]: {
              display: 'inline-block',

              [`${componentCls}-slider`]: {
                width: `${sliderWidth}px`,
                height: `${sliderHeight}px`,
                display: 'inline-block',
                borderRadius: '50%',
                background: colorFill,
                marginInlineEnd: sliderHeight,

                '&-active': {
                  background: colorPrimary,
                },
              },
            },
            [`${componentCls}-buttons button`]: {
              marginInlineStart: marginXS,
            },
          },
        },

        // =============================  primary type  ===========================
        // `$` for panel, `&$` for pure panel
        [`${componentCls}-primary, &${componentCls}-primary`]: {
          '--antd-arrow-background-color': colorPrimary,
        },

        [`${componentCls}-primary`]: {
          [`${componentCls}-inner`]: {
            color: colorTextLightSolid,
            textAlign: 'start',
            textDecoration: 'none',
            backgroundColor: colorPrimary,
            borderRadius,
            boxShadow,

            [`${componentCls}-close`]: {
              color: colorTextLightSolid,
            },

            [`${componentCls}-sliders`]: {
              [`${componentCls}-slider`]: {
                background: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),

                '&-active': {
                  background: colorTextLightSolid,
                },
              },
            },

            [`${componentCls}-prev-btn`]: {
              color: colorTextLightSolid,
              borderColor: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
              backgroundColor: colorPrimary,

              '&:hover': {
                backgroundColor: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
                borderColor: 'transparent',
              },
            },

            [`${componentCls}-next-btn`]: {
              color: colorPrimary,
              borderColor: 'transparent',
              background: colorWhite,

              '&:hover': {
                background: new TinyColor(colorBgTextHover).onBackground(colorWhite).toRgbString(),
              },
            },
          },
        },
      },

      // ============================= mask ===========================
      [`${componentCls}-mask`]: {
        [`${componentCls}-placeholder-animated`]: {
          transition: `all ${motionDurationSlow}`,
        },
      },

      // =========== Limit left and right placement radius ==============
      [[
        '&-placement-left',
        '&-placement-leftTop',
        '&-placement-leftBottom',
        '&-placement-right',
        '&-placement-rightTop',
        '&-placement-rightBottom',
      ].join(',')]: {
        [`${componentCls}-inner`]: {
          borderRadius: Math.min(tourBorderRadius, MAX_VERTICAL_CONTENT_RADIUS),
        },
      },
    },

    // ============================= Arrow ===========================
    getArrowStyle<TourToken>(token, {
      colorBg: 'var(--antd-arrow-background-color)',
      showArrowCls: '',
      contentRadius: tourBorderRadius,
      limitVerticalRadius: true,
    }),
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook('Tour', token => {
  const { borderRadiusLG, fontSize, lineHeight } = token;
  const TourToken = mergeToken<TourToken>(token, {
    tourZIndexPopup: token.zIndexPopupBase + 70,
    sliderWidth: 6,
    sliderHeight: 6,
    tourBorderRadius: borderRadiusLG,
    tourCloseSize: fontSize * lineHeight,
  });
  return [genBaseStyle(TourToken)];
});
