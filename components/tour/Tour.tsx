import { defineComponent } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useTarget from './useTarget';
import TourStep from './TourStep';
import TourMask from './TourMask';
import Trigger from '../vc-trigger';
import type { TourStepProps } from './TourStep';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

export const tourProps = () => ({
  prefixCls: String,
  visible: Boolean,
  current: Number,
  steps: { type: Array as PropType<Array<TourStepProps>> },
  gap: Number,
  mask: Boolean,
});

export type TourProps = ExtractPropTypes<ReturnType<typeof tourProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  props: initDefaultProps(tourProps(), {}),
  setup(props: TourProps) {
    // @ts-ignore
    const [posInfo] = useTarget(
      props.steps[0].target,
      props.gap,
      props.steps[0].stepScrollIntoViewOptions ?? props.scrollIntoViewOptions,
    );
    return () => {
      const { visible } = props;
      const { prefixCls } = useConfigInject('tour', props);
      // current, total, title, description, arrow

      // style
      const [wrapSSR] = useStyle(prefixCls);
      return wrapSSR(
        <>
          <Trigger prefixCls={prefixCls.value} popupVisible={visible}>
            <TourStep current={1} total={3} title={'1111'} description={'22222'} arrow={true} />
          </Trigger>
          <TourMask visible={visible} showMask={true} pos={posInfo.value} />
        </>,
      );
    };
  },
});
