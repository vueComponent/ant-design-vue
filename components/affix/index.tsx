import type { ComponentPublicInstance, CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  defineComponent,
  ref,
  reactive,
  watch,
  onMounted,
  getCurrentInstance,
  computed,
  onUnmounted,
  onUpdated,
} from 'vue';
import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { withInstall } from '../_util/type';
import {
  addObserveTarget,
  removeObserveTarget,
  getTargetRect,
  getFixedTop,
  getFixedBottom,
} from './utils';
import useConfigInject from '../_util/hooks/useConfigInject';
import omit from '../_util/omit';

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}
enum AffixStatus {
  None,
  Prepare,
}
export interface AffixState {
  affixStyle?: CSSProperties;
  placeholderStyle?: CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  prevTarget: Window | HTMLElement | null;
}

// Affix
export const affixProps = () => ({
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: Number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: Number,
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: {
    type: Function as PropType<() => Window | HTMLElement | null>,
    default: getDefaultTarget,
  },
  prefixCls: String,
  /** 固定状态改变时触发的回调函数 */
  onChange: Function as PropType<AffixEmits['change']>,
  onTestUpdatePosition: Function as PropType<AffixEmits['testUpdatePosition']>,
});

export type AffixProps = Partial<ExtractPropTypes<ReturnType<typeof affixProps>>>;

export type AffixEmits = {
  change: (lastAffix: boolean) => void;
  testUpdatePosition: () => void;
};

export type AffixExpose = {
  updatePosition: (...args: any[]) => void;
  lazyUpdatePosition: (...args: any[]) => void;
};

export type AffixInstance = ComponentPublicInstance<AffixProps, AffixExpose>;
const Affix = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAffix',
  props: affixProps(),
  setup(props, { slots, emit, expose }) {
    const placeholderNode = ref();
    const fixedNode = ref();
    const state = reactive({
      affixStyle: undefined,
      placeholderStyle: undefined,
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null,
      timeout: null,
    });
    const currentInstance = getCurrentInstance();

    const offsetTop = computed(() => {
      return props.offsetBottom === undefined && props.offsetTop === undefined
        ? 0
        : props.offsetTop;
    });
    const offsetBottom = computed(() => props.offsetBottom);
    const measure = () => {
      const { status, lastAffix } = state;
      const { target } = props;
      if (status !== AffixStatus.Prepare || !fixedNode.value || !placeholderNode.value || !target) {
        return;
      }

      const targetNode = target();
      if (!targetNode) {
        return;
      }

      const newState = {
        status: AffixStatus.None,
      } as AffixState;
      const targetRect = getTargetRect(targetNode);
      const placeholderRect = getTargetRect(placeholderNode.value as HTMLElement);
      const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value);
      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderRect.width + 'px',
          height: placeholderRect.height + 'px',
        };
        newState.placeholderStyle = {
          width: placeholderRect.width + 'px',
          height: placeholderRect.height + 'px',
        };
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderRect.width + 'px',
          height: placeholderRect.height + 'px',
        };
        newState.placeholderStyle = {
          width: placeholderRect.width + 'px',
          height: placeholderRect.height + 'px',
        };
      }

      newState.lastAffix = !!newState.affixStyle;
      if (lastAffix !== newState.lastAffix) {
        emit('change', newState.lastAffix);
      }
      // update state
      Object.assign(state, newState);
    };
    const prepareMeasure = () => {
      Object.assign(state, {
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined,
      });
      currentInstance.update();
      // Test if `updatePosition` called
      if (process.env.NODE_ENV === 'test') {
        emit('testUpdatePosition');
      }
    };

    const updatePosition = throttleByAnimationFrame(() => {
      prepareMeasure();
    });
    const lazyUpdatePosition = throttleByAnimationFrame(() => {
      const { target } = props;
      const { affixStyle } = state;

      // Check position change before measure to make Safari smooth
      if (target && affixStyle) {
        const targetNode = target();
        if (targetNode && placeholderNode.value) {
          const targetRect = getTargetRect(targetNode);
          const placeholderRect = getTargetRect(placeholderNode.value as HTMLElement);
          const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value);
          const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value);
          if (
            (fixedTop !== undefined && affixStyle.top === fixedTop) ||
            (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
          ) {
            return;
          }
        }
      }
      // Directly call prepare measure since it's already throttled.
      prepareMeasure();
    });

    expose({
      updatePosition,
      lazyUpdatePosition,
    });
    watch(
      () => props.target,
      val => {
        const newTarget = val?.() || null;
        if (state.prevTarget !== newTarget) {
          removeObserveTarget(currentInstance);
          if (newTarget) {
            addObserveTarget(newTarget, currentInstance);
            // Mock Event object.
            updatePosition();
          }
          state.prevTarget = newTarget;
        }
      },
    );
    watch(() => [props.offsetTop, props.offsetBottom], updatePosition);
    onMounted(() => {
      const { target } = props;
      if (target) {
        // [Legacy] Wait for parent component ref has its value.
        // We should use target as directly element instead of function which makes element check hard.
        state.timeout = setTimeout(() => {
          addObserveTarget(target(), currentInstance);
          // Mock Event object.
          updatePosition();
        });
      }
    });
    onUpdated(() => {
      measure();
    });
    onUnmounted(() => {
      clearTimeout(state.timeout);
      removeObserveTarget(currentInstance);
      (updatePosition as any).cancel();
      // https://github.com/ant-design/ant-design/issues/22683
      (lazyUpdatePosition as any).cancel();
    });

    const { prefixCls } = useConfigInject('affix', props);

    return () => {
      const { affixStyle, placeholderStyle } = state;
      const className = classNames({
        [prefixCls.value]: affixStyle,
      });
      const restProps = omit(props, [
        'prefixCls',
        'offsetTop',
        'offsetBottom',
        'target',
        'onChange',
        'onTestUpdatePosition',
      ]);
      return (
        <ResizeObserver onResize={updatePosition}>
          <div {...restProps} style={placeholderStyle} ref={placeholderNode}>
            <div class={className} ref={fixedNode} style={affixStyle}>
              {slots.default?.()}
            </div>
          </div>
        </ResizeObserver>
      );
    };
  },
});

export default withInstall(Affix);
