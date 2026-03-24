import type { VNode } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'

export interface PaginationProps {
  /** Total number of items */
  total?: number
  /** Current page (v-model:current) */
  current?: number
  /** Default current page */
  defaultCurrent?: number
  /** Number of items per page (v-model:pageSize) */
  pageSize?: number
  /** Default page size */
  defaultPageSize?: number
  /** Whether pagination is disabled */
  disabled?: boolean
  /** Hide when only one page */
  hideOnSinglePage?: boolean
  /** Show page size changer */
  showSizeChanger?: boolean
  /** Page size options */
  pageSizeOptions?: number[]
  /** Show quick jumper input */
  showQuickJumper?: boolean
  /** Show total info */
  showTotal?: (total: number, range: [number, number]) => string
  /** Simple mode */
  simple?: boolean
  /** Size variant */
  size?: 'default' | 'small'
}

export const paginationDefaultProps = {
  total: 0,
  defaultCurrent: 1,
  defaultPageSize: 10,
  disabled: false,
  hideOnSinglePage: false,
  showSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showQuickJumper: false,
  simple: false,
  size: 'default' as const,
}

export interface PaginationEmits {
  (e: 'update:current', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number, pageSize: number): void
  (e: 'showSizeChange', current: number, size: number): void
}

export interface PaginationSlots {
  /** Custom item renderer */
  itemRender?: ScopedSlot<{
    page: number
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'
    originalElement: VNode
  }>
}
