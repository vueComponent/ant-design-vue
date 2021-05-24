import { Key } from '../../../_util/type';
import {
  ComputedRef,
  CSSProperties,
  defineComponent,
  inject,
  InjectionKey,
  provide,
  Ref,
  UnwrapRef,
} from 'vue';
import {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuMode,
  MenuTheme,
  TriggerSubMenuAction,
} from '../interface';
import { CSSMotionProps } from '../../../_util/transition';

export interface StoreMenuInfo {
  eventKey: string;
  key: Key;
  parentEventKeys: ComputedRef<string[]>;
  childrenEventKeys?: Ref<string[]>;
  isLeaf?: boolean;
  parentKeys: ComputedRef<Key[]>;
}
export interface MenuContextProps {
  isRootMenu: boolean;

  store: UnwrapRef<Record<string, StoreMenuInfo>>;
  registerMenuInfo: (key: string, info: StoreMenuInfo) => void;
  unRegisterMenuInfo: (key: string) => void;
  prefixCls: ComputedRef<string>;
  openKeys: Ref<Key[]>;
  selectedKeys: Ref<Key[]>;

  selectedSubMenuEventKeys: Ref<string[]>;
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
  overflowDisabled?: ComputedRef<boolean>;

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
  defaultMotions?: ComputedRef<Partial<
    {
      [key in MenuMode | 'other']:
        | CSSMotionProps
        | ((style: Ref<CSSProperties>, className: Ref<string>) => CSSMotionProps);
    }
  > | null>;

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
    props: Object,
  },
  setup(props, { slots }) {
    useProvideMenu({ ...useInjectMenu(), ...props.props });
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
