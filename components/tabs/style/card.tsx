import type { CSSObject } from '../../_util/cssinjs';

export const tabsCardStyle:{tabsCardGutter:string}={
  tabsCardGutter: '2px'
}
export const genTabscardStyle = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [` ${componentCls}-nav,
     div > ${componentCls}-nav `]: {
      [`${componentCls}-tab `]: {
        margin: 0,
        background: `${token.colorFillAlter}`,
        padding: `${token.paddingXS}px ${token.padding}px`,
        border:`${token.lineWidth}px ${token.colorBorder}   ${token.lineType} `, 
        transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut} `,

        [`&-active `]: {
          color: `  ${token.colorInfoActive}`,
          background: `${token.colorBgContainer}`,
        },
      },

      [`${componentCls}-ink-bar`]: {
        visibility: `hidden`,
      },
    },

    // ========================== Top & Bottom ==========================
    [`&${componentCls}-top,
    &${componentCls}-bottom`]: {
      [`${componentCls}-nav,
       div > ${componentCls}-nav `]: {
        [` ${componentCls}-tab + ${componentCls}-tab `]: {
          marginLeft: `${tabsCardStyle.tabsCardGutter} `,
        },
      },
    },

    [`&${componentCls}-top `]: {
      [`${componentCls}-nav,
       div > ${componentCls}-nav `]: {
        [`${componentCls}-tab `]: {
          borderRadius: ` ${token.radiusBase}px  ${token.radiusBase}px 0 0`,
          [`&-active `]: {
            borderBottomColor: `${token.colorBgContainer}`,
          },
        },
      },
    },
    [`&${componentCls}-bottom`]: {
      [`${componentCls}-nav,
       div > ${componentCls}-nav`]: {
        [` ${componentCls}-tab `]: {
          borderRadius: `0 0 ${token.radiusBase}px ${token.radiusBase}px`,

          [` &-active `]: {
            borderTopColor:  `${token.colorBgContainer}`,
          },
        },
      },
    },

    // ========================== Left & Right ==========================
    [`&${componentCls}-left,
    &${componentCls}-right`]: {
      [`   ${componentCls}-nav,
       div > ${componentCls}-nav `]: {
        [`   ${componentCls}-tab + ${componentCls}-tab`]: {
          marginTop: `${tabsCardStyle.tabsCardGutter}`,
        },
      },
    },

    [`&${componentCls}-left`]: {
      [` > ${componentCls}-nav,
      > div > ${componentCls}-nav`]: {
        [` ${componentCls}-tab`]: {
          borderRadius: `${token.radiusBase}px 0 0 ${token.radiusBase}px`,

          [` &-active`]: {
            borderRightColor: `${token.colorBgContainer}`,
          },
        },
      },
    },
    [` &${componentCls}-right `]: {
      [` ${componentCls}-nav,
       div > ${componentCls}-nav `]: {
        [`    ${componentCls}-tab `]: {
          borderRadius: `0 ${token.radiusBase}px ${token.radiusBase}px 0`,

          [`   &-active `]: {
            borderLeftColor:`${token.colorBgContainer}`,
          },
        },
      },
    },
  };
};
