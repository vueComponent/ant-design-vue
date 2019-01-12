// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { AnchorLink } from './anchor-link';

export declare class Anchor extends AntdComponent {
  static Link: AnchorLink;

  /**
   * Fixed mode of Anchor
   * @default true
   * @type boolean
   */
  affix: boolean;

  /**
   * Bounding distance of anchor area
   * @default 5
   * @type number
   */
  bounds: number;

  /**
   * Scrolling container
   * @default () => window
   * @type Function
   */
  getContainer: () => HTMLElement;

  /**
   * Pixels to offset from bottom when calculating position of scroll
   * @type number
   */
  offsetBottom: number;

  /**
   * Pixels to offset from top when calculating position of scroll
   * @default 0
   * @type number
   */
  offsetTop: number;

  /**
   * Whether show ink-balls in Fixed mode
   * @default false
   * @type boolean
   */
  showInkInFixed: boolean;
}
