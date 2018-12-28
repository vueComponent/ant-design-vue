import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ALayout Layout Component */
export declare class ALayout extends AntdVueComponent {
  class: string;
  
  style: object;

  hasSider: boolean;

  Sider: ASider
}

export declare class ASider extends AntdVueComponent {
  breakpoint: object;

  class: string;

  collapsed: boolean;

  collapsedWidth: number;

  collapsible: boolean;

  defaultCollapsed: boolean;

  reverseArrow: boolean;

  style: object | string;

  theme: 'light' | 'dark';

  trigger: string | VNode;

  width: number | string;

  collapse: (collapsed: boolean, type: string) => void;
}

