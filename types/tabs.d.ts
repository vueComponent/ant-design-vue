import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';


type position = 'top' | 'right' | 'bottom' | 'left';

type Type = 'line' | 'card' | 'editable-card';
/** ATabs Layout Component */
export declare class ATabs extends AntdVueComponent {
  activeKey: string

  animated: boolean | {inkBar:boolean, tabPane:boolean}

  defaultActiveKey: string

  hideAdd: boolean

  size: AntdVueComponentSize

  tabBarExtraContent: VNode

  tabBarStyle: object

  tabPosition: position

  type: Type

  tabBarGutter: number

  static change: (activeKey: string) => void

  static edit: (targetKey: string, action: string) => void

  static nextClick: Function

  static prevClick: Function

  static tabClick: Function
}

/** ATabPane Layout Component */
export declare class ATabPane extends AntdVueComponent {
  forceRender: boolean

  key: string

  tab: string | VNode
}
