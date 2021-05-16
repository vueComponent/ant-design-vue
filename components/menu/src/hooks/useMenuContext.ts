import { Key } from '../../../_util/type';
import { ComputedRef, FunctionalComponent, inject, InjectionKey, provide, Ref } from 'vue';
import { BuiltinPlacements, MenuMode, MenuTheme, TriggerSubMenuAction } from '../interface';

export interface MenuContextProps {
  prefixCls: ComputedRef<string>;
  openKeys: Ref<Key[]>;
  selectedKeys: Ref<Key[]>;
  rtl?: ComputedRef<boolean>;

  locked?: Ref<boolean>;

  inlineCollapsed: Ref<boolean>;
  antdMenuTheme?: ComputedRef<MenuTheme>;

  siderCollapsed?: ComputedRef<boolean>;

  // // Mode
  mode: Ref<MenuMode>;

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
  inlineIndent: ComputedRef<number>;

  // // Motion
  motion?: any;
  defaultMotions?: Partial<{ [key in MenuMode | 'other']: any }>;

  // // Popup
  subMenuOpenDelay: ComputedRef<number>;
  subMenuCloseDelay: ComputedRef<number>;
  // forceSubMenuRender?: boolean;
  builtinPlacements?: ComputedRef<BuiltinPlacements>;
  triggerSubMenuAction?: ComputedRef<TriggerSubMenuAction>;

  // // Icon
  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;

  // // Function
  // onItemClick: MenuClickEventHandler;
  // onOpenChange: (key: string, open: boolean) => void;
  getPopupContainer: ComputedRef<(node: HTMLElement) => HTMLElement>;
}

const MenuContextKey: InjectionKey<MenuContextProps> = Symbol('menuContextKey');

const useProvideMenu = (props: MenuContextProps) => {
  provide(MenuContextKey, props);
};

const useInjectMenu = () => {
  return inject(MenuContextKey);
};

const MenuFirstLevelContextKey: InjectionKey<Boolean> = Symbol('menuFirstLevelContextKey');
const useProvideFirstLevel = (firstLevel: Boolean) => {
  provide(MenuFirstLevelContextKey, firstLevel);
};

const useInjectFirstLevel = () => {
  return inject(MenuFirstLevelContextKey, true);
};

const MenuContextProvider: FunctionalComponent<{ props: Record<string, any> }> = (
  props,
  { slots },
) => {
  useProvideMenu({ ...useInjectMenu(), ...props });
  return slots.default?.();
};
MenuContextProvider.props = { props: Object };
MenuContextProvider.inheritAttrs = false;
MenuContextProvider.displayName = 'MenuContextProvider';

export {
  useProvideMenu,
  MenuContextKey,
  useInjectMenu,
  MenuFirstLevelContextKey,
  useProvideFirstLevel,
  useInjectFirstLevel,
  MenuContextProvider,
};

export default useProvideMenu;
