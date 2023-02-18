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
      backgroundColor: '#ffffff',
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
    [componentCls]: {
      [[
        '&-placement-top &-arrow',
        '&-placement-topLeft &-arrow',
        '&-placement-topRight &-arrow',
      ].join(',')]: {
        bottom: '4px',
        marginLeft: '-5px',
        borderWidth: '5px 5px 0',
        borderTopColor: '#fff',
      },
      ['&-placement-top &-arrow']: {
        left: '50%',
      },
      '&-placement-topLeft &-arrow': {
        left: '15%',
      },
      '&-placement-topRight &-arrow': {
        right: '15%',
      },
      [[
        '&-placement-right &-arrow',
        '&-placement-rightTop &-arrow',
        '&-placement-rightBottom &-arrow',
      ].join(',')]: {
        bottom: '4px',
        marginLeft: '-5px',
        borderWidth: '5px 5px 5px 0',
        borderTopColor: '#fff',
      },
      '&-placement-right &-arrow': {
        left: '50%',
      },
      '&-placement-rightTop &-arrow': {
        left: '15%',
      },
      '&-placement-rightBottom &-arrow': {
        right: '15%',
      },

      [[
        '&-placement-left &-arrow',
        '&-placement-leftTop &-arrow',
        '&-placement-leftBottom &-arrow',
      ].join(',')]: {
        right: '4px',
        marginTop: '-5px',
        borderWidth: '5px 0 5px 5px',
        borderLeftColor: '#fff',
      },
      '&-placement-left &-arrow': {
        top: '15%',
      },
      '&-placement-leftTop &-arrow': {
        top: '15%',
        marginTop: 0,
      },
      '&-placement-leftBottom &-arrow': {
        bottom: '15%',
      },
      [[
        '&-placement-bottom &-arrow',
        '&-placement-bottomLeft &-arrow',
        '&-placement-bottomRight &-arrow',
      ].join(',')]: {
        top: '4px',
        marginLeft: '-5px',
        borderWidth: '0 5px 5px',
        borderBottomColor: '#fff',
      },
      '&-placement-bottom &-arrow': {
        left: '50%',
      },
      '&-placement-bottomLeft &-arrow': {
        left: '15%',
      },
      '&-placement-bottomRight &-arrow': {
        right: '15%',
      },

      '&-wrap': {
        position: 'fixed',
        overflow: 'auto',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1050,
        WebkitOverflowScrolling: 'touch',
        outline: 0,
      },

      '&-title': {
        margin: 0,
        fontSize: '14px',
        lineHeight: '21px',
        fontWeight: 'bold',
      },
      '&-close': {
        cursor: 'pointer',
        border: 0,
        background: 'transparent',
        fontSize: '16px',
        position: 'absolute',
        right: '20px',
        top: '14px',
        fontWeight: 700,
        lineHeight: 1,
        color: '#000',
        textShadow: '0 1px 0 #fff',
        filter: 'alpha(opacity=20)',
        opacity: 0.2,
        textDecoration: 'none',

        '&:hover': {
          opacity: 1,
          filter: 'alpha(opacity=100)',
          textDecoration: 'none',
        },
      },

      '&-header': {
        padding: '13px 20px 14px 20px',
        borderRadius: '5px 5px 0 0',
        background: '#fff',
        color: '#666',
        borderBottom: '1px solid #e9e9e9',
      },

      '&-description': {
        padding: '24px',
        fontSize: '14px',
        lineHeight: 1.5715,
        wordWrap: 'break-word',
      },

      '&-footer': {
        padding: '10px 16px',
        display: 'flex',
        background: '0 0',
        borderTop: '1px solid rgba(0,0,0,.06)',
        borderRadius: '0 0 2px 2px',
      },

      '&-sliders': {
        width: '70%',
        display: 'inline-block',
        '> span': {
          width: '8px',
          height: '8px',
          display: 'inline-block',
          borderRadius: '50%',
          background: '#000',
          marginRight: '4px',
          opacity: 0.75,
          '&.active': {
            background: '#007aff',
          },
        },
      },
      [['&-prev-btn', '&-next-btn', '&-finish-btn'].join(',')]: {
        display: 'inline-block',
        marginLeft: '8px',
      },
    },
  };
};

export default genTourStyle;
