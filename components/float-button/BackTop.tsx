import VerticalAlignTopOutlined from '@ant-design/icons-vue/VerticalAlignTopOutlined';
import { getTransitionProps } from '../_util/transition';
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
  Transition,
} from 'vue';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import getScroll from '../_util/getScroll';
import scrollTo from '../_util/scrollTo';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { initDefaultProps } from '../_util/props-util';
import { backTopProps } from './interface';

import useStyle from './style';
import { useInjectFloatButtonGroupContext } from './context';

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABackTop',
  inheritAttrs: false,
  props: initDefaultProps(backTopProps(), {
    visibilityHeight: 400,
    target: () => window,
    duration: 450,
    type: 'default',
    shape: 'circle',
  }),
  // emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);

    const [wrapSSR] = useStyle(prefixCls);

    const domRef = ref();
    const state = reactive({
      visible: props.visibilityHeight === 0,
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
    const floatButtonGroupContext = useInjectFloatButtonGroupContext();
    return () => {
      const { description, type, shape, tooltip, badge } = props;

      const floatButtonProps = {
        ...attrs,
        shape: floatButtonGroupContext?.shape.value || shape,
        onClick: scrollToTop,
        class: {
          [`${prefixCls.value}`]: true,
          [`${attrs.class}`]: attrs.class,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        description,
        type,
        tooltip,
        badge,
      };

      const transitionProps = getTransitionProps('fade');
      return wrapSSR(
        <Transition {...transitionProps}>
          <FloatButton v-show={state.visible} {...floatButtonProps} ref={domRef}>
            {{
              icon: () => slots.icon?.() || <VerticalAlignTopOutlined />,
            }}
          </FloatButton>
        </Transition>,
      );
    };
  },
});

export default BackTop;
