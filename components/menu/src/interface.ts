import type { CSSProperties } from 'vue';
import type { Key } from '../../_util/type';
import type { MenuItemProps } from './MenuItem';

// ========================= Options =========================
interface ItemSharedProps {
  style?: CSSProperties;
  class?: string;
}

export interface SubMenuType extends ItemSharedProps {
  label?: any;

  children: ItemType[];

  disabled?: boolean;

  key: Key;
  theme?: MenuTheme;
  rootClassName?: string;

  // >>>>> Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseenter?: MenuHoverEventHandler;
  onMouseleave?: MenuHoverEventHandler;

  // >>>>> Popup
  popupClassName?: string;
  popupOffset?: number[];

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseenter?: MenuHoverEventHandler;
  onTitleMouseleave?: MenuHoverEventHandler;
}

export interface MenuItemType extends ItemSharedProps {
  label?: any;

  disabled?: boolean;

  itemIcon?: RenderIconType;

  key: Key;

  // >>>>> Active
  onMouseenter?: MenuHoverEventHandler;
  onMouseleave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
}

export interface MenuItemGroupType extends ItemSharedProps {
  type: 'group';

  label?: any;

  children?: ItemType[];
}

export interface MenuDividerType extends ItemSharedProps {
  type: 'divider';
}

export type ItemType = SubMenuType | MenuItemType | MenuItemGroupType | MenuDividerType | null;

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
  eventKeyPath: string[];
  domEvent: MouseEvent | KeyboardEvent;
  item: MenuItemProps & { [key: string]: any };
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
