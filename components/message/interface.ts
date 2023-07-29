import type { CSSProperties } from 'vue';
import type { Key, VueNode } from '../_util/type';

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ConfigOptions {
  top?: number | string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
}

export interface ArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration?: number;
  type?: NoticeType;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: CSSProperties;
  class?: string;
  onClick?: (e: Event) => void;
}

export type JointContent = VueNode | ArgsProps;

export interface MessageType extends PromiseLike<boolean> {
  (): void;
}

export type TypeOpen = (
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction,
) => MessageType;

export interface MessageInstance {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
  open(args: ArgsProps): MessageType;
  destroy(key?: Key): void;
}
