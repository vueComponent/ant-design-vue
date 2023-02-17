import type { CSSObject } from '../../_util/cssinjs';

export const genTabsPositionStyle = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [`&-top,
        &-bottom`]: {
      flexDirection: 'column',
      [`${componentCls}-nav, div >${componentCls}-nav`]: {
        margin: ` 0 0 ${token.margin}px `,
        [`&::before`]: {
          position: 'absolute',
          right:0,
          left: 0,
          borderBottom: `${token.lineWidth}px ${token.colorBorder}   ${token.lineType} `,
          content: '""',
        },
        [`${componentCls}-ink-bar`]: {
          height: ' 2px',
          [`&-animated`]: {
            transition: `width ${token.motionDurationSlow} , left ${token.motionDurationSlow},
                  right `,
          },
        },

        [`${componentCls}-nav-wrap`]: {
          [`&::before,
          &::after`]: {
            top: 0,
            bottom: 0,
            width:'30px',
          },

          [` &::before`]: {
            left: 0,
            boxShadow: `${token.boxShadowTabsOverflowBottom}`,
          },

          [` &::after`]: {
            right: 0,
            boxShadow: `${token.boxShadowTabsOverflowRight}`,
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

    [`&-top`]: {
      [`${componentCls}-nav,
      div >${componentCls}-nav`]: {
        [`&::before`]: {
          bottom: 0,
        },

        [`${componentCls}-ink-bar`]: {
          bottom: 0,
        },
      },
    },

    [`&-bottom`]: {

      [`${componentCls}-nav,
           div >${componentCls}-nav`]: {
        order: 1,
        marginTop: `  ${token.margin}px`,
        marginBottom: 0,
        [` &::before`]: {
          top: 0,
        },

        [`${componentCls}-ink-bar`]: {
          top: 0,
        },
      },

      [`${componentCls}-content-holder,
           div >${componentCls}-content-holder`]: {
        order: 0,
      },
    },

    // ========================== Left & Right ==========================
    [`&-left,
       &-right`]: {
      [`${componentCls}-nav, div>${componentCls}-nav`]: {
        flexDirection: 'column',
        minWidth: '50px',
        // >>>>>>>>>>> Tab
        [`${componentCls}-tab`]: {
          padding: ` ${token.padding}px`,
          textAlign: 'center',
        },

        [`${componentCls}-tab + ${componentCls}-tab`]: {
          margin: `  ${token.margin}px 0 0 0`,
        },

        // >>>>>>>>>>> Nav
        [`${componentCls}-nav-wrap`]: {
          flexDirection: 'column',
          [`&::before,
          &::after`]: {
            right: 0,
            left: 0,
            height: '30px',
          },

          [`&::before`]: {
            top: 0,
            boxShadow: `${token.boxShadowTabsOverflowTop}`,
          },

          [`&::after`]: {
            bottom: 0,
            boxShadow: `${token.boxShadowTabsOverflowBottom}`,
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
          width: `2px`,

          [`&-animated`]: {
            transition: `height ${token.motionDurationSlow}, top ${token.motionDurationSlow}`,
          },
        },

        [`${componentCls}-nav-list,
        ${componentCls}-nav-operations`]: {
          // color: '#fff',
          flex: `1 0 auto`, // fix safari scroll problem
          flexDirection: `column`,
        },
      },
    },

    [`&-left`]: {
      [`${componentCls}-nav,
           div >${componentCls}-nav`]: {
        [`${componentCls}-ink-bar`]: {
          right: 0,
        },
      },

      [`${componentCls}-content-holder,
           div >&-content-holder`]: {
        marginLeft: `-${token.lineWidth}px`,
        borderLeft: `${token.lineWidth}px ${token.colorBorder}   ${token.lineType} `,
        [` ${componentCls}-content > ${componentCls}-tabpane`]: {
          paddingLeft: `${token.paddingLG}px`,
        },
      },
    },

    [`&-right`]: {
      [` ${componentCls}-nav,
           div >${componentCls}-nav`]: {
           order: 1,

        [`${componentCls}-ink-bar`]: {
          left: 0,
        },
      },
      [`${componentCls}-content-holder,
           div >${componentCls}-content-holder`]: {
        order: 0,
        marginLeft: ` -${token.lineWidth}px`,
        borderRight: `${token.lineWidth}px ${token.colorBorder}   ${token.lineType} `,

        [`${componentCls}-content >${componentCls}-tabpane`]: {
          paddingLeft: ` ${token.paddingLG}px`,
        },
      },
    },
  };
};
