import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AMenu',
  setup(props, { slots }) {
    return () => {
      return <div>{slots.default?.()}</div>;
    };
  },
});
