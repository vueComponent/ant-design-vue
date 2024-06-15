import { FullToken, genComponentStyleHook, type GenerateStyle } from '../../theme/internal';
import { initInputToken, type InputToken } from './index';

const genOTPInputStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { componentCls, paddingXS } = token;

  return {
    [`${componentCls}`]: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      columnGap: paddingXS,
      padding: 0,
      // border: 'none',

      '&-rtl': {
        direction: 'rtl',
      },

      [`${componentCls}-input`]: {
        textAlign: 'center',
        paddingInline: token.paddingXXS,
      },

      // ================= Size =====================
      [`&${componentCls}-sm ${componentCls}-input`]: {
        paddingInline: token.paddingXXS / 2,
      },

      [`&${componentCls}-lg ${componentCls}-input`]: {
        paddingInline: token.paddingXS,
      },
    },
  };
};

// ================ EXPORT =======================
export default genComponentStyleHook('Input', token => {
  const inputToken = initInputToken<FullToken<'Input'>>(token);

  return [genOTPInputStyle(inputToken)];
});
