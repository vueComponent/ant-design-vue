import PropTypes from './vue-types';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
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
    const container = ref();
    onMounted(() => {
      container.value = props.getContainer();
    });
    onUpdated(() => {
      nextTick(() => {
        props.nextTick?.(props);
      });
    });
    onBeforeUnmount(() => {
      if (container.value && container.value.parentNode) {
        container.value.parentNode.removeChild(container.value);
      }
    });
    return () => {
      return container.value ? <Teleport to={container.value}>{slots.default?.()}</Teleport> : null;
    };
  },
});
