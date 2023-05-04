import type { CSSProperties } from 'vue';
import type { Key, VueNode } from '../_util/type';

export type NotificationPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

export type IconType = 'success' | 'info' | 'error' | 'warning';

export interface ArgsProps {
  message: VueNode;
  description?: VueNode;
  btn?: VueNode;
  key?: Key;
  onClose?: () => void;
  duration?: number | null;
  icon?: VueNode;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  className?: string;
  readonly type?: IconType;
  onClick?: () => void;
  closeIcon?: VueNode;
}

type StaticFn = (args: ArgsProps) => void;

export interface NotificationInstance {
  success: StaticFn;
  error: StaticFn;
  info: StaticFn;
  warning: StaticFn;
  open: StaticFn;
  destroy(key?: Key): void;
}

export interface GlobalConfigProps {
  top?: number;
  bottom?: number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  closeIcon?: VueNode;
  rtl?: boolean;
  maxCount?: number;
}

export interface NotificationConfig {
  top?: number;
  bottom?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  maxCount?: number;
  rtl?: boolean;
}
