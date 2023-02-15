import { Keyframes } from '../../_util/cssinjs';
import type { UploadToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const uploadAnimateInlineIn = new Keyframes('uploadAnimateInlineIn', {
  from: {
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
  },
});

const uploadAnimateInlineOut = new Keyframes('uploadAnimateInlineOut', {
  to: {
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
  },
});
// =========================== Motion ===========================
const genMotionStyle: GenerateStyle<UploadToken> = token => {
  const { componentCls } = token;
  const inlineCls = `${componentCls}-animate-inline`;

  return [
    {
      [`${componentCls}-wrapper`]: {
        [`${inlineCls}-appear, ${inlineCls}-enter, ${inlineCls}-leave`]: {
          animationDuration: token.motionDurationSlow,
          animationTimingFunction: token.motionEaseInOutCirc,
          animationFillMode: 'forwards',
        },

        [`${inlineCls}-appear, ${inlineCls}-enter`]: {
          animationName: uploadAnimateInlineIn,
        },

        [`${inlineCls}-leave`]: {
          animationName: uploadAnimateInlineOut,
        },
      },
    },
    uploadAnimateInlineIn,
    uploadAnimateInlineOut,
  ];
};

export default genMotionStyle;
