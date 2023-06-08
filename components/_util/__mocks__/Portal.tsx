import { defineComponent } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Portal',
  inheritAttrs: false,
  props: ['getContainer'],
  setup(_props, { slots }) {
    return () => {
      return slots.default?.();
    };
  },
});
