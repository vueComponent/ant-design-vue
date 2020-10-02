import {
  App,
  inject,
  Transition,
  reactive,
  nextTick,
  onMounted,
  onBeforeMount,
  defineComponent,
} from 'vue';
import classNames from '../_util/classNames';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import getTransitionProps from '../_util/getTransitionProps';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import scrollTo from '../_util/scrollTo';
import { BackTopProps, BackTopState } from './backTopTypes';
import backTopProps from './backTopProps';
function getDefaultTarget() {
  return window;
}

const BackTop = defineComponent({
  name: 'ABackTop',
  inheritAttrs: false,
  props: backTopProps,
  setup(propsValues, { emit, attrs, slots }) {
    const props = { ...attrs, ...propsValues } as BackTopProps;
    const state = reactive<BackTopState>({
      scrollEvent: null,
      visible: false,
    });
    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);

    function handleScroll() {
      const { visibilityHeight, target = getDefaultTarget } = props;
      const scrollTop = getScroll(target(), true);
      state.visible = scrollTop > visibilityHeight;
    }

    function scrollToTop(e: Event) {
      const { target = getDefaultTarget } = props;
      scrollTo(0, {
        getContainer: target,
      });
      emit('click', e);
    }

    onMounted(() => {
      nextTick(() => {
        const getTarget = props.target || getDefaultTarget;
        const t = getTarget();
        if (!t) return;
        state.scrollEvent = addEventListener(t, 'scroll', handleScroll);
        handleScroll();
      });
    });

    onBeforeMount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });

    return () => {
      const { prefixCls: customizePrefixCls } = props;
      const prefixCls = getPrefixCls('back-top', customizePrefixCls);

      const classString = classNames(prefixCls, props.class);
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
      if (!backTopBtn) return null;
      return <Transition {...transitionProps}>{backTopBtn}</Transition>;
    };
  },
});

BackTop.install = function(app: App<Element>) {
  app.component(BackTop.name, BackTop);
};

export default BackTop;
