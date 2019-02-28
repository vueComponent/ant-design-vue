// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { VNode } from 'vue';

export declare class Slider extends AntdComponent {
  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * The default value of slider. When range is false, use number, otherwise, use [number, number]
   * @default 0 | [0, 0]
   * @type number | number[]
   */
  defaultValue: number | number[];

  /**
   * If true, the slider will not be interactable.
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Whether the thumb can drag over tick only.
   * @default false
   * @type boolean
   */
  dots: boolean;

  /**
   * Make effect when marks not null，true means containment and false means coordinative
   * @default true
   * @type boolean
   */
  included: boolean;

  /**
   * Tick mark of Slider, type of key must be number, and must in closed interval [min, max] ，each mark can declare its own style.
   * @default { number: string|VNode } | { number: { style: object, label: string|VNode } } | { number: () => VNode }
   * @type object
   */
  marks: {
    [key: number]: string | VNode | { style: object; label: string | VNode } | Function;
  };

  /**
   * The maximum value the slider can slide to
   * @default 100
   * @type number
   */
  max: number;

  /**
   * The minimum value the slider can slide to.
   * @default 0
   * @type number
   */
  min: number;

  /**
   * dual thumb mode
   * @default false
   * @type boolean
   */
  range: boolean;

  /**
   * The granularity the slider can step through values.
   * Must greater than 0, and be divided by (max - min) . When marks no null, step can be null.
   * @default 1
   * @type number | null
   */
  step: number | null;

  /**
   * Slider will pass its value to tipFormatter, and display its value in Tooltip, and hide Tooltip when return value is null.
   * @default IDENTITY
   * @type Function | null
   */
  tipFormatter: Function | null;

  /**
   * The value of slider. When range is false, use number, otherwise, use [number, number]
   * @type number | number[]
   */
  value: number | number[];

  /**
   * If true, the slider will be vertical.
   * @default false
   * @type boolean
   */
  vertical: boolean;

  /**
   * If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering.
   * @default false
   * @type boolean
   */
  tooltipVisible: boolean;

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}
