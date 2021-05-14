import { defineComponent, getCurrentInstance } from 'vue';

let indexGuid = 0;

export default defineComponent({
  name: 'AMenuItem',
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const key = instance.vnode.key;
    const uniKey = `menu_item_${++indexGuid}`;

    return () => {
      return <li>{slots.default?.()}</li>;
    };
  },
});
