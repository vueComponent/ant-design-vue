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
  message: (() => VueNode) | VueNode;
  description?: (() => VueNode) | VueNode;
  btn?: (() => VueNode) | VueNode;
  key?: Key;
  onClose?: () => void;
  duration?: number | null;
  icon?: (() => VueNode) | VueNode;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  class?: string;
  readonly type?: IconType;
  onClick?: () => void;
  closeIcon?: (() => VueNode) | VueNode;
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
  top?: number | string;
  bottom?: number | string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  closeIcon?: (() => VueNode) | VueNode;
  rtl?: boolean;
  maxCount?: number;
}

export interface NotificationConfig {
  top?: number | string;
  bottom?: number | string;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  maxCount?: number;
  rtl?: boolean;
}
