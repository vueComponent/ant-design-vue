import { defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TourMask from './TourMask';
import useTarget from './useTarget';
import TourStep from './TourStep';
import Trigger from '../vc-trigger';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

export const TourProps = () => ({
  prefixCls: String,
  visible: Boolean,
  current: Number,
  steps: Array,
  gap: Number,
  mask: Boolean,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  props: initDefaultProps(TourProps(), {}),
  setup(props) {
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
