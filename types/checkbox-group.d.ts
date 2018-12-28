import { AntdVueComponent } from './component';

/** ACheckboxGroup Layout Component */
export declare class ACheckboxGroup extends AntdVueComponent {
  defaultValue: string[]

  options: string[] | Array<{ label: string, value: string, disabled?: boolean, onChange?: Function }>

  value: string[]

  onChange(checkedValue: string[]): void
}
