import type { AlignType } from '../interface';
import useVisibleStatus from './useVisibleStatus';
import useStretchStyle from './useStretchStyle';
import type { CSSProperties } from 'vue';
import {
  computed,
  defineComponent,
  shallowRef,
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
  compatConfig: { MODE: 3 },
  name: 'PopupInner',
  inheritAttrs: false,
  props: innerProps,
  emits: ['mouseenter', 'mouseleave', 'mousedown', 'touchstart', 'align'],
  setup(props, { expose, attrs, slots }) {
    const alignRef = shallowRef<RefAlign>();
    const elementRef = shallowRef<HTMLDivElement>();
    const alignedClassName = shallowRef<string>();
    // ======================= Measure ========================
    const [stretchStyle, measureStretchStyle] = useStretchStyle(toRef(props, 'stretch'));

    const doMeasure = () => {
      if (props.stretch) {
        measureStretchStyle(props.getRootDomNode());
      }
    };
    const visible = shallowRef(false);
    let timeoutId: any;
    watch(
      () => props.visible,
      val => {
        clearTimeout(timeoutId);
        if (val) {
          timeoutId = setTimeout(() => {
            visible.value = props.visible;
          });
        } else {
          visible.value = false;
        }
      },
      { immediate: true },
    );

    // ======================== Status ========================
    const [status, goNextStatus] = useVisibleStatus(visible, doMeasure);

    // ======================== Aligns ========================
    const prepareResolveRef = shallowRef<(value?: unknown) => void>();

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
          Promise.resolve().then(() => {
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
      const m = typeof props.animation === 'object' ? props.animation : getMotion(props as any);
      ['onAfterEnter', 'onAfterLeave'].forEach(eventName => {
        const originFn = m[eventName];
        m[eventName] = node => {
          goNextStatus();
          // 结束后，强制 stable
          status.value = 'stable';
          originFn?.(node);
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
      [motion, status],
      () => {
        if (!motion.value && status.value === 'motion') {
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
    const alignDisabled = computed(() => {
      if ((props.align as any)?.points && (status.value === 'align' || status.value === 'stable')) {
        return false;
      }
      return true;
    });
    return () => {
      const {
        zIndex,
        align,
        prefixCls,
        destroyPopupOnHide,
        onMouseenter,
        onMouseleave,
        onTouchstart = () => {},
        onMousedown,
      } = props as PopupInnerProps;
      const statusValue = status.value;
      // ======================== Render ========================
      const mergedStyle: CSSProperties[] = [
        {
          ...stretchStyle.value,
          zIndex,
          opacity:
            statusValue === 'motion' || statusValue === 'stable' || !visible.value ? null : 0,
          // pointerEvents: statusValue === 'stable' ? null : 'none',
          pointerEvents: !visible.value && statusValue !== 'stable' ? 'none' : null,
        },
        attrs.style as CSSProperties,
      ];

      let childNode: any = flattenChildren(slots.default?.({ visible: props.visible }));

      // Wrapper when multiple children
      if (childNode.length > 1) {
        childNode = <div class={`${prefixCls}-content`}>{childNode}</div>;
      }

      const mergedClassName = classNames(
        prefixCls,
        attrs.class,
        alignedClassName.value,
        !props.arrow && `${prefixCls}-arrow-hidden`,
      );
      const hasAnimate = visible.value || !props.visible;
      const transitionProps = hasAnimate ? getTransitionProps(motion.value.name, motion.value) : {};

      return (
        <Transition
          ref={elementRef}
          {...transitionProps}
          onBeforeEnter={onShowPrepare}
          v-slots={{
            default: () => {
              return !destroyPopupOnHide || props.visible ? (
                <Align
                  v-show={visible.value}
                  target={getAlignTarget()}
                  key="popup"
                  ref={alignRef}
                  monitorWindowResize
                  disabled={alignDisabled.value}
                  align={align as any}
                  onAlign={onInternalAlign}
                  v-slots={{
                    default: () => (
                      <div
                        class={mergedClassName}
                        onMouseenter={onMouseenter}
                        onMouseleave={onMouseleave}
                        onMousedown={withModifiers(onMousedown, ['capture'] as any)}
                        {...{
                          [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: withModifiers(
                            onTouchstart,
                            ['capture'] as any,
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
