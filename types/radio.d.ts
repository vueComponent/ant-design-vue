import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ARadio Layout Component */
export declare class ARadio extends AntdVueComponent {
  autoFocus: boolean

  checked: boolean

  defaultChecked: boolean

  value: any

  blur(): void

  focus(): void
}

export declare class ARadioGroup extends AntdVueComponent {
  defaultValue: any

  disabled: boolean

  name: string

  options: string[] | Array<{ label: string, value: string, disabled?: boolean }>

  size: AntdVueComponentSize

  value: any

  buttonStyle: 'outline' | 'solid'

  change(e: Event): void
}


export declare class ARadioButton extends AntdVueComponent {
  value: string | number
}
