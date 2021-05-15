import { defineComponent } from 'vue';
import useProvideKeyPath from './hooks/useKeyPath';

export default defineComponent({
  name: 'ASubMenu',
  setup(props, { slots }) {
    useProvideKeyPath();
    return () => {
      return <ul>{slots.default?.()}</ul>;
    };
  },
});
