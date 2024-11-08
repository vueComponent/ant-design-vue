import { defineComponent, Transition } from 'vue';
import { getTransitionProps } from '../_util/transition';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'DialogMask',
  props: {
    prefixCls: String,
    visible: Boolean,
    motionName: String,
    maskProps: Object,
  },
  setup(props, {}) {
    return () => {
      const { prefixCls, visible, maskProps, motionName } = props;
      const transitionProps = getTransitionProps(motionName);
      return (
        <Transition {...transitionProps}>
          <div v-show={visible} class={`${prefixCls}-mask`} {...maskProps} />
        </Transition>
      );
    };
  },
});
