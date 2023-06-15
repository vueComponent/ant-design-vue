import { initZoomMotion } from '../../style/motion';
import type { FullToken, GenerateStyle, PresetColorType } from '../../theme/internal';
import { genComponentStyleHook, mergeToken, PresetColors } from '../../theme/internal';
import { resetComponent } from '../../style';
import getArrowStyle from '../../style/placementArrow';

export interface ComponentToken {
  zIndexPopup: number;
  width: number;
}

export type PopoverToken = FullToken<'Popover'> & {
  popoverBg: string;
  popoverColor: string;
  popoverPadding: number | string;
};

const genBaseStyle: GenerateStyle<PopoverToken> = token => {
  const {
    componentCls,
    popoverBg,
    popoverColor,
    width,
    fontWeightStrong,
    popoverPadding,
    boxShadowSecondary,
    colorTextHeading,
    borderRadiusLG: borderRadius,
    zIndexPopup,
    marginXS,
    colorBgElevated,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),
        position: 'absolute',
        top: 0,
        // use `left` to fix https://github.com/ant-design/ant-design/issues/39195
        left: {
          _skip_check_: true,
          value: 0,
        },
        zIndex: zIndexPopup,
        fontWeight: 'normal',
        whiteSpace: 'normal',
        textAlign: 'start',
        cursor: 'auto',
        userSelect: 'text',
        '--antd-arrow-background-color': colorBgElevated,

        '&-rtl': {
          direction: 'rtl',
        },

        '&-hidden': {
          display: 'none',
        },

        [`${componentCls}-content`]: {
          position: 'relative',
        },

        [`${componentCls}-inner`]: {
          backgroundColor: popoverBg,
          backgroundClip: 'padding-box',
          borderRadius,
          boxShadow: boxShadowSecondary,
          padding: popoverPadding,
        },

        [`${componentCls}-title`]: {
          minWidth: width,
          marginBottom: marginXS,
          color: colorTextHeading,
          fontWeight: fontWeightStrong,
        },

        [`${componentCls}-inner-content`]: {
          color: popoverColor,
        },
      },
    },

    // Arrow Style
    getArrowStyle(token, { colorBg: 'var(--antd-arrow-background-color)' }),

    // Pure Render
    {
      [`${componentCls}-pure`]: {
        position: 'relative',
        maxWidth: 'none',

        [`${componentCls}-content`]: {
          display: 'inline-block',
        },
      },
    },
  ];
};

const genColorStyle: GenerateStyle<PopoverToken> = token => {
  const { componentCls } = token;

  return {
    [componentCls]: PresetColors.map((colorKey: keyof PresetColorType) => {
      const lightColor = token[`${colorKey}-6`];
      return {
        [`&${componentCls}-${colorKey}`]: {
          '--antd-arrow-background-color': lightColor,
          [`${componentCls}-inner`]: {
            backgroundColor: lightColor,
          },
          [`${componentCls}-arrow`]: {
            background: 'transparent',
          },
        },
      };
    }),
  };
};

const genWireframeStyle: GenerateStyle<PopoverToken> = token => {
  const {
    componentCls,
    lineWidth,
    lineType,
    colorSplit,
    paddingSM,
    controlHeight,
    fontSize,
    lineHeight,
    padding,
  } = token;

  const titlePaddingBlockDist = controlHeight - Math.round(fontSize * lineHeight);
  const popoverTitlePaddingBlockTop = titlePaddingBlockDist / 2;
  const popoverTitlePaddingBlockBottom = titlePaddingBlockDist / 2 - lineWidth;
  const popoverPaddingHorizontal = padding;

  return {
    [componentCls]: {
      [`${componentCls}-inner`]: {
        padding: 0,
      },

      [`${componentCls}-title`]: {
        margin: 0,
        padding: `${popoverTitlePaddingBlockTop}px ${popoverPaddingHorizontal}px ${popoverTitlePaddingBlockBottom}px`,
        borderBottom: `${lineWidth}px ${lineType} ${colorSplit}`,
      },

      [`${componentCls}-inner-content`]: {
        padding: `${paddingSM}px ${popoverPaddingHorizontal}px`,
      },
    },
  };
};

export default genComponentStyleHook(
  'Popover',
  token => {
    const { colorBgElevated, colorText, wireframe } = token;

    const popoverToken = mergeToken<PopoverToken>(token, {
      popoverBg: colorBgElevated,
      popoverColor: colorText,
      popoverPadding: 12, // Fixed Value
    });

    return [
      genBaseStyle(popoverToken),
      genColorStyle(popoverToken),
      wireframe && genWireframeStyle(popoverToken),
      initZoomMotion(popoverToken, 'zoom-big'),
    ];
  },
  ({ zIndexPopupBase }) => ({
    zIndexPopup: zIndexPopupBase + 30,
    width: 177,
  }),
);
