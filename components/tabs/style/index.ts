import { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genFocusStyle, resetComponent, textEllipsis } from '../../style';
import genMotionStyle from './motion';

export interface ComponentToken {
  zIndexPopup: number;
}

export interface TabsToken extends FullToken<'Tabs'> {
  tabsCardHorizontalPadding: string;
  tabsCardHeight: number;
  tabsCardGutter: number;
  tabsHoverColor: string;
  tabsActiveColor: string;
  tabsHorizontalGutter: number;
  tabsCardHeadBackground: string;
  dropdownEdgeChildVerticalPadding: number;
  tabsNavWrapPseudoWidth: number;
  tabsActiveTextShadow: string;
  tabsDropdownHeight: number;
  tabsDropdownWidth: number;
}

const genCardStyle: GenerateStyle<TabsToken> = (token: TabsToken): CSSObject => {
  const {
    componentCls,
    tabsCardHorizontalPadding,
    tabsCardHeadBackground,
    tabsCardGutter,
    colorSplit,
  } = token;
  return {
    [`${componentCls}-card`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        [`${componentCls}-tab`]: {
          margin: 0,
          padding: tabsCardHorizontalPadding,
          background: tabsCardHeadBackground,
          border: `${token.lineWidth}px ${token.lineType} ${colorSplit}`,
          transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        },

        [`${componentCls}-tab-active`]: {
          color: token.colorPrimary,
          background: token.colorBgContainer,
        },

        [`${componentCls}-ink-bar`]: {
          visibility: 'hidden',
        },
      },

      // ========================== Top & Bottom ==========================
      [`&${componentCls}-top, &${componentCls}-bottom`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab + ${componentCls}-tab`]: {
            marginLeft: {
              _skip_check_: true,
              value: `${tabsCardGutter}px`,
            },
          },
        },
      },

      [`&${componentCls}-top`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
          },

          [`${componentCls}-tab-active`]: {
            borderBottomColor: token.colorBgContainer,
          },
        },
      },

      [`&${componentCls}-bottom`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            borderRadius: `0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px`,
          },

          [`${componentCls}-tab-active`]: {
            borderTopColor: token.colorBgContainer,
          },
        },
      },

      // ========================== Left & Right ==========================
      [`&${componentCls}-left, &${componentCls}-right`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab + ${componentCls}-tab`]: {
            marginTop: `${tabsCardGutter}px`,
          },
        },
      },

      [`&${componentCls}-left`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `${token.borderRadiusLG}px 0 0 ${token.borderRadiusLG}px`,
            },
          },

          [`${componentCls}-tab-active`]: {
            borderRightColor: {
              _skip_check_: true,
              value: token.colorBgContainer,
            },
          },
        },
      },

      [`&${componentCls}-right`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0`,
            },
          },

          [`${componentCls}-tab-active`]: {
            borderLeftColor: {
              _skip_check_: true,
              value: token.colorBgContainer,
            },
          },
        },
      },
    },
  };
};

const genDropdownStyle: GenerateStyle<TabsToken> = (token: TabsToken): CSSObject => {
  const { componentCls, tabsHoverColor, dropdownEdgeChildVerticalPadding } = token;
  return {
    [`${componentCls}-dropdown`]: {
      ...resetComponent(token),

      position: 'absolute',
      top: -9999,
      left: {
        _skip_check_: true,
        value: -9999,
      },
      zIndex: token.zIndexPopup,
      display: 'block',

      '&-hidden': {
        display: 'none',
      },

      [`${componentCls}-dropdown-menu`]: {
        maxHeight: token.tabsDropdownHeight,
        margin: 0,
        padding: `${dropdownEdgeChildVerticalPadding}px 0`,
        overflowX: 'hidden',
        overflowY: 'auto',
        textAlign: {
          _skip_check_: true,
          value: 'left',
        },
        listStyleType: 'none',
        backgroundColor: token.colorBgContainer,
        backgroundClip: 'padding-box',
        borderRadius: token.borderRadiusLG,
        outline: 'none',
        boxShadow: token.boxShadowSecondary,

        '&-item': {
          ...textEllipsis,
          display: 'flex',
          alignItems: 'center',
          minWidth: token.tabsDropdownWidth,
          margin: 0,
          padding: `${token.paddingXXS}px ${token.paddingSM}px`,
          color: token.colorText,
          fontWeight: 'normal',
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          cursor: 'pointer',
          transition: `all ${token.motionDurationSlow}`,

          '> span': {
            flex: 1,
            whiteSpace: 'nowrap',
          },

          '&-remove': {
            flex: 'none',
            marginLeft: {
              _skip_check_: true,
              value: token.marginSM,
            },
            color: token.colorTextDescription,
            fontSize: token.fontSizeSM,
            background: 'transparent',
            border: 0,
            cursor: 'pointer',

            '&:hover': {
              color: tabsHoverColor,
            },
          },

          '&:hover': {
            background: token.controlItemBgHover,
          },

          '&-disabled': {
            '&, &:hover': {
              color: token.colorTextDisabled,
              background: 'transparent',
              cursor: 'not-allowed',
            },
          },
        },
      },
    },
  };
};

const genPositionStyle: GenerateStyle<TabsToken> = (token: TabsToken): CSSObject => {
  const { componentCls, margin, colorSplit } = token;
  return {
    // ========================== Top & Bottom ==========================
    [`${componentCls}-top, ${componentCls}-bottom`]: {
      flexDirection: 'column',

      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        margin: `0 0 ${margin}px 0`,

        '&::before': {
          position: 'absolute',
          right: {
            _skip_check_: true,
            value: 0,
          },
          left: {
            _skip_check_: true,
            value: 0,
          },
          borderBottom: `${token.lineWidth}px ${token.lineType} ${colorSplit}`,
          content: "''",
        },

        [`${componentCls}-ink-bar`]: {
          height: token.lineWidthBold,

          '&-animated': {
            transition: `width ${token.motionDurationSlow}, left ${token.motionDurationSlow},
            right ${token.motionDurationSlow}`,
          },
        },

        [`${componentCls}-nav-wrap`]: {
          '&::before, &::after': {
            top: 0,
            bottom: 0,
            width: token.controlHeight,
          },

          '&::before': {
            left: {
              _skip_check_: true,
              value: 0,
            },
            boxShadow: token.boxShadowTabsOverflowLeft,
          },

          '&::after': {
            right: {
              _skip_check_: true,
              value: 0,
            },
            boxShadow: token.boxShadowTabsOverflowRight,
          },

          [`&${componentCls}-nav-wrap-ping-left::before`]: {
            opacity: 1,
          },
          [`&${componentCls}-nav-wrap-ping-right::after`]: {
            opacity: 1,
          },
        },
      },
    },

    [`${componentCls}-top`]: {
      [`> ${componentCls}-nav,
        > div > ${componentCls}-nav`]: {
        '&::before': {
          bottom: 0,
        },

        [`${componentCls}-ink-bar`]: {
          bottom: 0,
        },
      },
    },

    [`${componentCls}-bottom`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        order: 1,
        marginTop: `${margin}px`,
        marginBottom: 0,

        '&::before': {
          top: 0,
        },

        [`${componentCls}-ink-bar`]: {
          top: 0,
        },
      },

      [`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: {
        order: 0,
      },
    },

    // ========================== Left & Right ==========================
    [`${componentCls}-left, ${componentCls}-right`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        flexDirection: 'column',
        minWidth: token.controlHeight * 1.25,

        // >>>>>>>>>>> Tab
        [`${componentCls}-tab`]: {
          padding: `${token.paddingXS}px ${token.paddingLG}px`,
          textAlign: 'center',
        },

        [`${componentCls}-tab + ${componentCls}-tab`]: {
          margin: `${token.margin}px 0 0 0`,
        },

        // >>>>>>>>>>> Nav
        [`${componentCls}-nav-wrap`]: {
          flexDirection: 'column',

          '&::before, &::after': {
            right: {
              _skip_check_: true,
              value: 0,
            },
            left: {
              _skip_check_: true,
              value: 0,
            },
            height: token.controlHeight,
          },

          '&::before': {
            top: 0,
            boxShadow: token.boxShadowTabsOverflowTop,
          },

          '&::after': {
            bottom: 0,
            boxShadow: token.boxShadowTabsOverflowBottom,
          },

          [`&${componentCls}-nav-wrap-ping-top::before`]: {
            opacity: 1,
          },

          [`&${componentCls}-nav-wrap-ping-bottom::after`]: {
            opacity: 1,
          },
        },

        // >>>>>>>>>>> Ink Bar
        [`${componentCls}-ink-bar`]: {
          width: token.lineWidthBold,

          '&-animated': {
            transition: `height ${token.motionDurationSlow}, top ${token.motionDurationSlow}`,
          },
        },

        [`${componentCls}-nav-list, ${componentCls}-nav-operations`]: {
          flex: '1 0 auto', // fix safari scroll problem
          flexDirection: 'column',
        },
      },
    },

    [`${componentCls}-left`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        [`${componentCls}-ink-bar`]: {
          right: {
            _skip_check_: true,
            value: 0,
          },
        },
      },

      [`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: {
        marginLeft: {
          _skip_check_: true,
          value: `-${token.lineWidth}px`,
        },
        borderLeft: {
          _skip_check_: true,
          value: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
        },

        [`> ${componentCls}-content > ${componentCls}-tabpane`]: {
          paddingLeft: {
            _skip_check_: true,
            value: token.paddingLG,
          },
        },
      },
    },

    [`${componentCls}-right`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        order: 1,

        [`${componentCls}-ink-bar`]: {
          left: {
            _skip_check_: true,
            value: 0,
          },
        },
      },

      [`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: {
        order: 0,
        marginRight: {
          _skip_check_: true,
          value: -token.lineWidth,
        },
        borderRight: {
          _skip_check_: true,
          value: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
        },

        [`> ${componentCls}-content > ${componentCls}-tabpane`]: {
          paddingRight: {
            _skip_check_: true,
            value: token.paddingLG,
          },
        },
      },
    },
  };
};

const genSizeStyle: GenerateStyle<TabsToken> = (token: TabsToken): CSSObject => {
  const { componentCls, padding } = token;
  return {
    [componentCls]: {
      '&-small': {
        [`> ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            padding: `${token.paddingXS}px 0`,
            fontSize: token.fontSize,
          },
        },
      },

      '&-large': {
        [`> ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            padding: `${padding}px 0`,
            fontSize: token.fontSizeLG,
          },
        },
      },
    },

    [`${componentCls}-card`]: {
      [`&${componentCls}-small`]: {
        [`> ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            padding: `${token.paddingXXS * 1.5}px ${padding}px`,
          },
        },
        [`&${componentCls}-bottom`]: {
          [`> ${componentCls}-nav ${componentCls}-tab`]: {
            borderRadius: `0 0 ${token.borderRadius}px ${token.borderRadius}px`,
          },
        },
        [`&${componentCls}-top`]: {
          [`> ${componentCls}-nav ${componentCls}-tab`]: {
            borderRadius: `${token.borderRadius}px ${token.borderRadius}px 0 0`,
          },
        },
        [`&${componentCls}-right`]: {
          [`> ${componentCls}-nav ${componentCls}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `0 ${token.borderRadius}px ${token.borderRadius}px 0`,
            },
          },
        },
        [`&${componentCls}-left`]: {
          [`> ${componentCls}-nav ${componentCls}-tab`]: {
            borderRadius: {
              _skip_check_: true,
              value: `${token.borderRadius}px 0 0 ${token.borderRadius}px`,
            },
          },
        },
      },

      [`&${componentCls}-large`]: {
        [`> ${componentCls}-nav`]: {
          [`${componentCls}-tab`]: {
            padding: `${token.paddingXS}px ${padding}px ${token.paddingXXS * 1.5}px`,
          },
        },
      },
    },
  };
};

const genTabStyle: GenerateStyle<TabsToken, CSSObject> = (token: TabsToken) => {
  const { componentCls, tabsActiveColor, tabsHoverColor, iconCls, tabsHorizontalGutter } = token;

  const tabCls = `${componentCls}-tab`;

  return {
    [tabCls]: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${token.paddingSM}px 0`,
      fontSize: `${token.fontSize}px`,
      background: 'transparent',
      border: 0,
      outline: 'none',
      cursor: 'pointer',
      '&-btn, &-remove': {
        '&:focus:not(:focus-visible), &:active': {
          color: tabsActiveColor,
        },
        ...genFocusStyle(token),
      },
      '&-btn': {
        outline: 'none',
        transition: 'all 0.3s',
      },
      '&-remove': {
        flex: 'none',
        marginRight: {
          _skip_check_: true,
          value: -token.marginXXS,
        },
        marginLeft: {
          _skip_check_: true,
          value: token.marginXS,
        },
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        transition: `all ${token.motionDurationSlow}`,
        '&:hover': {
          color: token.colorTextHeading,
        },
      },
      '&:hover': {
        color: tabsHoverColor,
      },

      [`&${tabCls}-active ${tabCls}-btn`]: {
        color: token.colorPrimary,
        textShadow: token.tabsActiveTextShadow,
      },

      [`&${tabCls}-disabled`]: {
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
      },
      [`&${tabCls}-disabled ${tabCls}-btn, &${tabCls}-disabled ${componentCls}-remove`]: {
        '&:focus, &:active': {
          color: token.colorTextDisabled,
        },
      },
      [`& ${tabCls}-remove ${iconCls}`]: {
        margin: 0,
      },
      [iconCls]: {
        marginRight: {
          _skip_check_: true,
          value: token.marginSM,
        },
      },
    },

    [`${tabCls} + ${tabCls}`]: {
      margin: {
        _skip_check_: true,
        value: `0 0 0 ${tabsHorizontalGutter}px`,
      },
    },
  };
};

const genRtlStyle: GenerateStyle<TabsToken, CSSObject> = (token: TabsToken) => {
  const { componentCls, tabsHorizontalGutter, iconCls, tabsCardGutter } = token;
  const rtlCls = `${componentCls}-rtl`;
  return {
    [rtlCls]: {
      direction: 'rtl',

      [`${componentCls}-nav`]: {
        [`${componentCls}-tab`]: {
          margin: {
            _skip_check_: true,
            value: `0 0 0 ${tabsHorizontalGutter}px`,
          },

          [`${componentCls}-tab:last-of-type`]: {
            marginLeft: {
              _skip_check_: true,
              value: 0,
            },
          },

          [iconCls]: {
            marginRight: {
              _skip_check_: true,
              value: 0,
            },
            marginLeft: {
              _skip_check_: true,
              value: `${token.marginSM}px`,
            },
          },

          [`${componentCls}-tab-remove`]: {
            marginRight: {
              _skip_check_: true,
              value: `${token.marginXS}px`,
            },
            marginLeft: {
              _skip_check_: true,
              value: `-${token.marginXXS}px`,
            },

            [iconCls]: {
              margin: 0,
            },
          },
        },
      },

      [`&${componentCls}-left`]: {
        [`> ${componentCls}-nav`]: {
          order: 1,
        },

        [`> ${componentCls}-content-holder`]: {
          order: 0,
        },
      },

      [`&${componentCls}-right`]: {
        [`> ${componentCls}-nav`]: {
          order: 0,
        },

        [`> ${componentCls}-content-holder`]: {
          order: 1,
        },
      },

      // ====================== Card ======================
      [`&${componentCls}-card${componentCls}-top, &${componentCls}-card${componentCls}-bottom`]: {
        [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
          [`${componentCls}-tab + ${componentCls}-tab`]: {
            marginRight: {
              _skip_check_: true,
              value: `${tabsCardGutter}px`,
            },
            marginLeft: { _skip_check_: true, value: 0 },
          },
        },
      },
    },

    [`${componentCls}-dropdown-rtl`]: {
      direction: 'rtl',
    },

    [`${componentCls}-menu-item`]: {
      [`${componentCls}-dropdown-rtl`]: {
        textAlign: {
          _skip_check_: true,
          value: 'right',
        },
      },
    },
  };
};

const genTabsStyle: GenerateStyle<TabsToken> = (token: TabsToken): CSSObject => {
  const {
    componentCls,
    tabsCardHorizontalPadding,
    tabsCardHeight,
    tabsCardGutter,
    tabsHoverColor,
    tabsActiveColor,
    colorSplit,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'flex',

      // ========================== Navigation ==========================
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
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
          '&::before, &::after': {
            position: 'absolute',
            zIndex: 1,
            opacity: 0,
            transition: `opacity ${token.motionDurationSlow}`,
            content: "''",
            pointerEvents: 'none',
          },
        },

        [`${componentCls}-nav-list`]: {
          position: 'relative',
          display: 'flex',
          transition: `opacity ${token.motionDurationSlow}`,
        },

        // >>>>>>>> Operations
        [`${componentCls}-nav-operations`]: {
          display: 'flex',
          alignSelf: 'stretch',
        },

        [`${componentCls}-nav-operations-hidden`]: {
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
        },

        [`${componentCls}-nav-more`]: {
          position: 'relative',
          padding: tabsCardHorizontalPadding,
          background: 'transparent',
          border: 0,

          '&::after': {
            position: 'absolute',
            right: {
              _skip_check_: true,
              value: 0,
            },
            bottom: 0,
            left: {
              _skip_check_: true,
              value: 0,
            },
            height: token.controlHeightLG / 8,
            transform: 'translateY(100%)',
            content: "''",
          },
        },

        [`${componentCls}-nav-add`]: {
          minWidth: `${tabsCardHeight}px`,
          marginLeft: {
            _skip_check_: true,
            value: `${tabsCardGutter}px`,
          },
          padding: `0 ${token.paddingXS}px`,
          background: 'transparent',
          border: `${token.lineWidth}px ${token.lineType} ${colorSplit}`,
          borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
          outline: 'none',
          cursor: 'pointer',
          color: token.colorText,
          transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut}`,

          '&:hover': {
            color: tabsHoverColor,
          },

          '&:active, &:focus:not(:focus-visible)': {
            color: tabsActiveColor,
          },

          ...genFocusStyle(token),
        },
      },

      [`${componentCls}-extra-content`]: {
        flex: 'none',
      },

      // ============================ InkBar ============================
      [`${componentCls}-ink-bar`]: {
        position: 'absolute',
        background: token.colorPrimary,
        pointerEvents: 'none',
      },

      // ============================= Tabs =============================
      ...genTabStyle(token),

      // =========================== TabPanes ===========================
      [`${componentCls}-content`]: {
        position: 'relative',
        width: '100%',
      },

      [`${componentCls}-content-holder`]: {
        flex: 'auto',
        minWidth: 0,
        minHeight: 0,
      },

      [`${componentCls}-tabpane`]: {
        outline: 'none',
        '&-hidden': {
          display: 'none',
        },
      },
    },

    [`${componentCls}-centered`]: {
      [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
        [`${componentCls}-nav-wrap`]: {
          [`&:not([class*='${componentCls}-nav-wrap-ping'])`]: {
            justifyContent: 'center',
          },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Tabs',
  token => {
    const tabsCardHeight = token.controlHeightLG;

    const tabsToken = mergeToken<TabsToken>(token, {
      tabsHoverColor: token.colorPrimaryHover,
      tabsActiveColor: token.colorPrimaryActive,

      tabsCardHorizontalPadding: `${
        (tabsCardHeight - Math.round(token.fontSize * token.lineHeight)) / 2 - token.lineWidth
      }px ${token.padding}px`,
      tabsCardHeight,
      tabsCardGutter: token.marginXXS / 2,
      tabsHorizontalGutter: 32, // Fixed Value
      tabsCardHeadBackground: token.colorFillAlter,
      dropdownEdgeChildVerticalPadding: token.paddingXXS,
      tabsActiveTextShadow: '0 0 0.25px currentcolor',
      tabsDropdownHeight: 200,
      tabsDropdownWidth: 120,
    });

    return [
      genSizeStyle(tabsToken),
      genRtlStyle(tabsToken),
      genPositionStyle(tabsToken),
      genDropdownStyle(tabsToken),
      genCardStyle(tabsToken),
      genTabsStyle(tabsToken),
      genMotionStyle(tabsToken),
    ];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
  }),
);
