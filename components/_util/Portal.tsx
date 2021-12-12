import PropTypes from './vue-types';
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onUpdated,
  Teleport,
} from 'vue';

export default defineComponent({
  name: 'Portal',
  inheritAttrs: false,
  props: {
    getContainer: PropTypes.func.isRequired,
    didUpdate: PropTypes.func,
  },
  setup(props, { slots }) {
    let isSSR = true;
    // getContainer 不会改变，不用响应式
    let container: HTMLElement;
    onBeforeMount(() => {
      isSSR = false;
      container = props.getContainer();
    });
    onUpdated(() => {
      nextTick(() => {
        props.didUpdate?.(props);
      });
    });
    onBeforeUnmount(() => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    return () => {
      if (isSSR) {
        return slots.default?.();
      }
      return container ? <Teleport to={container} v-slots={slots}></Teleport> : null;
    };
  },
});
