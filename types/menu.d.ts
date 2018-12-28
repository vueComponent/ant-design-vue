import { AntdVueComponent } from './component';

type MenuMode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline';

type Theme = 'light' | 'dark';

interface clickOption{ item: any, key: string, keyPath: string }

interface deselectOption{ item: any, key: string, selectedKeys: string }

/** AMenu Layout Component */
export declare class AMenu extends AntdVueComponent {
  defaultOpenKeys: string[]

  defaultSelectedKeys: string[]

  forceSubMenuRender: boolean

  inlineCollapsed: boolean

  inlineIndent: number

  mode: MenuMode

  multiple: boolean

  openKeys: string[]

  selectable: boolean

  selectedKeys: string[]

  subMenuCloseDelay: number

  subMenuOpenDelay: number

  theme: Theme

  click(Options: clickOption): void

  deselect(Options: deselectOption): void

  openChange(openKeys: string[]): void

  select(Options: deselectOption): void
}
/** AMenuDivider Layout Component */
export declare class AMenuDivider extends AntdVueComponent {

}

