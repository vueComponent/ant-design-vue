import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AMenuItem',
  setup(props, { slots }) {
    return () => {
      return <li>{slots.default?.()}</li>;
    };
  },
});
