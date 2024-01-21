// Style as inline component
import type { ButtonToken } from './token';
import { prepareComponentToken, prepareToken } from './token';
import { genCompactItemStyle } from '../../style/compact-item';
import { genCompactItemVerticalStyle } from '../../style/compact-item-vertical';
import type { GenerateStyle } from '../../_theme/internal';
import { genSubStyleComponent } from '../../_theme/internal';
import type { CSSObject } from '../../_util/_cssinjs';
import { unit } from '../../_util/_cssinjs';

const genButtonCompactStyle: GenerateStyle<ButtonToken, CSSObject> = token => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      // Special styles for Primary Button
      [`&-compact-item${componentCls}-primary`]: {
        [`&:not([disabled]) + ${componentCls}-compact-item${componentCls}-primary:not([disabled])`]:
          {
            position: 'relative',

            '&:before': {
              position: 'absolute',
              top: calc(token.lineWidth).mul(-1).equal(),
              insetInlineStart: calc(token.lineWidth).mul(-1).equal(),
              display: 'inline-block',
              width: token.lineWidth,
              height: `calc(100% + ${unit(token.lineWidth)} * 2)`,
              backgroundColor: token.colorPrimaryHover,
              content: '""',
            },
          },
      },
      // Special styles for Primary Button
      '&-compact-vertical-item': {
        [`&${componentCls}-primary`]: {
          [`&:not([disabled]) + ${componentCls}-compact-vertical-item${componentCls}-primary:not([disabled])`]:
            {
              position: 'relative',

              '&:before': {
                position: 'absolute',
                top: calc(token.lineWidth).mul(-1).equal(),
                insetInlineStart: calc(token.lineWidth).mul(-1).equal(),
                display: 'inline-block',
                width: `calc(100% + ${unit(token.lineWidth)} * 2)`,
                height: token.lineWidth,
                backgroundColor: token.colorPrimaryHover,
                content: '""',
              },
            },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genSubStyleComponent(
  ['Button', 'compact'],
  token => {
    const buttonToken = prepareToken(token);

    return [
      // Space Compact
      genCompactItemStyle(buttonToken),
      genCompactItemVerticalStyle(buttonToken),
      genButtonCompactStyle(buttonToken),
    ] as CSSObject[];
  },
  prepareComponentToken,
);
