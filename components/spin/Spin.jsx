import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import {
  filterEmpty,
  initDefaultProps,
  isValidElement,
  getComponentFromProp,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

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
    prefixCls: 'ant-spin',
    size: 'default',
    spinning: true,
    wrapperClassName: '',
  }),
  data() {
    const { spinning, delay } = this;
    this.debounceTimeout = null;
    this.delayTimeout = null;
    return {
      sSpinning: spinning && !shouldDelay(spinning, delay),
    };
  },
  updated() {
    this.$nextTick(() => {
      const { delay, spinning, sSpinning } = this;
      if (sSpinning === spinning) {
        return;
      }

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      if (sSpinning && !spinning) {
        this.debounceTimeout = window.setTimeout(() => this.setState({ sSpinning: spinning }), 200);
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout);
        }
      } else {
        if (shouldDelay(spinning, delay)) {
          if (this.delayTimeout) {
            clearTimeout(this.delayTimeout);
          }
          this.delayTimeout = window.setTimeout(this.delayUpdateSpinning, delay);
        } else {
          this.setState({ sSpinning: spinning });
        }
      }
    });
  },
  beforeDestroy() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  },
  methods: {
    delayUpdateSpinning() {
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
    renderIndicator(h, props) {
      // const h = this.$createElement
      const { prefixCls } = props;
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
    const { size, prefixCls, tip, wrapperClassName, ...restProps } = this.$props;
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
        {this.renderIndicator(h, this.$props)}
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
        <div {...{ on: this.$listeners }} class={[`${prefixCls}-nested-loading`, wrapperClassName]}>
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
