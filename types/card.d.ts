import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** ACard Layout Component */
export declare class ACard extends AntdVueComponent {
  actions: VNode

  headStyle: object

  bodyStyle: object

  bordered: boolean

  cover: VNode

  extra: string | VNode

  hoverable: boolean

  loading: boolean

  tabList: Array<{key: string, tab: any, scopedSlots: {tab: 'XXX'}}>

  activeTabKey: string

  defaultActiveTabKey: string

  title: string | VNode

  type: string

  onTabChange: (key: string) => void

  tabChange(key: string): void
}

/** ACardMeta Layout Component */
export declare class ACardMeta extends AntdVueComponent {
  avatar: VNode

  description: string | VNode

  title: string | VNode
}

/** ACardGrid Layout Component */
export declare class ACardGrid extends AntdVueComponent {

}
