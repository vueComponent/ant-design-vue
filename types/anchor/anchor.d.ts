// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { CSSProperties } from 'vue';
import { AnchorLink } from './anchor-link';
import { AntdComponent, AntdProps } from '../component';

export declare class Anchor extends AntdComponent {
  static Link: typeof AnchorLink;

  $props: AntdProps & {
    /**
     * Fixed mode of Anchor
     * @default true
     * @type boolean
     */
    affix?: boolean;

    /**
     * Bounding distance of anchor area
     * @default 5
     * @type number
     */
    bounds?: number;

    /**
     * Scrolling container
     * @default () => window
     * @type Function
     */
    getContainer?: () => HTMLElement;

    /**
     * Pixels to offset from bottom when calculating position of scroll
     * @type number
     */
    offsetBottom?: number;

    /**
     * Pixels to offset from top when calculating position of scroll
     * @default 0
     * @type number
     */
    offsetTop?: number;

    /**
     * Whether show ink-balls in Fixed mode
     * @default false
     * @type boolean
     */
    showInkInFixed?: boolean;

    /**
     * The class name of the container
     * @type string
     */
    wrapperClass?: string;

    /**
     * The style of the container
     * @type object
     */
    wrapperStyle?: CSSProperties | string;

    /**
     * Customize the anchor highlight
     * @version 1.5.0
     * @type function
     * @return string
     */
    getCurrentAnchor?: () => string;

    /**
     * Anchor scroll offset, default as `offsetTop`
     * e.g. https://antdv.com/components/anchor/#components-anchor-demo-targetOffset
     * @version 1.5.0
     * @type number
     */
    targetOffset?: number;

    /**
     * 	set the handler to handle click event
     * @param e
     * @param link
     */
    onClick?: (e?: Event, link?: { [key: string]: any }) => void;

    /**
     * Listening for anchor link change
     * @param currentActiveLink
     */
    onChange?: (currentActiveLink?: string) => void;
  };
}
