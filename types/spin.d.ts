import { VNode, CreateElement } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ASpin Layout Component */
export declare class ASpin extends AntdVueComponent {
  delay: number

  indicator: VNode

  size: AntdVueComponentSize

  spinning: boolean

  tip: string

  wrapperClassName: string

  static setDefaultIndicator: ({ indicator: (h: CreateElement) => VNode })
}
