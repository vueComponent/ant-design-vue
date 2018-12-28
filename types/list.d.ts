import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** AList Layout Component */
export declare class AList extends AntdVueComponent {
  bordered: boolean

  footer: VNode | string

  grid: object

  header: VNode | string

  itemLayout: string

  loading: boolean | object

  loadMore: string | VNode

  pagination: boolean | object

  size: AntdVueComponentSize

  split: boolean

  renderItem: (item: any, index: number) => VNode

  rowKey: (item: any) => string | number
}

/** AList Layout Component */
export declare class AListGrid extends AntdVueComponent {
  column: number

  gutter: number

  xs: number

  sm: number

  md: number

  lg: number

  xl: number

  xxl: number
}

/** AListItem Layout Component */
export declare class AListItem extends AntdVueComponent {
  actions: Array<VNode>

  extra: string | VNode

  Meta: AListItemMeta
}

/** AListItemMeta Layout Component */
export declare class AListItemMeta extends AntdVueComponent {
  avatar: VNode

  description: string | VNode

  title: string | VNode
}
