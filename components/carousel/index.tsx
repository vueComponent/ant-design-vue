import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { ref, computed, watchEffect, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import SlickCarousel from '../vc-slick';
import { withInstall } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';

export type SwipeDirection = 'left' | 'down' | 'right' | 'up' | string;

export type LazyLoadTypes = 'ondemand' | 'progressive';

export type CarouselEffect = 'scrollx' | 'fade';
export type DotPosition = 'top' | 'bottom' | 'left' | 'right';

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
  autoplay: (palyType?: 'update' | 'leave' | 'blur') => void;
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
  swipeEvent: Function as PropType<(swipeDirection: SwipeDirection) => void>,
  touchMove: { type: Boolean, default: undefined },
  touchThreshold: Number,
  variableWidth: { type: Boolean, default: undefined },
  useCSS: { type: Boolean, default: undefined },
  slickGoTo: Number,
  responsive: Array,
  dotPosition: { type: String as PropType<DotPosition>, default: undefined },
  verticalSwiping: { type: Boolean, default: false },
});
export type CarouselProps = Partial<ExtractPropTypes<ReturnType<typeof carouselProps>>>;
const Carousel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACarousel',
  inheritAttrs: false,
  props: carouselProps(),
  setup(props, { slots, attrs, expose }) {
    const slickRef = ref();

    const goTo = (slide: number, dontAnimate = false) => {
      slickRef.value?.slickGoTo(slide, dontAnimate);
    };

    expose({
      goTo,
      autoplay: palyType => {
        slickRef.value?.innerSlider?.handleAutoPlay(palyType);
      },
      prev: () => {
        slickRef.value?.slickPrev();
      },
      next: () => {
        slickRef.value?.slickNext();
      },
      innerSlider: computed(() => {
        return slickRef.value?.innerSlider;
      }),
    } as CarouselRef);
    watchEffect(() => {
      warning(
        props.vertical === undefined,
        'Carousel',
        '`vertical` is deprecated, please use `dotPosition` instead.',
      );
    });
    const { prefixCls, direction } = useConfigInject('carousel', props);
    const dotPosition = computed(() => {
      if (props.dotPosition) return props.dotPosition;
      if (props.vertical !== undefined) return props.vertical ? 'right' : 'bottom';
      return 'bottom';
    });
    const vertical = computed(() => dotPosition.value === 'left' || dotPosition.value === 'right');
    const dsClass = computed(() => {
      const dotsClass = 'slick-dots';
      return classNames({
        [dotsClass]: true,
        [`${dotsClass}-${dotPosition.value}`]: true,
        [`${props.dotsClass}`]: !!props.dotsClass,
      });
    });
    return () => {
      const { dots, arrows, draggable, effect } = props;
      const { class: cls, style, ...restAttrs } = attrs;
      const fade = effect === 'fade' ? true : props.fade;
      const className = classNames(prefixCls.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-vertical`]: vertical.value,
        [`${cls}`]: !!cls,
      });
      return (
        <div class={className} style={style as CSSProperties}>
          <SlickCarousel
            ref={slickRef}
            {...props}
            {...restAttrs}
            dots={!!dots}
            dotsClass={dsClass.value}
            arrows={arrows}
            draggable={draggable}
            fade={fade}
            vertical={vertical.value}
            v-slots={slots}
          />
        </div>
      );
    };
  },
});

export default withInstall(Carousel);
