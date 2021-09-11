import type { StickyOffsets, FixedType } from '../interface';

export interface FixedInfo {
  fixLeft: number | false;
  fixRight: number | false;
  lastFixLeft: boolean;
  firstFixRight: boolean;

  // For Rtl Direction
  lastFixRight: boolean;
  firstFixLeft: boolean;

  isSticky: boolean;
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
  direction: 'ltr' | 'rtl',
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft: number;
  let fixRight: number;

  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[colStart];
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[colEnd];
  }

  let lastFixLeft = false;
  let firstFixRight = false;

  let lastFixRight = false;
  let firstFixLeft = false;

  const nextColumn = columns[colEnd + 1];
  const prevColumn = columns[colStart - 1];

  if (direction === 'rtl') {
    if (fixLeft !== undefined) {
      const prevFixLeft = prevColumn && prevColumn.fixed === 'left';
      firstFixLeft = !prevFixLeft;
    } else if (fixRight !== undefined) {
      const nextFixRight = nextColumn && nextColumn.fixed === 'right';
      lastFixRight = !nextFixRight;
    }
  } else if (fixLeft !== undefined) {
    const nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft;
  } else if (fixRight !== undefined) {
    const prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    firstFixLeft,
    isSticky: stickyOffsets.isSticky,
  };
}
