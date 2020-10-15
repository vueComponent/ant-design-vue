import { defineComponent, PropType, provide } from 'vue';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export const SizeContextProvider = defineComponent({
  props: {
    size: String as PropType<SizeType>,
  },
  setup(props, { slots }) {
    provide('sizeProvider', props.size);

    return () => slots.default?.();
  },
});
