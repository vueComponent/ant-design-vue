import { VNode } from 'vue';
import { AntdVueComponent } from './component';


interface Data {key: string, title: string, description?: string, disabled?: boolean}
/** ATransfer Layout Component */
export declare class ATransfer extends AntdVueComponent {
  dataSource: Data[]

  disabled: boolean

  filterOption(inputValue: any, option: any): boolean

  footer: VNode

  lazy: object | boolean

  listStyle: object

  notFoundContent: string | VNode

  operations: string[]

  render(record: any): any

  searchPlaceholder: string

  selectedKeys: string[]

  showSearch: boolean

  targetKeys: string[]

  titles: string[]

  change(targetKeys: string, direction: string, moveKeys: string[]): void

  scroll(direction: string, event: Event): void

  searchChange(direction: 'left'|'right', event: Event): void

  selectChange(sourceSelectedKeys: string[], targetSelectedKeys: string[]): void
}
