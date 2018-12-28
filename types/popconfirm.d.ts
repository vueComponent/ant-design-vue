import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** APopconfirm Layout Component */
export declare class APopconfirm extends AntdVueComponent {
  cancelText: string | VNode

  okText: string | VNode

  okType: string

  title: string | VNode
  
  icon: VNode

  cancel: (e: Event) => void

  confirm: (e: Event) => void

  visibleChange: (visible: boolean) => void
}
