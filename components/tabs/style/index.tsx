// import '../../style/index.less';
// import './index.less';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, clearFix } from '../../_style';
import Token from 'markdown-it/lib/token';
import { genTabsPositionStyle } from './position';
import { genTabsSizeStyle } from './size';
import { genRtlStyle } from './rtl';
import { genTabsDropdownStyle } from './dropdown';
import { genTabscardStyle } from './card';
import {tabsCardStyle } from './card'

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {}
interface tabsToken extends FullToken<'Tabs'> {
  tabsCardHeight: string;
  tabsCardGutter: string;
  tabsHorizontalMarginRtl: string;
}
// ============================== Shared ==============================

export const genTabsSmallStyle = (token: tabsToken): CSSObject => {
  const { componentCls } = token;

  return  {
    [componentCls]: {
      ...genTabsSizeStyle(token),
      ...genTabsPositionStyle(token),
      ...resetComponent(token),
      display: 'flex',
      // ========================== Navigation ==========================
      [`&-card`]: {
        ...genTabscardStyle(token),
      },
      [`&-rtl`]: {
        ...genRtlStyle(token),
      },
      
      [`&-dropdown`]: {
        ...genTabsDropdownStyle(token),
      },
      [`${componentCls}-nav,
         div > ${componentCls}-nav`]: {
        position: 'relative',
        display: 'flex',
        flex: 'none',
        alignItems: 'center',
        [`${componentCls}-nav-wrap`]: {
          position: 'relative',
          display: 'flex',
          flex: 'auto',
          alignSelf: 'stretch',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transform: 'translate(0)', // Fix chrome render bug
          // >>>>> Ping shadow
          [`&::before ,
            &::after `]: {
            position: 'absolute',
            zIndex: 1,
            opacity: 0,
            transition: `opacity ${token.motionDurationSlow}`,
            content: '""',
            pointerEvents: 'none',
          },
        },

        [`${componentCls}-nav-list`]: {
          position: 'relative',
          display: 'flex',
          transition: `transform  ${token.motionDurationSlow}`,
        },

        // >>>>>>>> Operations
        [`${componentCls}-nav-operations`]: {
          display: 'flex',
          alignSelf: 'stretch',
          [`&-hidden`]: {
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
          },
        },

        [`${componentCls}-nav-more`]: {
          position: 'relative',
          padding: `${token.paddingXS}px ${token.padding}px`,
          background: 'transparent',
          border: 0,
          [`&::after`]: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            left: 0,
            height: '5px',
            transform: 'translateY(100%)',
            content: '""',
          },
        },
        [`${componentCls}-nav-add`]: {
          minWidth: `${token.tabsCardHeight}`,
          marginLeft: `${token.tabsCardGutter}`,
          padding: `0 ${token.paddingXS}px `,
          background: `${token.colorFillAlter}`,
          border: `${token.lineWidth}px ${token.colorBorder}   ${token.lineType} `,
          borderRadius: ` ${token.borderRadius}e ${token.borderRadius} 0 0`,
          outline: 'none',
          cursor: 'pointer',
          transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut} `,
          [` &:hover `]: {
            color: `${token.colorPrimaryActive}`,
          },

          [` &:active,
            &:focus`]: {
            color: `${token.colorPrimaryActive}`,
          },
        },
      },

      [`${componentCls}-extra-content `]: {
        flex: 'none',
      },
      [`&-centered`]: {
        [`${componentCls}-nav,
           div > ${componentCls}-nav`]: {
          [`${componentCls}-nav-wrap`]: {
            [`&:not([class*='@:${componentCls}-nav-wrap-ping'])`]: {
              justifyContent: 'center',
            },
          },
        },
      },

      // ============================ InkBar ============================
      [`${componentCls}-ink-bar`]: {
        position: 'absolute',
        background: `${token.colorPrimary}`,
        pointerEvents: 'none',
      },

      // ============================= Tabs =============================
      [`${componentCls}-tab `]: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${token.paddingSM}px 0`,
        fontSize: `${token.fontSize}px`,
        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',

        [`&-btn,
          &-remove`]: {
          [` &:focus,
            &:active `]: {
            color: `${token.colorInfoActive}`,
          },
        },

        [` &-btn `]: {
          outline: 'none',
          transition: `all 0.3s`,
        },

        [`&-remove `]: {
          flex: 'none',
          marginRight: `-${token.marginXXS}px`,
          marginLeft: `${tabsCardStyle.tabsCardGutter}`,
          color: `${token.colorTextSecondary} `,
          fontSize: ` ${token.fontSizeSM}px`,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          transition: `all ${token.motionDurationSlow} `,

          [` &:hover `]: {
            color: `${token.colorTextHeading} `,
          },
        },

        [` &:hover `]: {
          color: `${token.colorLinkHover}`,
        },

        [`${componentCls}-active &-btn `]: {
          color: `${token.colorHighlight}`,
          textShadow: '0 0 0.25px currentcolor',
        },

        [`&-disabled `]: {
          color: `${token.colorTextDisabled}`,
          cursor: 'not-allowed',
        },

        [`&-disabled &-btn,
          &-disabled &-remove`]: {
          [` &:focus,
            &:active `]: {
            color: `${token.colorTextDisabled}`,
          },
        },

        [` &-remove ${token.iconCls}`]: {
          margin: 0,
        },

        [` ${token.iconCls} `]: {
          marginRight: `${token.marginSM}px`,
        },
      },

      [`${componentCls}-tab + ${componentCls}-tab `]: {
        margin: `${token.tabsHorizontalMarginRtl}`,
      },

      // =========================== TabPanes ===========================
      [`${componentCls}-content`]: {
        [`&-holder`]: {
          flex: 'auto',
          minWidth: 0,
          minHeight: 0,
          
        },
        display: 'flex',
        width: '100%',
        [`${componentCls}-animated`]: {
          transition: `margin ${token.motionDurationSlow}`,
        },
      },

      [` ${componentCls}-tabpane `]: {
        flex: 'none',
        width: ' 100%',
        outline: 'none',
      },
    },
  };

};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Tabs',
  token => {
    const tabsToken = mergeToken<tabsToken>(token, {
      tabsCardHeight: '40px',
      tabsCardGutter: '5px',
      tabsHorizontalMarginRtl: '0 0 0 32px',
    });
    return [genTabsSmallStyle(tabsToken)];
  },
  {},
);
