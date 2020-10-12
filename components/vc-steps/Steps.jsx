import PropTypes, { withUndefined } from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import debounce from 'lodash-es/debounce';
import isFlexSupported from '../_util/isFlexSupported';
import { getSlot, getPropsData } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Steps',
  mixins: [BaseMixin],
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('rc-steps'),
    iconPrefix: PropTypes.string.def('rc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
    canClick: PropTypes.looseBool,
  },
  data() {
    this.calcStepOffsetWidth = debounce(this.calcStepOffsetWidth, 150);
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.calcStepOffsetWidth();
      if (!isFlexSupported()) {
        this.setState({
          flexSupported: false,
        });
      }
    });
  },
  updated() {
    this.$nextTick(() => {
      this.calcStepOffsetWidth();
    });
  },
  beforeUnmount() {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout);
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel();
    }
  },
  methods: {
    onStepClick(next) {
      const { current } = this.$props;
      if (current !== next) {
        this.__emit('change', next);
      }
    },
    calcStepOffsetWidth() {
      if (isFlexSupported()) {
        return;
      }
      const { lastStepOffsetWidth } = this.$data;
      // Just for IE9
      const domNode = this.$refs.vcStepsRef;
      if (domNode.children.length > 0) {
        if (this.calcTimeout) {
          clearTimeout(this.calcTimeout);
        }
        this.calcTimeout = setTimeout(() => {
          // +1 for fit edge bug of digit width, like 35.4px
          const offsetWidth = (domNode.lastChild.offsetWidth || 0) + 1;
          // Reduce shake bug
          if (
            lastStepOffsetWidth === offsetWidth ||
            Math.abs(lastStepOffsetWidth - offsetWidth) <= 3
          ) {
            return;
          }
          this.setState({ lastStepOffsetWidth: offsetWidth });
        });
      }
    },
  },
  render() {
    const {
      prefixCls,
      direction,
      type,
      labelPlacement,
      iconPrefix,
      status,
      size,
      current,
      progressDot,
      initial,
      icons,
      canClick,
    } = this;
    const isNav = type === 'navigation';
    const { lastStepOffsetWidth, flexSupported } = this;
    const filteredChildren = getSlot(this);
    const lastIndex = filteredChildren.length - 1;
    const adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
    const classString = {
      [prefixCls]: true,
      [`${prefixCls}-${direction}`]: true,
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-label-${adjustedlabelPlacement}`]: direction === 'horizontal',
      [`${prefixCls}-dot`]: !!progressDot,
      [`${prefixCls}-navigation`]: isNav,
      [`${prefixCls}-flex-not-supported`]: !flexSupported,
    };
    const stepsProps = {
      class: classString,
      ref: 'vcStepsRef',
    };
    return (
      <div {...stepsProps}>
        {filteredChildren.map((child, index) => {
          const childProps = getPropsData(child);
          const stepNumber = initial + index;
          const stepProps = {
            stepNumber: `${stepNumber + 1}`,
            stepIndex: stepNumber,
            prefixCls,
            iconPrefix,
            progressDot,
            icons,
            ...childProps,
          };
          if (canClick) {
            stepProps.onStepClick = this.onStepClick;
          }
          if (!flexSupported && direction !== 'vertical') {
            if (isNav) {
              stepProps.itemWidth = `${100 / (lastIndex + 1)}%`;
              stepProps.adjustMarginRight = 0;
            } else if (index !== lastIndex) {
              stepProps.itemWidth = `${100 / lastIndex}%`;
              stepProps.adjustMarginRight = `${-Math.round(lastStepOffsetWidth / lastIndex + 1)}px`;
            }
          }
          // fix tail color
          if (status === 'error' && index === current - 1) {
            stepProps.class = `${prefixCls}-next-error`;
          }
          if (!childProps.status) {
            if (stepNumber === current) {
              stepProps.status = status;
            } else if (stepNumber < current) {
              stepProps.status = 'finish';
            } else {
              stepProps.status = 'wait';
            }
          }
          stepProps.active = stepNumber === current;
          return cloneElement(child, stepProps);
        })}
      </div>
    );
  },
});
