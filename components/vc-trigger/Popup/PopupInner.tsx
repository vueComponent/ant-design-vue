import type { AlignType } from '../interface';
import useVisibleStatus from './useVisibleStatus';
import useStretchStyle from './useStretchStyle';
import type { CSSProperties } from 'vue';
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  toRef,
  Transition,
  watch,
  withModifiers,
} from 'vue';
import type { RefAlign } from '../../vc-align/Align';
import Align from '../../vc-align/Align';
import { getMotion } from '../utils/motionUtil';
import { flattenChildren } from '../../_util/props-util';
import classNames from '../../_util/classNames';
import type { PopupInnerProps } from './interface';
import { innerProps } from './interface';
import { getTransitionProps } from '../../_util/transition';
import supportsPassive from '../../_util/supportsPassive';

export default defineComponent({
  name: 'PopupInner',
  inheritAttrs: false,
  props: innerProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, { expose, attrs, slots }) {
    const alignRef = ref<RefAlign>();
    const elementRef = ref<HTMLDivElement>();
    const alignedClassName = ref<string>();
    // ======================= Measure ========================
    const [stretchStyle, measureStretchStyle] = useStretchStyle(toRef(props, 'stretch'));

    const doMeasure = () => {
      if (props.stretch) {
        measureStretchStyle(props.getRootDomNode());
      }
    };

    // ======================== Status ========================
    const [status, goNextStatus] = useVisibleStatus(toRef(props, 'visible'), doMeasure);

    // ======================== Aligns ========================
    const prepareResolveRef = ref<(value?: unknown) => void>();

    // `target` on `rc-align` can accept as a function to get the bind element or a point.
    // ref: https://www.npmjs.com/package/rc-align
    const getAlignTarget = () => {
      if (props.point) {
        return props.point;
      }
      return props.getRootDomNode;
    };

    const forceAlign = () => {
      alignRef.value?.forceAlign();
    };

    const onInternalAlign = (popupDomNode: HTMLElement, matchAlign: AlignType) => {
      const nextAlignedClassName = props.getClassNameFromAlign(matchAlign);
      const preAlignedClassName = alignedClassName.value;
      if (alignedClassName.value !== nextAlignedClassName) {
        alignedClassName.value = nextAlignedClassName;
      }
      if (status.value === 'align') {
        // Repeat until not more align needed
        if (preAlignedClassName !== nextAlignedClassName) {
          nextTick(() => {
            forceAlign();
          });
        } else {
          goNextStatus(() => {
            prepareResolveRef.value?.();
          });
        }

        props.onAlign?.(popupDomNode, matchAlign);
      }
    };

    // ======================== Motion ========================
    const motion = computed(() => {
      const m = getMotion(props);
      ['onAfterEnter', 'onAfterLeave'].forEach(eventName => {
        m[eventName] = () => {
          goNextStatus();
        };
      });
      return m;
    });

    const onShowPrepare = () => {
      return new Promise(resolve => {
        prepareResolveRef.value = resolve;
      });
    };

    watch(
      [toRef(motion.value, 'name'), status],
      () => {
        if (!motion.value.name && status.value === 'motion') {
          goNextStatus();
        }
      },
      { immediate: true },
    );

    expose({
      forceAlign,
      getElement: () => {
        return (elementRef.value as any).$el || elementRef.value;
      },
    });
    return () => {
      const {
        zIndex,
        visible,
        align,
        prefixCls,
        destroyPopupOnHide,
        onMouseenter,
        onMouseleave,
        onTouchstart,
        onMousedown,
      } = props as PopupInnerProps;
      const statusValue = status.value;
      // ======================== Render ========================
      const mergedStyle: CSSProperties = {
        ...stretchStyle.value,
        zIndex,
        opacity: statusValue === 'motion' || statusValue === 'stable' || !visible ? undefined : 0,
        pointerEvents: statusValue === 'stable' ? undefined : 'none',
        ...(attrs.style as object),
      };

      // Align statusValue
      let alignDisabled = true;
      if (align?.points && (statusValue === 'align' || statusValue === 'stable')) {
        alignDisabled = false;
      }

      let childNode: any = flattenChildren(slots.default?.());

      // Wrapper when multiple children
      if (childNode.length > 1) {
        childNode = <div class={`${prefixCls}-content`}>{childNode}</div>;
      }
      const mergedClassName = classNames(prefixCls, attrs.class, alignedClassName.value);
      const transitionProps = getTransitionProps(motion.value.name, motion.value);
      return (
        <Transition
          ref={elementRef}
          {...transitionProps}
          onBeforeEnter={onShowPrepare}
          v-slots={{
            default: () => {
              return !destroyPopupOnHide || visible ? (
                <Align
                  v-show={visible}
                  target={getAlignTarget()}
                  key="popup"
                  ref={alignRef}
                  monitorWindowResize
                  disabled={alignDisabled}
                  align={align}
                  onAlign={onInternalAlign}
                  v-slots={{
                    default: () => (
                      <div
                        class={mergedClassName}
                        onMouseenter={onMouseenter}
                        onMouseleave={onMouseleave}
                        onMousedown={withModifiers(onMousedown, ['capture'])}
                        {...{
                          [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: withModifiers(
                            onTouchstart,
                            ['capture'],
                          ),
                        }}
                        style={mergedStyle}
                      >
                        {childNode}
                      </div>
                    ),
                  }}
                ></Align>
              ) : null;
            },
          }}
        ></Transition>
      );
    };
  },
});
