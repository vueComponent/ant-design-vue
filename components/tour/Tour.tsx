import { computed, defineComponent, ref, toRefs } from 'vue';
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
    type: Object as PropType<TourStepProps['mask']>,
    default: true,
  },
  arrow: {
    type: Object as PropType<TourStepProps['arrow']>,
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
    type: Object as PropType<TourStepProps['scrollIntoViewOptions']>,
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
    const {
      visible,
      steps,
      current,
      mask,
      arrow,
      placement,
      gap,
      scrollIntoViewOptions,
      rootClassName,
    } = toRefs(props);

    const mergedCurrent = ref(current.value || 0);
    const mergedOpen = computed(() =>
      mergedCurrent.value < 0 || mergedCurrent.value >= steps.value.length
        ? false
        : visible.value ?? true,
    );

    const stepInfo = computed(() => steps.value[mergedCurrent.value]);

    const mergedPlacement = stepInfo.value.placement ?? placement.value;
    const mergedMask = mergedOpen.value && (stepInfo.value.mask ?? mask.value);
    const mergedScrollIntoViewOptions =
      stepInfo.value.scrollIntoViewOptions ?? scrollIntoViewOptions.value;
    const [posInfo, targetElement] = useTarget(
      stepInfo.value.target,
      gap.value,
      mergedScrollIntoViewOptions,
    );

    // ========================= arrow =========================
    const mergedArrow = targetElement
      ? typeof stepInfo.value.arrow === 'undefined'
        ? arrow.value
        : stepInfo.value.arrow
      : false;
    const arrowPointAtCenter = typeof mergedArrow === 'object' ? mergedArrow.pointAtCenter : false;

    // ========================= Change =========================
    const onInternalChange = (nextCurrent: number) => {
      mergedCurrent.value = nextCurrent;
      emit('change', nextCurrent);
    };

    // ========================= popupAlign =========================
    const popupAlign = targetElement
      ? arrowPointAtCenter
        ? placement.value || getCenterPlacements({ placement: placement.value })
        : placements[mergedPlacement]
      : CENTER_ALIGN;

    // ========================= Render =========================
    // Skip if not init yet
    if (targetElement === undefined) {
      return null;
    }

    const handleClose = () => {
      emit('update:visible', false);
      emit('close');
    };

    return () => {
      const { prefixCls } = useConfigInject('tour', props);

      const getPopupElement = () => (
        <TourStep
          arrow={mergedArrow}
          total={steps.value.length}
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
          {...steps.value[mergedCurrent.value]}
        />
      );

      const mergedShowMask = typeof mergedMask === 'boolean' ? mergedMask : !!mergedMask;
      // const mergedMaskStyle = typeof mergedMask === 'boolean' ? undefined : mergedMask;

      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = node => {
        return node || targetElement || document.body;
      };

      // style
      const [wrapSSR] = useStyle(prefixCls);
      return wrapSSR(
        <>
          <Trigger
            prefixCls={prefixCls.value}
            popupAlign={popupAlign}
            popupPlacement={mergedPlacement}
            popupVisible={mergedOpen.value}
            popup={getPopupElement}
            forceRender={false}
            destroyPopupOnHide
            zIndex={1090}
            getTriggerDOMNode={getTriggerDOMNode}
          >
            <Portal visible={mergedOpen.value}>
              <div
                class={classNames(rootClassName, `${prefixCls}-target-placeholder`)}
                style={{
                  ...(posInfo || CENTER_PLACEHOLDER),
                  position: 'fixed',
                  pointerEvents: 'none',
                }}
              />
            </Portal>
          </Trigger>
          <TourMask visible={visible.value} pos={posInfo} showMask={mergedShowMask} />
        </>,
      );
    };
  },
});
