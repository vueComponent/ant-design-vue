import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import { getListeners } from '../_util/props-util';
import scrollTo from '../_util/scrollTo';

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
      const { target = getDefaultTarget } = this;
      scrollTo(0, {
        getContainer: target,
      });
      this.$emit('click', e);
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
    const { prefixCls: customizePrefixCls, $slots } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('back-top', customizePrefixCls);

    const defaultElement = (
      <div class={`${prefixCls}-content`}>
        <div class={`${prefixCls}-icon`} />
      </div>
    );
    const divProps = {
      on: {
        ...getListeners(this),
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
