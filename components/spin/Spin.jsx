import { inject, cloneVNode, isVNode } from 'vue';
import debounce from 'lodash-es/debounce';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { initDefaultProps, getComponent, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export const SpinSize = PropTypes.oneOf(['small', 'default', 'large']);

export const SpinProps = () => ({
  prefixCls: PropTypes.string,
  spinning: PropTypes.bool,
  size: SpinSize,
  wrapperClassName: PropTypes.string,
  tip: PropTypes.string,
  delay: PropTypes.number,
  indicator: PropTypes.any,
});

// Render indicator
let defaultIndicator;

function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

export function setDefaultIndicator(Content) {
  const Indicator = Content.indicator;
  defaultIndicator =
    typeof Indicator === 'function'
      ? Indicator
      : () => {
          return <Indicator />;
        };
}

export default {
  name: 'ASpin',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(SpinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: '',
  }),
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    const { spinning, delay } = this;
    const shouldBeDelayed = shouldDelay(spinning, delay);
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(this.$props);
    return {
      sSpinning: spinning && !shouldBeDelayed,
    };
  },
  mounted() {
    this.updateSpinning();
  },
  updated() {
    this.$nextTick(() => {
      this.debouncifyUpdateSpinning();
      this.updateSpinning();
    });
  },
  beforeUnmount() {
    this.cancelExistingSpin();
  },
  methods: {
    debouncifyUpdateSpinning(props) {
      const { delay } = props || this.$props;
      if (delay) {
        this.cancelExistingSpin();
        this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
      }
    },
    updateSpinning() {
      const { spinning, sSpinning } = this;
      if (sSpinning !== spinning) {
        this.setState({ sSpinning: spinning });
      }
    },
    cancelExistingSpin() {
      const { updateSpinning } = this;
      if (updateSpinning && updateSpinning.cancel) {
        updateSpinning.cancel();
      }
    },
    renderIndicator(prefixCls) {
      const dotClassName = `${prefixCls}-dot`;
      let indicator = getComponent(this, 'indicator');
      // should not be render default indicator when indicator value is null
      if (indicator === null) {
        return null;
      }
      if (Array.isArray(indicator)) {
        indicator = indicator.length === 1 ? indicator[0] : indicator;
      }
      if (isVNode(indicator)) {
        return cloneVNode(indicator, { class: dotClassName });
      }

      if (defaultIndicator && isVNode(defaultIndicator())) {
        return cloneVNode(defaultIndicator(), { class: dotClassName });
      }

      return (
        <span class={`${dotClassName} ${prefixCls}-dot-spin`}>
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
        </span>
      );
    },
  },
  render() {
    const { size, prefixCls: customizePrefixCls, tip, wrapperClassName } = this.$props;
    const { class: cls, style, ...divProps } = this.$attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('spin', customizePrefixCls);

    const { sSpinning } = this;
    const spinClassName = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning`]: sSpinning,
      [`${prefixCls}-show-text`]: !!tip,
      [cls]: !!cls,
    };

    const spinElement = (
      <div {...divProps} style={style} class={spinClassName}>
        {this.renderIndicator(prefixCls)}
        {tip ? <div class={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    const children = getSlot(this);
    if (children && children.length) {
      const containerClassName = {
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: sSpinning,
      };

      return (
        <div class={[`${prefixCls}-nested-loading`, wrapperClassName]}>
          {sSpinning && <div key="loading">{spinElement}</div>}
          <div class={containerClassName} key="container">
            {children}
          </div>
        </div>
      );
    }
    return spinElement;
  },
};
