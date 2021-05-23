import { Key } from '../../_util/type';

export type MenuTheme = 'light' | 'dark';

// ========================== Basic ==========================
export type MenuMode = 'horizontal' | 'vertical' | 'inline';

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';

export interface RenderIconInfo {
  isSelected?: boolean;
  isOpen?: boolean;
  isSubMenu?: boolean;
  disabled?: boolean;
}

export type RenderIconType = (props: RenderIconInfo) => any;

export interface MenuInfo {
  key: Key;
  eventKey: string;
  keyPath?: Key[];
  eventKeyPath: Key[];
  domEvent: MouseEvent | KeyboardEvent;
}

export interface MenuTitleInfo {
  key: Key;
  domEvent: MouseEvent | KeyboardEvent;
}

// ========================== Hover ==========================
export type MenuHoverEventHandler = (info: { key: Key; domEvent: MouseEvent }) => void;

// ======================== Selection ========================
export interface SelectInfo extends MenuInfo {
  selectedKeys: Key[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

// ========================== Click ==========================
export type MenuClickEventHandler = (info: MenuInfo) => void;
