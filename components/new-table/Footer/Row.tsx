import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterRow',
  setup(_props, { slots }) {
    return () => <tr>{slots.default?.()}</tr>;
  },
});
