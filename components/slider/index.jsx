import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps } from '../_util/props-util';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import Tooltip from '../tooltip';
import { ConfigConsumerProps } from '../config-provider';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';

const tooltipProps = abstractTooltipProps();
export const SliderProps = () => ({
  prefixCls: PropTypes.string,
  tooltipPrefixCls: PropTypes.string,
  range: PropTypes.bool,
  reverse: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.any]),
  marks: PropTypes.object,
  dots: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  included: PropTypes.bool,
  disabled: PropTypes.bool,
  vertical: PropTypes.bool,
  tipFormatter: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  tooltipVisible: PropTypes.bool,
  tooltipPlacement: tooltipProps.placement,
  getTooltipPopupContainer: PropTypes.func,
  onChange: PropTypes.func,
  'onUpdate:value': PropTypes.func,
  onAfterChange: PropTypes.func,
});

const defaultTipFormatter = value => value.toString();

const Slider = {
  name: 'ASlider',
  inheritAttrs: false,
  // model: {
  //   prop: 'value',
  //   event: 'change',
  // },
  mixins: [BaseMixin],
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  props: {
    ...SliderProps(),
  },
  data() {
    return {
      visibles: {},
    };
  },
  methods: {
    toggleTooltipVisible(index, visible) {
      this.setState(({ visibles }) => ({
        visibles: {
          ...visibles,
          [index]: visible,
        },
      }));
    },
    handleWithTooltip(tooltipPrefixCls, prefixCls, { value, dragging, index, ...restProps }) {
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
    saveSlider(node) {
      this.vcSlider = node;
    },
    focus() {
      this.vcSlider.focus();
    },
    blur() {
      this.vcSlider.blur();
    },
    handleChange(val) {
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
    } = { ...getOptionProps(this), ...this.$attrs };
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('slider', customizePrefixCls);
    const tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
    if (range) {
      const vcRangeProps = {
        ...restProps,
        prefixCls,
        tooltipPrefixCls,
        handle: info => this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
        ref: this.saveSlider,
        onChange: this.handleChange,
      };
      return <VcRange {...vcRangeProps} />;
    }
    const vcSliderProps = {
      ...restProps,
      prefixCls,
      tooltipPrefixCls,
      handle: info => this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
      ref: this.saveSlider,
      onChange: this.handleChange,
    };
    return <VcSlider {...vcSliderProps} />;
  },
};

/* istanbul ignore next */
Slider.install = function(app) {
  app.component(Slider.name, Slider);
};

export default Slider;
