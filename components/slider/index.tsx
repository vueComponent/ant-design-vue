import type { CSSProperties, VNodeTypes, PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import type { TooltipPlacement } from '../tooltip/Tooltip';
import useConfigInject from '../_util/hooks/useConfigInject';
import SliderTooltip from './SliderTooltip';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form/FormItemContext';

export type SliderValue = number | [number, number];

interface SliderMarks {
  [key: number]:
    | VueNode
    | {
        style: CSSProperties;
        label: any;
      };
}

interface HandleGeneratorInfo {
  value?: number;
  dragging?: boolean;
  index: number;
}
interface SliderRange {
  draggableTrack?: boolean;
}
export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => VNodeTypes;
type Value = [number, number] | number;

const defaultTipFormatter = (value: number) => (typeof value === 'number' ? value.toString() : '');
export const sliderProps = () => ({
  id: String,
  prefixCls: String,
  tooltipPrefixCls: String,
  range: { type: [Boolean, Object] as PropType<boolean | SliderRange>, default: undefined },
  reverse: { type: Boolean, default: undefined },
  min: Number,
  max: Number,
  step: { type: [Number, Object] as PropType<null | number> },
  marks: { type: Object as PropType<SliderMarks> },
  dots: { type: Boolean, default: undefined },
  value: { type: [Number, Array] as PropType<Value> },
  defaultValue: { type: [Number, Array] as PropType<Value> },
  included: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  vertical: { type: Boolean, default: undefined },
  tipFormatter: {
    type: Function as PropType<(value?: number) => any>,
    default: defaultTipFormatter,
  },
  tooltipVisible: { type: Boolean, default: undefined },
  tooltipPlacement: { type: String as PropType<TooltipPlacement> },
  getTooltipPopupContainer: {
    type: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  },
  autofocus: { type: Boolean, default: undefined },
  onChange: { type: Function as PropType<(value: Value) => void> },
  onAfterChange: { type: Function as PropType<(value: Value) => void> },
  handleStyle: { type: [Object, Array] as PropType<CSSProperties[] | CSSProperties> },
  trackStyle: { type: [Object, Array] as PropType<CSSProperties[] | CSSProperties> },
});

export type Visibles = { [index: number]: boolean };

const Slider = defineComponent({
  name: 'ASlider',
  inheritAttrs: false,
  props: {
    ...sliderProps(),
  },
  emits: ['update:value', 'change', 'afterChange', 'blur'],
  slots: ['mark'],
  setup(props, { attrs, slots, emit, expose }) {
    const { prefixCls, rootPrefixCls, direction, getPopupContainer, configProvider } =
      useConfigInject('slider', props);
    const formItemContext = useInjectFormItemContext();
    const sliderRef = ref();
    const visibles = ref<Visibles>({});
    const toggleTooltipVisible = (index: number, visible: boolean) => {
      visibles.value[index] = visible;
    };
    const tooltipPlacement = computed(() => {
      if (props.tooltipPlacement) {
        return props.tooltipPlacement;
      }
      if (!props.vertical) {
        return 'top';
      }
      return direction.value === 'rtl' ? 'left' : 'right';
    });

    const focus = () => {
      sliderRef.value?.focus();
    };
    const blur = () => {
      sliderRef.value?.blur();
    };
    const handleChange = (val: SliderValue) => {
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = () => {
      emit('blur');
    };
    expose({
      focus,
      blur,
    });
    const handleWithTooltip: HandleGeneratorFn = ({
      tooltipPrefixCls,
      info: { value, dragging, index, ...restProps },
    }) => {
      const { tipFormatter, tooltipVisible, getTooltipPopupContainer } = props;
      const isTipFormatter = tipFormatter ? visibles.value[index] || dragging : false;
      const visible = tooltipVisible || (tooltipVisible === undefined && isTipFormatter);
      return (
        <SliderTooltip
          prefixCls={tooltipPrefixCls}
          title={tipFormatter ? tipFormatter(value) : ''}
          visible={visible}
          placement={tooltipPlacement.value}
          transitionName={`${rootPrefixCls.value}-zoom-down`}
          key={index}
          overlayClassName={`${prefixCls.value}-tooltip`}
          getPopupContainer={getTooltipPopupContainer || getPopupContainer.value}
        >
          <VcHandle
            {...restProps}
            value={value}
            onMouseenter={() => toggleTooltipVisible(index, true)}
            onMouseleave={() => toggleTooltipVisible(index, false)}
          />
        </SliderTooltip>
      );
    };
    return () => {
      const {
        tooltipPrefixCls: customizeTooltipPrefixCls,
        range,
        id = formItemContext.id.value,
        ...restProps
      } = props;
      const tooltipPrefixCls = configProvider.getPrefixCls('tooltip', customizeTooltipPrefixCls);
      const cls = classNames(attrs.class, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });

      // make reverse default on rtl direction
      if (direction.value === 'rtl' && !restProps.vertical) {
        restProps.reverse = !restProps.reverse;
      }

      // extrack draggableTrack from range={{ ... }}
      let draggableTrack: boolean | undefined;
      if (typeof range === 'object') {
        draggableTrack = range.draggableTrack;
      }

      if (range) {
        return (
          <VcRange
            {...restProps}
            step={restProps.step!}
            draggableTrack={draggableTrack}
            class={cls}
            ref={ref}
            handle={(info: HandleGeneratorInfo) =>
              handleWithTooltip({
                tooltipPrefixCls,
                prefixCls: prefixCls.value,
                info,
              })
            }
            prefixCls={prefixCls.value}
            onChange={handleChange}
            v-slots={{ mark: slots.mark }}
          />
        );
      }
      return (
        <VcSlider
          {...restProps}
          id={id}
          step={restProps.step!}
          class={cls}
          ref={ref}
          handle={(info: HandleGeneratorInfo) =>
            handleWithTooltip({
              tooltipPrefixCls,
              prefixCls: prefixCls.value,
              info,
            })
          }
          prefixCls={prefixCls.value}
          onChange={handleChange}
          onBlur={handleBlur}
          v-slots={{ mark: slots.mark }}
        />
      );
    };
  },
});

export default withInstall(Slider);
