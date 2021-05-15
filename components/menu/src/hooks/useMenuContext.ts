import { Key } from '../../../_util/type';
import { ComputedRef, inject, InjectionKey, provide, Ref } from 'vue';

// import {
//   BuiltinPlacements,
//   MenuClickEventHandler,
//   MenuMode,
//   RenderIconType,
//   TriggerSubMenuAction,
// } from '../interface';

export interface MenuContextProps {
  prefixCls: ComputedRef<string>;
  openKeys: Ref<Key[]>;
  selectedKeys: Ref<Key[]>;
  // rtl?: boolean;

  // // Mode
  // mode: MenuMode;

  // // Disabled
  disabled?: ComputedRef<boolean>;
  // // Used for overflow only. Prevent hidden node trigger open
  // overflowDisabled?: boolean;

  // // Active
  activeKeys: Ref<Key[]>;
  changeActiveKeys: (keys: Key[]) => void;
  // onActive: (key: string) => void;
  // onInactive: (key: string) => void;

  // // Selection
  // selectedKeys: string[];

  // // Level
  // inlineIndent: number;

  // // Motion
  // // motion?: CSSMotionProps;
  // // defaultMotions?: Partial<{ [key in MenuMode | 'other']: CSSMotionProps }>;

  // // Popup
  // subMenuOpenDelay: number;
  // subMenuCloseDelay: number;
  // forceSubMenuRender?: boolean;
  // builtinPlacements?: BuiltinPlacements;
  // triggerSubMenuAction?: TriggerSubMenuAction;

  // // Icon
  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;

  // // Function
  // onItemClick: MenuClickEventHandler;
  // onOpenChange: (key: string, open: boolean) => void;
  // getPopupContainer: (node: HTMLElement) => HTMLElement;
}

const MenuContextKey: InjectionKey<MenuContextProps> = Symbol('menuContextKey');

const useProvideMenu = (props: MenuContextProps) => {
  provide(MenuContextKey, props);
};

const useInjectMenu = () => {
  return inject(MenuContextKey);
};

export { useProvideMenu, MenuContextKey, useInjectMenu };

export default useProvideMenu;
