const autoAdjustOverflow = {
  adjustX: 1,
  adjustY: 1,
};

export const placements = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [0, -7],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
    offset: [0, 7],
  },
  leftTop: {
    points: ['tr', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [-4, 0],
  },
  rightTop: {
    points: ['tl', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [4, 0],
  },
};

export const placementsRtl = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [0, -7],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
    offset: [0, 7],
  },
  rightTop: {
    points: ['tr', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [-4, 0],
  },
  leftTop: {
    points: ['tl', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [4, 0],
  },
};

export default placements;
