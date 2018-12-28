import { AntdVueComponent } from './component';

type Layout = 'horizontal' | 'vertical' | 'inline';

export interface CreateOptions {
  props?: object

  mapPropsToFields?: (props: object) => ({ fieldName: object })

  validateMessages?: Object

  onFieldsChange?: (props: object, fields: object) => void

  onValuesChange?: (props: object, values: string) => void
}

/** AForm Layout Component */
export declare class AForm extends AntdVueComponent {
  form: object

  hideRequiredMark: Boolean

  layout: Layout

  autoFormCreate: (form: object) => void

  options: object

  submit(e: Event): void

  static create(options?: CreateOptions): any
}

declare module 'vue/types/vue' {
  interface Vue {
    Form: any,
    form: any
  }
}
