import { VNode } from 'vue';
import { AntdVueComponent } from './component';

type DataSourceItemType = { value: any, text: string };

/** AAutoComplete Layout Component */
export declare class AAutoComplete extends AntdVueComponent {
  allowClear: boolean

  autoFocus: boolean

  backfill: boolean

  dataSource: VNode | DataSourceItemType[]

  defaultActiveFirstOption: boolean

  defaultValue: string | string[] |
  { key: string, label: string|VNode[] } | Array<{ key: string, label: string|VNode[]}>

  disabled: boolean

  filterOption: (inputValue: string, option: any) => boolean | boolean

  optionLabelProp: string

  placeholder: string | VNode

  value: string | string[] |
  { key: string, label: string|VNode[] } | Array<{ key: string, label: string|VNode[]}>

  defaultOpen: boolean

  open: boolean

  static blur: () => void

  static focus: () => void
}
