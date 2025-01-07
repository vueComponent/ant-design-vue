import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ATableSummaryRow',
  setup(_props, { slots }) {
    return () => <tr>{slots.default?.()}</tr>;
  },
});
