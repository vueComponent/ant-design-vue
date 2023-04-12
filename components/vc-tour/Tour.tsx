import { ref, computed, watch, watchEffect, defineComponent, toRefs } from 'vue';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
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
import useScrollLocker from './hooks/useScrollLocker';
import canUseDom from '../_util/canUseDom';

const CENTER_PLACEHOLDER: CSSProperties = {
  left: '50%',
  top: '50%',
  width: 1,
  height: 1,
};

export const tourProps = () => {
  const { builtinPlacements, ...pickedTriggerProps } = triggerProps();
  return {
    ...pickedTriggerProps,
    steps: { type: Array as PropType<TourStepInfo[]>, default: () => [] },
    open: { type: Boolean },
    defaultCurrent: { type: Number },
    current: { type: Number },
    onChange: { type: Function as PropType<(current: number) => void> },
    onClose: { type: Function as PropType<(current: number) => void> },
    onFinish: { type: Function as PropType<() => void> },
    mask: {
      type: [Boolean, Object] as PropType<boolean | { style?: CSSProperties; color?: string }>,
      default: true,
    },
    arrow: {
      type: [Boolean, Object] as PropType<boolean | { pointAtCenter: boolean }>,
      default: true,
    },
    rootClassName: { type: String },
    placement: { type: String as PropType<PlacementType>, default: 'bottom' },
    prefixCls: { type: String, default: 'vc-tour' },
    renderPanel: { type: Function as PropType<(props: TourStepProps, current: number) => VueNode> },
    gap: { type: Object as PropType<Gap> },
    animated: { type: [Boolean, Object] as PropType<boolean | { placeholder: boolean }> },
    scrollIntoViewOptions: {
      type: [Boolean, Object] as PropType<boolean | ScrollIntoViewOptions>,
      default: true,
    },
    zIndex: { type: Number, default: 1001 },
  };
};

export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;

const Tour = defineComponent({
  name: 'Tour',
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

    const openRef = ref(mergedOpen.value);
    watchEffect(() => {
      if (mergedOpen.value && !openRef.value) {
        setMergedCurrent(0);
      }
      openRef.value = mergedOpen.value;
    });

    const curStep = computed(() => props.steps[mergedCurrent.value] || {});

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

    // ========================= lock scroll =========================
    const lockScroll = computed(() => mergedOpen.value && canUseDom());

    useScrollLocker(lockScroll);

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

      const mergedShowMask =
        typeof mergedMask.value === 'boolean' ? mergedMask.value : !!mergedMask.value;
      const mergedMaskStyle = typeof mergedMask.value === 'boolean' ? undefined : mergedMask.value;

      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = () => {
        return targetElement.value || document.body;
      };

      return (
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
            builtinPlacements={getPlacements(arrowPointAtCenter.value)}
            {...restProps}
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
            popupPlacement={!curStep.value.target ? 'center' : mergedPlacement.value}
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
            <div
              class={classNames(rootClassName, `${prefixCls}-target-placeholder`)}
              style={{
                ...(posInfo.value || CENTER_PLACEHOLDER),
                position: 'fixed',
                pointerEvents: 'none',
              }}
            />
          </Trigger>
        </>
      );
    };
  },
});

export default Tour;
