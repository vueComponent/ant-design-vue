import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps } from '../_util/props-util';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import Tooltip from '../tooltip';

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

export const SliderProps = () => ({
  prefixCls: PropTypes.string,
  tooltipPrefixCls: PropTypes.string,
  range: PropTypes.bool,
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
});

const Slider = {
  name: 'ASlider',
  model: {
    prop: 'value',
    event: 'change',
  },
  mixins: [BaseMixin],
  props: {
    ...SliderProps(),
    prefixCls: PropTypes.string.def('ant-slider'),
    tooltipPrefixCls: PropTypes.string.def('ant-tooltip'),
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
    handleWithTooltip({ value, dragging, index, directives, on, ...restProps }) {
      const { tooltipPrefixCls, tipFormatter, tooltipVisible } = this.$props;
      const { visibles } = this;
      const isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
      const visible = tooltipVisible || (tooltipVisible === undefined && isTipFormatter);
      const tooltipProps = {
        props: {
          prefixCls: tooltipPrefixCls,
          title: tipFormatter ? tipFormatter(value) : '',
          visible,
          placement: 'top',
          transitionName: 'fade',
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
    const { range, ...restProps } = getOptionProps(this);
    if (range) {
      const vcRangeProps = {
        props: {
          ...restProps,
          handle: this.handleWithTooltip,
        },
        ref: 'sliderRef',
        on: this.$listeners,
      };
      return <VcRange {...vcRangeProps} />;
    }
    const vcSliderProps = {
      props: {
        ...restProps,
        handle: this.handleWithTooltip,
      },
      ref: 'sliderRef',
      on: this.$listeners,
    };
    return <VcSlider {...vcSliderProps} />;
  },
};

/* istanbul ignore next */
Slider.install = function(Vue) {
  Vue.component(Slider.name, Slider);
};

export default Slider;
