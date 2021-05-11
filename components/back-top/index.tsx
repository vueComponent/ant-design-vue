import {
  defineComponent,
  ExtractPropTypes,
  inject,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
} from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import { getTransitionProps, Transition } from '../_util/transition';
import { defaultConfigProvider } from '../config-provider';
import scrollTo from '../_util/scrollTo';
import { withInstall } from '../_util/type';

function getDefaultTarget() {
  return window;
}

export const backTopProps = {
  // 滚动高度达到此参数值才出现 BackTop
  visibilityHeight: PropTypes.number.def(400),
  // 回到顶部所需时间（ms） @4.4.0
  duration: PropTypes.number.def(450),
  // 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
  target: PropTypes.func,
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

    const state = reactive({
      visible: false,
      scrollEvent: null,
    });

    const scrollToTop = (e: Event) => {
      const { target = getDefaultTarget, duration } = props;
      scrollTo(0, {
        getContainer: target,
        duration,
      });
      emit('click', e);
    };

    const handleScroll = () => {
      const { visibilityHeight, target = getDefaultTarget } = props;
      const scrollTop = getScroll(target(), true);
      state.visible = scrollTop > visibilityHeight;
    };

    onMounted(() => {
      nextTick(() => {
        const getTarget = props.target || getDefaultTarget;
        state.scrollEvent = addEventListener(getTarget(), 'scroll', handleScroll);
        handleScroll();
      });
    });

    onActivated(() => {
      nextTick(() => {
        handleScroll();
      });
    });

    onBeforeUnmount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });

    return () => {
      const { prefixCls: customizePrefixCls } = props;

      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('back-top', customizePrefixCls);
      const classString = classNames(prefixCls, attrs.class);
      const defaultElement = (
        <div class={`${prefixCls}-content`}>
          <div class={`${prefixCls}-icon`} />
        </div>
      );
      const divProps = {
        ...attrs,
        onClick: scrollToTop,
        class: classString,
      };

      const backTopBtn = state.visible ? (
        <div {...divProps}>{slots.default?.() || defaultElement}</div>
      ) : null;
      const transitionProps = getTransitionProps('fade');
      return <Transition {...transitionProps}>{backTopBtn}</Transition>;
    };
  },
});

export default withInstall(BackTop);
