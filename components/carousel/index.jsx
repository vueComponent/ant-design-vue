import PropTypes from '../_util/vue-types';
import debounce from 'lodash/debounce';
import {
  initDefaultProps,
  getComponentFromProp,
  filterEmpty,
  getListeners,
} from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = mediaQuery => {
    return {
      media: mediaQuery,
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
}
// Use require over import (will be lifted up)
// make sure matchMedia polyfill run before require('vc-slick')
// Fix https://github.com/ant-design/ant-design/issues/6560
// Fix https://github.com/ant-design/ant-design/issues/3308
const SlickCarousel = require('../vc-slick/src').default;

export const CarouselEffect = PropTypes.oneOf(['scrollx', 'fade']);
// Carousel
export const CarouselProps = {
  effect: CarouselEffect,
  dots: PropTypes.bool,
  vertical: PropTypes.bool,
  autoplay: PropTypes.bool,
  easing: PropTypes.string,
  beforeChange: PropTypes.func,
  afterChange: PropTypes.func,
  // style: PropTypes.React.CSSProperties,
  prefixCls: PropTypes.string,
  accessibility: PropTypes.bool,
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: PropTypes.bool,
  // className: PropTypes.string,
  adaptiveHeight: PropTypes.bool,
  arrows: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  centerMode: PropTypes.bool,
  centerPadding: PropTypes.string,
  cssEase: PropTypes.string,
  dotsClass: PropTypes.string,
  draggable: PropTypes.bool,
  fade: PropTypes.bool,
  focusOnSelect: PropTypes.bool,
  infinite: PropTypes.bool,
  initialSlide: PropTypes.number,
  lazyLoad: PropTypes.bool,
  rtl: PropTypes.bool,
  slide: PropTypes.string,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  speed: PropTypes.number,
  swipe: PropTypes.bool,
  swipeToSlide: PropTypes.bool,
  touchMove: PropTypes.bool,
  touchThreshold: PropTypes.number,
  variableWidth: PropTypes.bool,
  useCSS: PropTypes.bool,
  slickGoTo: PropTypes.number,
  responsive: PropTypes.array,
};

const Carousel = {
  name: 'ACarousel',
  props: initDefaultProps(CarouselProps, {
    dots: true,
    arrows: false,
    draggable: false,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },

  beforeMount() {
    this.onWindowResized = debounce(this.onWindowResized, 500, {
      leading: false,
    });
  },

  mounted() {
    const { autoplay } = this;
    if (autoplay) {
      window.addEventListener('resize', this.onWindowResized);
    }
    // https://github.com/ant-design/ant-design/issues/7191
    this.innerSlider = this.$refs.slick && this.$refs.slick.innerSlider;
  },

  beforeDestroy() {
    const { autoplay } = this;
    if (autoplay) {
      window.removeEventListener('resize', this.onWindowResized);
      this.onWindowResized.cancel();
    }
  },
  methods: {
    onWindowResized() {
      // Fix https://github.com/ant-design/ant-design/issues/2550
      const { autoplay } = this;
      if (
        autoplay &&
        this.$refs.slick &&
        this.$refs.slick.innerSlider &&
        this.$refs.slick.innerSlider.autoPlay
      ) {
        this.$refs.slick.innerSlider.autoPlay();
      }
    },

    next() {
      this.$refs.slick.slickNext();
    },

    prev() {
      this.$refs.slick.slickPrev();
    },

    goTo(slide, dontAnimate = false) {
      this.$refs.slick.slickGoTo(slide, dontAnimate);
    },
  },

  render() {
    const props = {
      ...this.$props,
    };
    const { $slots } = this;

    if (props.effect === 'fade') {
      props.fade = true;
    }

    const getPrefixCls = this.configProvider.getPrefixCls;
    let className = getPrefixCls('carousel', props.prefixCls);

    if (props.vertical) {
      className = `${className} ${className}-vertical`;
    }
    const SlickCarouselProps = {
      props: {
        ...props,
        nextArrow: getComponentFromProp(this, 'nextArrow'),
        prevArrow: getComponentFromProp(this, 'prevArrow'),
      },
      on: getListeners(this),
      scopedSlots: this.$scopedSlots,
    };

    return (
      <div class={className}>
        <SlickCarousel ref="slick" {...SlickCarouselProps}>
          {filterEmpty($slots.default)}
        </SlickCarousel>
      </div>
    );
  },
};

/* istanbul ignore next */
Carousel.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Carousel.name, Carousel);
};

export default Carousel;
