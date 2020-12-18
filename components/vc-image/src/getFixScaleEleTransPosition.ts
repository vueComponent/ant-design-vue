import { getClientSize } from '../../vc-util/Dom/css';

function fixPoint(key: 'x' | 'y', start: number, width: number, clientWidth: number) {
  const startAddWidth = start + width;
  const offsetStart = (width - clientWidth) / 2;

  if (width > clientWidth) {
    if (start > 0) {
      return {
        [key]: offsetStart,
      };
    }
    if (start < 0 && startAddWidth < clientWidth) {
      return {
        [key]: -offsetStart,
      };
    }
  } else if (start < 0 || startAddWidth > clientWidth) {
    return {
      [key]: start < 0 ? offsetStart : -offsetStart,
    };
  }
  return {};
}

/**
 * Fix positon x,y point when
 *
 * Ele width && height < client
 * - Back origin
 *
 * - Ele width | height > clientWidth | clientHeight
 * - left | top > 0 -> Back 0
 * - left | top + width | height < clientWidth | clientHeight -> Back left | top + width | height === clientWidth | clientHeight
 *
 * Regardless of other
 */
export default function getFixScaleEleTransPosition(
  width: number,
  height: number,
  left: number,
  top: number,
): null | { x: number; y: number } {
  const { width: clientWidth, height: clientHeight } = getClientSize();

  let fixPos = null;

  if (width <= clientWidth && height <= clientHeight) {
    fixPos = {
      x: 0,
      y: 0,
    };
  } else if (width > clientWidth || height > clientHeight) {
    fixPos = {
      ...fixPoint('x', left, width, clientWidth),
      ...fixPoint('y', top, height, clientHeight),
    };
  }

  return fixPos;
}
