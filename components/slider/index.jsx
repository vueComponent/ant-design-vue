import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, getListeners } from '../_util/props-util';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import Tooltip from '../tooltip';
import Base from '../base';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';

// export interface SliderMarks {
//   [key]: React.ReactNode | {
//     style: React.CSSProperties,
//     label: React.ReactNode,
//   };
// }
// const SliderMarks = PropTypes.shape({
//   style: PropTypes.object,
//   label: PropTypes.any,
// }).loose
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
});

const Slider = {
  name: 'ASlider',
  model: {
    prop: 'value',
    event: 'change',
  },
  mixins: [BaseMixin],
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  props: {
    ...SliderProps(),
    tipFormatter: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).def(value =>
      value.toString(),
    ),
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
    handleWithTooltip(
      tooltipPrefixCls,
      prefixCls,
      { value, dragging, index, directives, on, ...restProps },
    ) {
      const {
        tipFormatter,
        tooltipVisible,
        tooltipPlacement,
        getTooltipPopupContainer,
      } = this.$props;
      const { visibles } = this;
      const isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
      const visible = tooltipVisible || (tooltipVisible === undefined && isTipFormatter);
      const tooltipProps = {
        props: {
          prefixCls: tooltipPrefixCls,
          title: tipFormatter ? tipFormatter(value) : '',
          visible,
          placement: tooltipPlacement || 'top',
          transitionName: 'zoom-down',
          overlayClassName: `${prefixCls}-tooltip`,
          getPopupContainer: getTooltipPopupContainer || (() => document.body),
        },
        key: index,
      };
      const handleProps = {
        props: {
          value,
          ...restProps,
        },
        directives,
        on: {
          ...on,
          mouseenter: () => this.toggleTooltipVisible(index, true),
          mouseleave: () => this.toggleTooltipVisible(index, false),
        },
      };
      return (
        <Tooltip {...tooltipProps}>
          <VcHandle {...handleProps} />
        </Tooltip>
      );
    },
    focus() {
      this.$refs.sliderRef.focus();
    },
    blur() {
      this.$refs.sliderRef.blur();
    },
  },
  render() {
    const {
      range,
      prefixCls: customizePrefixCls,
      tooltipPrefixCls: customizeTooltipPrefixCls,
      ...restProps
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('slider', customizePrefixCls);
    const tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
    const listeners = getListeners(this);
    if (range) {
      const vcRangeProps = {
        props: {
          ...restProps,
          prefixCls,
          tooltipPrefixCls,
          handle: info => this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
        },
        ref: 'sliderRef',
        on: listeners,
      };
      return <VcRange {...vcRangeProps} />;
    }
    const vcSliderProps = {
      props: {
        ...restProps,
        prefixCls,
        tooltipPrefixCls,
        handle: info => this.handleWithTooltip(tooltipPrefixCls, prefixCls, info),
      },
      ref: 'sliderRef',
      on: listeners,
    };
    return <VcSlider {...vcSliderProps} />;
  },
};

/* istanbul ignore next */
Slider.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Slider.name, Slider);
};

export default Slider;
