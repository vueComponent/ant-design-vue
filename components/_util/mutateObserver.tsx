import type { PropType } from 'vue';
import { defineComponent } from 'vue';
export const mutateObserverProps = {
  onMutate: Function as PropType<(mutations: MutationRecord[], observer: MutationObserver) => void>,
  options: Object as PropType<MutationObserverInit>,
};
export const DomWrapper = defineComponent({
  name: 'DomWrapper',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => {
      return slots.default?.();
    };
  },
});
export default defineComponent({
  name: 'MutateObserver',
  inheritAttrs: false,
  props: {
    ...mutateObserverProps,
  },
  setup(_props, { slots }) {
    return () => {
      return <DomWrapper> {slots.default?.()}</DomWrapper>;
    };
  },
});
