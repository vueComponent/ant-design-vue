import type { Key } from '../../../_util/type';
import type { ComputedRef, CSSProperties, InjectionKey, PropType, Ref, UnwrapRef } from 'vue';
import { defineComponent, inject, provide, toRef } from 'vue';
import type {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuMode,
  MenuTheme,
  TriggerSubMenuAction,
} from '../interface';
import type { CSSMotionProps } from '../../../_util/transition';

export interface StoreMenuInfo {
  eventKey: string;
  key: Key;
  parentEventKeys: ComputedRef<string[]>;
  childrenEventKeys?: Ref<string[]>;
  isLeaf?: boolean;
  parentKeys: ComputedRef<Key[]>;
}
export interface MenuContextProps {
  isRootMenu: Ref<boolean>;

  store: Ref<Record<string, UnwrapRef<StoreMenuInfo>>>;
  registerMenuInfo: (key: string, info: StoreMenuInfo) => void;
  unRegisterMenuInfo: (key: string) => void;
  prefixCls: ComputedRef<string>;
  openKeys: Ref<Key[]>;
  selectedKeys: Ref<Key[]>;

  selectedSubMenuEventKeys: Ref<string[]>;
  rtl?: ComputedRef<boolean>;

  inlineCollapsed: Ref<boolean>;
  antdMenuTheme?: ComputedRef<MenuTheme>;

  siderCollapsed?: ComputedRef<boolean>;

  // // Mode
  mode: Ref<MenuMode>;

  // // Disabled
  disabled?: ComputedRef<boolean>;
  // // Used for overflow only. Prevent hidden node trigger open
  overflowDisabled?: Ref<boolean>;

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
  motion?: ComputedRef<CSSMotionProps | null>;
  defaultMotions?: ComputedRef<Partial<{
    [key in MenuMode | 'other']:
      | CSSMotionProps
      | ((style: Ref<CSSProperties>, className: Ref<string>) => CSSMotionProps);
  }> | null>;

  // // Popup
  subMenuOpenDelay: ComputedRef<number>;
  subMenuCloseDelay: ComputedRef<number>;
  // forceSubMenuRender?: boolean;
  builtinPlacements?: ComputedRef<BuiltinPlacements>;
  triggerSubMenuAction?: ComputedRef<TriggerSubMenuAction>;

  // // Icon
  // itemIcon?: RenderIconType;
  expandIcon?: ComputedRef<(p?: { isOpen: boolean; [key: string]: any }) => any>;

  // // Function
  onItemClick: MenuClickEventHandler;
  onOpenChange: (key: Key, open: boolean) => void;
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

const MenuContextProvider = defineComponent({
  name: 'MenuContextProvider',
  inheritAttrs: false,
  props: {
    mode: { type: String as PropType<MenuMode>, default: undefined },
    overflowDisabled: { type: Boolean, default: undefined },
    isRootMenu: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    const menuContext = useInjectMenu();
    const newContext = { ...menuContext };
    // 确保传入的属性不会动态增删
    // 不需要 watch 变化
    if (props.mode !== undefined) {
      newContext.mode = toRef(props, 'mode');
    }
    if (props.isRootMenu !== undefined) {
      newContext.isRootMenu = toRef(props, 'isRootMenu');
    }
    if (props.overflowDisabled !== undefined) {
      newContext.overflowDisabled = toRef(props, 'overflowDisabled');
    }
    useProvideMenu(newContext);
    return () => slots.default?.();
  },
});

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
