// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export interface Settings {
  accessibility?: boolean;
  adaptiveHeight?: boolean;
  arrows?: boolean;
  autoplaySpeed?: number;
  autoplay?: boolean;
  centerMode?: boolean;
  centerPadding?: string;
  className?: string;
  cssEase?: string;
  dotsClass?: string;
  dots?: boolean;
  draggable?: boolean;
  easing?: string;
  edgeFriction?: number;
  fade?: boolean;
  focusOnSelect?: boolean;
  infinite?: boolean;
  initialSlide?: number;
  pauseOnDotsHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnHover?: boolean;
  responsive?: ResponsiveObject[];
  rows?: number;
  rtl?: boolean;
  slide?: string;
  slidesPerRow?: number;
  slidesToScroll?: number;
  slidesToShow?: number;
  speed?: number;
  swipeToSlide?: boolean;
  swipe?: boolean;
  touchMove?: boolean;
  touchThreshold?: number;
  useCSS?: boolean;
  useTransform?: boolean;
  variableWidth?: boolean;
  vertical?: boolean;
  verticalSwiping?: boolean;
  waitForAnimate?: boolean;
}
export interface ResponsiveObject {
  breakpoint: number;
  settings: 'unslick' | Settings;
}
export declare class Carousel extends AntdComponent {
  /**
   * Callback function called after the current index changes
   * @type Function
   */
  afterChange: (current: number) => any;

  /**
   * Whether to scroll automatically
   * @default false
   * @type boolean
   */
  autoplay: boolean;

  /**
   * Callback function called before the current index changes
   * @type Function
   */
  beforeChange: (from: number, to: number) => any;

  /**
   * Whether to show the dots at the bottom of the gallery
   * @default true
   * @type boolean
   */
  dots: boolean;

  /**
   * Transition interpolation function name
   * @default 'linear'
   * @type string
   */
  easing: string;

  /**
   * Transition effect
   * @default 'scrollx'
   * @type string
   */
  effect: 'scrollx' | 'fade';

  /**
   * Whether to use a vertical display
   * @default false
   * @type boolean
   */
  vertical: boolean;

  responsive: ResponsiveObject[];

  /**
   * Go to slide index, if dontAnimate=true, it happens without animation
   * @param slideNumber slide number to go
   * @param dontAnimate animate or not
   */
  goTo(slideNumber: number, dontAnimate: boolean): void;

  /**
   * Next
   * @description Change current slide to next slide
   */
  next(): void;

  /**
   * Previous
   * @description Change current slide to previous slide
   */
  prev(): void;
}
