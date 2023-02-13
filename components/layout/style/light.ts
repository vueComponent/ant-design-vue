import type { CSSObject } from '../../_util/cssinjs';
import type { LayoutToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genLayoutLightStyle: GenerateStyle<LayoutToken, CSSObject> = token => {
  const { componentCls, colorBgContainer, colorBgBody, colorText } = token;

  return {
    [`${componentCls}-sider-light`]: {
      background: colorBgContainer,

      [`${componentCls}-sider-trigger`]: {
        color: colorText,
        background: colorBgContainer,
      },

      [`${componentCls}-sider-zero-width-trigger`]: {
        color: colorText,
        background: colorBgContainer,
        border: `1px solid ${colorBgBody}`, // Safe to modify to any other color
        borderInlineStart: 0,
      },
    },
  };
};

export default genLayoutLightStyle;
