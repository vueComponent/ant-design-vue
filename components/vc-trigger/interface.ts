import type { CSSProperties, ExtractPropTypes, TransitionProps, PropType } from 'vue';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';

/** Two char of 't' 'b' 'c' 'l' 'r'. Example: 'lt' */
export type AlignPoint = string;

export type OffsetType = number | `${number}%`;
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
  offset?: OffsetType[];
  /**
   * offset target node by offset[0] in x and offset[1] in y.
   * If targetOffset contains percentage string value, it is relative to targetNode region.
   */
  targetOffset?: OffsetType[];
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
   *  - `visible`:
   *    The visible region of user browser window.
   *    Use `clientHeight` for check.
   *    If `visible` region not satisfy, fallback to `scroll`.
   *  - `scroll`:
   *    The whole region of the html scroll area.
   *    Use `scrollHeight` for check.
   *  - `visibleFirst`:
   *    Similar to `visible`, but if `visible` region not satisfy, fallback to `scroll`.
   */
  htmlRegion?: 'visible' | 'scroll' | 'visibleFirst';
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

function returnEmptyString() {
  return '';
}

function returnDocument(element) {
  if (element) {
    return element.ownerDocument;
  }
  return window.document;
}

export function noop() {}

export const triggerProps = () => ({
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def([]),
  showAction: PropTypes.any.def([]),
  hideAction: PropTypes.any.def([]),
  getPopupClassNameFromAlign: PropTypes.any.def(returnEmptyString),
  onPopupVisibleChange: Function as PropType<(open: boolean) => void>,
  afterPopupVisibleChange: PropTypes.func.def(noop),
  popup: PropTypes.any,
  arrow: PropTypes.bool.def(true),
  popupStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  prefixCls: PropTypes.string.def('rc-trigger-popup'),
  popupClassName: PropTypes.string.def(''),
  popupPlacement: String,
  builtinPlacements: PropTypes.object,
  popupTransitionName: String,
  popupAnimation: PropTypes.any,
  mouseEnterDelay: PropTypes.number.def(0),
  mouseLeaveDelay: PropTypes.number.def(0.1),
  zIndex: Number,
  focusDelay: PropTypes.number.def(0),
  blurDelay: PropTypes.number.def(0.15),
  getPopupContainer: Function,
  getDocument: PropTypes.func.def(returnDocument),
  forceRender: { type: Boolean, default: undefined },
  destroyPopupOnHide: { type: Boolean, default: false },
  mask: { type: Boolean, default: false },
  maskClosable: { type: Boolean, default: true },
  // onPopupAlign: PropTypes.func.def(noop),
  popupAlign: PropTypes.object.def(() => ({})),
  popupVisible: { type: Boolean, default: undefined },
  defaultPopupVisible: { type: Boolean, default: false },
  maskTransitionName: String,
  maskAnimation: String,
  stretch: String,
  alignPoint: { type: Boolean, default: undefined }, // Maybe we can support user pass position in the future
  autoDestroy: { type: Boolean, default: false },
  mobile: Object,
  getTriggerDOMNode: Function as PropType<(d?: HTMLElement) => HTMLElement>,
});

export type TriggerProps = Partial<ExtractPropTypes<ReturnType<typeof triggerProps>>>;
