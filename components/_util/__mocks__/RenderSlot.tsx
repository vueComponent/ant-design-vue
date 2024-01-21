import { defineComponent } from 'vue';
import { customRenderSlot } from '../vnode';

export default defineComponent({
  name: 'RenderSlot',
  setup(_props, { slots }) {
    return () => {
      return customRenderSlot(slots, 'default', {}, () => ['default value']);
    };
  },
});
