import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Portal',
  inheritAttrs: false,
  props: ['getContainer'],
  setup(_props, { slots }) {
    return () => {
      return slots.default?.();
    };
  },
});
