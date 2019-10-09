import raf from 'raf';
import PropTypes from '../_util/vue-types';
import addEventListener from '../_util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

const easeInOutCubic = (t, b, c, d) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  } else {
    return (cc / 2) * ((t -= 2) * t * t + 2) + b;
  }
};

function getDefaultTarget() {
  return window;
}

const BackTopProps = {
  visibilityHeight: PropTypes.number,
  // onClick?: React.MouseEventHandler<any>;
  target: PropTypes.func,
  prefixCls: PropTypes.string,
  // visible: PropTypes.bool, // Only for test. Don't use it.
};

const BackTop = {
  name: 'ABackTop',
  mixins: [BaseMixin],
  props: {
    ...BackTopProps,
    visibilityHeight: PropTypes.number.def(400),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    this.scrollEvent = null;
    return {
      visible: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const getTarget = this.target || getDefaultTarget;
      this.scrollEvent = addEventListener(getTarget(), 'scroll', this.handleScroll);
      this.handleScroll();
    });
  },

  beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },
  methods: {
    getCurrentScrollTop() {
      const getTarget = this.target || getDefaultTarget;
      const targetNode = getTarget();
      if (targetNode === window) {
        return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
      }
      return targetNode.scrollTop;
    },

    scrollToTop(e) {
      const scrollTop = this.getCurrentScrollTop();
      const startTime = Date.now();
      const frameFunc = () => {
        const timestamp = Date.now();
        const time = timestamp - startTime;
        this.setScrollTop(easeInOutCubic(time, scrollTop, 0, 450));
        if (time < 450) {
          raf(frameFunc);
        } else {
          this.setScrollTop(0);
        }
      };
      raf(frameFunc);
      this.$emit('click', e);
    },

    setScrollTop(value) {
      const getTarget = this.target || getDefaultTarget;
      const targetNode = getTarget();
      if (targetNode === window) {
        document.body.scrollTop = value;
        document.documentElement.scrollTop = value;
      } else {
        targetNode.scrollTop = value;
      }
    },

    handleScroll() {
      const { visibilityHeight, target = getDefaultTarget } = this;
      const scrollTop = getScroll(target(), true);
      this.setState({
        visible: scrollTop > visibilityHeight,
      });
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, $slots, $listeners } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('back-top', customizePrefixCls);

    const defaultElement = (
      <div class={`${prefixCls}-content`}>
        <div class={`${prefixCls}-icon`} />
      </div>
    );
    const divProps = {
      on: {
        ...$listeners,
        click: this.scrollToTop,
      },
      class: prefixCls,
    };

    const backTopBtn = this.visible ? (
      <div {...divProps}>{$slots.default || defaultElement}</div>
    ) : null;
    const transitionProps = getTransitionProps('fade');
    return <transition {...transitionProps}>{backTopBtn}</transition>;
  },
};

/* istanbul ignore next */
BackTop.install = function(Vue) {
  Vue.use(Base);
  Vue.component(BackTop.name, BackTop);
};

export default BackTop;
