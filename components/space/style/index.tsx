import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import genSpaceCompactStyle from './compact';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
}

interface SpaceToken extends FullToken<'Space'> {
  // Custom token here
}

const genSpaceStyle: GenerateStyle<SpaceToken> = token => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'inline-flex',
      '&-rtl': {
        direction: 'rtl',
      },
      '&-vertical': {
        flexDirection: 'column',
      },
      '&-align': {
        flexDirection: 'column',
        '&-center': {
          alignItems: 'center',
        },
        '&-start': {
          alignItems: 'flex-start',
        },
        '&-end': {
          alignItems: 'flex-end',
        },
        '&-baseline': {
          alignItems: 'baseline',
        },
      },
      [`${componentCls}-space-item`]: {
        '&:empty': {
          display: 'none',
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Space', token => [
  genSpaceStyle(token),
  genSpaceCompactStyle(token),
]);
