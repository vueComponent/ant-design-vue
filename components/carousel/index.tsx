import type { CSSProperties, ExtractPropTypes } from 'vue';
import { ref, computed, watchEffect, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import SlickCarousel from '../vc-slick';
import { withInstall, booleanType, functionType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';

// CSSINJS
import useStyle from './style';

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
  effect: stringType<CarouselEffect>(),
  dots: booleanType(true),
  vertical: booleanType(),
  autoplay: booleanType(),
  easing: String,
  beforeChange: functionType<(currentSlide: number, nextSlide: number) => void>(),
  afterChange: functionType<(currentSlide: number) => void>(),
  // style: PropTypes.React.CSSProperties,
  prefixCls: String,
  accessibility: booleanType(),
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: booleanType(),
  // className: String,
  adaptiveHeight: booleanType(),
  arrows: booleanType(false),
  autoplaySpeed: Number,
  centerMode: booleanType(),
  centerPadding: String,
  cssEase: String,
  dotsClass: String,
  draggable: booleanType(false),
  fade: booleanType(),
  focusOnSelect: booleanType(),
  infinite: booleanType(),
  initialSlide: Number,
  lazyLoad: stringType<LazyLoadTypes>(),
  rtl: booleanType(),
  slide: String,
  slidesToShow: Number,
  slidesToScroll: Number,
  speed: Number,
  swipe: booleanType(),
  swipeToSlide: booleanType(),
  swipeEvent: functionType<(swipeDirection: SwipeDirection) => void>(),
  touchMove: booleanType(),
  touchThreshold: Number,
  variableWidth: booleanType(),
  useCSS: booleanType(),
  slickGoTo: Number,
  responsive: Array,
  dotPosition: stringType<DotPosition>(),
  verticalSwiping: booleanType(false),
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

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

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
      const className = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-vertical`]: vertical.value,
          [`${cls}`]: !!cls,
        },
        hashId.value,
      );
      return wrapSSR(
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
        </div>,
      );
    };
  },
});

export default withInstall(Carousel);
