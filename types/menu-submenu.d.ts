import Vue, { VNode } from 'vue';
import { AntdVueComponent } from './component';
import { AMenuItem } from './menu-item';
/** ASubmenu Layout Component */
export declare class ASubmenu extends AntdVueComponent {
  children: Array<AMenuItem|ASubmenu>

  disabled: boolean

  key: string

  title: string | VNode

  titleClick(key: string, domEvent: Event): void
}
