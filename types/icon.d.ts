import { AntdVueComponent } from './component';
import { VNode, Component } from 'vue';

export declare class AIcon extends AntdVueComponent {
  type: string;

  style: any;

  theme: 'filled' | 'outlined' | 'twoTone';

  spin: boolean;

  component: VNode;

  twoToneColor: string;

  static setTwoToneColor: (color: string) => void;

  static getTwoToneColor: () => string;

  createFromIconfontCN: ({ scriptUrl: string, extraCommonProps: object }) => Component;

}