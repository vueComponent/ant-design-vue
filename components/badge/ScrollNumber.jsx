import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getStyle } from '../_util/props-util';
import omit from 'omit.js';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function getNumberArray(num) {
  return num
    ? num
        .toString()
        .split('')
        .reverse()
        .map(i => {
          const current = Number(i);
          return isNaN(current) ? i : current;
        })
    : [];
}

const ScrollNumberProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.any,
  component: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string, null]),
  displayComponent: PropTypes.any,
  className: PropTypes.object,
};

export default {
  mixins: [BaseMixin],
  props: ScrollNumberProps,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      animateStarted: true,
      sCount: this.count,
    };
  },
  watch: {
    count() {
      this.lastCount = this.sCount;
      this.setState({
        animateStarted: true,
      });
    },
  },
  updated() {
    const { animateStarted, count } = this;
    if (animateStarted) {
      this.clearTimeout();
      // Let browser has time to reset the scroller before actually
      // performing the transition.
      this.timeout = setTimeout(() => {
        this.setState(
          {
            animateStarted: false,
            sCount: count,
          },
          this.onAnimated,
        );
      });
    }
  },
  beforeDestroy() {
    this.clearTimeout();
  },
  methods: {
    clearTimeout() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
    },
    getPositionByNum(num, i) {
      const { sCount } = this;
      const currentCount = Math.abs(Number(sCount));
      const lastCount = Math.abs(Number(this.lastCount));
      const currentDigit = Math.abs(getNumberArray(sCount)[i]);
      const lastDigit = Math.abs(getNumberArray(this.lastCount)[i]);

      if (this.animateStarted) {
        return 10 + num;
      }
      // 同方向则在同一侧切换数字
      if (currentCount > lastCount) {
        if (currentDigit >= lastDigit) {
          return 10 + num;
        }
        return 20 + num;
      }
      if (currentDigit <= lastDigit) {
        return 10 + num;
      }
      return num;
    },
    onAnimated() {
      this.$emit('animated');
    },

    renderNumberList(position, className) {
      const childrenToReturn = [];
      for (let i = 0; i < 30; i++) {
        childrenToReturn.push(
          <p
            key={i.toString()}
            class={classNames(className, {
              current: position === i,
            })}
          >
            {i % 10}
          </p>,
        );
      }

      return childrenToReturn;
    },
    renderCurrentNumber(prefixCls, num, i) {
      if (typeof num === 'number') {
        const position = this.getPositionByNum(num, i);
        const removeTransition =
          this.animateStarted || getNumberArray(this.lastCount)[i] === undefined;
        const style = {
          transition: removeTransition ? 'none' : undefined,
          msTransform: `translateY(${-position * 100}%)`,
          WebkitTransform: `translateY(${-position * 100}%)`,
          transform: `translateY(${-position * 100}%)`,
        };
        return (
          <span class={`${prefixCls}-only`} style={style} key={i}>
            {this.renderNumberList(position, `${prefixCls}-only-unit`)}
          </span>
        );
      }
      return (
        <span key="symbol" class={`${prefixCls}-symbol`}>
          {num}
        </span>
      );
    },

    renderNumberElement(prefixCls) {
      const { sCount } = this;
      if (sCount && Number(sCount) % 1 === 0) {
        return getNumberArray(sCount)
          .map((num, i) => this.renderCurrentNumber(prefixCls, num, i))
          .reverse();
      }
      return sCount;
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      title,
      component: Tag = 'sup',
      displayComponent,
      className,
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('scroll-number', customizePrefixCls);
    if (displayComponent) {
      return cloneElement(displayComponent, {
        class: `${prefixCls}-custom-component`,
      });
    }
    const style = getStyle(this, true);
    // fix https://fb.me/react-unknown-prop
    const restProps = omit(this.$props, ['count', 'component', 'prefixCls', 'displayComponent']);
    const newProps = {
      props: {
        ...restProps,
      },
      attrs: {
        title,
      },
      style,
      class: classNames(prefixCls, className),
    };
    // allow specify the border
    // mock border-color by box-shadow for compatible with old usage:
    // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
    if (style && style.borderColor) {
      newProps.style.boxShadow = `0 0 0 1px ${style.borderColor} inset`;
    }

    return <Tag {...newProps}>{this.renderNumberElement(prefixCls)}</Tag>;
  },
};
