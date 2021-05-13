import { getPropsSlot } from '../../_util/props-util';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AMenuItemGroup',
  setup(props, { slots }) {
    return () => {
      return (
        <li>
          {getPropsSlot(slots, props, 'title')}
          <ul>{slots.default?.()}</ul>
        </li>
      );
    };
  },
});
