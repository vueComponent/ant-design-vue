export type PlacementType =
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'center';

const targetOffset = [0, 0];

export type AlignPointTopBottom = 't' | 'b' | 'c';
export type AlignPointLeftRight = 'l' | 'r' | 'c';

/** Two char of 't' 'b' 'c' 'l' 'r'. Example: 'lt' */
export type AlignPoint = `${AlignPointTopBottom}${AlignPointLeftRight}`;

export interface AlignType {
  /**
   * move point of source node to align with point of target node.
   * Such as ['tr','cc'], align top right point of source node with center point of target node.
   * Point can be 't'(top), 'b'(bottom), 'c'(center), 'l'(left), 'r'(right) */
  points?: (string | AlignPoint)[];
  /**
   * offset source node by offset[0] in x and offset[1] in y.
   * If offset contains percentage string value, it is relative to sourceNode region.
   */
  offset?: number[];
  /**
   * offset target node by offset[0] in x and offset[1] in y.
   * If targetOffset contains percentage string value, it is relative to targetNode region.
   */
  targetOffset?: number[];
  /**
   * If adjustX field is true, will adjust source node in x direction if source node is invisible.
   * If adjustY field is true, will adjust source node in y direction if source node is invisible.
   */
  overflow?: {
    adjustX?: boolean | number;
    adjustY?: boolean | number;
    shiftX?: boolean | number;
    shiftY?: boolean | number;
  };
  /** Auto adjust arrow position */
  autoArrow?: boolean;
  /**
   * Config visible region check of html node. Default `visible`:
   *  - `visible`: The visible region of user browser window. Use `clientHeight` for check.
   *  - `scroll`: The whole region of the html scroll area. Use `scrollHeight` for check.
   */
  htmlRegion?: 'visible' | 'scroll';
  /**
   * Whether use css right instead of left to position
   */
  useCssRight?: boolean;
  /**
   * Whether use css bottom instead of top to position
   */
  useCssBottom?: boolean;
  /**
   * Whether use css transform instead of left/top/right/bottom to position if browser supports.
   * Defaults to false.
   */
  useCssTransform?: boolean;
  ignoreShake?: boolean;
}

export type BuildInPlacements = Record<string, AlignType>;

const basePlacements: BuildInPlacements = {
  left: {
    points: ['cr', 'cl'],
    offset: [-8, 0],
  },
  right: {
    points: ['cl', 'cr'],
    offset: [8, 0],
  },
  top: {
    points: ['bc', 'tc'],
    offset: [0, -8],
  },
  bottom: {
    points: ['tc', 'bc'],
    offset: [0, 8],
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -8],
  },
  leftTop: {
    points: ['tr', 'tl'],
    offset: [-8, 0],
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -8],
  },
  rightTop: {
    points: ['tl', 'tr'],
    offset: [8, 0],
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 8],
  },
  rightBottom: {
    points: ['bl', 'br'],
    offset: [8, 0],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 8],
  },
  leftBottom: {
    points: ['br', 'bl'],
    offset: [-8, 0],
  },
};

export function getPlacements(arrowPointAtCenter = false) {
  const placements: BuildInPlacements = {};
  Object.keys(basePlacements).forEach(key => {
    placements[key] = { ...basePlacements[key], autoArrow: arrowPointAtCenter, targetOffset };
  });
  return placements;
}

export const placements = getPlacements();
