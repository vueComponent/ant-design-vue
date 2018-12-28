import { VNode } from 'vue';

import { AntdVueComponent } from './component';

type Status = 'wait' | 'process' | 'finish' | 'error';
/** ASteps Layout Component */
export declare class AStep extends AntdVueComponent {
  description: string | VNode

  icon: string | VNode

  status: Status

  title: string | VNode
}
