import { AntdVueComponent, AntdVueComponentSize } from './component';

type ButtonType = 'primary' | 'dashed' | 'danger';

type ButtonShape = 'circle' | 'default';

type HtmlType = 'button' | 'reset' | 'submit';

export declare class AButton extends AntdVueComponent {
  type: ButtonType

  shape: ButtonShape

  size: AntdVueComponentSize

  loading: boolean | { delay: number }

  disabled: boolean

  ghost: boolean

  htmlType: HtmlType

  icon: string

  block: boolean
}

export declare class AButtonGroup extends AntdVueComponent {

}
