import { defineComponent, inject, PropType, provide, toRef, Ref } from 'vue';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const injectSizeKey = 'sizeProvider';

export const useSizeContext = () => {
  const size = inject<Ref<SizeType>>(injectSizeKey);
  provide(injectSizeKey, size);
  return size;
};

export const SizeContextProvider = defineComponent({
  props: {
    size: String as PropType<SizeType>,
  },
  setup(props, { slots }) {
    const size = toRef(props, 'size');
    provide(injectSizeKey, size);

    return () => slots.default?.();
  },
});
