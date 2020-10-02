import { HTMLAttributes } from 'vue';

export type Fn<T = any> = (...arg: any[]) => T;
export type TargetFn = () => HTMLElement | Window | Document;
export interface BackTopState {
  scrollEvent: {
    remove: () => void;
  } | null;
  visible: boolean;
}

export interface BackTopProps extends HTMLAttributes {
  prefixCls?: string;
  visibilityHeight: number;
  target?: TargetFn;
  String?: string;
  onClick?: Fn;
}
