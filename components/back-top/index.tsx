import type { ExtractPropTypes, PropType } from 'vue';
import {
  defineComponent,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  onDeactivated,
} from 'vue';
import VerticalAlignTopOutlined from '@ant-design/icons-vue/VerticalAlignTopOutlined';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import { getTransitionProps, Transition } from '../_util/transition';
import scrollTo from '../_util/scrollTo';
import { withInstall } from '../_util/type';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { MouseEventHandler } from '../_util/EventInterface';

export const backTopProps = () => ({
  visibilityHeight: { type: Number, default: 400 },
  duration: { type: Number, default: 450 },
  target: Function as PropType<() => HTMLElement | Window | Document>,
  prefixCls: String,
  onClick: Function as PropType<MouseEventHandler>,
  // visible: { type: Boolean, default: undefined }, // Only for test. Don't use it.
});

export type BackTopProps = Partial<ExtractPropTypes<typeof backTopProps>>;

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABackTop',
  inheritAttrs: false,
  props: backTopProps(),
  // emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('back-top', props);
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
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      };

      const transitionProps = getTransitionProps('fade');
      return (
        <Transition {...transitionProps}>
          <div v-show={state.visible} {...divProps} ref={domRef}>
            {slots.default?.() || defaultElement}
          </div>
        </Transition>
      );
    };
  },
});

export default withInstall(BackTop);
