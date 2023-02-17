import type { CSSObject } from '../../_util/cssinjs';

export const genTabsSizeStyle = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [`&-small`]: {
      [`${componentCls}-nav`]: {
        [`${componentCls}-tab`]: {
          padding: ` ${token.paddingXS}px 0`,
          fontSize: ` ${token.fontSize}px`,
        },
      },
    },

    [`&-large`]: {
      [`${componentCls}-nav `]: {
        [`  ${componentCls}-tab`]: {
          padding: ` ${token.paddingLG}px 0`,
          fontSize: ` ${token.fontSizeLG}px`,
        },
      },
    },

    [`&-card `]: {
      [`& ${componentCls}-small `]: {
        [`${componentCls}-nav`]: {
          [`    ${componentCls}-tab`]: {
            padding: ` ${token.paddingSM}px`,
          },
        },
      },

      [`&-large`]: {
        [` > ${componentCls}-nav `]: {
          [`${componentCls}-tab`]: {
            padding: ` ${token.paddingLG}px 0`,
          },
        },
      },
    },
  };
};
