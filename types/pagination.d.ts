import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** APagination Layout Component */
export declare class APagination extends AntdVueComponent {
  current: number

  defaultCurrent: number

  defaultPageSize: number

  hideOnSinglePage: boolean

  itemRender: (page: number, type: 'page' | 'prev' | 'next', originalElement: HTMLElement) => VNode

  pageSize: number

  pageSizeOptions: string[]

  showQuickJumper: boolean

  showSizeChanger: boolean

  showTotal (total: number, range: any): void

  simple: boolean

  size: 'default' | 'small'

  total: number

  change(page: number, pageSize: number): void

  showSizeChange(current: number, size: number): void
}
