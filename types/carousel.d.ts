// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

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
