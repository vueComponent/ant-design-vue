import { onBeforeUnmount, watch, onActivated, defineComponent, ref } from 'vue';
import Tooltip, { tooltipProps } from '../tooltip';
import raf from '../_util/raf';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SliderTooltip',
  inheritAttrs: false,
  props: tooltipProps(),
  setup(props, { attrs, slots }) {
    const innerRef = ref<any>(null);

    const rafRef = ref<number>(null);

    function cancelKeepAlign() {
      raf.cancel(rafRef.value!);
      rafRef.value = null;
    }

    function keepAlign() {
      rafRef.value = raf(() => {
        innerRef.value?.forcePopupAlign();
        rafRef.value = null;
      });
    }
    const align = () => {
      cancelKeepAlign();
      if (props.open) {
        keepAlign();
      }
    };
    watch(
      [() => props.open, () => props.title],
      () => {
        align();
      },
      { flush: 'post', immediate: true },
    );
    onActivated(() => {
      align();
    });
    onBeforeUnmount(() => {
      cancelKeepAlign();
    });
    return () => {
      return <Tooltip ref={innerRef} {...props} {...attrs} v-slots={slots} />;
    };
  },
});
