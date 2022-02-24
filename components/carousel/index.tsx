import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import debounce from 'lodash-es/debounce';
import hasProp, { getComponent } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import SlickCarousel from '../vc-slick/src';
import { withInstall } from '../_util/type';

export type SwipeDirection = 'left' | 'down' | 'right' | 'up' | string;

export type LazyLoadTypes = 'ondemand' | 'progressive';

export type CarouselEffect = 'scrollx' | 'fade';
export type DotPosition = 'top' | 'bottom' | 'left' | 'right';

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
  autoPlay: (palyType?: 'update' | 'leave' | 'blur') => void;
  innerSlider: any;
}

// Carousel
export const carouselProps = () => ({
  effect: String as PropType<CarouselEffect>,
  dots: { type: Boolean, default: true },
  vertical: { type: Boolean, default: undefined },
  autoplay: { type: Boolean, default: undefined },
  easing: String,
  beforeChange: Function as PropType<(currentSlide: number, nextSlide: number) => void>,
  afterChange: Function as PropType<(currentSlide: number) => void>,
  // style: PropTypes.React.CSSProperties,
  prefixCls: String,
  accessibility: { type: Boolean, default: undefined },
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: { type: Boolean, default: undefined },
  // className: String,
  adaptiveHeight: { type: Boolean, default: undefined },
  arrows: { type: Boolean, default: false },
  autoplaySpeed: Number,
  centerMode: { type: Boolean, default: undefined },
  centerPadding: String,
  cssEase: String,
  dotsClass: String,
  draggable: { type: Boolean, default: false },
  fade: { type: Boolean, default: undefined },
  focusOnSelect: { type: Boolean, default: undefined },
  infinite: { type: Boolean, default: undefined },
  initialSlide: Number,
  lazyLoad: String as PropType<LazyLoadTypes>,
  rtl: { type: Boolean, default: undefined },
  slide: String,
  slidesToShow: Number,
  slidesToScroll: Number,
  speed: Number,
  swipe: { type: Boolean, default: undefined },
  swipeToSlide: { type: Boolean, default: undefined },
  touchMove: { type: Boolean, default: undefined },
  touchThreshold: Number,
  variableWidth: { type: Boolean, default: undefined },
  useCSS: { type: Boolean, default: undefined },
  slickGoTo: Number,
  responsive: Array,
  dotPosition: String as PropType<DotPosition>,
  verticalSwiping: { type: Boolean, default: false },
});
export type CarouselProps = Partial<ExtractPropTypes<ReturnType<typeof carouselProps>>>;
const Carousel = defineComponent({
  name: 'ACarousel',
  inheritAttrs: false,
  props: carouselProps(),
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
