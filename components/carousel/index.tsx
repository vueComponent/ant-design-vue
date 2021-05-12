import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import debounce from 'lodash-es/debounce';
import hasProp, { getComponent } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import SlickCarousel from '../vc-slick/src';
import { tuple, withInstall } from '../_util/type';

// Carousel
export const CarouselProps = {
  effect: PropTypes.oneOf(tuple('scrollx', 'fade')),
  dots: PropTypes.looseBool.def(true),
  vertical: PropTypes.looseBool,
  autoplay: PropTypes.looseBool,
  easing: PropTypes.string,
  beforeChange: PropTypes.func,
  afterChange: PropTypes.func,
  // style: PropTypes.React.CSSProperties,
  prefixCls: PropTypes.string,
  accessibility: PropTypes.looseBool,
  nextArrow: PropTypes.VNodeChild,
  prevArrow: PropTypes.VNodeChild,
  pauseOnHover: PropTypes.looseBool,
  // className: PropTypes.string,
  adaptiveHeight: PropTypes.looseBool,
  arrows: PropTypes.looseBool.def(false),
  autoplaySpeed: PropTypes.number,
  centerMode: PropTypes.looseBool,
  centerPadding: PropTypes.string,
  cssEase: PropTypes.string,
  dotsClass: PropTypes.string,
  draggable: PropTypes.looseBool.def(false),
  fade: PropTypes.looseBool,
  focusOnSelect: PropTypes.looseBool,
  infinite: PropTypes.looseBool,
  initialSlide: PropTypes.number,
  lazyLoad: PropTypes.looseBool,
  rtl: PropTypes.looseBool,
  slide: PropTypes.string,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  speed: PropTypes.number,
  swipe: PropTypes.looseBool,
  swipeToSlide: PropTypes.looseBool,
  touchMove: PropTypes.looseBool,
  touchThreshold: PropTypes.number,
  variableWidth: PropTypes.looseBool,
  useCSS: PropTypes.looseBool,
  slickGoTo: PropTypes.number,
  responsive: PropTypes.array,
  dotPosition: PropTypes.oneOf(tuple('top', 'bottom', 'left', 'right')),
  verticalSwiping: PropTypes.looseBool.def(false),
};

const Carousel = defineComponent({
  name: 'ACarousel',
  inheritAttrs: false,
  props: CarouselProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      slick: undefined,
      innerSlider: undefined,
    };
  },
  beforeMount() {
    this.onWindowResized = debounce(this.onWindowResized, 500, {
      leading: false,
    });
  },
  mounted() {
    if (hasProp(this, 'vertical')) {
      warning(
        !this.vertical,
        'Carousel',
        '`vertical` is deprecated, please use `dotPosition` instead.',
      );
    }
    const { autoplay } = this;
    if (autoplay) {
      window.addEventListener('resize', this.onWindowResized);
    }
    // https://github.com/ant-design/ant-design/issues/7191
    this.innerSlider = this.slick && this.slick.innerSlider;
  },
  beforeUnmount() {
    const { autoplay } = this;
    if (autoplay) {
      window.removeEventListener('resize', this.onWindowResized);
      (this.onWindowResized as any).cancel();
    }
  },
  methods: {
    getDotPosition() {
      if (this.dotPosition) {
        return this.dotPosition;
      }
      if (hasProp(this, 'vertical')) {
        return this.vertical ? 'right' : 'bottom';
      }
      return 'bottom';
    },
    saveSlick(node: HTMLElement) {
      this.slick = node;
    },
    onWindowResized() {
      // Fix https://github.com/ant-design/ant-design/issues/2550
      const { autoplay } = this;
      if (autoplay && this.slick && this.slick.innerSlider && this.slick.innerSlider.autoPlay) {
        this.slick.innerSlider.autoPlay();
      }
    },

    next() {
      this.slick.slickNext();
    },

    prev() {
      this.slick.slickPrev();
    },

    goTo(slide: number, dontAnimate = false) {
      this.slick.slickGoTo(slide, dontAnimate);
    },
  },

  render() {
    const props = { ...this.$props };
    const { $slots } = this;

    if (props.effect === 'fade') {
      props.fade = true;
    }
    const { class: cls, style, ...restAttrs } = this.$attrs as any;
    const getPrefixCls = this.configProvider.getPrefixCls;
    let className = getPrefixCls('carousel', props.prefixCls);
    const dotsClass = 'slick-dots';
    const dotPosition = this.getDotPosition();
    props.vertical = dotPosition === 'left' || dotPosition === 'right';
    props.dotsClass = classNames(`${dotsClass}`, `${dotsClass}-${dotPosition || 'bottom'}`, {
      [`${props.dotsClass}`]: !!props.dotsClass,
    });
    className = classNames({
      [cls]: !!cls,
      [className]: !!className,
      [`${className}-vertical`]: props.vertical,
    });
    const SlickCarouselProps = {
      ...props,
      ...restAttrs,
      nextArrow: getComponent(this, 'nextArrow'),
      prevArrow: getComponent(this, 'prevArrow'),
    };
    return (
      <div class={className} style={style}>
        <SlickCarousel
          ref={this.saveSlick}
          {...SlickCarouselProps}
          v-slots={$slots}
        ></SlickCarousel>
      </div>
    );
  },
});

export default withInstall(Carousel);
