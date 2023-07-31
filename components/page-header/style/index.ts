import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';
import { operationUnit } from '../../style';

interface PageHeaderToken extends FullToken<'PageHeader'> {
  pageHeaderPadding: number;
  pageHeaderPaddingVertical: number;
  pageHeaderPaddingBreadcrumb: number;
  pageHeaderGhostBg: string;
  pageHeaderBackColor: string;
  pageHeaderHeadingTitle: number;
  pageHeaderHeadingSubTitle: number;
  pageHeaderContentPaddingVertical: number;
  pageHeaderTabFontSize: number;
}

const genPageHeaderStyle: GenerateStyle<PageHeaderToken, CSSObject> = token => {
  const { componentCls, antCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      padding: `${token.pageHeaderPaddingVertical}px ${token.pageHeaderPadding}px`,
      backgroundColor: token.colorBgContainer,

      [`&${componentCls}-ghost`]: {
        backgroundColor: token.pageHeaderGhostBg,
      },

      [`&.has-footer`]: {
        paddingBottom: 0,
      },

      [`${componentCls}-back`]: {
        marginRight: token.marginMD,
        fontSize: token.fontSizeLG,
        lineHeight: 1,

        [`&-button`]: {
          ...operationUnit(token),
          color: token.pageHeaderBackColor,
          cursor: 'pointer',
        },
      },

      [`${antCls}-divider-vertical`]: {
        height: '14px',
        margin: `0 ${token.marginSM}`,
        verticalAlign: 'middle',
      },

      [`${antCls}-breadcrumb + &-heading`]: {
        marginTop: token.marginXS,
      },

      [`${componentCls}-heading`]: {
        display: 'flex',
        justifyContent: 'space-between',

        [`&-left`]: {
          display: 'flex',
          alignItems: 'center',
          margin: `${token.marginXS / 2}px 0`,
          overflow: 'hidden',
        },

        [`&-title`]: {
          marginRight: token.marginSM,
          marginBottom: 0,
          color: token.colorTextHeading,
          fontWeight: 600,
          fontSize: token.pageHeaderHeadingTitle,
          lineHeight: `${token.controlHeight}px`,
          ...textEllipsis,
        },

        [`${antCls}-avatar`]: {
          marginRight: token.marginSM,
        },

        [`&-sub-title`]: {
          marginRight: token.marginSM,
          color: token.colorTextDescription,
          fontSize: token.pageHeaderHeadingSubTitle,
          lineHeight: token.lineHeight,
          ...textEllipsis,
        },

        [`&-extra`]: {
          margin: `${token.marginXS / 2}px 0`,
          whiteSpace: 'nowrap',

          [`> *`]: {
            marginLeft: token.marginSM,
            whiteSpace: 'unset',
          },

          [`> *:first-child`]: {
            marginLeft: 0,
          },
        },
      },

      [`${componentCls}-content`]: {
        paddingTop: token.pageHeaderContentPaddingVertical,
      },

      [`${componentCls}-footer`]: {
        marginTop: token.marginMD,
        [`${antCls}-tabs`]: {
          [`> ${antCls}-tabs-nav`]: {
            margin: 0,

            [`&::before`]: {
              border: 'none',
            },
          },
          [`${antCls}-tabs-tab`]: {
            paddingTop: token.paddingXS,
            paddingBottom: token.paddingXS,
            fontSize: token.pageHeaderTabFontSize,
          },
        },
      },

      [`${componentCls}-compact ${componentCls}-heading`]: {
        flexWrap: 'wrap',
      },

      // rtl style
      [`&${token.componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('PageHeader', token => {
  const PageHeaderToken = mergeToken<PageHeaderToken>(token, {
    pageHeaderPadding: token.paddingLG,
    pageHeaderPaddingVertical: token.paddingMD,
    pageHeaderPaddingBreadcrumb: token.paddingSM,
    pageHeaderContentPaddingVertical: token.paddingSM,
    pageHeaderBackColor: token.colorTextBase,
    pageHeaderGhostBg: 'transparent',
    pageHeaderHeadingTitle: token.fontSizeHeading4,
    pageHeaderHeadingSubTitle: token.fontSize,
    pageHeaderTabFontSize: token.fontSizeLG,
  });

  return [genPageHeaderStyle(PageHeaderToken)];
});
