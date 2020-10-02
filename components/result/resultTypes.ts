import { VNodeChild, HTMLAttributes } from 'vue';

export type VNodeElement = VNodeChild | JSX.Element;

export type StatusType = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

export interface ResultProps extends Omit<HTMLAttributes, 'title'> {
  prefixCls?: string;
  icon?: VNodeElement;
  status?: StatusType;
  title?: VNodeElement;
  subTitle?: VNodeElement;
  extra?: VNodeElement;
}
