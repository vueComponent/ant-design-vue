import { VNodeChild, HTMLAttributes } from 'vue';

export type VNodeElement = VNodeChild | JSX.Element;

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes {
  type?: AlertType;
  closable?: boolean;
  closeText?: VNodeElement;
  message?: VNodeElement;
  description?: VNodeElement;
  afterClose?: () => void;
  showIcon?: boolean;
  prefixCls?: string;
  banner?: boolean;
  onClose?: (e: MouseEvent) => void;
  icon?: VNodeElement;
}
