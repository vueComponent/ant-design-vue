import { defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TourMask from './TourMask';

export const TourProps = () => ({
  prefixCls: String,
  visible: Boolean,
  defaultCurrent: Number,
  current: Number,
  mask: Boolean,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  props: initDefaultProps(TourProps(), {}),
  setup(props) {
    return () => {
      const { visible } = props;
      // const { prefixCls } = useConfigInject('tour', props);

      return <TourMask visible={visible} />;
    };
  },
});
