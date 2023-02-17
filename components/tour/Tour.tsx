import { computed, defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TourMask from './TourMask';
import useTarget from './useTarget';

export const TourProps = () => ({
  prefixCls: String,
  visible: Boolean,
  defaultCurrent: Number,
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
    const mergedCurrent = computed(() => {
      if (props.current) {
        return props.current;
      } else {
        return props.defaultCurrent || 1;
      }
    });
    // @ts-ignore
    const [posInfo] = useTarget(
      props.steps[mergedCurrent.value].target,
      props.gap,
      props.steps[mergedCurrent.value].stepScrollIntoViewOptions ?? props.scrollIntoViewOptions,
    );
    // console.log(posInfo, 'posInfo');
    return () => {
      const { visible } = props;
      // const { prefixCls } = useConfigInject('tour', props);

      return <TourMask visible={visible} showMask={true} pos={posInfo.value} />;
    };
  },
});
