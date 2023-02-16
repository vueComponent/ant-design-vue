import { defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';

export const TourProps = () => ({
  prefixCls: String,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  props: initDefaultProps(TourProps(), {}),
  setup() {
    return () => <div>Tour</div>;
  },
});
