// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare type triggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

export declare class TooltipCommon extends AntdComponent {
  /**
   * Whether the arrow is pointed at the center of target
   * @default false
   * @type boolean
   */
  arrowPointAtCenter: boolean;

  /**
   * Whether to adjust popup placement automatically when popup is off screen
   * @default true
   * @type boolean
   */
  autoAdjustOverflow: boolean | object;

  /**
   * Whether the floating tooltip card is visible by default
   * @default false
   * @type boolean
   */
  defaultVisible: boolean;

  /**
   * The DOM container of the tip, the default behavior is to create a div element in body.
   * @default () => document.body
   * @type Function
   */
  getPopupContainer: (triggerNode: any) => any;

  /**
   * Delay in seconds, before tooltip is shown on mouse enter
   * @default 0
   * @type number
   */
  mouseEnterDelay: number;

  /**
   * Delay in seconds, before tooltip is hidden on mouse leave
   * @default 0.1
   * @type number
   */
  mouseLeaveDelay: number;

  /**
   * Class name of the tooltip card
   * @type string
   */
  overlayClassName: string;

  /**
   * Style of the tooltip card
   * @type undefined
   */
  overlayStyle: object;

  /**
   * The position of the tooltip relative to the target, which can be one of top
   * left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom
   * @default 'top'
   * @type string
   */
  placement:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';

  /**
   * Tooltip trigger mode
   * @default 'hover'
   * @type triggerType | triggerType[]
   */
  trigger: triggerType | triggerType[];

  /**
   * Whether the floating tooltip card is visible or not
   * @default false
   * @type boolean
   */
  visible: boolean;

  /**
   * this value will be merged into placement's config, please refer to the settings dom-align
   * @type object
   */
  align: object;
}
