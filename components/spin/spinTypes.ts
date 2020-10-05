import { VNodeChild } from 'vue';

export type VNodeElement = VNodeChild | JSX.Element;

export type SpinSize = 'small' | 'default' | 'large';

export interface SpinProps {
  prefixCls?: string;
  spinning?: boolean;
  size?: SpinSize;
  wrapperClassName?: string;
  tip?: string;
  delay?: number;
  indicator?: VNodeElement;
}
