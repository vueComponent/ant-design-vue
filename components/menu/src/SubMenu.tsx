import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ASubMenu',
  setup(props, { slots }) {
    return () => {
      return <ul>{slots.default?.()}</ul>;
    };
  },
});
