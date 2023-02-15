import type { PlacementType } from './placements';
import { defineComponent } from 'vue';
// import useStyle from './style';
// import useConfigInject from '../config-provider/hooks/useConfigInject';

interface TourStepInfo {
  arrow: boolean | { pointAtCenter: boolean };
  target: HTMLElement | (() => HTMLElement) | null | (() => null);
  title: string;
  description: string;
  placement: PlacementType;
  mask:
    | boolean
    | {
        style: string;
        color: string;
      };
}

export interface TourProps {
  prefixCls?: string;
  visible: boolean;
  step?: TourStepInfo[];
}

export const tourProps = (): TourProps => ({
  visible: false,
  step: [],
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  setup() {
    return () => <div>Tour</div>;
  },
});
