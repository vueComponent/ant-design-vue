import debounce from 'lodash/debounce';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import {
  filterEmpty,
  initDefaultProps,
  isValidElement,
  getComponentFromProp,
  getListeners,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
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

export function setDefaultIndicator(content) {
  defaultIndicator =
    typeof content.indicator === 'function'
      ? content.indicator
      : h => {
          return <content.indicator />;
        };
}

export default {
  name: 'ASpin',
  mixins: [BaseMixin],
  props: initDefaultProps(SpinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: '',
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
  beforeDestroy() {
    if (this.updateSpinning && this.updateSpinning.cancel) {
      this.updateSpinning.cancel();
    }
  },
  methods: {
    debouncifyUpdateSpinning(props) {
      const { delay } = props || this.$props;
      if (delay) {
        this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
      }
    },
    updateSpinning() {
      const { spinning, sSpinning } = this;
      if (sSpinning !== spinning) {
        this.setState({ sSpinning: spinning });
      }
    },
    getChildren() {
      if (this.$slots && this.$slots.default) {
        return filterEmpty(this.$slots.default);
      }
      return null;
    },
    renderIndicator(h, prefixCls) {
      // const h = this.$createElement
      const dotClassName = `${prefixCls}-dot`;
      let indicator = getComponentFromProp(this, 'indicator');
      if (Array.isArray(indicator)) {
        indicator = filterEmpty(indicator);
        indicator = indicator.length === 1 ? indicator[0] : indicator;
      }
      if (isValidElement(indicator)) {
        return cloneElement(indicator, { class: dotClassName });
      }

      if (defaultIndicator && isValidElement(defaultIndicator(h))) {
        return cloneElement(defaultIndicator(h), { class: dotClassName });
      }

      return (
        <span class={`${dotClassName} ${prefixCls}-dot-spin`}>
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    },
  },
  render(h) {
    const {
      size,
      prefixCls: customizePrefixCls,
      tip,
      wrapperClassName,
      ...restProps
    } = this.$props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('spin', customizePrefixCls);

    const { sSpinning } = this;
    const spinClassName = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning`]: sSpinning,
      [`${prefixCls}-show-text`]: !!tip,
    };

    const spinElement = (
      <div {...restProps} class={spinClassName}>
        {this.renderIndicator(h, prefixCls)}
        {tip ? <div class={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    const children = this.getChildren();
    if (children) {
      const containerClassName = {
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: sSpinning,
      };

      return (
        <div
          {...{ on: getListeners(this) }}
          class={[`${prefixCls}-nested-loading`, wrapperClassName]}
        >
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
