// 此样式是vue版本独有样式，react版本没有拖拽改变列宽度功能
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genResizeStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-wrapper ${componentCls}-resize-handle`]: {
      position: 'absolute',
      top: 0,
      height: '100% !important',
      bottom: 0,
      left: ' auto !important',
      right: ' -8px',
      cursor: 'col-resize',
      touchAction: 'none',
      userSelect: 'auto',
      width: '16px',
      zIndex: 1,
      [`&-line`]: {
        display: 'block',
        width: '1px',
        marginLeft: '7px',
        height: '100% !important',
        backgroundColor: token.colorPrimary,
        opacity: 0,
      },
      [`&:hover &-line`]: {
        opacity: 1,
      },
    },
    [`${componentCls}-wrapper  ${componentCls}-resize-handle.dragging`]: {
      overflow: 'hidden',
      [`${componentCls}-resize-handle-line`]: {
        opacity: 1,
      },
      [`&:before`]: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        content: '" "',
        width: '200vw',
        transform: 'translateX(-50%)',
        opacity: 0,
      },
    },
  };
};

export default genResizeStyle;
