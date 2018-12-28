import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** ATimeline Layout Component */
export declare class ATimeline extends AntdVueComponent {
  pending: boolean | string | VNode

  pendingDot: string | VNode

  reverse: boolean

  mode: 'left' | 'alternate' | 'right'
}

/** ATimelineItem Layout Component */
export declare class ATimelineItem extends AntdVueComponent {
  color: string

  dot: string | VNode
}
