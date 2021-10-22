
export function getCellFixedInfo(colStart, colEnd, columns, stickyOffsets, direction) {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft;
  let fixRight;

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
