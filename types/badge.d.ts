import { AntdVueComponent } from './component';

type Status = 'success' | 'processing' | 'default' | 'error' | 'warning';

/** ABadge Layout Component */
export declare class ABadge extends AntdVueComponent {
  count: number | string

  dot: boolean

  offset: [number|string, number|string]

  overflowCount: number

  showZero: boolean

  status: Status

  text: string

  numberStyle: object

  title: string
}
