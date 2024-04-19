import { ref, computed, watch, watchEffect, defineComponent, toRefs, shallowRef } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { VueNode } from '../_util/type';
import Trigger, { triggerProps } from '../vc-trigger';
import classNames from '../_util/classNames';
import useMergedState from '../_util/hooks/useMergedState';
import useTarget from './hooks/useTarget';
import type { Gap } from './hooks/useTarget';
import TourStep from './TourStep';
import type { TourStepInfo, TourStepProps } from './interface';
import Mask from './Mask';
import { getPlacements } from './placements';
import type { PlacementType } from './placements';
import { initDefaultProps } from '../_util/props-util';

import {
  someType,
  stringType,
  arrayType,
  objectType,
  functionType,
  booleanType,
} from '../_util/type';
import Portal from '../_util/PortalWrapper';

const CENTER_PLACEHOLDER: CSSProperties = {
  left: '50%',
  top: '50%',
  width: '1px',
  height: '1px',
};

export const tourProps = () => {
  const { builtinPlacements, popupAlign } = triggerProps();
  return {
    builtinPlacements,
    popupAlign,
    steps: arrayType<TourStepInfo[]>(),
    open: booleanType(),
    defaultCurrent: { type: Number },
    current: { type: Number },
    onChange: functionType<(current: number) => void>(),
    onClose: functionType<(current: number) => void>(),
    onFinish: functionType<() => void>(),
    mask: someType<boolean | { style?: CSSProperties; color?: string }>([Boolean, Object], true),
    arrow: someType<boolean | { pointAtCenter: boolean }>([Boolean, Object], true),
    rootClassName: { type: String },
    placement: stringType<PlacementType>('bottom'),
    prefixCls: { type: String, default: 'rc-tour' },
    renderPanel: functionType<(props: TourStepProps, current: number) => VueNode>(),
    gap: objectType<Gap>(),
    animated: someType<boolean | { placeholder: boolean }>([Boolean, Object]),
    scrollIntoViewOptions: someType<boolean | ScrollIntoViewOptions>([Boolean, Object], true),
    zIndex: { type: Number, default: 1001 },
  };
};

export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;

const Tour = defineComponent({
  name: 'Tour',
  inheritAttrs: false,
  props: initDefaultProps(tourProps(), {}),
  setup(props) {
    const { defaultCurrent, placement, mask, scrollIntoViewOptions, open, gap, arrow } =
      toRefs(props);

    const triggerRef = ref();

    const [mergedCurrent, setMergedCurrent] = useMergedState(0, {
      value: computed(() => props.current),
      defaultValue: defaultCurrent.value,
    });

    const [mergedOpen, setMergedOpen] = useMergedState(undefined, {
      value: computed(() => props.open),
      postState: origin =>
        mergedCurrent.value < 0 || mergedCurrent.value >= props.steps.length
          ? false
          : origin ?? true,
    });

    const openRef = shallowRef(mergedOpen.value);
    watchEffect(() => {
      if (mergedOpen.value && !openRef.value) {
        setMergedCurrent(0);
      }
      openRef.value = mergedOpen.value;
    });

    const curStep = computed(() => (props.steps[mergedCurrent.value] || {}) as TourStepInfo);

    const mergedPlacement = computed(() => curStep.value.placement ?? placement.value);
    const mergedMask = computed(() => mergedOpen.value && (curStep.value.mask ?? mask.value));
    const mergedScrollIntoViewOptions = computed(
      () => curStep.value.scrollIntoViewOptions ?? scrollIntoViewOptions.value,
    );
    const [posInfo, targetElement] = useTarget(
      computed(() => curStep.value.target),
      open,
      gap,
      mergedScrollIntoViewOptions,
    );

    // ========================= arrow =========================
    const mergedArrow = computed(() =>
      targetElement.value
        ? typeof curStep.value.arrow === 'undefined'
          ? arrow.value
          : curStep.value.arrow
        : false,
    );
    const arrowPointAtCenter = computed(() =>
      typeof mergedArrow.value === 'object' ? mergedArrow.value.pointAtCenter : false,
    );

    watch(arrowPointAtCenter, () => {
      triggerRef.value?.forcePopupAlign();
    });
    watch(mergedCurrent, () => {
      triggerRef.value?.forcePopupAlign();
    });

    // ========================= Change =========================
    const onInternalChange = (nextCurrent: number) => {
      setMergedCurrent(nextCurrent);
      props.onChange?.(nextCurrent);
    };

    return () => {
      const {
        prefixCls,
        steps,
        onClose,
        onFinish,
        rootClassName,
        renderPanel,
        animated,
        zIndex,
        ...restProps
      } = props;

      // ========================= Render =========================
      // Skip if not init yet
      if (targetElement.value === undefined) {
        return null;
      }

      const handleClose = () => {
        setMergedOpen(false);
        onClose?.(mergedCurrent.value);
      };

      const mergedShowMask =
        typeof mergedMask.value === 'boolean' ? mergedMask.value : !!mergedMask.value;
      const mergedMaskStyle = typeof mergedMask.value === 'boolean' ? undefined : mergedMask.value;

      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = () => {
        return targetElement.value || document.body;
      };

      const getPopupElement = () => (
        <TourStep
          arrow={mergedArrow.value}
          key="content"
          prefixCls={prefixCls}
          total={steps.length}
          renderPanel={renderPanel}
          onPrev={() => {
            onInternalChange(mergedCurrent.value - 1);
          }}
          onNext={() => {
            onInternalChange(mergedCurrent.value + 1);
          }}
          onClose={handleClose}
          current={mergedCurrent.value}
          onFinish={() => {
            handleClose();
            onFinish?.();
          }}
          {...curStep.value}
        />
      );
      const posInfoStyle = computed(() => {
        const info = posInfo.value || CENTER_PLACEHOLDER;
        // 如果info[key] 是number，添加 px
        const style: CSSProperties = {};
        Object.keys(info).forEach(key => {
          if (typeof info[key] === 'number') {
            style[key] = `${info[key]}px`;
          } else {
            style[key] = info[key];
          }
        });
        return style;
      });
      return mergedOpen.value ? (
        <>
          <Mask
            zIndex={zIndex}
            prefixCls={prefixCls}
            pos={posInfo.value}
            showMask={mergedShowMask}
            style={mergedMaskStyle?.style}
            fill={mergedMaskStyle?.color}
            open={mergedOpen.value}
            animated={animated}
            rootClassName={rootClassName}
          />
          <Trigger
            {...restProps}
            arrow={!!restProps.arrow}
            builtinPlacements={
              !curStep.value.target
                ? undefined
                : restProps.builtinPlacements ?? getPlacements(arrowPointAtCenter.value)
            }
            ref={triggerRef}
            popupStyle={
              !curStep.value.target
                ? {
                    ...curStep.value.style,
                    position: 'fixed',
                    left: CENTER_PLACEHOLDER.left,
                    top: CENTER_PLACEHOLDER.top,
                    transform: 'translate(-50%, -50%)',
                  }
                : curStep.value.style
            }
            popupPlacement={mergedPlacement.value}
            popupVisible={mergedOpen.value}
            popupClassName={classNames(rootClassName, curStep.value.className)}
            prefixCls={prefixCls}
            popup={getPopupElement}
            forceRender={false}
            destroyPopupOnHide
            zIndex={zIndex}
            mask={false}
            getTriggerDOMNode={getTriggerDOMNode}
          >
            <Portal visible={mergedOpen.value} autoLock>
              <div
                class={classNames(rootClassName, `${prefixCls}-target-placeholder`)}
                style={{
                  ...posInfoStyle.value,
                  position: 'fixed',
                  pointerEvents: 'none',
                }}
              />
            </Portal>
          </Trigger>
        </>
      ) : null;
    };
  },
});

export default Tour;
