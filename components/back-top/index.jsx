import { inject, Transition } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import backTopTypes from './backTopTypes';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider';
import scrollTo from '../_util/scrollTo';

function getDefaultTarget() {
  return window;
}

const props = backTopTypes();

const BackTop = {
  name: 'ABackTop',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: {
    ...props,
    visibilityHeight: PropTypes.number.def(400),
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
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

  beforeUnmount() {
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
    const classString = classNames(prefixCls, this.$attrs.class);
    const defaultElement = (
      <div class={`${prefixCls}-content`}>
        <div class={`${prefixCls}-icon`} />
      </div>
    );
    const divProps = {
      ...this.$attrs,
      onClick: this.scrollToTop,
      class: classString,
    };

    const backTopBtn = this.visible ? (
      <div {...divProps}>{($slots.default && $slots.default()) || defaultElement}</div>
    ) : null;
    const transitionProps = getTransitionProps('fade');
    return <Transition {...transitionProps}>{backTopBtn}</Transition>;
  },
};

/* istanbul ignore next */
BackTop.install = function(app) {
  app.component(BackTop.name, BackTop);
};

export default BackTop;
