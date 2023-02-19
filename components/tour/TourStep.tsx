import { defineComponent } from 'vue';
import type { ExtractPropTypes, PropType, VNode, CSSProperties } from 'vue';
import type { PlacementType } from './placements';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from './style';

type Arrow = boolean | { pointAtCenter: boolean };
type Target = HTMLElement | (() => HTMLElement) | null | (() => null);
type Mask =
  | boolean
  | {
      style?: CSSProperties;
      // to fill mask color, e.g. rgba(80,0,0,0.5)
      color?: string;
    };
const tourStepInfo = () => ({
  arrow: { type: Object as PropType<Arrow> },
  target: { type: Object as PropType<Target> },
  title: { type: Object as PropType<VNode> },
  description: { type: Object as PropType<VNode> },
  placement: { type: Object as PropType<PlacementType> },
  mask: { type: Object as PropType<Mask> },
  class: String,
  style: { type: Object as PropType<CSSProperties> },
  scrollIntoViewOptions: { type: Object as PropType<boolean | ScrollIntoViewOptions> },
});

export const tourStepProps = () => ({
  ...tourStepInfo(),
  prefixCls: String,
  total: Number,
  current: Number,
  onClose: {
    type: Function as PropType<() => void>,
  },
  onFinish: {
    type: Function as PropType<() => void>,
  },
  onPrev: {
    type: Function as PropType<() => void>,
  },
  onNext: {
    type: Function as PropType<() => void>,
  },
});

export type TourStepInfo = ExtractPropTypes<ReturnType<typeof tourStepInfo>>;
export type TourStepProps = ExtractPropTypes<ReturnType<typeof tourStepProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATourStep',
  inheritAttrs: false,
  props: initDefaultProps(tourStepProps(), {}),
  setup(props: TourStepProps, { emit }) {
    return () => {
      const { current, total, title, description, arrow } = props;
      const { prefixCls } = useConfigInject('tour', props);

      const [wrapSSR] = useStyle(prefixCls);
      return wrapSSR(
        <div class={`${prefixCls.value}-content`}>
          {arrow && <div class={`${prefixCls.value}-arrow`} key="arrow" />}
          <div class={`${prefixCls.value}-inner`}>
            <button
              type="button"
              onClick={() => emit('close')}
              aria-label="Close"
              class={`${prefixCls.value}-close`}
            >
              <span class={`${prefixCls.value}-close-x`}>&times;</span>
            </button>
            <div class={`${prefixCls.value}-header`}>
              <div class={`${prefixCls.value}-title`}>{title}</div>
            </div>
            <div class={`${prefixCls.value}-description`}>{description}</div>
            <div class={`${prefixCls.value}-footer`}>
              <div class={`${prefixCls.value}-sliders`}>
                {total > 1
                  ? [...Array.from({ length: total }).keys()].map((item, index) => {
                      return <span key={item} class={index === current ? 'active' : ''} />;
                    })
                  : null}
              </div>
              <div class={`${prefixCls.value}-buttons`}>
                {current !== 0 ? (
                  <a-button class={`${prefixCls.value}-prev-btn`} onClick={() => emit('prev')}>
                    Prev
                  </a-button>
                ) : null}
                {current === total - 1 ? (
                  <a-button class={`${prefixCls.value}-finish-btn`} onClick={() => emit('finish')}>
                    Finish
                  </a-button>
                ) : (
                  <a-button class={`${prefixCls.value}-next-btn`} onClick={() => emit('next')}>
                    Next
                  </a-button>
                )}
              </div>
            </div>
          </div>
        </div>,
      );
    };
  },
});
