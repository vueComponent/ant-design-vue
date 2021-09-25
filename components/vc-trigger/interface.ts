import type { CSSProperties, TransitionProps } from 'vue';
import type { VueNode } from '../_util/type';

/** Two char of 't' 'b' 'c' 'l' 'r'. Example: 'lt' */
export type AlignPoint = string;

export interface AlignType {
  /**
   * move point of source node to align with point of target node.
   * Such as ['tr','cc'], align top right point of source node with center point of target node.
   * Point can be 't'(top), 'b'(bottom), 'c'(center), 'l'(left), 'r'(right) */
  points?: AlignPoint[];
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
  };
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

export type StretchType = string;

export type ActionType = string;

export type AnimationType = string;

export type TransitionNameType = string;

export interface Point {
  pageX: number;
  pageY: number;
}

export interface CommonEventHandler {
  remove: () => void;
}

export interface MobileConfig {
  /** Set popup motion. You can ref `rc-motion` for more info. */
  popupMotion?: TransitionProps;
  popupClassName?: string;
  popupStyle?: CSSProperties;
  popupRender?: (originNode: VueNode) => VueNode;
}
