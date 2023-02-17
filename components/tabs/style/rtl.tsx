import type { CSSObject } from '../../_util/cssinjs';
import {tabsCardStyle } from './card'
export const genRtlStyle = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [`&-rtl `]: {
      direction: 'rtl',
      [`${componentCls}-nav `]: {
        [`  ${componentCls}-tab `]: {
          margin: ` ${token.tabsHorizontalMarginRtl}`,

          [`   &:last-of-type`]: {
            marginLeft: 0,
          },

          [` ${token.iconCls}`]: {
            marginRight: 0,
            marginLeft: `${token.marginSM}`,
          },

          [` ${componentCls}-tab-remove `]: {
            marginRight: `${token.marginXS}`,
            marginLeft: `${token.marginXXS}`,
            [` ${token.iconCls} ${token.ico}`]: {
              margin: 0,
            },
          },
        },
      },

      [`& ${componentCls}-left`]: {
        [`${componentCls}-nav`]: {
          order: 1,
        },
        [`${componentCls}-content-holder `]: {
          order: 0,
        },
      },

      [` & ${componentCls}-right `]: {
        [`${componentCls}-nav `]: {
          order: 0,
        },
        [`${componentCls}-content-holder`]: {
          order: 1,
        },
      },
    },

    // ====================== Card ======================
    [`&-card`]: {
      [` & ${componentCls}-top,
      & ${componentCls}-bottom`]: {
        [` ${componentCls}-nav,
         div >${componentCls}-nav `]: {
          [` ${componentCls}-tab +${componentCls}-tab`]: {
            [` ${componentCls}-rtl& `]: {
              marginRight: `${tabsCardStyle.tabsCardGutter}`,
              marginLeft: 0,
            },
          },
          [` ${componentCls}-nav-add`]: {
            [` ${componentCls}-rtl& `]: {
              marginRight: `${tabsCardStyle.tabsCardGutter}`,
              marginLeft: 0,
            },
          },
        },
      },
    },
    [` ${componentCls}-dropdown `]: {
      [`  &-rtl `]: {
        direction: 'rtl',
      },
      [` &-menu-item `]: {
        [`${componentCls}-dropdown-rtl & `]: {
          textAlign: 'right',
        },
      },
    },
  };
};
