import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

interface DisplayRender { labels: string, selectedOptions: any }

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
/** ACascader Layout Component */
export declare class ACascader extends AntdVueComponent {
  allowClear: boolean

  autoFocus: boolean

  changeOnSelect: boolean

  defaultValue: string[]

  disabled: boolean

  displayRender: (Options: DisplayRender) => VNode

  expandTrigger: 'click' | 'hover'

  fieldNames: { label: string, value: string, children: string }

  getPopupContainer(triggerNode: VNode): HTMLElement

  loadData(selectedOptions: any): void

  notFoundContent: string

  options: object

  placeholder: string

  popupClassName: string

  popupStyle: object

  popupPlacement: Placement

  popupVisible: boolean

  showSearch: boolean | { 
    filter: (inputValue: any, path: string) => boolean, 
    matchInputWidth: boolean, 
    render: ({inputValue, path}) => VNode,
    sort: (a: any, b: any, inputValue: string) => void
  }

  size: AntdVueComponentSize

  suffixIcon: string | VNode

  value: string[]

  blur(): void

  focus(): void
}
