import type * as Vue from 'vue';
import type { VNode } from 'vue';
import type { Key, RawValueType } from './generator';

export type RenderDOMFunc = (props: any) => HTMLElement;

export type RenderNode = Vue.VNodeChild | ((props: any) => Vue.VNodeChild);

export type Mode = 'multiple' | 'tags' | 'combobox';

// ======================== Option ========================
export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export interface OptionCoreData {
  key?: Key;
  disabled?: boolean;
  value?: Key;
  title?: string;
  class?: string;
  style?: Vue.CSSProperties;
  label?: Vue.VNodeChild;
  /** @deprecated Only works when use `children` as option data */
  children?: VNode[] | JSX.Element[];
}

export interface OptionData extends OptionCoreData {
  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionGroupData {
  key?: Key;
  label?: Vue.VNodeChild;
  options: OptionData[];
  class?: string;
  style?: Vue.CSSProperties;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type OptionsType = (OptionData | OptionGroupData)[];

export interface FlattenOptionData {
  group?: boolean;
  groupOption?: boolean;
  key: string | number;
  data: OptionData | OptionGroupData;
}
