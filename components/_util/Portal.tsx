import PropTypes from './vue-types';
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  onUpdated,
  Teleport,
  watch,
} from 'vue';
import { useInjectPortal } from '../vc-trigger/context';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Portal',
  inheritAttrs: false,
  props: {
    getContainer: PropTypes.func.isRequired,
    didUpdate: Function,
  },
  setup(props, { slots }) {
    let isSSR = true;
    // getContainer 不会改变，不用响应式
    let container: HTMLElement;
    const { shouldRender } = useInjectPortal();

    function setContainer() {
      if (shouldRender.value) {
        container = props.getContainer();
      }
    }

    onBeforeMount(() => {
      isSSR = false;
      // drawer
      setContainer();
    });
    onMounted(() => {
      if (container) return;
      // https://github.com/vueComponent/ant-design-vue/issues/6937
      setContainer();
    });

    const stopWatch = watch(shouldRender, () => {
      if (shouldRender.value && !container) {
        container = props.getContainer();
      }
      if (container) {
        stopWatch();
      }
    });
    onUpdated(() => {
      nextTick(() => {
        if (shouldRender.value) {
          props.didUpdate?.(props);
        }
      });
    });
    // onBeforeUnmount(() => {
    //   if (container && container.parentNode) {
    //     container.parentNode.removeChild(container);
    //   }
    // });
    return () => {
      if (!shouldRender.value) return null;
      if (isSSR) {
        return slots.default?.();
      }
      return container ? <Teleport to={container} v-slots={slots}></Teleport> : null;
    };
  },
});
