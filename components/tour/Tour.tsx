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

interface TourProps {
  prefixCls?: string;
  open: boolean;
  step?: TourStepInfo[];
}

export const tourProps = (): TourProps => ({
  open: false,
});

// const Tour = defineComponent({
//   compatConfig: { MODE: 3 },
//   name: 'ATour',
//   inheritAttrs: false,
//   setup() {
//     return (
//       <div>表单组件</div>
//     )
//   }
// });
//
// export default Tour;

export default defineComponent({
  name: 'ATour',
  setup() {
    return () => {
      <div>Tour</div>;
    };
  },
});
