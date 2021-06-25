import type { ExtractPropTypes, PropType } from 'vue';
import {
  defineComponent,
  inject,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  onDeactivated,
  computed,
} from 'vue';
import VerticalAlignTopOutlined from '@ant-design/icons-vue/VerticalAlignTopOutlined';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import { getTransitionProps, Transition } from '../_util/transition';
import { defaultConfigProvider } from '../config-provider';
import scrollTo from '../_util/scrollTo';
import { withInstall } from '../_util/type';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';

export const backTopProps = {
  visibilityHeight: PropTypes.number.def(400),
  duration: PropTypes.number.def(450),
  target: Function as PropType<() => HTMLElement | Window | Document>,
  prefixCls: PropTypes.string,
  onClick: PropTypes.func,
  // visible: PropTypes.looseBool, // Only for test. Don't use it.
};

export type BackTopProps = Partial<ExtractPropTypes<typeof backTopProps>>;

const BackTop = defineComponent({
  name: 'ABackTop',
  inheritAttrs: false,
  props: backTopProps,
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const domRef = ref();
    const state = reactive({
      visible: false,
      scrollEvent: null,
    });

    const getDefaultTarget = () =>
      domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window;

    const scrollToTop = (e: Event) => {
      const { target = getDefaultTarget, duration } = props;
      scrollTo(0, {
        getContainer: target,
        duration,
      });
      emit('click', e);
    };

    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const { visibilityHeight } = props;
      const scrollTop = getScroll(e.target, true);
      state.visible = scrollTop > visibilityHeight;
    });

    const bindScrollEvent = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      state.scrollEvent = addEventListener(container, 'scroll', (e: Event) => {
        handleScroll(e);
      });
      handleScroll({
        target: container,
      });
    };

    const scrollRemove = () => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
      (handleScroll as any).cancel();
    };

    watch(
      () => props.target,
      () => {
        scrollRemove();
        nextTick(() => {
          bindScrollEvent();
        });
      },
    );

    onMounted(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onActivated(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onDeactivated(() => {
      scrollRemove();
    });

    onBeforeUnmount(() => {
      scrollRemove();
    });

    const prefixCls = computed(() => configProvider.getPrefixCls('back-top', props.prefixCls));

    return () => {
      const defaultElement = (
        <div class={`${prefixCls.value}-content`}>
          <div class={`${prefixCls.value}-icon`}>
            <VerticalAlignTopOutlined />
          </div>
        </div>
      );
      const divProps = {
        ...attrs,
        onClick: scrollToTop,
        class: {
          [`${prefixCls.value}`]: true,
          [`${attrs.class}`]: attrs.class,
          [`${prefixCls.value}-rtl`]: configProvider.direction === 'rtl',
        },
      };

      const backTopBtn = state.visible ? (
        <div {...divProps} ref={domRef}>
          {slots.default?.() || defaultElement}
        </div>
      ) : null;
      const transitionProps = getTransitionProps('fade');
      return <Transition {...transitionProps}>{backTopBtn}</Transition>;
    };
  },
});

export default withInstall(BackTop);
