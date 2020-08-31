// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';
import { TimelineItem } from './timeline-item';

export declare class Timeline extends AntdComponent {
  static Item: typeof TimelineItem;

  $props: AntdProps & {
    /**
     * Set the last ghost node's existence or its content
     * @default false
     * @type any (boolean | string | slot)
     */
    pending?: boolean | VNodeChild | JSX.Element;

    /**
     * Set the dot of the last ghost node when pending is true
     * @default <LoadingOutlined />
     * @type any (string | slot)
     */
    pendingDot?: VNodeChild | JSX.Element;

    /**
     * reverse nodes or not
     * @default false
     * @type boolean
     */
    reverse?: boolean;

    /**
     * By sending alternate the timeline will distribute the nodes to the left and right.
     * @default 'left'
     * @type string
     */
    mode?: 'left' | 'alternate' | 'right';
  };
}
