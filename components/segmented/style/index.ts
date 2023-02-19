import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../_style';

export interface ComponentToken {}

interface SegmentedToken extends FullToken<'Segmented'> {
  segmentedPaddingHorizontal: number;
  segmentedPaddingHorizontalSM: number;
  segmentedContainerPadding: number;
  labelColor: string;
  labelColorHover: string;
  bgColor: string;
  bgColorHover: string;
  bgColorSelected: string;
}

// ============================== Mixins ==============================
function segmentedDisabledItem(cls: string, token: SegmentedToken): CSSObject {
  return {
    [`${cls}, ${cls}:hover, ${cls}:focus`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  };
}

function getSegmentedItemSelectedStyle(token: SegmentedToken): CSSObject {
  return {
    backgroundColor: token.bgColorSelected,
    boxShadow: token.boxShadow,
  };
}

const segmentedTextEllipsisCss: CSSObject = {
  overflow: 'hidden',
  // handle text ellipsis
  ...textEllipsis,
};

// ============================== Shared ==============================
const genSharedSegmentedStyle: GenerateStyle<SegmentedToken> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      display: 'inline-block',
      padding: token.segmentedContainerPadding,
      color: token.labelColor,
      backgroundColor: token.bgColor,
      borderRadius: token.borderRadius,
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,

      [`${componentCls}-group`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyItems: 'flex-start',
        width: '100%',
      },

      // RTL styles
      '&&-rtl': {
        direction: 'rtl',
      },

      // block styles
      '&&-block': {
        display: 'flex',
      },

      [`&&-block ${componentCls}-item`]: {
        flex: 1,
        minWidth: 0,
      },

      // item styles
      [`${componentCls}-item`]: {
        position: 'relative',
        textAlign: 'center',
        cursor: 'pointer',
        transition: `color ${token.motionDurationMid} ${token.motionEaseInOut}`,
        borderRadius: token.borderRadiusSM,

        '&-selected': {
          ...getSegmentedItemSelectedStyle(token),
          color: token.labelColorHover,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          insetInlineStart: 0,
          borderRadius: token.borderRadiusSM,
          transition: `background-color ${token.motionDurationMid}`,
        },

        [`&:hover:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.labelColorHover,

          '&::after': {
            backgroundColor: token.bgColorHover,
          },
        },

        '&-label': {
          minHeight: token.controlHeight - token.segmentedContainerPadding * 2,
          lineHeight: `${token.controlHeight - token.segmentedContainerPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`,
          ...segmentedTextEllipsisCss,
        },

        // syntactic sugar to add `icon` for Segmented Item
        '&-icon + *': {
          marginInlineEnd: token.marginSM / 2,
        },

        '&-input': {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        },
      },

      // size styles
      '&&-lg': {
        borderRadius: token.borderRadiusLG,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightLG - token.segmentedContainerPadding * 2,
          lineHeight: `${token.controlHeightLG - token.segmentedContainerPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`,
          fontSize: token.fontSizeLG,
        },
        [`${componentCls}-item-selected`]: {
          borderRadius: token.borderRadius,
        },
      },

      '&&-sm': {
        borderRadius: token.borderRadiusSM,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightSM - token.segmentedContainerPadding * 2,
          lineHeight: `${token.controlHeightSM - token.segmentedContainerPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontalSM}px`,
        },
        [`${componentCls}-item-selected`]: {
          borderRadius: token.borderRadiusXS,
        },
      },

      // disabled styles
      ...segmentedDisabledItem(`&-disabled ${componentCls}-item`, token),
      ...segmentedDisabledItem(`${componentCls}-item-disabled`, token),

      // thumb styles
      [`${componentCls}-thumb`]: {
        ...getSegmentedItemSelectedStyle(token),

        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: '100%',
        padding: `${token.paddingXXS}px 0`,
        borderRadius: token.borderRadiusSM,

        [`& ~ ${componentCls}-item:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)::after`]:
          {
            backgroundColor: 'transparent',
          },
      },

      // transition effect when `appear-active`
      [`${componentCls}-thumb-motion-appear-active`]: {
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, width ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        willChange: 'transform, width',
      },
    },
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Segmented', token => {
  const {
    lineWidthBold,
    lineWidth,
    colorTextLabel,
    colorText,
    colorFillSecondary,
    colorBgLayout,
    colorBgElevated,
  } = token;

  const segmentedToken = mergeToken<SegmentedToken>(token, {
    segmentedPaddingHorizontal: token.controlPaddingHorizontal - lineWidth,
    segmentedPaddingHorizontalSM: token.controlPaddingHorizontalSM - lineWidth,
    segmentedContainerPadding: lineWidthBold,
    labelColor: colorTextLabel,
    labelColorHover: colorText,
    bgColor: colorBgLayout,
    bgColorHover: colorFillSecondary,
    bgColorSelected: colorBgElevated,
  });
  return [genSharedSegmentedStyle(segmentedToken)];
});
