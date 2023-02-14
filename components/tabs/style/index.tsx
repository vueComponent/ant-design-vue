// import '../../style/index.less';
// import './index.less';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, clearFix } from '../../_style';
import Token from 'markdown-it/lib/token';
import { genTabsPositionStyle } from './position';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {}
interface tabsToken extends FullToken<'Tabs'> {
  tabsCardHeight: string;
  tabsCardGutter: string;
  a: number;
}
// ============================== Shared ==============================

export const genTabsSmallStyle = (token: tabsToken): CSSObject => {
  const { componentCls } = token;

  return {
    [`componentCls-yang`]: {
      // ...genTabsPositionStyle(token),
    },
    [componentCls]: {
      ...resetComponent(token),
      display: 'flex',
      ...genTabsPositionStyle(token),

      // ========================== Navigation ==========================
      [`> ${componentCls}-nav,
        > div > ${componentCls}-nav`]: {
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
          [` &::before,
            &::after `]: {
            position: 'absolute',
            zIndex: 1,
            opacity: 0,
            transition: `opacity ${token.motionDurationSlow}`,
            content: '""',
            pointerEvents: 'none',
          },
        },

        [`  ${componentCls}-nav-list`]: {
          position: 'relative',
          display: 'flex',
          transition: `transform  ${token.motionDurationSlow}`,
        },

        // >>>>>>>> Operations
        [`${componentCls}-nav-operations `]: {
          display: 'flex',
          alignSelf: 'stretch',

          [`  &-hidden `]: {
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
          },
        },

        [`${componentCls}-nav-more`]: {
          position: 'relative',
          padding: '@tabs-card-horizontal-padding',
          background: 'transparent',
          border: 0,

          [` &::after`]: {
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
          padding: `0 ${token.paddingXS} `,
          //   background: `${token.PageHeader}`  @tabs-card-head-background,
          border: `${token.lineWidth} ${token.borderRadius} ${token.colorSplit} `,
          borderRadius: ` ${token.borderRadius}e ${token.borderRadius} 0 0`,
          outline: 'none',
          cursor: 'pointer',
          transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut} `,

          [` &:hover `]: {
            color: ' @tabs-hover-color',
          },

          [` &:active,
            &:focus`]: {
            color: `${token.colorPrimaryActive}`,
          },
        },
      },

      [` &-extra-content `]: {
        flex: 'none',
      },

      ' &-centered': {
        [`  > ${componentCls}-nav,
          > div > ${componentCls}-nav`]: {
          [` ${componentCls}-nav-wrap `]: {
            [`  &:not([class*='@:{tab-prefix-cls}-nav-wrap-ping']) `]: {
              justifyContent: 'center',
            },
          },
        },
      },

      // ============================ InkBar ============================
      [`&-ink-bar`]: {
        position: 'absolute',
        background: `${token.colorPrimary}`,
        pointerEvents: 'none',
      },

      // ============================= Tabs =============================
      [`&-tab `]: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${token.padding}`,
        fontSize: `${token.fontSize}`,

        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',

        [` &-btn,
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

        [` &-remove `]: {
          flex: 'none',
          marginRight: `${token.marginXXS}`,
          marginLeft: `${token.marginXS}`,
          color: `${token.colorTextSecondary} `,
          fontSize: `@font-size-sm ${token.fontSizeSM}`,
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
          color: `@tabs-hover-color`,
        },

        [` &&-active &-btn `]: {
          color: '@tabs-highlight-color',
          textShadow: '0 0 0.25px currentcolor',
        },

        [` &&-disabled`]: {
          color: `${token.colorTextDisabled}`,
          cursor: 'not-allowed',
        },

        [`&&-disabled &-btn,
          &&-disabled &-remove`]: {
          [` &:focus,
            &:active `]: {
            color: `${token.colorTextDisabled}`,
          },
        },

        [` & &-remove .@:{iconfont-css-prefix} `]: {
          margin: 0,
        },

        [` .@:{iconfont-css-prefix} `]: {
          marginRight: `${token.marginSM}`,
        },
      },

      [` &-tab + &-tab `]: {
        // @tabs-horizontal-margin
        margin: `${token.margin} `,
      },

      // =========================== TabPanes ===========================
      [` &-content `]: {
        [` &-holder`]: {
          flex: 'auto',
          minWidth: 0,
          minHeight: 0,
        },

        display: 'flex',
        width: '100%',

        [` &-animated`]: {
          transition: `margin ${token.motionDurationSlow}`,
        },
      },

      [` &-tabpane `]: {
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
      a: 1,
    });
    return [genTabsSmallStyle(tabsToken)];
  },
  {},
);
