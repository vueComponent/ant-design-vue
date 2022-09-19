import { defineComponent } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'FooterRow',
  setup(_props, { slots }) {
    return () => <tr>{slots.default?.()}</tr>;
  },
});
