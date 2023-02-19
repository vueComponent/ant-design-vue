import { computed, defineComponent, ref } from 'vue';
import type { ExtractPropTypes, PropType, VNode, CSSProperties } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useTarget from './useTarget';
import TourStep from './TourStep';
import TourMask from './TourMask';
import Trigger from '../vc-trigger';
import Portal from '../_util/PortalWrapper';
import type { TourStepProps } from './TourStep';
import type { PlacementType } from './placements';
import type { Gap } from './useTarget';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { getCenterPlacements } from './placements';
import placements from '../_util/placements';
import classNames from '../_util/classNames';

const CENTER_ALIGN = {
  points: ['cc', 'cc'],
  offset: [0, 0],
};

const CENTER_PLACEHOLDER: CSSProperties = {
  left: '50%',
  top: '50%',
  width: 1,
  height: 1,
};

export const tourProps = () => ({
  prefixCls: String,
  steps: {
    type: Array as PropType<Array<TourStepProps>>,
    default: [],
  },
  visible: Boolean,
  current: Number,
  mask: {
    type: Boolean,
    default: true,
  },
  arrow: {
    type: Boolean,
    default: true,
  },
  rootClassName: String,
  placement: {
    type: String as PropType<PlacementType>,
    default: 'bottom',
  },
  renderPanel: { type: Function as PropType<(props: TourStepProps, current: number) => VNode> },
  gap: { type: String as PropType<Gap> },
  animated: { type: Object as PropType<boolean | { placeholder: boolean }> },
  scrollIntoViewOptions: {
    type: Boolean,
    default: true,
  },
});

export type TourProps = ExtractPropTypes<ReturnType<typeof tourProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATour',
  inheritAttrs: false,
  props: initDefaultProps(tourProps(), {}),
  emits: ['update:visible', 'change', 'close'],
  setup(props: TourProps, { emit }) {
    const mergedCurrent = ref(props.current || 0);
    const mergedOpen = computed(() =>
      mergedCurrent.value < 0 || mergedCurrent.value >= props.steps.length
        ? false
        : props.visible ?? true,
    );

    const stepInfo = computed(() => props.steps[mergedCurrent.value]);

    const mergedPlacement = computed(() => stepInfo.value.placement ?? props.placement);
    const mergedMask = computed(() => mergedOpen.value && (stepInfo.value.mask ?? props.mask));
    const mergedScrollIntoViewOptions = computed(
      () => stepInfo.value.scrollIntoViewOptions ?? props.scrollIntoViewOptions,
    );
    const target = useTarget(stepInfo.value.target, props.gap, mergedScrollIntoViewOptions.value);
    // ========================= Change =========================
    const onInternalChange = (nextCurrent: number) => {
      mergedCurrent.value = nextCurrent;
      emit('change', nextCurrent);
    };

    // ========================= popupAlign =========================
    const popupAlign = target.targetElement
      ? props.arrow
        ? props.placement || getCenterPlacements({ placement: props.placement })
        : placements[mergedPlacement.value]
      : CENTER_ALIGN;

    // ========================= Render =========================
    // Skip if not init yet
    if (target.targetElement === undefined) {
      return null;
    }

    const handleClose = () => {
      emit('update:visible', false);
      emit('close');
    };

    return () => {
      const { prefixCls } = useConfigInject('tour', props);
      const { steps, rootClassName } = props;

      const getPopupElement = () => (
        <TourStep
          arrow={props.arrow}
          total={steps.length}
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
          }}
          {...steps[mergedCurrent.value]}
        />
      );

      const mergedShowMask =
        typeof mergedMask.value === 'boolean' ? mergedMask.value : !!mergedMask.value;
      // const mergedMaskStyle = typeof mergedMask === 'boolean' ? undefined : mergedMask;

      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = node => {
        return node || target.targetElement || document.body;
      };

      // style
      const [wrapSSR] = useStyle(prefixCls);
      return wrapSSR(
        <>
          <Trigger
            prefixCls={prefixCls.value}
            popupAlign={popupAlign}
            popupPlacement={mergedPlacement.value}
            popupVisible={mergedOpen.value}
            popup={getPopupElement}
            forceRender={false}
            destroyPopupOnHide
            zIndex={1090}
            getTriggerDOMNode={getTriggerDOMNode}
          >
            <Portal visible={mergedOpen.value}>
              <div
                class={classNames(rootClassName, `${prefixCls.value}-target-placeholder`)}
                style={{
                  ...(target.mergedPosInfo || CENTER_PLACEHOLDER),
                  position: 'fixed',
                  pointerEvents: 'none',
                }}
              />
            </Portal>
          </Trigger>
          <TourMask
            visible={props.visible}
            pos={target.mergedPosInfo.value}
            showMask={mergedShowMask}
          />
        </>,
      );
    };
  },
});
