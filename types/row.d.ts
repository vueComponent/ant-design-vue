import { AntdVueComponent } from './component';

/** Horizontal alignment of flex layout */
export type HorizontalAlignment = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

/** vertical alignment of flex layout */
export type VertialAlignment = 'top' | 'middle' | 'bottom';

/** Row Layout Component */
export declare class ARow extends AntdVueComponent {
  align: VertialAlignment

  gutter: number | object

  justify: HorizontalAlignment

  type: string
}
