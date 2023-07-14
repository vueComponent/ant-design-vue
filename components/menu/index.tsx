import type { MenuProps } from './src/Menu';
import Menu from './src/Menu';
import type { MenuItemProps } from './src/MenuItem';
import MenuItem from './src/MenuItem';
import type { SubMenuProps } from './src/SubMenu';
import SubMenu from './src/SubMenu';
import type { MenuItemGroupProps } from './src/ItemGroup';
import ItemGroup from './src/ItemGroup';
import Divider from './src/Divider';
import type { MenuDividerProps } from './src/Divider';
import type { App, Plugin } from 'vue';
import type { MenuTheme, MenuMode } from './src/interface';
import type { ItemType } from './src/hooks/useItems';
/* istanbul ignore next */
Menu.install = function (app: App) {
  app.component(Menu.name, Menu);
  app.component(MenuItem.name, MenuItem);
  app.component(SubMenu.name, SubMenu);
  app.component(Divider.name, Divider);
  app.component(ItemGroup.name, ItemGroup);
  return app;
};

Menu.Item = MenuItem;
Menu.Divider = Divider;
Menu.SubMenu = SubMenu;
Menu.ItemGroup = ItemGroup;
export type {
  MenuProps,
  SubMenuProps,
  MenuItemProps,
  MenuItemGroupProps,
  MenuTheme,
  MenuMode,
  MenuDividerProps,
  ItemType,
};
export {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  ItemGroup,
  ItemGroup as MenuItemGroup,
  Divider,
  Divider as MenuDivider,
};

export default Menu as typeof Menu &
  Plugin & {
    readonly Item: typeof MenuItem;
    readonly SubMenu: typeof SubMenu;
    readonly Divider: typeof Divider;
    readonly ItemGroup: typeof ItemGroup;
  };
