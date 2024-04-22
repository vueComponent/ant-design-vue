import type { Point, AlignType, StretchType, MobileConfig } from '../interface';
import type { ExtractPropTypes, PropType } from 'vue';

export const innerProps = {
  visible: Boolean,

  prefixCls: String,
  zIndex: Number,

  destroyPopupOnHide: Boolean,
  forceRender: Boolean,

  arrow: { type: Boolean, default: true },

  // Legacy Motion
  animation: [String, Object],
  transitionName: String,

  // Measure
  stretch: { type: String as PropType<StretchType> },

  // Align
  align: { type: Object as PropType<AlignType> },
  point: { type: Object as PropType<Point> },
  getRootDomNode: { type: Function as PropType<() => HTMLElement> },
  getClassNameFromAlign: { type: Function as PropType<(align: AlignType) => string> },
  onAlign: {
    type: Function as PropType<(popupDomNode: HTMLElement, align: AlignType) => void>,
  },
  onMouseenter: { type: Function as PropType<(align: MouseEvent) => void> },
  onMouseleave: { type: Function as PropType<(align: MouseEvent) => void> },
  onMousedown: { type: Function as PropType<(align: MouseEvent) => void> },
  onTouchstart: { type: Function as PropType<(align: MouseEvent) => void> },
};
export type PopupInnerProps = Partial<ExtractPropTypes<typeof innerProps>> & {
  align?: AlignType;
};

export const mobileProps = {
  ...innerProps,
  mobile: { type: Object as PropType<MobileConfig> },
};

export type MobilePopupProps = Partial<ExtractPropTypes<typeof mobileProps>> & {
  align?: AlignType;
  mobile: MobileConfig;
};

export const popupProps = {
  ...innerProps,
  mask: Boolean,
  mobile: { type: Object as PropType<MobileConfig> },
  maskAnimation: String,
  maskTransitionName: String,
};

export type PopupProps = Partial<ExtractPropTypes<typeof popupProps>> & {
  align?: AlignType;
  mobile: MobileConfig;
};
