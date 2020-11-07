import { defineComponent, inject, nextTick } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import backTopTypes from './backTopTypes';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import { getTransitionProps, Transition } from '../_util/transition';
import { defaultConfigProvider } from '../config-provider';
import scrollTo from '../_util/scrollTo';
import { withInstall } from '../_util/type';

function getDefaultTarget() {
  return window;
}

const props = backTopTypes();

const BackTop = defineComponent({
  name: 'ABackTop',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    ...props,
    visibilityHeight: PropTypes.number.def(400),
  },
  emits: ['click'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      visible: false,
      scrollEvent: null,
    };
  },
  mounted() {
    nextTick(() => {
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

    scrollToTop(e: Event) {
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
      <div {...divProps}>{$slots.default?.() || defaultElement}</div>
    ) : null;
    const transitionProps = getTransitionProps('fade');
    return <Transition {...transitionProps}>{backTopBtn}</Transition>;
  },
});

export default withInstall(BackTop);
