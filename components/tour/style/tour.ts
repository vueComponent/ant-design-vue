import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import { TourToken } from '.';

const genTourStyle: GenerateStyle<TourToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}`]: {
      position: 'absolute',
      zIndex: 1070,
      display: 'block',
      visibility: 'visible',
      fontSize: '12px',
      lineHeight: 1.5,
      opacity: 0.9,
      minWidth: '520px',
      minHeight: '200px',
      [`&-hidden`]: {
        display: 'none',
      },
      [[`&-placement-top`, `&-placement-topLeft`, `&-placement-topRight`].join(',')]: {
        padding: '5px 0 9px 0',
      },
      [[`&-placement-right`, `&-placement-rightTop`, `&-placement-rightBottom`].join(',')]: {
        padding: '0 5px 0 9px',
      },
      [[`&-placement-bottom`, `&-placement-bottomLeft`, `&-placement-bottomRight`].join(',')]: {
        padding: '9px 0 5px 0',
      },
      [[`&-placement-left`, `&-placement-leftTop`, `&-placement-leftBottom`].join(',')]: {
        padding: '0 9px 0 5px',
      },
    },
    // Wrapper for the tour content
    [`${componentCls}-inner`]: {
      textAlign: 'left',
      textDecoration: 'none',
      borderRadius: '6px',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.17)',
      position: 'relative',
      backgroundColor: '#ffffff;',
      border: 'none',
      backgroundClip: 'padding-box',
      minHeight: '200px',
    },
    // Arrows
    [`${componentCls}-arrow`]: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderColor: 'transparent',
      borderStyle: 'solid',
    },
  };
};

export default genTourStyle;
