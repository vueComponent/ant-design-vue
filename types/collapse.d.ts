import { AntdVueComponent } from './component';
import { VNode } from 'vue';

/** ACollapse Layout Component */
export declare class ACollapse extends AntdVueComponent {
  activeKey: string[] | string

  defaultActiveKey: string

  change: (key: string) => void
}

/** ACollapsePanel Layout Component */
export declare class ACollapsePanel extends AntdVueComponent {
  disabled: boolean

  forceRender: boolean

  header: string | VNode

  key: string
}
