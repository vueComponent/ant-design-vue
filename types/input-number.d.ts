import { AntdVueComponent, AntdVueComponentSize } from './component';

/** AInputNumber Layout Component */
export declare class AInputNumber extends AntdVueComponent {
  autoFocus: boolean

  defaultValue: number

  disabled: boolean

  formatter(value: number | string): string

  max: number

  min: number

  parser(string: string): number

  decimalSeparator: string

  precision: number

  size: AntdVueComponentSize

  step: number | string

  value: number

  change(value: number | string): void

  blur(): void

  focus(): void
}
