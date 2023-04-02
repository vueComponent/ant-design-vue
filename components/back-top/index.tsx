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
import getScroll from '../_util/getScroll';
import { getTransitionProps, Transition } from '../_util/transition';
import scrollTo from '../_util/scrollTo';
import { withInstall, eventType } from '../_util/type';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { MouseEventHandler } from '../_util/EventInterface';
import useStyle from './style';

export const backTopProps = () => ({
  visibilityHeight: { type: Number, default: 400 },
  duration: { type: Number, default: 450 },
  target: Function as PropType<() => HTMLElement | Window | Document>,
  prefixCls: String,
  onClick: eventType<MouseEventHandler>(),
  // visible: { type: Boolean, default: undefined }, // Only for test. Don't use it.
});

export type BackTopProps = Partial<ExtractPropTypes<typeof backTopProps>>;

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABackTopLegacy',
  inheritAttrs: false,
  props: backTopProps(),
  // emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('back-top', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
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
      state.visible = scrollTop >= visibilityHeight;
    });

    const bindScrollEvent = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll({ target: container });
      container?.addEventListener('scroll', handleScroll);
    };

    const scrollRemove = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll.cancel();
      container?.removeEventListener('scroll', handleScroll);
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
          [hashId.value]: true,
          [`${prefixCls.value}`]: true,
          [`${attrs.class}`]: attrs.class,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      };

      const transitionProps = getTransitionProps('fade');
      return wrapSSR(
        <Transition {...transitionProps}>
          <div v-show={state.visible} {...divProps} ref={domRef}>
            {slots.default?.() || defaultElement}
          </div>
        </Transition>,
      );
    };
  },
});

export default withInstall(BackTop);
