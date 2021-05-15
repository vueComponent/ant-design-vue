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
  key: string;
  keyPath: string[];
  domEvent: MouseEvent | KeyboardEvent;
}

export interface MenuTitleInfo {
  key: string;
  domEvent: MouseEvent | KeyboardEvent;
}

// ========================== Hover ==========================
export type MenuHoverEventHandler = (info: { key: string; domEvent: MouseEvent }) => void;

// ======================== Selection ========================
export interface SelectInfo extends MenuInfo {
  selectedKeys: string[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

// ========================== Click ==========================
export type MenuClickEventHandler = (info: MenuInfo) => void;
