import type { VNodeTypes } from 'vue';
import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps } from '../_util/props-util';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import Tooltip from '../tooltip';
import { defaultConfigProvider } from '../config-provider';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { withInstall } from '../_util/type';

export type SliderValue = number | [number, number];

interface HandleGeneratorInfo {
  value: number;
  dragging: boolean;
  index: number;
  rest: any[];
}

export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => VNodeTypes;

const tooltipProps = abstractTooltipProps();
export const SliderProps = () => ({
  prefixCls: PropTypes.string,
  tooltipPrefixCls: PropTypes.string,
  range: PropTypes.looseBool,
  reverse: PropTypes.looseBool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.any,
  marks: PropTypes.object,
  dots: PropTypes.looseBool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  included: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  vertical: PropTypes.looseBool,
  tipFormatter: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  tooltipVisible: PropTypes.looseBool,
  tooltipPlacement: tooltipProps.placement,
  getTooltipPopupContainer: PropTypes.func,
  onChange: PropTypes.func,
  onAfterChange: PropTypes.func,
});

const defaultTipFormatter = (value: number) => value.toString();

const Slider = defineComponent({
  name: 'ASlider',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    ...SliderProps(),
  },
  emits: ['update:value', 'change'],
  setup() {
    return {
      vcSlider: null,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      visibles: {},
    };
  },
  methods: {
    toggleTooltipVisible(index: number, visible: boolean) {
      this.setState(({ visibles }) => ({
        visibles: {
          ...visibles,
          [index]: visible,
        },
      }));
    },
    handleWithTooltip(
      tooltipPrefixCls: string,
      prefixCls: string,
      { value, dragging, index, ...restProps }: HandleGeneratorInfo,
    ): VNodeTypes {
      const {
        tipFormatter = defaultTipFormatter,
        tooltipVisible,
        tooltipPlacement,
        getTooltipPopupContainer,
      } = this.$props;
      const { visibles } = this;
      const isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
      const visible = tooltipVisible || (tooltipVisible === undefined && isTipFormatter);
      const tooltipProps = {
        prefixCls: tooltipPrefixCls,
        title: tipFormatter ? tipFormatter(value) : '',
        visible,
        placement: tooltipPlacement || 'top',
        transitionName: 'zoom-down',
        overlayClassName: `${prefixCls}-tooltip`,
        getPopupContainer: getTooltipPopupContainer || (() => document.body),
        key: index,
      };
      const handleProps = {
        value,
        ...restProps,
        onMouseenter: () => this.toggleTooltipVisible(index, true),
        onMouseleave: () => this.toggleTooltipVisible(index, false),
      };
      return (
        <Tooltip {...tooltipProps}>
          <VcHandle {...handleProps} />
        </Tooltip>
      );
    },
    saveSlider(node: any) {
      this.vcSlider = node;
    },
    focus() {
      this.vcSlider.focus();
    },
    blur() {
      this.vcSlider.blur();
    },
    handleChange(val: SliderValue) {
      this.$emit('update:value', val);
      this.$emit('change', val);
    },
  },
  render() {
    const {
      range,
      prefixCls: customizePrefixCls,
      tooltipPrefixCls: customizeTooltipPrefixCls,
      ...restProps
    } = { ...getOptionProps(this), ...this.$attrs } as any;
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('slider', customizePrefixCls);
    const tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
    if (range) {
      const vcRangeProps = {
        ...restProps,
        prefixCls,
        tooltipPrefixCls,
        handle: (info: HandleGeneratorInfo) =>
          this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
        ref: this.saveSlider,
        onChange: this.handleChange,
      };
      return <VcRange {...vcRangeProps} />;
    }
    const vcSliderProps = {
      ...restProps,
      prefixCls,
      tooltipPrefixCls,
      handle: (info: HandleGeneratorInfo) =>
        this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
      ref: this.saveSlider,
      onChange: this.handleChange,
    };
    return <VcSlider {...vcSliderProps} />;
  },
});

export default withInstall(Slider);
