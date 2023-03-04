import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';
import type { PlacementType } from './placements';
import type { VueNode } from '../_util/type';

export const tourStepInfo = () => ({
  arrow: { type: [Boolean, Object] as PropType<boolean | { pointAtCenter: boolean }> },
  target: {
    type: [String, Function, Object] as PropType<
      HTMLElement | (() => HTMLElement) | null | (() => null)
    >,
    default: undefined as HTMLElement | (() => HTMLElement) | null | (() => null),
  },
  title: { type: [String, Object] as PropType<string | VueNode> },
  description: { type: [String, Object] as PropType<string | VueNode> },
  placement: { type: String as PropType<PlacementType> },
  mask: {
    type: [Boolean, Object] as PropType<boolean | { style?: CSSProperties; color?: string }>,
    default: true,
  },
  className: { type: String },
  style: { type: Object as PropType<CSSProperties> },
  scrollIntoViewOptions: { type: [Boolean, Object] as PropType<boolean | ScrollIntoViewOptions> },
});

export type TourStepInfo = Partial<ExtractPropTypes<ReturnType<typeof tourStepInfo>>>;

export const tourStepProps = () => ({
  ...tourStepInfo(),
  prefixCls: { type: String },
  total: { type: Number },
  current: { type: Number },
  onClose: { type: Function as PropType<(e: MouseEvent) => void> },
  onFinish: { type: Function as PropType<(e: MouseEvent) => void> },
  renderPanel: { type: Function as PropType<(step: any, current: number) => VueNode> },
  onPrev: { type: Function as PropType<(e: MouseEvent) => void> },
  onNext: { type: Function as PropType<(e: MouseEvent) => void> },
});

export type TourStepProps = Partial<ExtractPropTypes<ReturnType<typeof tourStepProps>>>;
